import os
import firebase_admin
from firebase_admin import credentials, auth
from fastapi import Request, HTTPException, status
from dotenv import load_dotenv

load_dotenv()

# Initialize Firebase Admin (if not already initialized)
if not firebase_admin._apps:
    cred_path = os.getenv("GOOGLE_APPLICATION_CREDENTIALS", "firebase-service-account.json")
    cred = credentials.Certificate(cred_path)
    firebase_admin.initialize_app(cred)

async def verify_token(request: Request):
    """
    Dependency to verify Firebase ID Token passed in 'Authorization: Bearer <token>'.
    On success, returns the decoded token (uid, email, etc.).
    On failure, raises HTTP 401.
    """
    auth_header = request.headers.get("Authorization")
    if not auth_header:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing Authorization header")

    scheme, _, token = auth_header.partition(" ")
    if scheme.lower() != "bearer" or not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid Authorization header format")

    try:
        decoded_token = auth.verify_id_token(token)
        return decoded_token  # contains 'uid', 'email', etc.
    except Exception as e:
        # Token is invalid or expired
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid or expired ID token")
