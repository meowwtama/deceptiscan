from fastapi import APIRouter, Depends, Request
from middleware.authMiddleware import verify_token
from controllers.messageController import handle_analyze

router = APIRouter()

@router.post("/analyze")
async def analyze_message_endpoint(request: Request, payload: dict, decoded=Depends(verify_token)):
    """
    Endpoint: POST /analyze
    Headers: Authorization: Bearer <ID_TOKEN>
    Body: { "message": "<text to analyze>" }
    """
    # Extract raw Authorization header so controller can forward it
    raw_auth = request.headers.get("Authorization", "")
    # Pass it into handle_analyze by tacking onto payload
    payload["rawAuthHeader"] = raw_auth

    return await handle_analyze(payload, decoded)
