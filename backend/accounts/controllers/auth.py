from django.contrib.auth import get_user_model
from django.contrib.auth.password_validation import validate_password
from django.core.exceptions import ValidationError
from django.utils import timezone

from accounts.auth import create_access_token, create_refresh_token, decode_token

User = get_user_model()

def handle_signup(payload):
    if payload.password != payload.password_confirm:
        raise ValidationError("Passwords do not match")

    if User.objects.filter(email=payload.email).exists():
        raise ValidationError("Email already exists")

    if not validate_password(payload.password):
        raise ValidationError("Password is not valid")

    user = User.objects.create_user(
        email=payload.email,
        password=payload.password
    )

    access_token = create_access_token(data={"user_id": str(user.id)})
    refresh_token = create_refresh_token(data={"user_id": str(user.id)})

    user.update_refresh_token(refresh_token.token)

    return {
        "access_token": access_token.token,
        "refresh_token": refresh_token.token,
        "token_type": "bearer"
    }

def handle_login(payload):
    user = User.objects.filter(email=payload.email).first()
    if not user.check_password(payload.password):
        raise User.DoesNotExist

    user.last_login = timezone.now()
    user.save()

    access_token = create_access_token(data={"user_id": str(user.id)})
    refresh_token = create_refresh_token(data={"user_id": str(user.id)})

    # Implement refresh token rotation
    user.update_refresh_token(refresh_token.token)

    return {
        "access_token": access_token.token,
        "refresh_token": refresh_token.token,
        "token_type": "bearer"
    }

def handle_refresh(payload):
    data = decode_token(payload.refresh_token)
    if not data or data["type"] != "refresh":
        raise ValidationError("Invalid refresh token")

    try:
        user = User.objects.get(id=data["user_id"])

        # Verify the refresh token matches the stored one
        if user.refresh_token != payload.refresh_token:
            raise ValidationError("Refresh token has been revoked")

        access_token = create_access_token(data={"user_id": str(user.id)})
        refresh_token = create_refresh_token(data={"user_id": str(user.id)})

        user.update_refresh_token(refresh_token.token)

        return {
            "access_token": access_token.token,
            "refresh_token": refresh_token.token,
            "token_type": "bearer"
        }
    except User.DoesNotExist:
        raise ValueError("User does not exist")

def handle_logout(request):
    user_id = request.auth["user_id"]
    user = User.objects.get(id=user_id)
    user.invalidate_refresh_token()
    return {"status": "success"}