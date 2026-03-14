import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { db } from "../../db/_db";

export default function NewProjectDialog({
  open,
  onClose,
  onCreate,
  addDirectory,
}) {
  const [name, setName] = useState("");

  const handleCreate = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;

    const projectId = `proj_${Date.now()}`;

    await addDirectory({
      id: projectId,
      name: trimmed,
      parentDirectoryId: null,
    });

    // Default schema file
    await db.files.add({
      id: `schema_${Date.now()}`,
      name: "schema.md",
      directoryId: projectId,
      type: "schema",
      content: `
---
fields:
  title:
    type: text
  content:
    type: textarea
---

# {{title}}

{{content}}
      `.trim(),
    });

    setName("");
    onCreate();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>New Project</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Project name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          margin="dense"
          variant="outlined"
          helperText="e.g. Mobile App Redesign, Personal Blog, etc."
          sx={{
            "& input": { fontSize: { xs: 16, sm: 14 }, WebkitTextSizeAdjust: "100%" },
          }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" disabled={!name.trim()} onClick={handleCreate}>
          Create
        </Button>
      </DialogActions>
    </Dialog>
  );
}