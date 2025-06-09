from telethon.tl.functions.channels import JoinChannelRequest
import re
from telethon.errors import UserAlreadyParticipantError, ChatInvalidError, RPCError, FloodWaitError
import asyncio

def extract_join_info(link: str):
    """
    Parses a Telegram group link to determine its type and extract identifying info.

    Args:
        link (str): Telegram group or channel link (e.g., t.me/xyz or t.me/joinchat/abc123)

    Returns:
        tuple:
            - str: "public", "private", or "invalid" depending on the link type
            - str or None: The group username (for public) or invite hash (for private); None if invalid
    """
    link = link.strip()

    # Detect private invite links
    if re.match(r"(https?://)?t\.me/(joinchat/|\+)[\w\d]+", link):
        invite_hash = link.split("/")[-1].replace("+", "")
        return "private", invite_hash

    # Detect public group/channel links
    elif re.match(r"(https?://)?t\.me/[\w\d_]+", link):
        group_username = link.split("/")[-1]
        return "public", group_username

    return "invalid", None

async def join_channel(client, link, retries = 1):
    """
    Attempts to join a public Telegram group using a Telethon client.

    Args:
        client (TelegramClient): An active Telethon client instance.
        link (str): Telegram group link (must be public).
        retries (int): Number of retry attempts in case of FloodWaitError (default: 1).

    Returns:
        dict: {
            "status": str - One of:
                - "success": Successfully joined the group.
                - "GroupError": Invalid or malformed group link.
                - "PrivateError": Link points to a private group (unsupported).
                - "FloodWaitError": Too many requests; retry limit exceeded.
                - "TelegramError": Telegram API error (unspecified).
                - "PythonError": Unexpected internal Python error.
            "message": str - Human-readable message about the outcome.
            "group_name": str - Group username (only if join successful).
        }
    """
    # Check for whether private or public group and extract group username
    results = extract_join_info(link)
    status = results[0]
    group_name = results[1]
    
    # Join if public else return private group
    if status == "public":
        try:
            await(client(JoinChannelRequest(group_name)))
            return {"status" : "success", "message" : f"Joined @{group_name}", "group_name" : group_name}
        
        except UserAlreadyParticipantError:
            pass

        except ChatInvalidError:
            return {"status" : "GroupError", "message" : "Invalid Telegram group link"}
        
        except FloodWaitError as e:
            if retries > 3:
                return {"status": "FLoodWaitError", "message": "Too many retries, please try again later."}
            await asyncio.sleep(e.seconds)
            return await join_channel(client, link, retries + 1)
        
        except RPCError as e:  # Catch any Telegram API errors not already covered
            return {"status": "TelegramError", "message": f"Telegram error: {e.__class__.__name__}"}

        except Exception as e: # Catch truly unexpected Python errors (e.g., typos, logic bugs)
            return {"status": "PythonError", "message": f"Unexpected error: {str(e)}"}

    elif status == "private":
        return {"status" : "PrivateError", "message" : "Invalid Telegram group link (must be a public group)."}
    
    else:
        return {"status" : "GroupError", "message" : "Invalid Telegram group link"}

