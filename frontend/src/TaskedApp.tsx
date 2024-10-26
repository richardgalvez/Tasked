import { useState } from "react";
import axios from "axios";

interface TaskItem {
  id: string;
  description: string;
  is_done: boolean;
}

const TaskedApp = () => {
  const [tasks, setTasks] = useState<TaskItem[]>([]);
  const [newTask, setNewTask] = useState('');

// TODO: Implement for all data attributes to match Task from backend
// TODO: Implement backend and db connection

  const createTask = () => {
    if (newTask !== '') {
      const newId = crypto.randomUUID();
      const newTaskItem: TaskItem = {
        id: newId,
        description: newTask,
        is_done: false,
      };
      setTasks([...tasks, newTaskItem]);
      setNewTask('');
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
              {task.description}
            </span>
            <button onClick={() => deleteTask(task.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskedApp;