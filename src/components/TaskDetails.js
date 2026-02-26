import { useParams, useNavigate } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import {
  Box,
  Typography,
  Chip,
  Checkbox,
  Button,
  Paper,
  Stack,
  IconButton,
  Divider,
  useTheme,
  useMediaQuery,
  Alert,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { ArrowBack, Edit, Delete } from "@mui/icons-material";
import dayjs from "dayjs";
import { useState } from "react";

const priorityColors = { low: "success", medium: "warning", high: "error" };

const TaskDetails = () => {
  const { id } = useParams();
  const { tasks, toggleComplete, deleteTask } = useTasks();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const task = tasks.find((t) => t.id === id);

  if (!task)
    return (
      <Alert severity="info" sx={{ m: 3 }}>
        Task not found
      </Alert>
    );

  const due = task.dueDate
    ? dayjs(task.dueDate).format("MMM D, YYYY")
    : "No due date";

  const handleDelete = () => {
    deleteTask(id);
    setDeleteConfirmOpen(false);
    navigate("/");
  };

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
      <Box sx={{ display: "flex", alignItems: "center", px: 2, py: 2 }}>
        <IconButton onClick={() => navigate("/")}>
          <ArrowBack />
        </IconButton>
        <Typography
          variant={isMobile ? "h6" : "h4"}
          sx={{ ml: 2, flexGrow: 1 }}
        >
          {task.title}
        </Typography>
      </Box>

      {/* Content */}
      <Box
        sx={{
          flex: 1,
          px: 2,
          pb: isMobile ? 12 : 4,
          width: "100%",
          maxWidth: 900,
          mx: "auto",
        }}
      >
        <Paper
          elevation={isMobile ? 0 : 2}
          sx={{
            p: isMobile ? 0 : 3,
            bgcolor: isMobile ? "transparent" : "background.paper",
          }}
        >
          <Stack direction="column" spacing={3}>
            {/* Status */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Status
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", mt: 1 }}>
                <Checkbox
                  checked={task.completed}
                  onChange={() => toggleComplete(id)}
                  color="success"
                  size="large"
                />
                <Typography
                  sx={{
                    ml: 1,
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                >
                  {task.completed ? "Completed" : "Active"}
                </Typography>
              </Box>
            </Box>

            <Divider />

            {/* Due Date */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Due Date
              </Typography>
              <Typography
                sx={{ mt: 1, cursor: "pointer" }}
                onClick={() => navigate(`/tasks/${id}`)}
              >
                {due}
              </Typography>
            </Box>

            <Divider />

            {/* Priority */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Priority
              </Typography>
              <Chip
                label={task.priority?.toUpperCase() || "None"}
                color={priorityColors[task.priority] || "default"}
                sx={{ mt: 1 }}
              />
            </Box>

            <Divider />

            {/* Tags */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary">
                Tags
              </Typography>
              <Box sx={{ mt: 1 }}>
                {task.tags?.length > 0 ? (
                  task.tags.map((tag) => (
                    <Chip key={tag} label={tag} sx={{ mr: 1, mb: 1 }} />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No tags
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Description */}
            {task.description && (
              <>
                <Divider />
                <Box>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    gutterBottom
                  >
                    Description
                  </Typography>
                  <Typography whiteSpace="pre-wrap">
                    {task.description}
                  </Typography>
                </Box>
              </>
            )}
          </Stack>
        </Paper>
      </Box>

      {/* Mobile Bottom Actions */}
      {isMobile && (
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
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`/tasks/${id}/edit`)}
          >
            Edit
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => setDeleteConfirmOpen(true)}
          >
            Delete
          </Button>
        </Box>
      )}

      {/* Desktop Floating Actions */}
      {!isMobile && (
        <Box
          sx={{
            position: "fixed",
            right: 32,
            bottom: 32,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            startIcon={<Edit />}
            onClick={() => navigate(`/tasks/${id}/edit`)}
          >
            Edit Task
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<Delete />}
            onClick={() => setDeleteConfirmOpen(true)}
          >
            Delete Task
          </Button>
        </Box>
      )}

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
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button color="error" onClick={handleDelete}>
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default TaskDetails;