import { useState, useEffect } from "react";
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
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import dayjs from "dayjs";

const EditTask = () => {
  const { id } = useParams();
  const { tasks, updateTask, deleteTask } = useTasks(); // assuming deleteTask exists
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
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
          color: "text.secondary",
        }}
      >
        <Typography variant="body1">
          {task ? "Loading task..." : "Task not found"}
        </Typography>
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
      setError("Task title is required");
      return;
    }

    updateTask(id, {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      dueDate: form.dueDate ? form.dueDate.toISOString() : null,
      priority: form.priority,
      tags: form.tags.length > 0 ? form.tags : undefined,
    });

    navigate(`/tasks/${id}`);
  };

  const handleDelete = () => {
    if (deleteTask) {
      deleteTask(id);
      setDeleteConfirmOpen(false);
      navigate("/");
    }
  };

  const formContent = (
    <Stack spacing={3}>
      {error && (
        <Alert severity="error" sx={{ borderRadius: 2 }}>
          {error}
        </Alert>
      )}

      <TextField
        label="Task Title"
        name="title"
        value={form.title}
        onChange={handleChange}
        fullWidth
        required
        variant="outlined"
        error={!!error && !form.title.trim()}
        helperText={error && !form.title.trim() ? "This field is required" : ""}
      />

      <TextField
        label="Description (optional)"
        name="description"
        value={form.description}
        onChange={handleChange}
        multiline
        rows={4}
        fullWidth
        variant="outlined"
      />

      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          gap: 2.5,
        }}
      >
        <FormControl fullWidth variant="outlined">
          <InputLabel id="priority-label">Priority</InputLabel>
          <Select
            labelId="priority-label"
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
          label="Due Date (optional)"
          value={form.dueDate}
          onChange={handleDateChange}
          slotProps={{
            textField: {
              fullWidth: true,
              variant: "outlined",
            },
          }}
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
              size="small"
              label={option}
              {...getTagProps({ index })}
              key={index}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Tags"
            placeholder="Type and press enter (e.g. work, urgent)"
            helperText="Separate tags with Enter"
            variant="outlined"
          />
        )}
      />
    </Stack>
  );

  // ─── DESKTOP ──────────────────────────────────────────────────
  if (isDesktop) {
    return (
      <>
        <Dialog
          open
          maxWidth="sm"
          fullWidth
          onClose={() => navigate(`/tasks/${id}`)}
          PaperProps={{
            sx: { borderRadius: 3, overflow: "hidden" },
          }}
        >
          <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
            <Typography variant="h6" fontWeight={600}>
              Edit Task
            </Typography>
          </DialogTitle>

          <DialogContent dividers sx={{ px: 3, py: 3 }}>
            {formContent}
          </DialogContent>

          <DialogActions sx={{ px: 3, py: 2.5, gap: 1.5 }}>
            <Button
              color="error"
              startIcon={<DeleteOutlineIcon />}
              onClick={() => setDeleteConfirmOpen(true)}
              sx={{ mr: "auto" }}
            >
              Delete
            </Button>

            <Button onClick={() => navigate(`/tasks/${id}`)} color="inherit">
              Cancel
            </Button>

            <Button
              variant="contained"
              disableElevation
              onClick={handleSubmit}
              sx={{ minWidth: 100 }}
            >
              Update
            </Button>
          </DialogActions>
        </Dialog>

        {/* Delete Confirmation */}
        <Dialog
          open={deleteConfirmOpen}
          onClose={() => setDeleteConfirmOpen(false)}
          maxWidth="xs"
          fullWidth
        >
          <DialogTitle>Delete Task?</DialogTitle>
          <DialogContent>
            <Typography>
              This action cannot be undone. The task will be permanently removed.
            </Typography>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteConfirmOpen(false)}>
              Cancel
            </Button>
            <Button color="error" variant="contained" onClick={handleDelete}>
              Delete
            </Button>
          </DialogActions>
        </Dialog>
      </>
    );
  }

  // ─── MOBILE ───────────────────────────────────────────────────
  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
      }}
    >
      {/* Header */}
      <Box
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: "background.paper",
          position: "sticky",
          top: 0,
          zIndex: theme.zIndex.appBar,
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            px: { xs: 2, sm: 4 },
            py: 2,
          }}
        >
          <IconButton
            onClick={() => navigate(`/tasks/${id}`)}
            edge="start"
            sx={{ mr: 1.5 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={600}>
            Edit Task
          </Typography>
        </Box>
      </Box>

      {/* Form */}
      <Box
        sx={{
          flex: 1,
          px: { xs: 2, sm: 4 },
          py: { xs: 3, md: 5 },
          maxWidth: 780,
          mx: "auto",
          width: "100%",
        }}
      >
        <Box
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            bgcolor: "background.paper",
          }}
        >
          {formContent}
        </Box>
      </Box>

      {/* Bottom bar */}
      <Box
        sx={{
          position: "fixed",
          bottom: 0,
          left: 0,
          right: 0,
          p: 2,
          bgcolor: "background.paper",
          borderTop: `1px solid ${theme.palette.divider}`,
          display: "flex",
          gap: 2,
          boxShadow: "0 -2px 10px rgba(0,0,0,0.08)",
        }}
      >
        <Button
          fullWidth
          color="error"
          variant="outlined"
          startIcon={<DeleteOutlineIcon />}
          onClick={() => setDeleteConfirmOpen(true)}
        >
          Delete
        </Button>

        <Button
          fullWidth
          variant="contained"
          disableElevation
          onClick={handleSubmit}
        >
          Update
        </Button>
      </Box>

      {/* Delete Confirmation */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Task?</DialogTitle>
        <DialogContent>
          <Typography>
            This action cannot be undone. The task will be permanently removed.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>
            Cancel
          </Button>
          <Button color="error" variant="contained" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default EditTask;