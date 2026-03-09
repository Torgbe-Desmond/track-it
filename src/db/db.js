import Dexie from 'dexie';

export const db = new Dexie('TaskAppDB');
db.version(1).stores({
  categories: '++id, name',
  tasks: '++id, categoryId, title, completed, priority, createdAt'
});