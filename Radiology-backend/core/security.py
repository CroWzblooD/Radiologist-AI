from datetime import datetime, timedelta
from typing import Optional
import jwt
from passlib.context import CryptContext
from cryptography.fernet import Fernet
from config.settings import SECRET_KEY, ALGORITHM, ENCRYPTION_KEY

pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
fernet = Fernet(ENCRYPTION_KEY.encode())

class SecurityManager:
    @staticmethod
    def create_access_token(data: dict, expires_delta: Optional[timedelta] = None):
        """Create JWT access token"""
        to_encode = data.copy()
        if expires_delta:
            expire = datetime.utcnow() + expires_delta
        else:
            expire = datetime.utcnow() + timedelta(minutes=15)
        to_encode.update({"exp": expire})
        encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
        return encoded_jwt

    @staticmethod
    def verify_password(plain_password: str, hashed_password: str) -> bool:
        """Verify password hash"""
        return pwd_context.verify(plain_password, hashed_password)

    @staticmethod
    def get_password_hash(password: str) -> str:
        """Generate password hash"""
        return pwd_context.hash(password)

    @staticmethod
    def encrypt_data(data: bytes) -> bytes:
        """Encrypt sensitive data"""
        return fernet.encrypt(data)

    @staticmethod
    def decrypt_data(encrypted_data: bytes) -> bytes:
        """Decrypt sensitive data"""
        return fernet.decrypt(encrypted_data) 