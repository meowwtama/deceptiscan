import os
from fastapi import FastAPI
from routes.linkRoutes import router as link_router
from fastapi.middleware.cors import CORSMiddleware
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="Link Analyser Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],   # In production, narrow this to known origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(link_router, prefix="/link")

@app.get("/health")
async def health_check():
    return {"status": "link-analyser-service up"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8003))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)