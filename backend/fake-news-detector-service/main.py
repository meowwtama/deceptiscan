from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv
import os
import uvicorn
from routes.newsRoute import router as news_router

# Load environment variables
load_dotenv()

PORT = int(os.getenv("PORT"))

# FastAPI app initialization
app = FastAPI(title="Fake News Detector Service")

# Enable CORS for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Allow specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Route registration
app.include_router(news_router, prefix="/news")

# Health check endpoint
@app.get("/health")
async def health_check():
    return {"status": "fake-news-detector-service up"}

# Uvicorn entry point
if __name__ == "__main__":
    port = PORT
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
