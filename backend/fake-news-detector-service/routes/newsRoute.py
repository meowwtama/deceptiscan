from fastapi import APIRouter, Depends, Request
from middleware.authMiddleware import verify_token
from controllers.newsController import analyze_article_flow

router = APIRouter()

@router.post("/analyze")
async def analyze_article_endpoint(request: Request, payload: dict, decoded=Depends(verify_token)):
    """
    Endpoint: POST /analyze
    Headers: Authorization: Bearer <ID_TOKEN>
    Body: { "url": "url to news article to analyse" }
    """
    # Extract raw Authorization header so controller can forward it
    raw_auth = request.headers.get("Authorization", "")
    # Pass it into analyze_group by tacking onto payload
    payload["rawAuthHeader"] = raw_auth

    return await analyze_article_flow(payload, decoded)