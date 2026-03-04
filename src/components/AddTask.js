import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
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
import { useCategoriesAndTasks } from "../hooks/CategoriesContext";

const AddTask = ({ open, onClose }) => {
  const { categoryId } = useParams(); // ← now reads category from URL
  const { addTask } = useCategoriesAndTasks(); // ← updated hook
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
      setError("Task title is required");
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
      navigate(-1); // or navigate(`/categories/${categoryId}`)
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

  // ─── MODAL MODE ───────────────────────────────────────────────
  if (isModal) {
    return (
      <Dialog
        open={open}
        onClose={onClose}
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: { borderRadius: 3, overflow: "hidden" },
        }}
      >
        <DialogTitle sx={{ pb: 1, pt: 3, px: 3 }}>
          <Typography variant="h6" fontWeight={600}>
            New Task
          </Typography>
        </DialogTitle>

        <DialogContent dividers sx={{ px: 3, py: 3 }}>
          {formContent}
        </DialogContent>

        <DialogActions sx={{ px: 3, py: 2.5 }}>
          <Button onClick={onClose} color="inherit">
            Cancel
          </Button>
          <Button
            variant="contained"
            disableElevation
            onClick={handleSubmit}
            sx={{ minWidth: 100 }}
          >
            Save Task
          </Button>
        </DialogActions>
      </Dialog>
    );
  }

  // ─── FULL PAGE MODE ───────────────────────────────────────────
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
            onClick={() => navigate(-1)}
            edge="start"
            sx={{ mr: 1.5 }}
          >
            <ArrowBackIcon />
          </IconButton>
          <Typography variant="h6" fontWeight={600}>
            New Task
          </Typography>
        </Box>
      </Box>

      {/* Form Content */}
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
        <Paper
          elevation={isDesktop ? 2 : 0}
          sx={{
            p: { xs: 3, md: 5 },
            borderRadius: 3,
            bgcolor: "background.paper",
          }}
        >
          {formContent}

          {isDesktop && (
            <Box
              sx={{
                display: "flex",
                justifyContent: "flex-end",
                gap: 2,
                mt: 5,
              }}
            >
              <Button
                variant="outlined"
                onClick={() => navigate(-1)}
                sx={{ minWidth: 110 }}
              >
                Cancel
              </Button>
              <Button
                variant="contained"
                disableElevation
                onClick={handleSubmit}
                sx={{ minWidth: 110 }}
              >
                Save Task
              </Button>
            </Box>
          )}
        </Paper>
      </Box>

      {/* Mobile fixed bottom bar */}
      {!isDesktop && (
        <Box
          sx={{
            position: "fixed",
            bottom: 0,
            left: 0,
            right: 0,
            p: 2,
            zIndex: 10,
            bgcolor: "background.paper",
            borderTop: `1px solid ${theme.palette.divider}`,
            display: "flex",
            gap: 2,
            boxShadow: "0 -2px 10px rgba(0,0,0,0.08)",
          }}
        >
          <Button fullWidth variant="outlined" onClick={() => navigate(-1)}>
            Cancel
          </Button>
          <Button
            fullWidth
            variant="contained"
            disableElevation
            onClick={handleSubmit}
          >
            Save
          </Button>
        </Box>
      )}
    </Box>
  );
};

export default AddTask;