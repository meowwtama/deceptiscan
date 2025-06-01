import os
import requests
import json
from fastapi import HTTPException, status
from groq import Groq

from dotenv import load_dotenv
load_dotenv()

GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("Missing GROQ_API_KEY in .env")

# Initialize Groq LLM client
client = Groq(api_key=GROQ_API_KEY)

# History Service config
HISTORY_SERVICE_URL = os.getenv("HISTORY_SERVICE_URL", "http://localhost:8004")
if not HISTORY_SERVICE_URL.endswith("/"):
    HISTORY_SERVICE_URL = HISTORY_SERVICE_URL.rstrip("/")

def analyze_with_groq(message: str) -> dict:
    """
    Send a prompt to Groq LLM to classify 'message' as 'scam' or 'not scam'
    and get a short summary explaining why.
    Returns a dict: { "classification": "scam"/"not scam", "summary": "<text>" }
    """

    try:
        resp = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {
                    "role": "system",
                    "content": 
                    """
                    You are a helpful assistant that classifies a user‐provided SMS or email message as either "scam" or "not scam", then provides a short explanation not more than 200 words long of why you classified it that way.

                    Output in the JSON file template as provided in the assistant prompt.
                    {{
                    "classification": "<scam or not scam>",
                    "summary": "<short explanation not reaching 200 words>"
                    }}
                    """
                },
                {
                    "role": "user", 
                    "content": message,
                },
                {
                    "role": "assistant",
                    "content": 
                    """
                    Please classify the message above as either "scam" or "not scam", and provide a short explanation of your reasoning in the summary field.
                    
                    Output in the JSON file template as provided in the system prompt.
                    {{
                    "classification": "<scam or not scam>",
                    "summary": "<short explanation not reaching 200 words>"
                    }}
                    """
                }
        ],
        temperature=1,
        max_tokens=1000,
        top_p=1,
        stream=False,
        response_format={"type": "json_object"},
        stop=None,
    )

        generated = resp.choices[0].message.content

        parsed = json.loads(generated)
        classification = parsed.get("classification")
        summary = parsed.get("summary")

        if classification not in ("scam", "not scam"):
            raise ValueError(f"Unexpected classification value: {classification}")

        return {"classification": classification, "summary": summary}

    except Exception as e:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Groq LLM error: {str(e)}"
        )

def save_to_history(
    uid: str,
    id_token: str,
    classification: str,
    summary: str,
    original_message: str
    ) -> None:
    """
    Call the History Service to save this analysis under 'messageAnalyser' subcollection:
    POST /history/messageAnalyser
    Body: { "data": { ... } }
    """
    url = f"{HISTORY_SERVICE_URL}/history/messageAnalyser"

    payload = {
        "data": {
            "classification": classification,
            "summary": summary,
            "originalMessage": original_message
        }
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {id_token}"
    }

    resp = requests.post(url, json=payload, headers=headers, timeout=20)
    if resp.status_code != 201:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to save to history: {resp.status_code} {resp.text}"
        )

async def handle_analyze(request_data: dict, decoded_token: dict):
    """
    Orchestrates:
    1. Call Groq to analyze message.
    2. Call History Service to save the result.
    Returns the analysis result in JSON format.
    """
    message = request_data.get("message")
    if not message or not isinstance(message, str):
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Field 'message' (string) is required"
        )

    # 1. Analyze with Groq
    analysis = analyze_with_groq(message)
    classification = analysis["classification"]
    summary = analysis["summary"]

    # 2. Save to history
    uid = decoded_token.get("uid")
    if not uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: no uid"
        )

    # We need the raw ID token to pass to History Service
    # FastAPI dependency only gave us decoded_token, not the raw token.
    # So we assume the caller passed 'Authorization' header with 'Bearer <idToken>'—we re‐use that.
    raw_id_token = None
    auth_header = request_data.get("rawAuthHeader")
    if auth_header and auth_header.startswith("Bearer "):
        raw_id_token = auth_header.split(" ", 1)[1]

    if not raw_id_token:
        # Try to extract from context if available
        raw_id_token = decoded_token.get("token")
    if not raw_id_token:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve ID token to forward to History Service"
        )

    save_to_history(
        uid=uid,
        id_token=raw_id_token,
        classification=classification,
        summary=summary,
        original_message=message
    )

    # 3. Return to caller
    return {"classification": classification, "summary": summary}
