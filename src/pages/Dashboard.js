import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  IconButton,
  TextField,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Fab,
  useTheme,
  Card,
  Stack
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";

import { useDexieFileSystem } from "../hooks/useDexieFileSystem";

export default function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();

  const {
    directories,
    fetchDirectories,
    addDirectory,
    updateDirectory,
    deleteDirectory,
  } = useDexieFileSystem();

  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const [renameOpen, setRenameOpen] = useState(false);
  const [activeProject, setActiveProject] = useState(null);
  const [renameValue, setRenameValue] = useState("");

  useEffect(() => {
    fetchDirectories(null); // root → parentDirectoryId = null
  }, [fetchDirectories]);

  // Create new project (root folder)
  const handleCreateProject = async () => {
    const name = newProjectName.trim();
    if (!name) return;

    const id = `proj_${Date.now()}`;
    await addDirectory({
      id,
      name,
      parentDirectoryId: null,
    });

    setNewProjectName("");
    setNewProjectOpen(false);
    fetchDirectories(null);
  };

  // Rename project
  const handleStartRename = (project) => {
    setActiveProject(project);
    setRenameValue(project.name);
    setRenameOpen(true);
  };

  const handleSaveRename = async () => {
    const name = renameValue.trim();
    if (!name || !activeProject) return;

    await updateDirectory(activeProject.id, name);

    setRenameOpen(false);
    setActiveProject(null);
    setRenameValue("");
    fetchDirectories(null);
  };

  // Delete project
  const handleDeleteProject = async (id) => {
    if (
      !window.confirm(
        "Delete this project and all its contents? This cannot be undone.",
      )
    ) {
      return;
    }

    await deleteDirectory(id);
    fetchDirectories(null);
  };

  return (
    <Container maxWidth="md" disableGutters sx={{ pb: { xs: 10, sm: 6, } }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          px: { xs: 2, sm: 3 },
          py: { xs: 2, sm: 3 },
          position: "sticky",
          top: 0,
          mb:0,
          bgcolor: "background.default",
          zIndex: 10,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h5" fontWeight={700} component="h1">
          Projects
        </Typography>
      </Box>

      {/* Content */}
      <Box sx={{  }}>
        {directories.length === 0 ? (
          <Box
            sx={{
              py: 12,
              textAlign: "center",
              color: "text.secondary",
            }}
          >
            <FolderRoundedIcon sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
            <Typography variant="body1" gutterBottom>
              You don't have any projects yet
            </Typography>
            <Typography variant="body2">
              Create your first project to get started
            </Typography>
          </Box>
        ) : (
              <Stack elevation={0} sx={{ pb: 4, }}>
                 {directories.map((project) => (
              <Card
                key={project.id}
                elevation={0}
                variant="outlined"
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  px: { xs: 2, sm: 2.5 },
                  py: 1.8,
                  borderRadius: 0,
                  cursor: "pointer",
                  transition: "all 0.12s",
                  "&:hover": {
                    bgcolor: "action.hover",
                    borderColor: "primary.light",
                  },
                  borderTop:"none",
                  borderLeft: "none",
                  borderRight: "none",
                
                }}
                onClick={() => navigate(`/folder/${project.id}`)}
              >
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                    minWidth: 0,
                  }}
                >
                  <FolderRoundedIcon
                    sx={{ fontSize: 34, color: "primary.main", flexShrink: 0 }}
                  />
                  <Typography
                    variant="body1"
                    fontWeight={500}
                    noWrap
                    sx={{ flex: 1 }}
                  >
                    {project.name}
                  </Typography>
                </Box>

                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <IconButton
                    size="small"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleStartRename(project);
                    }}
                    sx={{ color: "text.secondary" }}
                  >
                    <EditRoundedIcon fontSize="small" />
                  </IconButton>

                  <IconButton
                    size="small"
                    color="error"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleDeleteProject(project.id);
                    }}
                  >
                    <DeleteOutlineRoundedIcon fontSize="small" />
                  </IconButton>
                </Box>
              </Card>
            ))}
          </Stack>
        )}
      </Box>

      {/* FAB */}
      <Fab
        color="primary"
        aria-label="add project"
        onClick={() => setNewProjectOpen(true)}
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          boxShadow: 4,
        }}
      >
        <AddRoundedIcon />
      </Fab>

      {/* New Project Dialog */}
      <Dialog
        open={newProjectOpen}
        onClose={() => setNewProjectOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>New Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Project name"
            value={newProjectName}
            onChange={(e) => setNewProjectName(e.target.value)}
            margin="dense"
            variant="outlined"
            helperText="e.g. Mobile App Redesign, Personal Blog, etc."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewProjectOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!newProjectName.trim()}
            onClick={handleCreateProject}
          >
            Create
          </Button>
        </DialogActions>
      </Dialog>

      {/* Rename Dialog */}
      <Dialog
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Rename Project</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="New project name"
            value={renameValue}
            onChange={(e) => setRenameValue(e.target.value)}
            margin="dense"
            variant="outlined"
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={!renameValue.trim()}
            onClick={handleSaveRename}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
