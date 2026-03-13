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
  Stack,
  MenuItem,
  Menu,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import { useDexieFileSystem } from "../hooks/useDexieFileSystem";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

export default function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();

  const { directories, fetchDirectories, addDirectory } = useDexieFileSystem();

  const [newProjectOpen, setNewProjectOpen] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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
    handleMenuClose();
  };

  return (
    <Container maxWidth="md" disableGutters sx={{ pb: { xs: 10, sm: 6 } }}>
      {/* Header */}
      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent:"space-between", 
          gap: 1.5,
          py: { xs: 2, sm: 3 },
          position: "sticky",
          top: 0,
          mb: 0,
          bgcolor: "background.default",
          zIndex: 10,
          width:"100%",
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <Typography variant="h5" fontWeight={700} component="h1">
          Projects
        </Typography>

        <IconButton
          id="folder-options-button"
          aria-controls={open ? "folder-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleMenuClick}
          sx={{
            color: "text.secondary",
            "&:hover": {
              color: "primary.main",
              bgcolor: "action.hover",
            },
          }}
        >
          <MoreHorizIcon />
        </IconButton>

        <Menu
          id="folder-menu"
          anchorEl={anchorEl}
          open={open}
          onClose={handleMenuClose}
          MenuListProps={{
            "aria-labelledby": "folder-options-button",
          }}
          transformOrigin={{ horizontal: "right", vertical: "top" }}
          anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
        >
          <MenuItem onClick={handleCreateProject}>
            <ListItemIcon>
              <FolderRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Add Project</ListItemText>
          </MenuItem>

        </Menu>
      </Box>

      {/* Content */}
      <Box sx={{}}>
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
          <Stack elevation={0} sx={{ pb: 4 }}>
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
                    color: "primary.main",
                    bgcolor: "action.hover",
                  },
                  borderTop: "none",
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
    </Container>
  );
}
