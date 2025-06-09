from fastapi import Request
from fastapi.responses import JSONResponse
from services.joinService import join_channel
from services.scrapingService import scrape_messages
from services.llmService import tele_analyse
from services.leaveService import leave_group
from services.savehistoryService import save_to_history
from main import client
from fastapi import HTTPException, status

async def analyze_group(request_data: dict, decoded_token: dict):
    """
    Analyzes a Telegram group by joining, scraping messages, summarizing, and saving history.

    Args:
        request_data (dict): Payload from the frontend. Must include:
            - group_link (str): Public Telegram group link
            - rawAuthHeader (str, optional): Authorization header for Firebase
        decoded_token (dict): Decoded Firebase token containing at least 'uid'

    Returns:
        dict: {
            "status": "success",
            "summary": str  # Summary of the group's purpose from LLM
        }

    Raises:
        HTTPException:
            - 400 if group_link is missing or invalid
            - 403 if group is private, Telegram denies access, or flood wait occurs
            - 422 if no usable messages were found for analysis
            - 401 if token is missing or invalid
            - 502 if summarization or history service fails
            - 500 for all other unexpected internal errors
    """
    
    # 1. Getting the group link from the frontend payload
    group_link = request_data.get("group_link")
    if not group_link or not isinstance(group_link, str):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Field 'Telegram group link' (string) is required")

    # 2. Joining the specific group for scraping
    join_result = await join_channel(client, group_link)

    # Handling errors that may surface from join_channel
    if join_result["status"] != "success":
        if join_result["status"] == "GroupError":
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                                detail=join_result["message"])
        elif join_result["status"] in ["PrivateError", "FloodWaitError", "TelegramError"]:
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN,
                                detail=join_result["message"])
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail=join_result["message"])
        

    # 3. Scraping the group messages
    group_name = join_result["group_name"]
    scrape_result = await scrape_messages(client, group_name)

    # Handling errors that may surface from scrape_result
    if scrape_result["status"] != "success":
        await leave_group(client, group_name)
        if scrape_result["status"] == "NoMessageError":
            raise HTTPException(status_code=status.HTTP_422_UNPROCESSABLE_ENTITY,
                                detail=scrape_result["message"])
        else:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                                detail=scrape_result["message"])

    # 4. Pass the results from scraping into llm for summarising and leave group after completion
    llm_result = tele_analyse(scrape_result["formatted_text"])

    # Handling errors that may surface from tele_analyse
    if llm_result["status"] != "success":
        await leave_group(client, group_name)
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY,
                            detail=llm_result["message"])

    await leave_group(client, group_name)

    # 5. Save the results to history
    uid = decoded_token.get("uid")
    if not uid:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token: no uid"
        )
    
    raw_id_token = None
    auth_header = request_data.get("rawAuthHeader")
    if auth_header and auth_header.startswith("Bearer "):
        raw_id_token = auth_header.split(" ", 1)[1]

    if not raw_id_token:
        # Try to extract from context if available
        raw_id_token = decoded_token.get("token")
    if not raw_id_token:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Unable to retrieve ID token to forward to History Service"
        )
    
    history_result = save_to_history(
        uid=uid,
        id_token=raw_id_token,
        group_name=group_name,
        summary=llm_result["summary"]
    )

    # Handling errors from save_to_history
    if history_result["status"] == "error":
        raise HTTPException(status_code= status.HTTP_502_BAD_GATEWAY,
                            detail=history_result["message"])

    return {
        "status": "success",
        "summary": llm_result["summary"]
    }

