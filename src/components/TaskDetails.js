import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCategoriesAndTasks } from "../hooks/useCategoriesAndTasks"; // updated hook
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
import {
  ArrowBack as ArrowBackIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  CalendarToday as CalendarIcon,
} from "@mui/icons-material";
import dayjs from "dayjs";

const priorityColors = {
  low: "success",
  medium: "warning",
  high: "error",
};

const TaskDetails = () => {
  const { categoryId, id: taskId } = useParams();
  const { categories, toggleComplete, deleteTask } = useCategoriesAndTasks();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const category = categories.find((c) => c.id === categoryId);
  const task = category?.tasks?.find((t) => t.id === taskId);

  if (!task) {
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
        <Alert severity="info" variant="outlined">
          Task not found
        </Alert>
      </Box>
    );
  }

  const isOverdue =
    task.dueDate && !task.completed && dayjs(task.dueDate).isBefore(dayjs());

  const dueDateText = task.dueDate
    ? dayjs(task.dueDate).format("MMM D, YYYY")
    : "No due date";

  const handleDelete = () => {
    deleteTask(categoryId, taskId);
    setDeleteConfirmOpen(false);
    navigate(`/categories/${categoryId}`);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
        display: "flex",
        flexDirection: "column",
        pb: 6,
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
            onClick={() => navigate(`/categories/${categoryId}`)}
            edge="start"
            sx={{ mr: 1.5 }}
          >
            <ArrowBackIcon />
          </IconButton>

          <Typography
            variant={isMobile ? "h6" : "h5"}
            fontWeight={600}
            sx={{
              flexGrow: 1,
              textDecoration: task.completed ? "line-through" : "none",
              color: task.completed ? "text.disabled" : "text.primary",
            }}
          >
            {task.title}
          </Typography>
        </Box>
      </Box>

      {/* Main Content */}
      <Box
        sx={{
          flex: 1,
          px: { xs: 2, sm: 4 },
          py: { xs: 3, sm: 4 },
          maxWidth: 900,
          mx: "auto",
          width: "100%",
        }}
      >
        <Paper
          elevation={isMobile ? 0 : 1}
          sx={{
            p: { xs: 3, sm: 4 },
            borderRadius: 3,
            bgcolor: "background.paper",
          }}
        >
          <Stack spacing={4}>
            {/* Status */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                STATUS
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1.5 }}>
                <Checkbox
                  checked={task.completed}
                  onChange={() => toggleComplete(categoryId, taskId)}
                  color="success"
                  size="medium"
                  sx={{ p: 0.5 }}
                />
                <Typography
                  variant="body1"
                  fontWeight={500}
                  sx={{
                    color: task.completed ? "success.main" : "text.primary",
                  }}
                >
                  {task.completed ? "Completed" : "Active"}
                </Typography>
              </Box>
            </Box>

            <Divider />

            {/* Due Date */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                DUE DATE
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <CalendarIcon
                  fontSize="small"
                  sx={{
                    color: isOverdue ? "error.main" : "text.secondary",
                  }}
                />
                <Typography
                  variant="body1"
                  sx={{
                    color: isOverdue ? "error.main" : "text.primary",
                    fontWeight: isOverdue ? 500 : 400,
                  }}
                >
                  {dueDateText}
                  {isOverdue && " (Overdue)"}
                </Typography>
              </Box>
            </Box>

            <Divider />

            {/* Priority */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                PRIORITY
              </Typography>
              <Chip
                label={(task.priority || "None").toUpperCase()}
                color={priorityColors[task.priority] || "default"}
                variant="outlined"
                size="medium"
                sx={{ mt: 0.5 }}
              />
            </Box>

            <Divider />

            {/* Tags */}
            <Box>
              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                TAGS
              </Typography>
              <Box sx={{ mt: 1, display: "flex", flexWrap: "wrap", gap: 1 }}>
                {task.tags?.length > 0 ? (
                  task.tags.map((tag) => (
                    <Chip
                      key={tag}
                      label={tag}
                      size="small"
                      variant="outlined"
                    />
                  ))
                ) : (
                  <Typography variant="body2" color="text.secondary">
                    No tags added
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
                    DESCRIPTION
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ whiteSpace: "pre-wrap", lineHeight: 1.6 }}
                  >
                    {task.description}
                  </Typography>
                </Box>
              </>
            )}
          </Stack>
        </Paper>
      </Box>

      {/* Actions - Mobile Bottom Bar */}
      {isMobile && (
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
            variant="outlined"
            startIcon={<EditIcon />}
            onClick={() => navigate(`/categories/${categoryId}/tasks/${taskId}/edit`)}
          >
            Edit
          </Button>
          <Button
            fullWidth
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteConfirmOpen(true)}
          >
            Delete
          </Button>
        </Box>
      )}

      {/* Actions - Desktop Floating */}
      {!isMobile && (
        <Box
          sx={{
            position: "fixed",
            bottom: 32,
            right: 32,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Button
            variant="contained"
            startIcon={<EditIcon />}
            disableElevation
            onClick={() => navigate(`/categories/${categoryId}/tasks/${taskId}/edit`)}
            sx={{ minWidth: 140 }}
          >
            Edit Task
          </Button>
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteIcon />}
            onClick={() => setDeleteConfirmOpen(true)}
            sx={{ minWidth: 140 }}
          >
            Delete Task
          </Button>
        </Box>
      )}

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

export default TaskDetails;