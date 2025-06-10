import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from contextlib import asynccontextmanager
from dotenv import load_dotenv

# Import the Telegram client (no circular imports)
from telegram_client import client
from routes.teleRoutes import router as tele_router

# Load .env (for PORT, etc.)
load_dotenv()

PORT = int(os.getenv("PORT", 8007))  # your default port

# Lifespan context to start/stop Telegram client
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting Telegram client…")
    await client.start()
    me = await client.get_me()
    print(f"Logged in as {me.username or me.first_name}")
    yield
    print("Shutting down Telegram client…")
    await client.disconnect()

# Create the FastAPI app with our lifespan
app = FastAPI(
    title="Telegram Group Analyzer Service",
    lifespan=lifespan
)

# CORS (allow all here, lock down in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register your router under /telegram
app.include_router(tele_router, prefix="/telegram")

@app.get("/health")
async def health_check():
    return {"status": "telegram-group-analyser-service up"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=PORT,
        reload=True,
        log_level="info"
    )
