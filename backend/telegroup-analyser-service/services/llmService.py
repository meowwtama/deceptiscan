from dotenv import load_dotenv
import os
from groq import Groq

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
                    "content" : f"""You are an expert in analyzing Telegram group messages. Summarize what the group is about in 1-2 sentences. \n\nMessages:\n{message}"""
                }
            ],
            temperature=0.3,
            max_tokens=128,
        )

        summary = response.choices[0].message.content

        return {
            "status":"success",
            "summary":summary
        }
    
    except Exception as e:
        return {
            "status": "error",
            "summary": None,
            "message": str(e)
        }