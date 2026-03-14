import Dexie from "dexie";

export const db = new Dexie("MarkdownEditorDB");

db.version(2).stores({
  directories: "id, name, parentDirectoryId",
  files: "id, name, directoryId, type",
});