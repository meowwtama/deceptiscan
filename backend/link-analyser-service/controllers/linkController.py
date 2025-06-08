import os
import socket
import ssl
import json
import datetime
import requests
import whois
from fastapi import HTTPException, status
from urllib.parse import urlparse
from bs4 import BeautifulSoup
from dotenv import load_dotenv

load_dotenv()

HISTORY_SERVICE_URL = os.getenv("HISTORY_SERVICE_URL", "http://localhost:5003").rstrip("/")

def resolve_ip(hostname: str) -> str | None:
    try:
        return socket.gethostbyname(hostname)
    except:
        return None


def get_certificate_issuer(hostname: str) -> str | None:
    try:
        ctx = ssl.create_default_context()
        with ctx.wrap_socket(socket.socket(), server_hostname=hostname) as s:
            s.settimeout(5)
            s.connect((hostname, 443))
            cert_bin = s.getpeercert(True)
        from OpenSSL import crypto
        cert = crypto.load_certificate(crypto.FILETYPE_ASN1, cert_bin)
        return cert.get_issuer().CN
    except:
        return None


def is_valid_url(url: str) -> bool:
    try:
        p = urlparse(url)
        return p.scheme in ("http", "https") and bool(p.netloc)
    except:
        return False


def fetch_redirect_chain(url: str, max_hops: int = 5) -> list[dict]:
    chain = []
    current_url = url
    for hop in range(max_hops + 1):
        try:
            resp = requests.get(current_url, timeout=5, allow_redirects=False)
        except Exception as e:
            chain.append({"url": current_url, "error": str(e)})
            break

        parsed = urlparse(current_url)
        hostname = parsed.hostname or ""
        ip = resolve_ip(hostname)

        tls_valid = None
        issuer = None
        if parsed.scheme == "https":
            try:
                requests.get(current_url, timeout=5)
                tls_valid = True
            except requests.exceptions.SSLError:
                tls_valid = False
            except:
                tls_valid = None
            issuer = get_certificate_issuer(hostname)

        # WHOIS age
        try:
            w = whois.whois(hostname)
            created = w.creation_date
            if isinstance(created, list):
                created = created[0]
            age_days = (datetime.datetime.now() - created).days if isinstance(created, datetime.datetime) else -1
        except:
            age_days = -1

        title, forms = ("", [])
        if resp.status_code == 200:
            soup = BeautifulSoup(resp.text, "html.parser")
            title = soup.find("title").get_text(strip=True) if soup.find("title") else ""
            forms = [f.get("action", "") for f in soup.find_all("form")]

        chain.append({
            "url": current_url,
            "status_code": resp.status_code,
            "ip": ip,
            "tls_valid": tls_valid,
            "cert_issuer": issuer,
            "domain_age_days": age_days,
            "title": title,
            "form_actions": forms,
        })

        if resp.status_code in (301, 302, 307, 308) and "Location" in resp.headers:
            loc = resp.headers["Location"]
            next_parsed = urlparse(loc)
            if not next_parsed.scheme:
                current_url = parsed._replace(path=loc).geturl()
            else:
                current_url = loc
            continue
        break

    return chain


def analyze_link(url: str) -> dict:
    issues = []
    chain = fetch_redirect_chain(url)
    first = chain[0]
    parsed = urlparse(first["url"])

    if not is_valid_url(url):
        issues.append("Invalid URL format")
    if parsed.scheme != "https":
        issues.append("Not using HTTPS")
    if first.get("tls_valid") is False:
        issues.append("TLS certificate invalid or expired")
    age = first.get("domain_age_days", -1)
    if age >= 0 and age < 30:
        issues.append(f"Domain age is only {age} days")
    title = first.get("title", "")
    if "login" in title.lower() and parsed.hostname not in title.lower():
        issues.append(f"Generic 'login' page title: '{title}'")
    for action in first.get("form_actions", []):
        if action and parsed.hostname not in action:
            issues.append(f"Form posts externally to '{action}'")
    if len(chain) > 5:
        issues.append(f"Redirect chain length is {len(chain)} (>5)")

    return {"safe": len(issues) == 0, "issues": issues, "redirect_details": chain}


def save_to_history(
    uid: str,
    id_token: str,
    url: str,
    result: dict
) -> str:
    endpoint = f"{HISTORY_SERVICE_URL}/history/linkAnalyser"
    payload = {"data": {"url": url, **result}}
    headers = {"Content-Type": "application/json", "Authorization": f"Bearer {id_token}"}
    resp = requests.post(endpoint, json=payload, headers=headers, timeout=10)
    if resp.status_code != 201:
        raise HTTPException(status_code=status.HTTP_502_BAD_GATEWAY,
                            detail=f"Failed to save link history: {resp.status_code} {resp.text}")
    return resp.json().get("id")


def generate_explanations(issues: list[str]) -> list[dict]:
    templates = {
        "Invalid URL format": "The URL provided could not be parsed as a valid HTTP/HTTPS link.",
        "Not using HTTPS": "Without HTTPS, data between the client and server isn't encrypted and could be intercepted.",
        "TLS certificate invalid or expired": "An invalid or expired certificate means the site's identity can't be verified, making it unsafe.",
        "Domain age": "Newly registered domains are often used for phishing campaigns.",
        "Generic 'login' page title": "A generic login page without brand context may indicate a phishing attempt.",
        "Form posts externally": "Forms that submit to a different domain can capture credentials for malicious use.",
        "Redirect chain length": "Long redirect chains can be used to obfuscate the final landing page."
    }
    out = []
    for issue in issues:
        key = next((k for k in templates if issue.startswith(k.split()[0])), None)
        explanation = templates.get(key, "Potential risk identified.")
        out.append({"issue": issue, "explanation": explanation})
    return out

async def handle_link_analysis(request_data: dict, decoded_token: dict):
    url = request_data.get("url")
    if not url or not isinstance(url, str):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST,
                            detail="Field 'url' (string) is required")
    result = analyze_link(url)
    uid = decoded_token.get("uid")
    if not uid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Invalid token: missing uid")
    auth_header = request_data.get("rawAuthHeader", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
                            detail="Missing rawAuthHeader for saving history")
    token = auth_header.split(" ", 1)[1]
    doc_id = save_to_history(uid, token, url, result)
    return {"id": doc_id, **result}

def get_link_details(uid: str, id_token: str, record_id: str) -> dict:
    endpoint = f"{HISTORY_SERVICE_URL}/history/linkAnalyser/{record_id}"
    headers = {"Authorization": f"Bearer {id_token}"}
    resp = requests.get(endpoint, headers=headers, timeout=5)
    if resp.status_code != 200:
        raise HTTPException(status_code=resp.status_code, detail=resp.text)
    data = resp.json()
    issues = data.get("issues", [])
    explanations = generate_explanations(issues)
    return {"record": data, "explanations": explanations}

async def handle_link_details(record_id: str, request: "fastapi.Request", decoded_token: dict):
    """
    GET details for a saved link analysis, including template explanations.
    """
    auth_header = request.headers.get("Authorization", "")
    if not auth_header.startswith("Bearer "):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Missing Authorization header")
    token = auth_header.split(" ", 1)[1]
    uid = decoded_token.get("uid")
    if not uid:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED,
                            detail="Invalid token: missing uid")
    return get_link_details(uid, token, record_id)
