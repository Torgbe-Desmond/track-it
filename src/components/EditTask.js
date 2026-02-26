import  { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Stack,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Chip,
  Box,
  Typography,
  useMediaQuery,
  useTheme,
  Autocomplete,
  Alert,
  IconButton,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ArrowBack } from "@mui/icons-material";
import dayjs from "dayjs";

const EditTask = () => {
  const { id } = useParams();
  const { tasks, updateTask } = useTasks();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));

  const task = tasks.find((t) => t.id === id);

  const [form, setForm] = useState(null);
  const [error, setError] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  useEffect(() => {
    if (task) {
      setForm({
        title: task.title,
        description: task.description || "",
        dueDate: task.dueDate ? dayjs(task.dueDate) : null,
        priority: task.priority || "medium",
        tags: task.tags || [],
      });
    }
  }, [task]);

  if (!task || !form) {
    return (
      <Box sx={{ p: 4 }}>
        <Typography>Loading...</Typography>
      </Box>
    );
  }

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleDateChange = (newValue) => {
    setForm((prev) => ({ ...prev, dueDate: newValue }));
  };

  const handleTagsChange = (event, newValue) => {
    setForm((prev) => ({ ...prev, tags: newValue }));
  };

  const handleSubmit = () => {
    if (!form.title.trim()) {
      setError("Title is required");
      return;
    }

    updateTask(id, {
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate ? form.dueDate.toISOString() : null,
      priority: form.priority,
      tags: form.tags,
    });

    navigate(`/tasks/${id}`);
  };

  const content = (
    <Stack spacing={3} sx={{ mt: 1 }}>
      {error && <Alert severity="error">{error}</Alert>}

      <TextField
        label="Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        fullWidth
        required
      />

      <TextField
        label="Description"
        name="description"
        value={form.description}
        onChange={handleChange}
        multiline
        rows={4}
        fullWidth
      />

      <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
        <FormControl sx={{ minWidth: 140, flex: 1 }}>
          <InputLabel>Priority</InputLabel>
          <Select
            name="priority"
            value={form.priority}
            label="Priority"
            onChange={handleChange}
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>

        <DatePicker
          label="Due Date"
          value={form.dueDate}
          onChange={handleDateChange}
          sx={{ flex: 1 }}
        />
      </Box>

      <Autocomplete
        multiple
        freeSolo
        options={[]}
        value={form.tags}
        onChange={handleTagsChange}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              variant="outlined"
              label={option}
              {...getTagProps({ index })}
              key={index}
            />
          ))
        }
        renderInput={(params) => (
          <TextField {...params} label="Tags (press enter to add)" />
        )}
      />
    </Stack>
  );

  /* ================= DESKTOP (DIALOG MODE) ================= */
  if (isDesktop) {
    return (
      <>
        <Dialog
          open
          maxWidth="sm"
          fullWidth
          onClose={() => navigate(`/tasks/${id}`)}
        >
          <DialogTitle>Edit Task</DialogTitle>
          <DialogContent dividers>{content}</DialogContent>
          <DialogActions>
            <Button onClick={() => navigate(`/tasks/${id}`)}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit}>
              Update
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation */}
        {/* <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
        >
          <DialogTitle>Confirm Delete</DialogTitle>
          <DialogContent>
            Are you sure you want to delete this task?
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button color="error" onClick={handleDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog> */}
      </>
    );
  }

  /* ================= MOBILE (FULL PAGE MODE) ================= */
  return (
    <>
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          flexDirection: "column",
          bgcolor: "background.default",
        }}
      >
        {/* Header */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: 2,
            py: 2,
          }}
        >
          <IconButton onClick={() => navigate(`/tasks/${id}`)}>
            <ArrowBack />
          </IconButton>
          <Typography variant="h6" sx={{ ml: 1 }}>
            Edit Task
          </Typography>
        </Box>

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            px: 2,
            pb: 12,
            maxWidth: 700,
            width: "100%",
            mx: "auto",
          }}
        >
          {content}
        </Box>

        {/* Bottom Action Bar */}
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            display: "flex",
            gap: 2,
            bgcolor: "background.paper",
            borderTop: "1px solid",
            borderColor: "divider",
          }}
        >
          <Button
            fullWidth
            color="error"
            variant="outlined"
            onClick={() => setDeleteConfirmOpen(true)}
          >
            Delete
          </Button>

          <Button
            fullWidth
            variant="contained"
            onClick={handleSubmit}
          >
            Update
          </Button>
        </Box>
      </Box>

      {/* Delete Confirmation Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>
          Are you sure you want to delete this task?
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default EditTask;