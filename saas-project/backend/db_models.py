from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime
import bcrypt

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String(60), nullable=False)  # BCrypt hash is always 60 chars
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime)

    uploads = relationship('Upload', back_populates='user')
    subscriptions = relationship('Subscription', back_populates='user')

    @staticmethod
    def hash_password(password: str) -> str:
        """Hash a password using bcrypt"""
        salt = bcrypt.gensalt(rounds=12)  # Work factor of 12 is good for most uses
        hashed = bcrypt.hashpw(password.encode('utf-8'), salt)
        return hashed.decode('utf-8')

    def verify_password(self, password: str) -> bool:
        """Verify a password against the hash"""
        try:
            return bcrypt.checkpw(
                password.encode('utf-8'),
                self.password_hash.encode('utf-8')
            )
        except Exception:
            return False

    def __repr__(self):
        return f"<User(username='{self.username}', email='{self.email}')>"


class Upload(Base):
    __tablename__ = 'uploads'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    filename = Column(String, nullable=False)
    original_path = Column(String, nullable=False)
    upload_date = Column(DateTime, default=datetime.utcnow)
    file_type = Column(String)
    file_size = Column(Float)

    user = relationship('User', back_populates='uploads')
    analyses = relationship('Analysis', back_populates='upload')

    def __repr__(self):
        return f"<Upload(filename='{self.filename}', user_id={self.user_id})>"


class Analysis(Base):
    __tablename__ = 'analyses'

    id = Column(Integer, primary_key=True)
    upload_id = Column(Integer, ForeignKey('uploads.id'), nullable=False)
    analysis_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, nullable=False)
    result_path = Column(String)
    analysis_metadata = Column(JSON)  
    
    upload = relationship('Upload', back_populates='analyses')

    def __repr__(self):
        return f"<Analysis(upload_id={self.upload_id}, status='{self.status}')>"


class Subscription(Base):
    __tablename__ = 'subscriptions'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    plan_type = Column(String, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime)
    status = Column(String, nullable=False)

    user = relationship('User', back_populates='subscriptions')

    def __repr__(self):
        return f"<Subscription(user_id={self.user_id}, plan_type='{self.plan_type}', status='{self.status}')>"