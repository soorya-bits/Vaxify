from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer
from jose import JWTError, jwt
from app.utils.security import decode_token

# OAuth2PasswordBearer handles token extraction from headers
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/auth/login")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = decode_token(token)  # decode the token
        username: str = payload.get("sub")
        if username is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return payload  # return the decoded user information
    except JWTError:
        raise HTTPException(status_code=401, detail="Token error")
