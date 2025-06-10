def preprocess_article(scrape_result: dict) -> dict:
    """
    Prepares scraped article data for LLM input.

    Args:
        scrape_result (dict): Output of scrape_article_with_fallbacks function.

    Returns:
        dict: {
            "status": "success" | "error",
            "prompt": str,
            "title": str,
            "snippet": str,
            "message": str (if any)
        }
    """

    if scrape_result["status"] not in ["success", "partial"]:
        return {
            "status": "error",
            "prompt": None,
            "title": None,
            "snippet": None,
            "message": "Article scraping failed or returned invalid content."
        }

    title = scrape_result.get("title", "Untitled Article")
    snippet = scrape_result.get("snippet", "")
    content = scrape_result.get("content")

    # Use full content if available, else fallback to snippet
    base_text = content if content else snippet

    if not base_text or len(base_text.strip()) < 30:
        return {
            "status": "error",
            "prompt": None,
            "title": title,
            "snippet": snippet,
            "message": "Not enough article content for meaningful analysis."
        }

    # Generate LLM-ready prompt
    prompt = (
        f"You are a fake news detection expert.\n"
        f"Analyze the following article and assess how likely it is to contain misinformation or fake news.\n"
        f"Provide a confidence score from 0 (definitely real) to 100 (definitely fake), and explain your reasoning in no more than 100 words.\n\n"
        f"Title: {title}\n\n"
        f"Article:\n{base_text}"
    )

    return {
        "status": "success",
        "prompt": prompt,
        "title": title,
        "snippet": snippet,
        "message": "Prepared prompt for LLM input."
    }
