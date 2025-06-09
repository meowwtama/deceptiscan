from telethon.tl.functions.channels import LeaveChannelRequest
from telethon.errors import RPCError

async def leave_group(client, group_username: str):
    """
    Leaves a Telegram group or channel using the provided client.

    Args:
        client: An active Telethon client instance.
        group_username: The public username of the group (e.g., 'openai_news').

    Returns:
        dict: Result status for API/Controller.
    """
    try:
        await client(LeaveChannelRequest(group_username))
        return {
            "status": "success",
            "message": f"Left @{group_username}"
        }
    
    except RPCError as e:
        return {
            "status": "error",
            "message": f"Telegram RPC error: {e.__class__.__name__}"
        }

    except Exception as e:
        return {
            "status": "error",
            "message": f"Unexpected error: {str(e)}"
        }
