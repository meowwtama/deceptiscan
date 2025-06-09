import asyncio

async def scrape_messages(client, group_identifier, limit=100):
    """
    Scrapes messages from a Telegram group or channel.

    Args:
        client: An active Telethon client instance.
        group_identifier: Group username, URL, or resolved entity.
        limit: Number of recent messages to scrape (default: 100).

    Returns:
        dict: {
            "status": "success" | "error",
            "raw_messages": List[Message],
            "formatted_text": str,
            "message_count": int,
            "message": str (if any error)
        }
    """
    try:
        messages = []
        async for msg in client.iter_messages(group_identifier, limit=limit, reverse=True):
            if msg.text:  # Skip empty or media-only messages
                sender = msg.sender_id if msg.sender_id else "Unknown"
                messages.append({
                    "id": msg.id,
                    "sender": sender,
                    "text": msg.text.strip()
                })

        if not messages:
            return {
                "status": "NoMessageError",
                "message": "No text messages found in the group.",
                "raw_messages": [],
                "formatted_text": "",
                "message_count": 0
            }

        formatted_text = "\n".join(f"[{msg['sender']}] {msg['text']}" for msg in messages)

        return {
            "status": "success",
            "raw_messages": messages,
            "formatted_text": formatted_text,
            "message_count": len(messages)
        }

    except Exception as e:
        return {
            "status": "error",
            "message": str(e),
            "raw_messages": [],
            "formatted_text": "",
            "message_count": 0
        }
