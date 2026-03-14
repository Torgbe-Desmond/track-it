import { useState } from "react";
import { db } from "../db/_db";

export function useDexieFileSystem() {
  const [directories, setDirectories] = useState([]);
  const [files, setFiles] = useState([]);

  // Fetch directories
  const fetchDirectories = async (parentDirectoryId = null) => {
    const dirs =
      parentDirectoryId === null
        ? await db.directories.filter((d) => !d.parentDirectoryId).toArray()
        : await db.directories
            .where("parentDirectoryId")
            .equals(parentDirectoryId)
            .toArray();
    setDirectories(dirs);
    return dirs;
  };

  // Fetch files
  const fetchFiles = async (directoryId) => {
    const f = await db.files.where("directoryId").equals(directoryId).toArray();
    setFiles(f);
    return f;
  };

  // Add directory
  const addDirectory = async ({ id, name, parentDirectoryId = null }) => {
    const now = Date.now();
    await db.directories.add({
      id,
      name,
      parentDirectoryId,
      files: [],
      subDirectories: [],
      createdAt: now,
      updatedAt: now,
    });

    // Update parent directory subDirectories
    if (parentDirectoryId) {
      const parent = await db.directories.get(parentDirectoryId);
      if (parent) {
        await db.directories.update(parentDirectoryId, {
          subDirectories: [...(parent.subDirectories || []), id],
          updatedAt: now,
        });
      }
    }

    await fetchDirectories(parentDirectoryId);
  };

  // Update directory
  const updateDirectory = async (id, newName) => {
    const now = Date.now();
    const dir = await db.directories.get(id);
    if (!dir) return;
    await db.directories.update(id, { name: newName, updatedAt: now });
    await fetchDirectories(dir.parentDirectoryId || null);
  };

  // Delete directory recursively
  const deleteDirectory = async (id) => {
    const dir = await db.directories.get(id);
    if (!dir) return;

    // Delete all files in this directory
    if (dir.files?.length) {
      await Promise.all(dir.files.map((fileId) => db.files.delete(fileId)));
    }

    // Delete all subdirectories recursively
    if (dir.subDirectories?.length) {
      for (const subId of dir.subDirectories) {
        await deleteDirectory(subId);
      }
    }

    // Remove this directory from parent’s subDirectories
    if (dir.parentDirectoryId) {
      const parent = await db.directories.get(dir.parentDirectoryId);
      if (parent) {
        await db.directories.update(dir.parentDirectoryId, {
          subDirectories: (parent.subDirectories || []).filter(
            (did) => did !== id,
          ),
          updatedAt: Date.now(),
        });
      }
    }

    // Delete the directory itself
    await db.directories.delete(id);

    await fetchDirectories(dir.parentDirectoryId || null);
  };

  // Add file
  const addFile = async ({
    id,
    name,
    directoryId,
    content = "",
    values = {},
  }) => {
    const now = Date.now();
    await db.files.add({
      id,
      name,
      directoryId,
      content,
      values, // store user-entered values
      size: content.length,
      createdAt: now,
      updatedAt: now,
    });

    // Update parent directory
    const dir = await db.directories.get(directoryId);
    if (dir) {
      await db.directories.update(directoryId, {
        files: [...(dir.files || []), id],
        updatedAt: now,
      });
    }

    await fetchFiles(directoryId);
  };

  // Update file content
  const updateFile = async (id, updates) => {
    const now = Date.now();
    await db.files.update(id, { ...updates, updatedAt: now });

    const file = await db.files.get(id);
    if (file) await fetchFiles(file.directoryId);
  };

  // Delete file
  const deleteFile = async (id) => {
    const file = await db.files.get(id);
    if (!file) return;

    // Remove from directory
    const dir = await db.directories.get(file.directoryId);
    if (dir) {
      await db.directories.update(dir.id, {
        files: (dir.files || []).filter((fid) => fid !== id),
        updatedAt: Date.now(),
      });
    }

    // Delete the file
    await db.files.delete(id);
    await fetchFiles(file.directoryId);
  };

  // Get single file
  const getFile = async (id) => {
    return await db.files.get(id);
  };

  // Get single directory
  const getDirectory = async (id) => {
    return await db.directories.get(id);
  };

  return {
    directories,
    files,
    fetchDirectories,
    fetchFiles,
    addDirectory,
    updateDirectory,
    deleteDirectory,
    addFile,
    updateFile,
    deleteFile,
    getFile,
    getDirectory,
  };
}
