from fastapi import APIRouter, Depends, Request
from middleware.authMiddleware import verify_token
from controllers.linkController import handle_link_analysis, handle_link_details

router = APIRouter()

@router.post("/analyze")
async def analyze_link_endpoint(request: Request, payload: dict, decoded=Depends(verify_token)):
    payload["rawAuthHeader"] = request.headers.get("Authorization", "")
    return await handle_link_analysis(payload, decoded)

@router.get("/details/{record_id}")
async def link_details_endpoint(request: Request, record_id: str, decoded=Depends(verify_token)):
    return await handle_link_details(record_id, request, decoded)
