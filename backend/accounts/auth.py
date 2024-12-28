from datetime import datetime, timedelta
from typing import Optional

from django.conf import settings
from django.utils import timezone
from jose import JWTError, jwt
from ninja.security import HttpBearer


class AuthBearer(HttpBearer):
    def authenticate(self, request, token: str) -> Optional[dict]:
        payload = decode_token(token)
        if payload and payload["type"] == "access":
            return payload
        return None

class AuthToken:
    def __init__(self, token: str, token_type: str):
        self.token = token
        self.token_type = token_type

def create_access_token(data: dict) -> AuthToken:
    to_encode = data.copy()
    expire = timezone.now() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
    return AuthToken(encoded_jwt, "access")

def create_refresh_token(data: dict) -> AuthToken:
    to_encode = data.copy()
    expire = timezone.now() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(
        to_encode,
        settings.JWT_SECRET,
        algorithm=settings.JWT_ALGORITHM
    )
    return AuthToken(encoded_jwt, "refresh")

def decode_token(token: str) -> Optional[dict]:
    try:
        decoded_token = jwt.decode(
            token,
            settings.JWT_SECRET,
            algorithms=[settings.JWT_ALGORITHM]
        )
        return decoded_token if decoded_token["exp"] >= timezone.now().timestamp() else None
    except JWTError:
        return None