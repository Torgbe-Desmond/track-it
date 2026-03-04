import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCategoriesAndTasks } from "../hooks/CategoriesContext"; // ✅ use context version
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
  Paper,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";

const AddTask = ({ open, onClose }) => {
  const { categoryId } = useParams();
  const { categories, addTask } = useCategoriesAndTasks(); 
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isModal = !!onClose;

  const categoryExists = categories.some((c) => c.id === categoryId);

  const [form, setForm] = useState({
    title: "",
    description: "",
    dueDate: null,
    priority: "medium",
    tags: [],
  });

  const [error, setError] = useState("");

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

    if (!categoryExists) {
      setError("Category not found");
      return;
    }

    addTask(categoryId, {
      title: form.title.trim(),
      description: form.description.trim() || undefined,
      dueDate: form.dueDate ? form.dueDate.toISOString() : null,
      priority: form.priority,
      tags: form.tags.length > 0 ? form.tags : undefined,
    });

    // Reset form
    setForm({
      title: "",
      description: "",
      dueDate: null,
      priority: "medium",
      tags: [],
    });

    setError("");

    if (isModal) {
      onClose();
    } else {
      navigate(`/categories/${categoryId}`);
    }
  };

  // Optional safety: if category doesn't exist
  if (!categoryExists) {
    return (
      <Box
        sx={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          p: 4,
        }}
      >
        <Alert severity="error">Category not found</Alert>
      </Box>
    );
  }

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
        autoFocus
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
        <FormControl fullWidth>
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
            placeholder="Type and press enter"
            helperText="Separate tags with Enter"
            variant="outlined"
          />
        )}
      />
    </Stack>
  );

  // ─── MODAL MODE ───────────────────────────────────────────────
  if (isModal) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>New Task</DialogTitle>
        <DialogContent dividers>{formContent}</DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save Task
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // ─── FULL PAGE MODE ───────────────────────────────────────────
  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      <Box sx={{ borderBottom: `1px solid ${theme.palette.divider}` }}>
        <Box sx={{ display: "flex", alignItems: "center", p: 2 }}>
          <IconButton onClick={() => navigate(`/categories/${categoryId}`)}>
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={600}>
            New Task
          </Typography>
        </Box>
      </Box>

      <Box sx={{ p: 3, maxWidth: 700, mx: "auto" }}>
        <Paper sx={{ p: 4 }}>{formContent}</Paper>

        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 2, mt: 3 }}>
          <Button
            variant="outlined"
            onClick={() => navigate(`/categories/${categoryId}`)}
          >
            Cancel
          </Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save Task
          </Button>
        </Box>
      </Box>
    </Box>
  );
};

export default AddTask;