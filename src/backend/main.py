from fastapi import FastAPI
from models import Task, session

app = FastAPI()

@app.get("/")
async def get_all_tasks():
  tasks_query = session.query(Task)
  return tasks_query.all()

@app.post("/create")
async def create_task(text: str, is_complete: bool = False):
  task = Task(text=text, is_done=is_complete)
  session.add(task)
  session.commit()
  return {"Task Added": task.text}

@app.get("/done")
async def get_done_tasks():
  tasks_query = session.query(Task)
  done_tasks_query = tasks_query.filter(Task.is_done==True)
  return done_tasks_query.all()