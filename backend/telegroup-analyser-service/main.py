from fastapi import FastAPI
from contextlib import asynccontextmanager
from telegramClient import client
from routes.teleRoutes import router as tele_router
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

port_num = os.getenv("PORT")

# Lifespan to handle startup and shutdown
@asynccontextmanager
async def lifespan(app: FastAPI):
    print("Starting Telegram client...")
    await client.start()
    me = await client.get_me()
    print(f"Logged in as {me.username or me.first_name}")
    
    yield
    
    print("Shutting down Telegram client...")
    await client.disconnect()

# Initialize FastAPI app
app = FastAPI(title="Telegram Group Analyzer Service", lifespan=lifespan)

# CORS settings
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Register routes
app.include_router(tele_router, prefix="/telegram")

@app.get("/health")
async def health_check():
    return {"status": "telegram-group-analyser-service up"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", port_num))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
