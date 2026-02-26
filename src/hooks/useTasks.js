import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useTasks = () => {
  const [tasks, setTasks] = useState(() => {
    const saved = localStorage.getItem('tasks');
    return saved ? JSON.parse(saved, (key, value) => {
      if (key === 'dueDate' && value) return new Date(value);
      return value;
    }) : [];
  });

  useEffect(() => {
    localStorage.setItem('tasks', JSON.stringify(tasks));
  }, [tasks]);

  const addTask = (newTask) => {
    setTasks(prev => [...prev, { id: uuidv4(), completed: false, ...newTask }]);
  };

  const updateTask = (id, updates) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, ...updates } : t));
  };

  const deleteTask = (id) => {
    setTasks(prev => prev.filter(t => t.id !== id));
  };

  const toggleComplete = (id) => {
    setTasks(prev => prev.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const reorderTasks = (newOrder) => {
    setTasks(newOrder);
  };

  return { tasks, addTask, updateTask, deleteTask, toggleComplete, reorderTasks };
};