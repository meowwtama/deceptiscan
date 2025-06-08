# backend/message-analyser-service/main.py

from fastapi import FastAPI
from routes.messageRoutes import router as message_router
from fastapi.middleware.cors import CORSMiddleware
import os
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Message Analyser Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount the message routes under /message
app.include_router(message_router, prefix="/message")

@app.get("/health")
async def health_check():
    return {"status": "message-analyser-service up"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8002))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
