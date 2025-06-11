import os
import requests
from controllers.src.main import main as predict_image
from fastapi import HTTPException, status

HISTORY_SERVICE_URL = os.getenv("HISTORY_SERVICE_URL", "http://0.0.0.0:8004")
if not HISTORY_SERVICE_URL.endswith("/"):
    HISTORY_SERVICE_URL = HISTORY_SERVICE_URL.rstrip("/")

def save_to_history(uid: str, id_token: str, prediction: str, probabilities: list, image_filename: str):
    """Save the image prediction result to the History Service."""
    url = f"{HISTORY_SERVICE_URL}/history/imageDetector"
    
    # Use the environment variable for service URL
    service_url = os.getenv('AI_IMAGE_DETECTOR_SERVICE_URL')
    if not service_url:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="AI_IMAGE_DETECTOR_SERVICE_URL not configured"
        )
    
    image_url = f"{service_url}/images/files/{image_filename}"

    payload = {
        "data": {
            "predicted_label": prediction,
            "probabilities": [probabilities[1] if prediction == "fake" else probabilities[0]],
            "image_url": image_url,
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