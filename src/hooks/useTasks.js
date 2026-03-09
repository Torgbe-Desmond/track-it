import { useLiveQuery } from 'dexie-react-hooks';
import { db } from '../db/db';

// --- TASK HOOKS & FUNCTIONS ---
export const useTasks = (categoryId) =>
  useLiveQuery(() => db.tasks.where('categoryId').equals(parseInt(categoryId)).toArray(), [categoryId]);

export const useTaskById = (id) =>
  useLiveQuery(() => db.tasks.get(parseInt(id)), [id]);

export const addTask = async (task) =>
  db.tasks.add({ ...task, createdAt: Date.now(), completed: false });

export const updateTask = async (id, data) =>
  db.tasks.update(parseInt(id), data);

export const toggleTask = async (id, currentStatus) =>
  db.tasks.update(parseInt(id), { completed: !currentStatus });

export const deleteTask = async (id) =>
  db.tasks.delete(parseInt(id));

// --- CATEGORY HOOKS & FUNCTIONS ---
export const useCategories = () => useLiveQuery(() => db.categories.toArray());

export const addCategory = async (name) => db.categories.add({ name });

export const updateCategory = async (id, name) =>
  db.categories.update(parseInt(id), { name });

export const deleteCategory = async (id) =>
  db.transaction('rw', db.categories, db.tasks, async () => {
    await db.tasks.where('categoryId').equals(parseInt(id)).delete();
    await db.categories.delete(parseInt(id));
  });