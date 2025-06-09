import os 
import requests

def save_to_history(
    uid: str,
    id_token: str,
    group_name: str,
    summary: str,
    ):

    """
    Save the telegram group summary result to the History Service.
    POST /history/TeleAnalyser
    Body: { "data": { ... } }
    """

    HISTORY_SERVICE_URL = os.getenv("HISTORY_SERVICE_URL")
    if not HISTORY_SERVICE_URL.endswith("/"):
        HISTORY_SERVICE_URL = HISTORY_SERVICE_URL.rstrip("/")
    
    url = f"{HISTORY_SERVICE_URL}/history/TeleAnalyser"

    payload = {
        "data": {
            "group_name": group_name,
            "summary": summary,
        }
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {id_token}"
    }

    resp = requests.post(url, json=payload, headers=headers, timeout=20)
    if resp.status_code != 201:
        return {"status":"error", "message":f"Failed to save to history: {resp.status_code} {resp.text}"}
