import os
import requests
from controllers.src.main import main as predict_image
from fastapi import HTTPException, status

HISTORY_SERVICE_URL = os.getenv("HISTORY_SERVICE_URL", "http://localhost:8004")
if not HISTORY_SERVICE_URL.endswith("/"):
    HISTORY_SERVICE_URL = HISTORY_SERVICE_URL.rstrip("/")

def save_to_history(uid: str, id_token: str, prediction: str, probabilities: list, image_filename: str):
    """
    Save the image prediction result to the History Service.
    POST /history/imageDetector
    Body: { "data": { ... } }
    """
    url = f"{HISTORY_SERVICE_URL}/history/imageDetector"

    payload = {
        "data": {
            "prediction": prediction,
            "probabilities": probabilities,
            "imageFilename": image_filename
        }
    }

    headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {id_token}"
    }

    resp = requests.post(url, json=payload, headers=headers, timeout=20)
    if resp.status_code != 201:
        raise HTTPException(
            status_code=status.HTTP_502_BAD_GATEWAY,
            detail=f"Failed to save to history: {resp.status_code} {resp.text}"
        )

def handle_image_prediction(image_filename: str, raw_id_token: str = None, decoded_token: dict = None):
    """
    Orchestrates:
    1. Call image prediction logic.
    2. Save to history (if token is provided).
    3. Return result.
    """
    try:
        image_path = os.path.join("images", image_filename)
        if not os.path.exists(image_path):
            raise HTTPException(
                status_code=404,
                detail=f"Image file not found: {image_filename}"
            )

        if not os.path.exists("models"):
            raise HTTPException(
                status_code=500,
                detail="Models directory not found. Please ensure models are properly installed."
            )

        predicted_label, probabilities_tensor = predict_image(image_path, './models')
        probabilities = probabilities_tensor.squeeze().tolist()

        # Optional history save
        if decoded_token and raw_id_token:
            uid = decoded_token.get("uid")
            if not uid:
                raise HTTPException(status_code=401, detail="Invalid token: no uid")

            save_to_history(
                uid=uid,
                id_token=raw_id_token,
                prediction=predicted_label,
                probabilities=probabilities,
                image_filename=image_filename
            )

        return predicted_label, probabilities_tensor
    except Exception as e:
        print(f"Error in handle_image_prediction: {str(e)}")  # Add logging
        raise HTTPException(
            status_code=500,
            detail=f"Prediction failed: {str(e)}"
        )