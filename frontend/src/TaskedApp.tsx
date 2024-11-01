import { useEffect, useState } from "react";
import axios from "axios";

interface TaskItem {
  id: string;
  name: string;
  description?: string;
  priority?: string;
  dueDate?: string;
  createdDate: string;
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

// TODO: Implement for all CRUD operations from backend

// TODO: Fix Create operation, 500 internal server error, could be wrong typing on id.
  const createTask = () => {
    if (newTask !== '') {
      const newId = crypto.randomUUID();
      let today = new Date().toISOString().slice(0, 10)
      const newTaskItem: TaskItem = {
        id: newId,
        name: newTask,
        description: "",
        priority: "",
        createdDate: today,
        dueDate: today,
        is_done: false,
      };

      //setTasks([...tasks, newTaskItem]);

      setTasks((tasks) => [...tasks, newTaskItem]);
      
      axios.post("http://localhost:8000/create", newTaskItem).catch((error) => {
        console.error("There was an error adding the task: ", error);
      });
      // setNewTask('');
    }
  };

  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  const toggleDone = (id: string) => {
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        return { ...task, is_done: !task.is_done};
      }
      return task;
    });
    setTasks(updatedTasks);
  };

// TODO: Implement better formatting and responsive design
  return (
    <div>
      <h1> Welcome to ⚙️ Tasked ⚙️</h1>
      <h2>👤 The Note Taking App for Everyone 👤</h2>
      <p>My Notes:</p>
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
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
              {task.name} | {task.description}
            </span>
            <button onClick={() => deleteTask(task.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskedApp;