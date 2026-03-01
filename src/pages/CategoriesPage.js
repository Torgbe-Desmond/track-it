// src/pages/CategoriesPage.jsx
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box,
  Typography,
  Button,
  List,
  ListItem,
  ListItemText,
  ListItemSecondaryAction,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Paper,
  Fab,
  Tooltip,
  Alert,
} from '@mui/material';
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
} from '@mui/icons-material';
import { useCategoriesAndTasks } from '../hooks/useCategoriesAndTasks';

export default function CategoriesPage() {
  const navigate = useNavigate();
  const {
    categories,
    addCategory,
    updateCategory,
    deleteCategory,
  } = useCategoriesAndTasks();

  const [openAdd, setOpenAdd] = useState(false);
  const [openEdit, setOpenEdit] = useState(false);
  const [openDeleteConfirm, setOpenDeleteConfirm] = useState(false);
  const [currentCategory, setCurrentCategory] = useState(null);
  const [categoryName, setCategoryName] = useState('');
  const [error, setError] = useState('');

  // ─── Add Category ─────────────────────────────────────────────
  const handleOpenAdd = () => {
    setCategoryName('');
    setError('');
    setOpenAdd(true);
  };

  const handleAddSubmit = () => {
    if (!categoryName.trim()) {
      setError('Category name is required');
      return;
    }

    addCategory(categoryName.trim());
    setOpenAdd(false);
    setCategoryName('');
    setError('');
  };

  // ─── Edit Category ────────────────────────────────────────────
  const handleOpenEdit = (cat) => {
    setCurrentCategory(cat);
    setCategoryName(cat.name);
    setError('');
    setOpenEdit(true);
  };

  const handleEditSubmit = () => {
    if (!categoryName.trim()) {
      setError('Category name is required');
      return;
    }

    updateCategory(currentCategory.id, categoryName.trim());
    setOpenEdit(false);
    setCurrentCategory(null);
    setCategoryName('');
    setError('');
  };

  // ─── Delete Category ──────────────────────────────────────────
  const handleOpenDelete = (cat) => {
    if (cat.name === 'Uncategorized') {
      // Optional: prevent deletion of default category
      alert('Cannot delete the default "Uncategorized" category.');
      return;
    }
    setCurrentCategory(cat);
    setOpenDeleteConfirm(true);
  };

  const handleDeleteConfirm = () => {
    deleteCategory(currentCategory.id);
    setOpenDeleteConfirm(false);
    setCurrentCategory(null);
  };

  // ─── Close handlers ───────────────────────────────────────────
  const handleCloseAdd = () => {
    setOpenAdd(false);
    setCategoryName('');
    setError('');
  };

  const handleCloseEdit = () => {
    setOpenEdit(false);
    setCurrentCategory(null);
    setCategoryName('');
    setError('');
  };

  const handleCloseDelete = () => {
    setOpenDeleteConfirm(false);
    setCurrentCategory(null);
  };

  return (
    <Box sx={{ p: { xs: 2, sm: 3, md: 4 }, maxWidth: 900, mx: 'auto' }}>
      <Typography variant="h4" component="h1" gutterBottom fontWeight={600}>
        Categories
      </Typography>

      <Typography variant="body1" color="text.secondary" paragraph sx={{ mb: 4 }}>
        Organize your tasks into categories. Click a category to view its tasks.
      </Typography>

      {categories.length === 0 ? (
        <Alert severity="info" sx={{ mb: 4 }}>
          You don't have any categories yet. Create one to start organizing your tasks!
        </Alert>
      ) : null}

      <Paper elevation={2} sx={{ borderRadius: 3, overflow: 'hidden' }}>
        <List disablePadding>
          {categories.map((category) => (
            <React.Fragment key={category.id}>
              <ListItem
                button
                onClick={() => navigate(`/categories/${category.id}`)}
                sx={{
                  py: 2.5,
                  px: 3,
                  '&:hover': { bgcolor: 'action.hover' },
                }}
              >
                <ListItemText
                  primary={
                    <Typography variant="h6" component="div">
                      {category.name}
                    </Typography>
                  }
                  secondary={`${category.tasks?.length || 0} task${
                    category.tasks?.length !== 1 ? 's' : ''
                  }`}
                />

                <ListItemSecondaryAction>
                  <Tooltip title="Edit name">
                    <IconButton
                      edge="end"
                      aria-label="edit"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenEdit(category);
                      }}
                      sx={{ mr: 1 }}
                    >
                      <EditIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Delete category">
                    <IconButton
                      edge="end"
                      aria-label="delete"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleOpenDelete(category);
                      }}
                      color="error"
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Tooltip>
                </ListItemSecondaryAction>
              </ListItem>
              <Divider component="li" />
            </React.Fragment>
          ))}
        </List>
      </Paper>

      {/* Floating Action Button */}
      <Tooltip title="Create new category" placement="left">
        <Fab
          color="primary"
          aria-label="add category"
          onClick={handleOpenAdd}
          sx={{
            position: 'fixed',
            bottom: 32,
            right: 32,
            boxShadow: 4,
          }}
        >
          <AddIcon />
        </Fab>
      </Tooltip>

      {/* ─── Add Category Dialog ──────────────────────────────────── */}
      <Dialog open={openAdd} onClose={handleCloseAdd} maxWidth="xs" fullWidth>
        <DialogTitle>New Category</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="Category name"
            fullWidth
            variant="outlined"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            inputProps={{ maxLength: 50 }}
            error={!!error && !categoryName.trim()}
            helperText="e.g. Work, Personal, Groceries, Study"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseAdd}>Cancel</Button>
          <Button
            onClick={handleAddSubmit}
            variant="contained"
            disabled={!categoryName.trim()}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Edit Category Dialog ─────────────────────────────────── */}
      <Dialog open={openEdit} onClose={handleCloseEdit} maxWidth="xs" fullWidth>
        <DialogTitle>Edit Category</DialogTitle>
        <DialogContent>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <TextField
            autoFocus
            margin="dense"
            label="Category name"
            fullWidth
            variant="outlined"
            value={categoryName}
            onChange={(e) => setCategoryName(e.target.value)}
            inputProps={{ maxLength: 50 }}
            error={!!error && !categoryName.trim()}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseEdit}>Cancel</Button>
          <Button
            onClick={handleEditSubmit}
            variant="contained"
            disabled={!categoryName.trim()}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* ─── Delete Confirmation ──────────────────────────────────── */}
      <Dialog
        open={openDeleteConfirm}
        onClose={handleCloseDelete}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete Category?</DialogTitle>
        <DialogContent>
          <Typography variant="body1">
            Are you sure you want to delete <strong>"{currentCategory?.name}"</strong>?
          </Typography>
          <Typography variant="body2" color="error" sx={{ mt: 2 }}>
            All tasks in this category will be permanently deleted. This action cannot be undone.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDelete}>Cancel</Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            variant="contained"
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}