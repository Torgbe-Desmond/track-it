import { useState } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  IconButton,
  Fab,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Stack,
} from '@mui/material';
import EditRoundedIcon from '@mui/icons-material/EditRounded';
import DeleteOutlineRoundedIcon from '@mui/icons-material/DeleteOutlineRounded';
import AddRoundedIcon from '@mui/icons-material/AddRounded';
import { useNavigate } from 'react-router-dom';
import { useCategories, deleteCategory, addCategory, updateCategory } from '../hooks/useTasks';

export default function Dashboard() {
  const navigate = useNavigate();
  const categories = useCategories();

  const [editOpen, setEditOpen] = useState(false);
  const [newOpen, setNewOpen] = useState(false);
  const [name, setName] = useState('');
  const [editingCat, setEditingCat] = useState(null);

  const handleAddOpen = () => {
    setName('');
    setNewOpen(true);
  };

  const handleAdd = () => {
    if (name.trim()) {
      addCategory(name.trim());
    }
    setNewOpen(false);
  };

  const handleEditOpen = (cat) => {
    setEditingCat(cat);
    setName(cat.name);
    setEditOpen(true);
  };

  const handleEditSave = () => {
    if (name.trim() && editingCat) {
      updateCategory(editingCat.id, name.trim());
    }
    setEditOpen(false);
    setEditingCat(null);
  };

  const handleDelete = (id) => {
    if (window.confirm('Delete this project and all its tasks?')) {
      deleteCategory(id);
    }
  };

  return (
    <Container maxWidth="md" disableGutters  sx={{ pb: { xs: 10, sm: 6 } }}>
      {/* Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          gap: 1.5,
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
          bgcolor: 'background.default',
          position: 'sticky',
          top: 0,
          zIndex: 10,
        }}
      >

        <Typography variant="h6" component="h1" fontWeight={600} sx={{ flex: 1 }}>
          Projects
        </Typography>
      </Box>

      <Box sx={{ px: { xs: 2, sm: 3 }, py: 3 }}>
        <Box
          display="grid"
          gridTemplateColumns={{ xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }}
          gap={2.5}
        >
          {categories?.map((cat) => (
            <Card
              key={cat.id}
              variant="outlined"
              sx={{
                borderRadius: 2,
                borderColor: 'divider',
                transition: 'all 0.15s',
                cursor: 'pointer',
                '&:hover': {
                  borderColor: 'primary.main',
                  bgcolor: 'action.hover',
                },
              }}
              onClick={() => navigate(`/tasks/${cat.id}`)}
            >
              <CardContent sx={{ px: 2.5, py: 2, display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant="h6" fontWeight={600} noWrap>
                  {cat.name}
                </Typography>

                <Stack direction="row" spacing={1} sx={{ mt: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleEditOpen(cat);
                    }}
                    sx={{
                      color: 'text.secondary',
                      '&:hover': { color: 'primary.main' },
                    }}
                  >
                    <EditRoundedIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDelete(cat.id);
                    }}
                    sx={{
                      color: 'text.secondary',
                      '&:hover': { color: 'error.main' },
                    }}
                  >
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          ))}
        </Box>

        {(!categories || categories.length === 0) && (
          <Box sx={{ textAlign: 'center', py: 10, color: 'text.secondary' }}>
            <Typography>No projects yet</Typography>
          </Box>
        )}
      </Box>

      {/* FAB */}
      <Fab
        color="primary"
        size="medium"
        onClick={handleAddOpen}
        sx={{
          position: 'fixed',
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          boxShadow: 3,
        }}
      >
        <AddRoundedIcon />
      </Fab>

      {/* New Project Dialog */}
      <Dialog open={newOpen} onClose={() => setNewOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>New Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleAdd} disabled={!name.trim()}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Edit Project Dialog */}
      <Dialog open={editOpen} onClose={() => setEditOpen(false)} maxWidth="xs" fullWidth>
        <DialogTitle>Rename Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Project name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            variant="outlined"
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleEditSave} disabled={!name.trim()}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}