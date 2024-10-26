from sqlalchemy import create_engine, Column, Integer, String, Boolean
from sqlalchemy.engine import URL
from sqlalchemy.orm import sessionmaker, declarative_base

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
  text = Column(String(255), nullable=False)
  is_done = Column(Boolean, default=False)
  
  Base.metadata.create_all(engine)