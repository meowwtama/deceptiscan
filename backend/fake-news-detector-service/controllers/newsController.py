from services.scrapewebsiteService import scrape_article_with_fallbacks
from services.contentpreprocessService import preprocess_article
from services.llmService import news_analyse
from services.savehistoryService import save_to_history
from fastapi import HTTPException, status


def analyze_article_flow(request_data: dict, decoded_token: dict):
    """
    Controller function that handles the full fake news detection pipeline:
    1. Scrape article from URL
    2. Preprocess content for LLM
    3. Analyze with LLM
    4. Save results to history

    Args:
        request_data (dict): Incoming request with `url` and optional `rawAuthHeader`
        decoded_token (dict): Decoded Firebase token with at least a `uid`

    Returns:
        dict: {
            "status": "success",
            "score": int,
            "explanation": str,
            "title": str
        }
    """
    url = request_data.get("url")
    if not url or not isinstance(url, str):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Field 'url' (string) is required.")

    # 1. Scrape article
    scraped = scrape_article_with_fallbacks(url)

    # Handle any errors
    if scraped["status"] not in ["success", "partial"]:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Failed to retrieve article content.")

    # 2. Preprocess content
    processed = preprocess_article(scraped)

    # Handle any errors
    if processed["status"] != "success":
        raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                            detail="Unable to preprocess article.")

    prompt = processed["prompt"]
    title = processed["title"]

    # 3. Analyze with LLM
    result = news_analyse(prompt)

    # Handle any errors
    if result["status"] != "success":
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY,
                            detail=result.get("message", "LLM failed."))

    # 4. Save to history
    uid = decoded_token.get("uid")
    if not uid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Invalid token: missing uid")

    # Extract token from request or fallback
    raw_id_token = None
    auth_header = request_data.get("rawAuthHeader")
    if auth_header and auth_header.startswith("Bearer "):
        raw_id_token = auth_header.split(" ", 1)[1]
    if not raw_id_token:
        raw_id_token = decoded_token.get("token")
    if not raw_id_token:
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Unable to retrieve ID token.")

    history_result = save_to_history(
        uid=uid,
        id_token=raw_id_token,
        news_url=url,
        classification=result["classification"],
        fake_probability=result["fake_probability"],
        explanation=result["explanation"]
    )

    if history_result["status"] == "error":
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY,
                            detail=history_result["message"])

    return {
        "status": "success",
        "classification": result["classification"],
        "fake_probability": result["fake_probability"],
        "explanation": result["explanation"],
        "title": title
    }
