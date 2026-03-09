import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTaskById, updateTask, deleteTask } from "../hooks/useTasks";

import {
  Box,
  Typography,
  TextField,
  Button,
  IconButton,
  CircularProgress,
  Alert,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Autocomplete,
} from "@mui/material";

import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";

export default function EditTask() {
  const { categoryId, id: taskId } = useParams();
  const navigate = useNavigate();
  const task = useTaskById(taskId);

  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title || "",
        description: task.description || "",
        dueDate: task.dueDate ? task.dueDate.split("T")[0] : "",
        priority: task.priority || "medium",
        tags: task.tags || [],
      });
    }
  }, [task]);

  if (!task || !form) {
    return (
      <Box sx={{ display: "grid", placeItems: "center", minHeight: "60vh" }}>
        <CircularProgress size={36} />
      </Box>
    );
  }

  const handleSave = async () => {
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    setSaving(true);
    setError("");

    try {
      await updateTask(taskId, {
        title: form.title.trim(),
        description: form.description.trim() || undefined,
        dueDate: form.dueDate || null,
        priority: form.priority,
        tags: form.tags.length ? form.tags : undefined,
      });
      navigate(`/tasks/${categoryId}`);
    } catch {
      setError("Failed to save changes");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!window.confirm("Delete this task permanently?")) return;

    setSaving(true);
    try {
      await deleteTask(taskId);
      navigate(`/tasks/${categoryId}`);
    } catch {
      setError("Failed to delete task");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Box
      sx={{
        p: { xs: 2, sm: 3 },
        maxWidth: 640,
        mx: "auto",
        pb: { xs: 8, sm: 6 }, // better mobile bottom space
      }}
    >
      {/* Header */}
      <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
        <IconButton
          onClick={() => navigate(-1)}
          edge="start"
          size="medium"
          sx={{ color: "text.secondary" }}
        >
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography variant="h6" component="h1" fontWeight={600}>
          Edit Task
        </Typography>
      </Box>

      {error && (
        <Alert severity="error" sx={{ mb: 3 }} variant="outlined">
          {error}
        </Alert>
      )}

      <Stack spacing={2.5}>
        <TextField
          label="Title"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          fullWidth
          autoFocus
          variant="outlined"
          size="medium"
        />

        <TextField
          label="Description (optional)"
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          multiline
          minRows={3}
          fullWidth
          variant="outlined"
        />

        <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
          <FormControl fullWidth size="medium">
            <InputLabel>Priority</InputLabel>
            <Select
              value={form.priority}
              label="Priority"
              onChange={(e) => setForm({ ...form, priority: e.target.value })}
            >
              <MenuItem value="low">Low</MenuItem>
              <MenuItem value="medium">Medium</MenuItem>
              <MenuItem value="high">High</MenuItem>
            </Select>
          </FormControl>

          <TextField
            label="Due Date"
            type="date"
            value={form.dueDate}
            onChange={(e) => setForm({ ...form, dueDate: e.target.value })}
            InputLabelProps={{ shrink: true }}
            fullWidth
          />
        </Stack>

        <Autocomplete
          multiple
          freeSolo
          value={form.tags}
          onChange={(_, newTags) => setForm({ ...form, tags: newTags })}
          options={[]}
          renderInput={(params) => (
            <TextField {...params} label="Tags (press enter)" />
          )}
        />
      </Stack>

      <Stack
        direction="row"
        spacing={2}
        justifyContent="flex-end"
        sx={{ mt: 5 }}
      >
        <Button
          variant="outlined"
          color="error"
          startIcon={<DeleteOutlineRoundedIcon />}
          onClick={handleDelete}
          disabled={saving}
        >
          Delete
        </Button>

        <Button
          variant="contained"
          disableElevation
          onClick={handleSave}
          disabled={saving}
        >
          {saving ? "Saving…" : "Save"}
        </Button>
      </Stack>
    </Box>
  );
}