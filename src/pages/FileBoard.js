import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Card,
  Stack,
  IconButton,
  TextField,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  useTheme,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
} from "@mui/material";

import { useParams, useNavigate } from "react-router-dom";

import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
import FolderDeleteRoundedIcon from "@mui/icons-material/FolderDeleteRounded";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import { useDexieFileSystem } from "../hooks/useDexieFileSystem";
import AddFile from "../components/AddFile";

export default function FileBoard() {
  const { dirId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();

  const { files, fetchFiles, getDirectory, updateDirectory, deleteDirectory } =
    useDexieFileSystem();

  const [isModalOpen, setIsModalOpen] = useState(false);

  const [currentFolder, setCurrentFolder] = useState(null);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [renameOpen, setRenameOpen] = useState(false);
  const [newFolderName, setNewFolderName] = useState("");

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  /* ---------------- Load Files + Folder ---------------- */

  useEffect(() => {
    if (!dirId) return;

    let active = true;

    async function loadData() {
      try {
        await fetchFiles(dirId);

        const folder = await getDirectory(dirId);

        if (active) {
          setCurrentFolder(folder);
          setNewFolderName(folder?.name || "");
        }
      } catch (error) {
        console.error("Failed to load folder:", error);
      }
    }

    loadData();

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dirId]);

  /* ---------------- Folder Menu ---------------- */

  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

  /* ---------------- Rename Folder ---------------- */

  const handleRenameFolderOpen = () => {
    handleMenuClose();
    setRenameOpen(true);
  };

  const handleRenameFolderSave = async () => {
    if (!dirId || !newFolderName.trim()) return;

    try {
      await updateDirectory(dirId, newFolderName.trim());

      const folder = await getDirectory(dirId);

      setCurrentFolder(folder);
      setNewFolderName(folder?.name || "");
      setRenameOpen(false);
    } catch (err) {
      console.error("Rename failed:", err);
    }
  };

  /* ---------------- Delete Folder ---------------- */

  const handleDeleteFolderOpen = () => {
    handleMenuClose();
    setDeleteConfirmOpen(true);
  };

  const handleDeleteFolder = async () => {
    if (!dirId) return;

    try {
      await deleteDirectory(dirId);
      setDeleteConfirmOpen(false);
      navigate(-1);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  /* ---------------- Files ---------------- */

  const handleFileClick = (fileId) => {
    navigate(`/file/${fileId}`);
  };

  const handleAddFile = () => {
    setIsModalOpen(true);
  };

  const handleFileAdded = async () => {
    if (!dirId) return;

    await fetchFiles(dirId);
    setIsModalOpen(false);
  };

  /* ---------------- UI ---------------- */

  return (
    <Container maxWidth="md" disableGutters sx={{ pb: { xs: 10, sm: 6 } }}>
      {/* Header */}

      <Box
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 1.5,
          py: { xs: 2, sm: 3 },
          position: "sticky",
          top: 0,
          bgcolor: "background.default",
          zIndex: 10,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <IconButton onClick={() => navigate(-1)} aria-label="Go back">
          <ArrowBackIosIcon />
        </IconButton>

        <Typography variant="h6" fontWeight={600} flex={1} noWrap>
          {currentFolder?.name || "Files"}
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
          <MenuItem onClick={handleRenameFolderOpen}>
            <ListItemIcon>
              <DriveFileRenameOutlineRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Rename Folder</ListItemText>
          </MenuItem>

          <MenuItem onClick={handleAddFile}>
            <ListItemIcon>
              <InsertDriveFileRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Add File</ListItemText>
          </MenuItem>

          <MenuItem
            onClick={handleDeleteFolderOpen}
            sx={{ color: "error.main" }}
          >
            <ListItemIcon sx={{ color: "error.main" }}>
              <FolderDeleteRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete Folder</ListItemText>
          </MenuItem>
        </Menu>
      </Box>

      {/* File List */}

      <Stack sx={{ pb: 4 }}>
        {!files?.length ? (
          <Box sx={{ py: 10, textAlign: "center", color: "text.secondary" }}>
            <InsertDriveFileRoundedIcon
              sx={{ fontSize: 48, mb: 2, opacity: 0.5 }}
            />

            <Typography variant="body1" gutterBottom>
              No files yet
            </Typography>

            <Typography variant="body2">
              Click the + button to add your first file
            </Typography>
          </Box>
        ) : (
          files.map((file) => (
            <Card
              key={file.id}
              variant="outlined"
              sx={{
                borderRadius: 0,
                borderTop: "none",
                borderLeft: "none",
                borderRight: "none",
              }}
            >
              <Box
                sx={{
                  px: 2.5,
                  gap: 2,
                  display: "flex",
                  alignItems: "center",
                  py: 1.8,
                  cursor: "pointer",
                  "&:hover": {
                    color: "primary.main",
                    bgcolor: "action.hover",
                  },
                }}
                onClick={() => handleFileClick(file.id)}
              >
                <InsertDriveFileRoundedIcon
                  sx={{ color: "primary.main", fontSize: 32 }}
                />

                <Typography noWrap sx={{ flex: 1, fontWeight: 500 }}>
                  {file.name}
                </Typography>
              </Box>
            </Card>
          ))
        )}
      </Stack>

      {/* Add File Dialog */}

      <AddFile
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        directoryId={dirId}
        onFileAdded={handleFileAdded}
      />

      {/* Rename Folder */}

      <Dialog
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Rename Folder</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="Folder Name"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setRenameOpen(false)}>Cancel</Button>

          <Button variant="contained" onClick={handleRenameFolderSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Folder */}

      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Delete Folder</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete "{currentFolder?.name}"? This will
            also delete all files inside this folder. This action cannot be
            undone.
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>

          <Button
            variant="contained"
            color="error"
            onClick={handleDeleteFolder}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
