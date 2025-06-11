from dotenv import load_dotenv
import os
from groq import Groq
import json

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("Missing GROQ_API_KEY in .env")

client = Groq(api_key=GROQ_API_KEY)

def tele_analyse(message: str):
    """
    Uses an LLM (via Groq API) to generate a concise summary of a Telegram group's messages.

    Args:
        message (str): A formatted string containing scraped group messages.

    Returns:
        dict: {
            "status": "success" | "error",
            "summary": str | None - Generated summary if successful,
            "scam_classification": str | None - Classification of group whether scam or not scam if successful,
            "scam_probability": int | None - Scam probability of group if successful
            "message": str (only if error) - Description of the exception
        }
    """
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages= [
                {
                    "role" : "system",
                    "content" : "You are an expert in summarizing community discussions. Be clear and concise."
                },
                {
                    "role" : "user",
                    "content" : ("You are an expert in analyzing Telegram group messages. "
                    "Summarize what the group is about in 1-2 sentences." 
                    "Also provide whether the channel is Scam or Safe and provide the probability that it is a scam (0-1 whether it is a scam)."
                    f"""Messages:\n{message}."""
                    "Format your response strictly as JSON: "
                    '{"summary": <summary of the group>, "classification": <Scam or Safe>, "scam_probability":<probability that the group is a scam>}'
                    )
                }
            ],
            temperature=0.3,
            max_tokens=128,
        )

        raw_output = response.choices[0].message.content.strip()

        parsed = json.loads(raw_output)

        return {
            "status":"success",
            "summary":parsed.get("summary"),
            "scam_classification":parsed.get("classification"),
            "scam_probability":parsed.get("scam_probability")
        }
    
    except Exception as e:
        return {
            "status": "error",
            "summary": None,
            "scam_classification": None,
            "scam_probability": None,
            "message": str(e)
        }