from fastapi import FastAPI
from datetime import datetime
from db.models import Task, session
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

origins = [
  "http://localhost:5173",
  "localhost:5173"
]

app.add_middleware(
  CORSMiddleware,
  allow_origins=origins,
  allow_credentials=True,
  allow_methods=["*"],
  allow_headers=["*"],
)

@app.get("/tasks")
async def get_all_tasks():
  tasks_query = session.query(Task)
  return tasks_query.all()

@app.post("/create")
async def create_task(
  id: str = "",
  name: str = "", 
  description: str = "", 
  priority: str = "",
  due_date: str = "yyyy-mm-dd",
  is_done: bool = False,
  ):
  task = Task(name=name, description=description, priority=priority, due_date=due_date, is_done=is_done)
  session.add(task)
  session.commit()
  return {
    "Task Added": task.name,
    "Task ID": task.id,
    "Description:": task.description,
    "Priority:": task.priority,
    "Due Date:": task.due_date,
    "created_date:": task.created_date,
    "Completed": task.is_done
    }

@app.get("/done")
async def get_done_tasks():
  tasks_query = session.query(Task)
  done_tasks_query = tasks_query.filter(Task.is_done==True)
  return done_tasks_query.all()

@app.put("/update/{id}")
async def update_task(
  id: int,
  new_name: str = "",
  is_done: bool = False
):
  task_query = session.query(Task).filter(Task.id==id)
  task = task_query.first()
  if new_name:
    task.name = new_name
  task.is_done = is_done
  session.add(task)
  session.commit()
  return {"Task updated to": task.name}

@app.delete("/delete/{id}")
async def delete_task(id: int):
  task = session.query(Task).filter(Task.id==id).first()
  session.delete(task)
  session.commit()
  return {"Task deleted": task.name}