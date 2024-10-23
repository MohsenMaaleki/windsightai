from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Boolean, Float, JSON
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy.orm import relationship
from datetime import datetime

Base = declarative_base()

class User(Base):
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    username = Column(String, unique=True, nullable=False)
    email = Column(String, unique=True, nullable=False)
    password_hash = Column(String, nullable=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    last_login = Column(DateTime)

    uploads = relationship('Upload', back_populates='user')
    subscriptions = relationship('Subscription', back_populates='user')

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

class Analysis(Base):
    __tablename__ = 'analyses'

    id = Column(Integer, primary_key=True)
    upload_id = Column(Integer, ForeignKey('uploads.id'), nullable=False)
    analysis_date = Column(DateTime, default=datetime.utcnow)
    status = Column(String, nullable=False)
    result_path = Column(String)
    analysis_metadata = Column(JSON)  
    upload = relationship('Upload', back_populates='analyses')


class Subscription(Base):
    __tablename__ = 'subscriptions'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    plan_type = Column(String, nullable=False)
    start_date = Column(DateTime, nullable=False)
    end_date = Column(DateTime)
    status = Column(String, nullable=False)

    user = relationship('User', back_populates='subscriptions')