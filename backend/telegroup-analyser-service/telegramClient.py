from telethon import TelegramClient
import asyncio
import os
from dotenv import load_dotenv

# Setting up TelegramClient
load_dotenv()

api_id = int(os.getenv("TELEGRAM_API_ID"))
api_hash = os.getenv("TELEGRAM_API_HASH")
session_name = os.getenv("SESSION_NAME", "default_session")

client = TelegramClient("my_session", api_id, api_hash)