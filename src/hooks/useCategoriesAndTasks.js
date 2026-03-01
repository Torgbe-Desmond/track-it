import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';

export const useCategoriesAndTasks = () => {
  // Load from localStorage or start with one default category
  const [categories, setCategories] = useState(() => {
    const saved = localStorage.getItem('taskCategories');
    if (saved) {
      return JSON.parse(saved, (key, value) => {
        // Revive dates
        if (key === 'dueDate' && value) return new Date(value);
        return value;
      });
    }

    // Default starting point if no data exists
    return [
      {
        id: uuidv4(),
        name: 'Uncategorized',
        tasks: [],
      },
    ];
  });

  // Persist to localStorage whenever categories change
  useEffect(() => {
    localStorage.setItem('taskCategories', JSON.stringify(categories));
  }, [categories]);

  // ─────────────────────────────────────────────────────────────
  // Category operations
  // ─────────────────────────────────────────────────────────────

  const addCategory = (name) => {
    if (!name?.trim()) return;

    const newCategory = {
      id: uuidv4(),
      name: name.trim(),
      tasks: [],
    };

    setCategories((prev) => [...prev, newCategory]);
  };

  const updateCategory = (categoryId, newName) => {
    if (!newName?.trim()) return;

    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, name: newName.trim() } : cat
      )
    );
  };

  const deleteCategory = (categoryId) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
  };

  const reorderCategories = (newOrder) => {
    setCategories(newOrder);
  };

  // ─────────────────────────────────────────────────────────────
  // Task operations (now need categoryId)
  // ─────────────────────────────────────────────────────────────

  const addTask = (categoryId, newTaskData) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              tasks: [
                ...cat.tasks,
                {
                  id: uuidv4(),
                  completed: false,
                  createdAt: new Date(),
                  ...newTaskData,
                },
              ],
            }
          : cat
      )
    );
  };

  const updateTask = (categoryId, taskId, updates) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              tasks: cat.tasks.map((task) =>
                task.id === taskId ? { ...task, ...updates } : task
              ),
            }
          : cat
      )
    );
  };

  const deleteTask = (categoryId, taskId) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              tasks: cat.tasks.filter((t) => t.id !== taskId),
            }
          : cat
      )
    );
  };

  const toggleComplete = (categoryId, taskId) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId
          ? {
              ...cat,
              tasks: cat.tasks.map((t) =>
                t.id === taskId ? { ...t, completed: !t.completed } : t
              ),
            }
          : cat
      )
    );
  };

  const reorderTasksInCategory = (categoryId, newTaskOrder) => {
    setCategories((prev) =>
      prev.map((cat) =>
        cat.id === categoryId ? { ...cat, tasks: newTaskOrder } : cat
      )
    );
  };

  return {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
    reorderCategories,

    addTask,
    updateTask,
    deleteTask,
    toggleComplete,
    reorderTasksInCategory,
  };
};