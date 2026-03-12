import { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
} from "@mui/material";
import { useDexieFileSystem } from "../hooks/useDexieFileSystem";
import { v4 as uuidv4 } from "uuid";

export default function AddFile({ open, onClose, directoryId, onFileAdded }) {
  const { addFile } = useDexieFileSystem();
  const [name, setName] = useState("");

  const handleAdd = async () => {
    if (!name.trim()) return;
    await addFile({
      id: uuidv4(),
      name: name.trim(),
      directoryId,
      content: "",
    });
    setName("");
    if (onFileAdded) onFileAdded();
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="xs">
      <DialogTitle>New File</DialogTitle>
      <DialogContent>
        <TextField
          autoFocus
          fullWidth
          label="Filename"
          value={name}
          onChange={(e) => setName(e.target.value)}
          sx={{ mt: 1 }}
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button variant="contained" onClick={handleAdd}>
          Add
        </Button>
      </DialogActions>
    </Dialog>
  );
}