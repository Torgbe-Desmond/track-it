import  { useState } from "react";
import { useNavigate } from "react-router-dom";
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
  Paper,
} from "@mui/material";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { ArrowBack } from "@mui/icons-material";

const AddTask = ({ open, onClose }) => {
  const { addTask } = useTasks();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md"));
  const isModal = !!onClose;

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
      setError("Title is required");
      return;
    }

    addTask({
      title: form.title.trim(),
      description: form.description.trim(),
      dueDate: form.dueDate ? form.dueDate.toISOString() : null,
      priority: form.priority,
      tags: form.tags,
    });

    setForm({
      title: "",
      description: "",
      dueDate: null,
      priority: "medium",
      tags: [],
    });

    setError("");

    if (isModal) onClose();
    else navigate("/");
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
        autoFocus
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
          <TextField
            {...params}
            label="Tags (press enter to add)"
            placeholder="e.g. work, urgent"
          />
        )}
      />
    </Stack>
  );

  /* ================= MODAL MODE ================= */
  if (isModal) {
    return (
      <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
        <DialogTitle>Add New Task</DialogTitle>
        <DialogContent dividers>{content}</DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSubmit}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  /* ================= FULL PAGE MODE ================= */
  return (
    <Box
      sx={{
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
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBack />
        </IconButton>
        <Typography variant="h6" sx={{ ml: 1 }}>
          Add New Task
        </Typography>
      </Box>

      {/* Desktop Centered Layout */}
      {isDesktop ? (
        <Box
          sx={{
            flex: 1,
            display: "flex",
            justifyContent: "center",
            px: 2,
            pb: 6,
          }}
        >
          <Paper
            elevation={3}
            sx={{
              width: "100%",
              maxWidth: 700,
              p: 4,
              borderRadius: 3,
            }}
          >
            {content}

            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 4,
              }}
            >
              <Button variant="outlined" onClick={() => navigate("/")}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSubmit}>
                Save
              </Button>
            </Box>
          </Paper>
        </Box>
      ) : (
        <>
          {/* Mobile Content */}
          <Box
            sx={{
              flex: 1,
              px: 2,
              pb: 12,
              maxWidth: 700,
              mx: "auto",
              width: "100%",
            }}
          >
            {content}
          </Box>

          {/* Mobile Bottom Action Bar */}
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
              variant="outlined"
              onClick={() => navigate("/")}
            >
              Cancel
            </Button>

            <Button fullWidth variant="contained" onClick={handleSubmit}>
              Save
            </Button>
          </Box>
        </>
      )}
    </Box>
  );
};

export default AddTask;