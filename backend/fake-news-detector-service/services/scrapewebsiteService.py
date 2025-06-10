import requests
from bs4 import BeautifulSoup
from newspaper import Article
from fastapi import HTTPException, status

def detect_paywall(text: str) -> bool:
    """
    Checks if the article text is likely paywalled.
    """
    if len(text.split()) < 50:
        return True
    paywall_keywords = ["subscribe", "membership", "sign in", "log in to continue", "limited access"]
    return any(keyword in text.lower() for keyword in paywall_keywords)


def scrape_article_with_fallbacks(url: str) -> dict:
    """
    Scrapes an article from a URL using newspaper3k, with fallback to BeautifulSoup.
    Rejects or limits content if a paywall is detected.

    Args:
        url (str): The news article URL to scrape.

    Returns:
        dict: {
            "status": "success" | "error",
            "title": str,
            "content": str,
            "snippet": str
        }
    """
    # First try with newspaper3k
    try:
        article = Article(url)
        article.download()
        article.parse()
        title = article.title
        text = article.text.strip()

        if detect_paywall(text):
            snippet = text[:300] + "..." if len(text) > 300 else text
            return {
                "status": "partial",
                "title": title,
                "snippet": snippet,
                "content": None,
                "message": "Article may be paywalled. Returning snippet only."
            }

        return {
            "status": "success",
            "title": title,
            "content": text,
            "snippet": text[:300] + "..." if len(text) > 300 else text
        }

    except Exception:
        # Fallback: BeautifulSoup
        try:
            response = requests.get(url, timeout=5)
            if response.status_code != 200:
                raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Failed to retrieve page.")

            soup = BeautifulSoup(response.content, "html.parser")
            title = soup.title.string.strip() if soup.title else "Untitled"

            # Try to get all paragraph text
            paragraphs = soup.find_all("p")
            text = "\n".join(p.get_text() for p in paragraphs).strip()

            if detect_paywall(text):
                snippet = text[:300] + "..." if len(text) > 300 else text
                return {
                    "status": "partial",
                    "title": title,
                    "snippet": snippet,
                    "content": None,
                    "message": "Article may be paywalled. Returning snippet only."
                }

            return {
                "status": "success",
                "title": title,
                "content": text,
                "snippet": text[:300] + "..." if len(text) > 300 else text
            }

        except Exception as e:
            raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR, detail=f"Failed to scrape article: {str(e)}")
