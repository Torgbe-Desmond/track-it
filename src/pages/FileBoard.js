import { useState, useEffect } from "react";
import {
  Container,
  Box,
  Typography,
  Fab,
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
} from "@mui/material";
import { useParams, useNavigate } from "react-router-dom";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import InsertDriveFileRoundedIcon from "@mui/icons-material/InsertDriveFileRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import { useDexieFileSystem } from "../hooks/useDexieFileSystem";
import AddFile from "../components/AddFile";
import { db } from "../db/_db";

export default function FileBoard() {
  const { dirId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const { files, fetchFiles, updateFile } = useDexieFileSystem();
  const [isModalOpen, setIsModalOpen] = useState(false);

  // State for renaming
  const [renameOpen, setRenameOpen] = useState(false);
  const [activeFile, setActiveFile] = useState(null);
  const [newName, setNewName] = useState("");

  useEffect(() => {
    fetchFiles(dirId);
  }, [dirId,fetchFiles]);

  const handleRenameOpen = (file) => {
    setActiveFile(file);
    setNewName(file.name);
    setRenameOpen(true);
  };

  const handleRenameSave = async () => {
    if (activeFile && newName.trim()) {
      // This will now pass { name: newName } to the updated hook
      await updateFile(activeFile.id, { name: newName.trim() });
      // fetchFiles is called inside updateFile, so this is safe!
    }
    setRenameOpen(false);
    setActiveFile(null);
    setNewName("");
  };

  const handleRenameCancel = () => {
    setRenameOpen(false);
    setActiveFile(null);
    setNewName("");
  };

  return (
    <Container maxWidth="md" disableGutters sx={{ pb: { xs: 10, sm: 6 } }}>
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
          bgcolor: "background.default",
          zIndex: 10,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackRoundedIcon />
        </IconButton>
        <Typography variant="h6" fontWeight={600} flex={1}>
          Files
        </Typography>
      </Box>

      {/* File List */}
      <Stack spacing={2} sx={{ px: { xs: 2, sm: 3 }, pb: 4, pt: 3 }}>
        {files?.length === 0 ? (
          <Box sx={{ py: 10, textAlign: "center", color: "text.secondary" }}>
            <Typography variant="body1">No files yet</Typography>
          </Box>
        ) : (
          files.map((file) => (
            <Card
              key={file.id}
              variant="outlined"
              sx={{
                borderRadius: 2,
                borderColor: "divider",
                transition: "all 0.15s",
                "&:hover": {
                  borderColor: "text.disabled",
                  bgcolor: "action.hover",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  px: 2.5,
                  py: 1.5,
                  gap: 2,
                  cursor: "pointer",
                }}
                onClick={() => navigate(`/file/${file.id}`)}
              >
                {/* File Icon */}
                <InsertDriveFileRoundedIcon
                  sx={{ color: "primary.main", fontSize: 32 }}
                />

                {/* File Name */}
                <Typography
                  variant="body1"
                  noWrap
                  sx={{ flex: 1, fontWeight: 500 }}
                >
                  {file.name}
                </Typography>

                {/* Edit Name */}
                <IconButton
                  size="small"
                  onClick={(e) => {
                    e.stopPropagation();
                    handleRenameOpen(file);
                  }}
                  sx={{
                    color: "text.secondary",
                    "&:hover": {
                      color: "primary.main",
                      bgcolor: "action.hover",
                    },
                  }}
                >
                  <EditRoundedIcon fontSize="small" />
                </IconButton>

                {/* Delete Button */}
                <IconButton
                  size="small"
                  onClick={async (e) => {
                    e.stopPropagation();
                    if (window.confirm("Delete this file?")) {
                      await db.files.delete(file.id);
                      fetchFiles(dirId);
                    }
                  }}
                  sx={{
                    color: "text.secondary",
                    "&:hover": { color: "error.main", bgcolor: "action.hover" },
                  }}
                >
                  <DeleteOutlineRoundedIcon fontSize="small" />
                </IconButton>
              </Box>
            </Card>
          ))
        )}
      </Stack>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        size="medium"
        onClick={() => setIsModalOpen(true)}
        sx={{
          position: "fixed",
          bottom: { xs: 16, sm: 24 },
          right: { xs: 16, sm: 24 },
          boxShadow: 4,
        }}
      >
        <AddRoundedIcon />
      </Fab>

      {/* Add File Modal */}
      <AddFile
        open={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        directoryId={dirId}
        onFileAdded={() => {
          fetchFiles(dirId);
          setIsModalOpen(false);
        }}
      />

      {/* Rename Dialog */}
      <Dialog
        open={renameOpen}
        onClose={handleRenameCancel}
        fullWidth
        maxWidth="xs"
      >
        <DialogTitle>Rename File</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="File Name"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
            sx={{ mt: 1 }}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleRenameCancel}>Cancel</Button>
          <Button variant="contained" onClick={handleRenameSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
