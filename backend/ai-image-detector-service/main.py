import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from routes.imageRoutes import image_routes  # your route file
from dotenv import load_dotenv

load_dotenv()

app = FastAPI(title="AI Image Detector Service")

# CORS (Optional: adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # change to your frontend URL in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount /images for accessing uploaded images
if not os.path.exists("images"):
    os.makedirs("images")

app.mount("/images", StaticFiles(directory="images"), name="images")

# Register your image routes
app.include_router(image_routes, prefix="/images")

@app.get("/health")
async def health_check():
    return {"status": "ai-image-detector-service up"}

if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8002))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)