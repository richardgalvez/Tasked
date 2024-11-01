import { useEffect, useState } from "react";
import axios from "axios";

interface TaskItem {
  id: string;
  name: string;
  description?: string;
  priority?: string;
  due_date?: string | null;
  created_date: string;
  is_done: boolean;
}

const TaskedApp = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  useEffect(() => {
    axios
      .get("http://localhost:8000/tasks")
      .then((response) => {
        setTasks(response.data);
      })
      .catch((error) => {
        console.log("There was an error retrieving the current task list:", error);
      });
  }, []);

  const [newTask, setNewTask] = useState('');
  const [newDescription, setNewDescription] = useState("");
  const [newPriority, setNewPriority] = useState("");
  const [newDueDate, setNewDueDate] = useState("");
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const response = await axios.get("http://localhost:8000/tasks");
        setTasks(response.data);
      } catch (error) {
        console.error("There was an error fetching the tasks:", error);
      }
    };
    fetchTasks();
  }, []);

  const createTask = () => {
    if (newTask !== '') {
      const newTaskItem: TaskItem = {
        id: crypto.randomUUID(),
        name: newTask,
        description: newDescription,
        priority: newPriority,
        due_date: newDueDate,
        created_date: new Date().toISOString().slice(0, 10),
        is_done: false,
      };
      setTasks((tasks) => [...tasks, newTaskItem]);
      
      axios.post("http://localhost:8000/create", newTaskItem).catch((error) => {
        console.error("There was an error adding the task: ", error);
      });
    }
  };

  const deleteTask = (id: string) => {
    axios
      .delete(`http://localhost:8000/delete/${id}`)
      .then(() => {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
      })
      .catch((error) => {
        console.error("There was an error deleting the task: ", error);
      });
  };

  // TODO: Implement option to update tasks as DONE
  const toggleDone = (id: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, is_done: !task.is_done};
      }
      return task;
    });
    setTasks(updatedTasks);
  };

// TODO: Implement better formatting and design for inputs
  return (
    <div>
      <h1> Welcome to ⚙️ Tasked ⚙️</h1>
      <h2>👤 The Note Taking App for Everyone 👤</h2>
      <h3>My Notes:</h3>
      <input className="inputbox"
        type="text"
        value={newTask}
        placeholder="Task Name"
        onChange={(e) => setNewTask(e.target.value)}
      />
      <p></p>
      <input className="inputbox"
        type="text"
        value={newDescription}
        placeholder="Description"
        onChange={(e) => setNewDescription(e.target.value)}
      />
      <p></p>
      <input className="inputbox"
        type="text"
        value={newPriority}
        placeholder="Priority Level"
        onChange={(e) => setNewPriority(e.target.value)}
      />
      <p></p>
      <input className="inputbox"
        type="text"
        value={newDueDate}
        placeholder="Due Date (yyyy-mm-dd)"
        onChange={(e) => setNewDueDate(e.target.value)}
      />
      <p></p>
      <button onClick={createTask}>Create Task</button>
      <ul>
        {tasks.map((task) => (
          <li key={task.id}>
            <input
              type="checkbox"
              checked={task.is_done}
              onChange={() => toggleDone(task.id)}
            />
            <span style={{ textDecoration: task.is_done ? 'line-through' : 'none'}}>
              {task.name}
              <p></p> 
              Description: {task.description} || 
              Priority: {task.priority} || 
              Due Date: {task.due_date}
            </span>
            <button onClick={() => deleteTask(task.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskedApp;