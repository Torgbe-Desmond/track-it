import { useState } from 'react';
import {
  Box,
  Typography,
  Fab,
  IconButton,
  Checkbox,
  Card,
  Stack,
  Container,
} from '@mui/material';
import ArrowBackRoundedIcon from '@mui/icons-material/ArrowBackRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useParams, useNavigate } from 'react-router-dom';
import { useTasks, toggleTask, deleteTask } from '../hooks/useTasks';
import AddTask from '../components/AddTask';

export default function TaskBoard() {
  const { categoryId } = useParams();
  const navigate = useNavigate();
  const tasks = useTasks(categoryId);

  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <Container maxWidth="md" disableGutters sx={{ pb: { xs: 10, sm: 6 } }}>
      {/* Header with back button */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
          position: 'sticky',
          top: 0,
          bgcolor: 'background.default',
          zIndex: 10,
        }}
      >
        <IconButton
          edge="start"
          onClick={() => navigate(-1)}
          sx={{ color: 'text.secondary' }}
        >
          <ArrowBackRoundedIcon />
        </IconButton>

        <Typography
          variant="h6"
          component="h1"
          fontWeight={600}
          sx={{ flex: 1 }}
        >
          Tasks
        </Typography>
      </Box>

      <Stack spacing={2} sx={{ px: { xs: 2, sm: 3 }, pb: 4 }}>
        {tasks?.length === 0 ? (
          <Box
            sx={{
              py: 10,
              textAlign: 'center',
              color: 'text.secondary',
            }}
          >
            <Typography variant="body1">No tasks yet</Typography>
          </Box>
        ) : (
          tasks?.map((task) => (
            <Card
              key={task.id}
              variant="outlined"
              sx={{
                borderRadius: 2,
                borderColor: 'divider',
                transition: 'all 0.15s',
                '&:hover': {
                  borderColor: 'text.disabled',
                  bgcolor: 'action.hover',
                },
              }}
            >
              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  px: 2.5,
                  py: 1.5,
                  gap: 2,
                }}
              >
                {/* Clickable area: checkbox + title */}
                <Box
                  sx={{
                    display: 'flex',
                    alignItems: 'center',
                    flex: 1,
                    cursor: 'pointer',
                    minWidth: 0,
                  }}
                  onClick={() => navigate(`/tasks/${categoryId}/edit/${task.id}`)}
                >
                  <Checkbox
                    checked={task.completed}
                    onChange={() => toggleTask(task.id, task.completed)}
                    size="medium"
                    sx={{
                      color: 'text.secondary',
                      '&.Mui-checked': { color: 'primary.main' },
                      p: 1,
                    }}
                  />

                  <Box sx={{ ml: 1, flex: 1, minWidth: 0 }}>
                    <Typography
                      variant="body1"
                      noWrap
                      sx={{
                        textDecoration: task.completed ? 'line-through' : 'none',
                        color: task.completed ? 'text.disabled' : 'text.primary',
                        fontWeight: task.completed ? 400 : 500,
                      }}
                    >
                      {task.title}
                    </Typography>

                    {task.priority && task.priority !== 'medium' && (
                      <Typography
                        variant="caption"
                        color="text.secondary"
                        sx={{
                          display: 'inline-flex',
                          alignItems: 'center',
                          gap: 1,
                          mt: 0.25,
                        }}
                      >
                        <Box
                          sx={{
                            width: 8,
                            height: 8,
                            borderRadius: '50%',
                            bgcolor:
                              task.priority === 'high'
                                ? 'error.main'
                                : 'text.secondary',
                            opacity: task.priority === 'low' ? 0.6 : 1,
                          }}
                        />
                        {task.priority}
                      </Typography>
                    )}
                  </Box>
                </Box>

                {/* Delete icon */}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    if (window.confirm('Delete this task?')) {
                      deleteTask(task.id);
                    }
                  }}
                  sx={{
                    color: 'text.secondary',
                    '&:hover': {
                      color: 'error.main',
                      bgcolor: 'action.hover',
                    },
                  }}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          ))
        )}
      </Stack>

      {/* Floating action button */}
      <Fab
        color="primary"
        size="medium"
        onClick={() => setIsModalOpen(true)}
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          boxShadow: 4,
        }}
      >
        <AddRoundedIcon />
      </Fab>

      <AddTask
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categoryId={categoryId}
      />
    </Container>
  );
}