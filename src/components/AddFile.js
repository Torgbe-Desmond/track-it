import { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Stack,
  MenuItem,
  Checkbox,
  FormControlLabel,
} from "@mui/material";

import { useDexieFileSystem } from "../hooks/useDexieFileSystem";
import { v4 as uuidv4 } from "uuid";
import matter from "gray-matter";
import { db } from "../db/_db";
import { Buffer } from "buffer";
window.Buffer = Buffer;

export default function AddFile({ open, onClose, directoryId, onFileAdded }) {
  const { addFile } = useDexieFileSystem();

  const [fields, setFields] = useState({});
  const [template, setTemplate] = useState("");
  const [formData, setFormData] = useState({});

  /* Load schema */

  useEffect(() => {
    if (!open) return;

    async function loadSchema() {
      const schemaFile = await db.files
        .where({ directoryId, type: "schema" })
        .first();

      if (!schemaFile) return;

      const { data, content } = matter(schemaFile.content);

      setFields(data.fields || {});
      setTemplate(content);
    }

    loadSchema();
  }, [open, directoryId]);

  /* Render markdown */

  const renderTemplate = (template, values) => {
    return template.replace(/{{(.*?)}}/g, (_, key) => {
      const value = values[key.trim()];

      if (value === true) return "Yes";
      if (value === false) return "No";

      return value ?? "";
    });
  };

  /* Create file */

  const handleAdd = async () => {
    // Validate required fields
    for (const [key, config] of Object.entries(fields)) {
      if (config.required && !formData[key]) {
        alert(`${key} is required`);
        return;
      }
    }

    // Render content from template
    const content = renderTemplate(template, formData);

    // Add the file to Dexie
    await addFile({
      id: uuidv4(),
      name: formData.title || "Untitled",
      directoryId,
      type: "file",
      content,
      values: { ...formData }, // <-- Store user-entered values here
    });

    setFormData({});
    if (onFileAdded) onFileAdded();
  };

  const renderField = (key, config) => {
    const value = formData[key] ?? config.default ?? "";

    if (config.type === "textarea") {
      return (
        <TextField
          key={key}
          label={key}
          multiline
          minRows={3}
          fullWidth
          required={config.required}
          value={value}
          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
        />
      );
    }

    if (config.type === "select") {
      return (
        <TextField
          key={key}
          select
          label={key}
          fullWidth
          required={config.required}
          value={value}
          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
        >
          {config.options?.map((opt) => (
            <MenuItem key={opt} value={opt}>
              {opt}
            </MenuItem>
          ))}
        </TextField>
      );
    }

    if (config.type === "date") {
      return (
        <TextField
          key={key}
          type="date"
          label={key}
          fullWidth
          InputLabelProps={{ shrink: true }}
          value={value}
          onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
        />
      );
    }

    if (config.type === "checkbox") {
      return (
        <FormControlLabel
          key={key}
          control={
            <Checkbox
              checked={value === true}
              onChange={(e) =>
                setFormData({ ...formData, [key]: e.target.checked })
              }
            />
          }
          label={key}
        />
      );
    }

    return (
      <TextField
        key={key}
        label={key}
        fullWidth
        required={config.required}
        value={value}
        onChange={(e) => setFormData({ ...formData, [key]: e.target.value })}
      />
    );
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>New File</DialogTitle>

      <DialogContent>
        <Stack spacing={2} sx={{ mt: 1 }}>
          {Object.entries(fields).map(([key, config]) =>
            renderField(key, config),
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>

        <Button variant="contained" onClick={handleAdd}>
          Create File
        </Button>
      </DialogActions>
    </Dialog>
  );
}
