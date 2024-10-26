from fastapi import FastAPI
from models import Task, session

app = FastAPI()

@app.get("/")
async def get_all_tasks():
  tasks_query = session.query(Task)
  return tasks_query.all()

@app.post("/create")
async def create_task(name: str, is_complete: bool = False):
  task = Task(name=name, is_done=is_complete)
  session.add(task)
  session.commit()
  return {"Task Added": task.name}

@app.get("/done")
async def get_done_tasks():
  tasks_query = session.query(Task)
  done_tasks_query = tasks_query.filter(Task.is_done==True)
  return done_tasks_query.all()

@app.put("/update/{id}")
async def update_task(
  id: int,
  new_name: str = "",
  is_complete: bool = False
):
  task_query = session.query(Task).filter(Task.id==id)
  task = task_query.first()
  if new_name:
    task.name = new_name
  task.is_done = is_complete
  session.add(task)
  session.commit()
  return {"Task updated to": task.name}

@app.delete("/delete/{id}")
async def delete_task(id: int):
  task = session.query(Task).filter(Task.id==id).first()
  session.delete(task)
  session.commit()
  return {"Task deleted": task.name}