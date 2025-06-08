from fastapi import APIRouter, Depends, Request, UploadFile, File, HTTPException
from fastapi.responses import JSONResponse
from werkzeug.utils import secure_filename
from controllers.imageController import handle_image_prediction
from middleware.authMiddleware import verify_token
import os
import shutil

image_routes = APIRouter()
UPLOAD_FOLDER = 'images'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg'}

def allowed_file(filename: str):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@image_routes.post('/upload')
async def upload_image(file: UploadFile = File(...), decoded=Depends(verify_token)):
    filename = secure_filename(file.filename)
    if not allowed_file(filename):
        raise HTTPException(status_code=400, detail='Invalid file type')

    save_path = os.path.join(UPLOAD_FOLDER, filename)
    os.makedirs(UPLOAD_FOLDER, exist_ok=True)
    
    with open(save_path, 'wb') as buffer:
        shutil.copyfileobj(file.file, buffer)

    return JSONResponse(content={'message': 'Upload successful', 'filename': filename}, status_code=200)

@image_routes.get('/predict/{filename}')
async def predict_image(filename: str, request: Request, decoded=Depends(verify_token)):
    # Get the raw token for History Service
    auth_header = request.headers.get("Authorization", "")
    raw_id_token = auth_header.split(" ", 1)[1] if auth_header.startswith("Bearer ") else None

    try:
        result = handle_image_prediction(
            image_filename=filename,
            raw_id_token=raw_id_token,
            decoded_token=decoded
        )
        predicted_label, probabilities = result
        return {
            "predicted_label": predicted_label,
            "probabilities": probabilities.tolist()
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))