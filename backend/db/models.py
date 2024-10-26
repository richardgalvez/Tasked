from sqlalchemy import create_engine, Column, Integer, Text, String, Boolean, DateTime
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker, declarative_base
from datetime import datetime

url = URL.create(
  drivername="postgresql",
  # username="postgres",
  # password="",
  host="localhost",
  database="mydb",
  port=5432
)

engine = create_engine(url)
Session = sessionmaker(bind=engine)
session = Session()

Base = declarative_base()

class Task(Base):
  __tablename__ = "tasks"
  id = Column(Integer, primary_key=True, autoincrement=True)
  name = Column(String(255), nullable=False)
  description = Column(Text)
  priority = Column(String(255))
  due_date = Column(DateTime)
  created_date = Column(DateTime, default=datetime.now)
  is_done = Column(Boolean, default=False)
  
  Base.metadata.create_all(engine)