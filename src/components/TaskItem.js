import React from 'react';
import {
  ListItem,
  ListItemText,
  Checkbox,
  IconButton,
  Box,
  ListItemIcon,
} from '@mui/material';
import ArrowForwardRoundedIcon from '@mui/icons-material/ArrowForwardRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import { useNavigate } from 'react-router-dom';
import { toggleTask, deleteTask } from '../hooks/useTasks';

export default function TaskItem({ task, categoryId }) {
  const navigate = useNavigate();

  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm(`Delete "${task.title}"?`)) {
      deleteTask(task.id);
    }
  };

  const handleToggle = (e) => {
    e.stopPropagation();
    toggleTask(task.id, task.completed);
  };

  const handleEdit = () => {
    navigate(`/tasks/${categoryId}/edit/${task.id}`);
  };

  return (
    <ListItem
      disablePadding
      sx={{
        px: { xs: 1.5, sm: 2 },
        py: 1,
        borderRadius: 1.5,
        transition: 'background-color 0.12s',
        '&:hover': {
          bgcolor: 'action.hover',
        },
        '&:active': {
          bgcolor: 'action.selected',
        },
        cursor: 'pointer',
      }}
      onClick={handleEdit}
    >
      {/* Back / Navigate icon on the left */}
      <ListItemIcon sx={{ minWidth: 40, color: 'text.secondary' }}>
        <ArrowForwardRoundedIcon fontSize="small" />
      </ListItemIcon>

      <Checkbox
        edge="start"
        checked={task.completed}
        onChange={handleToggle}
        sx={{ ml: -0.5 }}
      />

      <ListItemText
        primary={task.title}
        primaryTypographyProps={{
          variant: 'body1',
          fontWeight: task.completed ? 400 : 500,
          textDecoration: task.completed ? 'line-through' : 'none',
          color: task.completed ? 'text.secondary' : 'text.primary',
        }}
        sx={{ ml: 1, my: 0.5 }}
      />

      <Box sx={{ ml: 'auto', mr: 0.5 }}>
        <IconButton
          size="small"
          onClick={handleDelete}
          sx={{
            color: 'text.secondary',
            '&:hover': { color: 'error.main', bgcolor: 'action.hover' },
          }}
        >
          <DeleteOutlineRoundedIcon fontSize="small" />
        </IconButton>
      </Box>
    </ListItem>
  );
}