import { useEffect, useState } from "react";
import { v4 as uuidv4 } from 'uuid';
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
  const hostname = location.hostname;
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  useEffect(() => {
    axios
      .get(`http://${hostname}:8000/tasks`)
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
        const response = await axios.get(`http://${hostname}:8000/tasks`);
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
        id: uuidv4(),
        name: newTask,
        description: newDescription,
        priority: newPriority,
        due_date: newDueDate,
        created_date: new Date().toISOString().slice(0, 10),
        is_done: false,
      };
      setTasks((tasks) => [...tasks, newTaskItem]);
      
      axios.post(`http://${hostname}:8000/create`, newTaskItem).catch((error) => {
        console.error("There was an error adding the task: ", error);
      });
      setNewTask('');;
      setNewDescription('');
      setNewPriority('');
      setNewDueDate('');
    }
  };

  const deleteTask = (id: string) => {
    axios
      .delete(`http://${hostname}:8000/delete/${id}`)
      .then(() => {
        const updatedTasks = tasks.filter((task) => task.id !== id);
        setTasks(updatedTasks);
      })
      .catch((error) => {
        console.error("There was an error deleting the task: ", error);
      });
  };

  const toggleDone = (id: string) => {
    axios
    .put(`http://${hostname}:8000/status/${id}`)
    .then(() => {
      setTasks((tasks) =>
        tasks.map((task) => {
          if (task.id === id) {
            return { ...task, is_done: !task.is_done};
          }
          return task;
        })
      );
    })
    .catch((error) => {
      console.error("There was an error updating the task: ", error.response);
    });
  }

return (
  <div className="container">
    <h1>⚙️ Tasked ⚙️</h1>
    <h2>Task management made simple.</h2>
    <div>
      <input
        className="inputbox"
        type="text"
        placeholder="Task Name"
        value={newTask}
        onChange={(e) => setNewTask(e.target.value)}
      />
      <input
        className="inputbox"
        type="text"
        placeholder="Description"
        value={newDescription}
        onChange={(e) => setNewDescription(e.target.value)}
      />
      <input
        className="inputbox"
        type="text"
        placeholder="Priority"
        value={newPriority}
        onChange={(e) => setNewPriority(e.target.value)}
      />
      <input
        className="inputbox"
        type="text"
        placeholder="Due Date (yyyy-mm-dd)"
        value={newDueDate}
        onChange={(e) => setNewDueDate(e.target.value)}
      />
      <button onClick={createTask}>Add Task</button>
    </div>
    <div className="separator"></div>
    <h2>Current Tasks:</h2>
    <ul className="task-list">
      {tasks.map((task) => (
        <li className="task-card" key={task.id}>
          <div className="task-info">
            <input
              className="checkbox"
              type="checkbox"
              checked={task.is_done}
              onChange={() => toggleDone(task.id)}
            />
            <span style={{ textDecoration: task.is_done ? 'line-through' : 'none' }}>
              {task.name}
            </span>
            <p>Description: {task.description || "N/A"}</p>
            <p>Priority: {task.priority || "N/A"}</p>
            <p>Due Date: {task.due_date || "N/A"}</p>
          </div>
          <button className="remove-button" onClick={() => deleteTask(task.id)}>Remove</button>
        </li>
      ))}
    </ul>
  </div>
);
};

export default TaskedApp;