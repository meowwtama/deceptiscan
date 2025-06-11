import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes.imageRoutes import image_routes
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Image Detector Service")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# 1) Mount your upload & predict routes under /images
app.include_router(image_routes, prefix="/images")

# 2) Serve the actual image files under /images/files
os.makedirs("images", exist_ok=True)
app.mount(
    "/images/files",
    StaticFiles(directory="images"),
    name="images"
)

@app.get("/health")
async def health_check():
    return {"status": "ai-image-detector-service up"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8006))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)