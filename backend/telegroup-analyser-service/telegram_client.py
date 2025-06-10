import os
from telethon import TelegramClient
from dotenv import load_dotenv


# Load environment variables from .env
load_dotenv()

api_id = int(os.getenv("TELEGRAM_API_ID"))
api_hash = os.getenv("TELEGRAM_API_HASH")
session_name = os.getenv("SESSION_NAME")

# Create the Telethon client
client = TelegramClient(session_name, api_id, api_hash)
