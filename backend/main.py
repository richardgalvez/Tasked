import socket
from fastapi import FastAPI
from datetime import datetime
from db.models import Task, session
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

hostname = socket.gethostname() + ":5173"
http_hostname = "http://" +socket.gethostname() + ":5173"
https_hostname = "https://" + socket.gethostname() + ":5173"

# TODO: Update for containerized deployment
origins = [
  "http://localhost:5173",
  "https://localhost:5173",
  "localhost:5173",
]

# origins = [
#   hostname,
#   http_hostname,
#   https_hostname
# ]

# Testing with/without wildcard for containerized deployment
app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  # allow_origins=["*"],
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

class TaskItem(BaseModel):
  id: str
  name: str
  description: str
  priority: str
  due_date: str
  created_date: str
  is_done: bool = False

@app.get("/tasks")
async def get_all_tasks():
  tasks_query = session.query(Task)
  return tasks_query.all()

@app.post("/create")
async def create_task(task_item: TaskItem):
  # Mapping fields from TaskItem (incomnig JSON) to new 'task' SQLAlchemy instance 
  task = Task(
    id=task_item.id,
    name=task_item.name,
    description=task_item.description,
    priority=task_item.priority,
    due_date=task_item.due_date,
    created_date=task_item.created_date,
    is_done=task_item.is_done
    )
  session.add(task)
  session.commit()
  return task_item

# Update task as Completed
@app.put("/status/{id}")
async def complete_task(
  id: str,
  is_done: bool = False
):
  task_query = session.query(Task).filter(Task.id==id)
  task = task_query.first()
  if (task.is_done == False):
    task.is_done = True
  else: task.is_done = False
  session.add(task)
  session.commit()
  return {"Task updated to": task.is_done}

@app.delete("/delete/{id}")
async def delete_task(id: str):
  task = session.query(Task).filter(Task.id==id).first()
  session.delete(task)
  session.commit()
  return {"Task deleted": task.name}