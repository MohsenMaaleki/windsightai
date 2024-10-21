import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker
from db_models import Base

# Use the DATABASE_URL environment variable
DATABASE_URL = os.getenv('DATABASE_URL', "postgresql://postgres:@localhost/windsightai")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def init_db():
    Base.metadata.create_all(bind=engine)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
