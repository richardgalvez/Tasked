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

  // TODO: Implement deletion for tasks
  const deleteTask = (id: string) => {
    const updatedTasks = tasks.filter((task) => task.id !== id);
    setTasks(updatedTasks);
  };

  // TODO: Implement option to update tasks
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
      <input
        type="text"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <input
        type="text"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
      />
      <input
        type="text"
        value={newPriority}
        onChange={(e) => setNewPriority(e.target.value)}
      />
      <input
        type="text"
        value={newDueDate}
        onChange={(e) => setNewDueDate(e.target.value)}
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