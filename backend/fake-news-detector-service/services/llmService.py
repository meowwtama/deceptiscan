from dotenv import load_dotenv
import os
from groq import Groq
import json

load_dotenv()
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
if not GROQ_API_KEY:
    raise RuntimeError("Missing GROQ_API_KEY in .env")

client = Groq(api_key=GROQ_API_KEY)

def news_analyse(prompt: str):
    """
    Uses an LLM (via Groq API) to generate a concise summary of a Telegram group's messages.

    Args:
        message (str): A formatted string containing scraped group messages.

    Returns:
        dict: {
            "status": "success" | "error",
            "summary": str | None - Generated summary if successful,
            "message": str (only if error) - Description of the exception
        }
    """
    try:
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages= [
                {
                    "role" : "system",
                    "content": ("You are a fact-checking assistant. Your job is to assess whether a given news article is likely to be fake or misleading. Consider the tone, exaggeration, logic, evidence, and trustworthiness of the information."
                                "Return a confidence score between 0 and 100 indicating how confident you are that the article is fake (100 = fully fake). "
                                "Also provide a short explanation for your rating.\n\n"
                                "Format your response strictly as JSON: "
                                '{"confidence_score": <number>, "explanation": "<your explanation>"}'
                    )
                },
                {
                    "role": "user", 
                    "content": prompt,
                },
            ],
            temperature=0.0,
            max_tokens=256,
        )

        raw_output = response.choices[0].message.content.strip()

        parsed = json.loads(raw_output)

        return {
            "status": "success",
            "score": parsed.get("confidence_score"),
            "explanation": parsed.get("explanation")
        }

    except Exception as e:
        return {
            "status": "error",
            "score": None,
            "explanation": None,
            "message": str(e)
        }