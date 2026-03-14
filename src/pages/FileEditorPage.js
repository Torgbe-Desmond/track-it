import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  Container,
  Box,
  Typography,
  Button,
  Paper,
  Stack,
  IconButton,
  useTheme,
  useMediaQuery,
  Menu,
  MenuItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
} from "@mui/material";

import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import DriveFileRenameOutlineRoundedIcon from "@mui/icons-material/DriveFileRenameOutlineRounded";
import MoreHorizIcon from "@mui/icons-material/MoreHoriz";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeRaw from "rehype-raw";
import TextareaAutosize from "@mui/material/TextareaAutosize";

import { useDexieFileSystem } from "../hooks/useDexieFileSystem";
import { db } from "../db/_db";

export default function FileEditorPage() {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { getFile, updateFile, fetchFiles } = useDexieFileSystem();

  const [file, setFile] = useState(null);
  const [content, setContent] = useState("");
  const [isEditing, setIsEditing] = useState(false);

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);

  const [renameOpen, setRenameOpen] = useState(false);
  const [newFileName, setNewFileName] = useState("");
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  /* ---------------- Load File ---------------- */
  useEffect(() => {
    if (!fileId) return;

    let mounted = true;

    async function load() {
      const f = await getFile(fileId);
      if (!mounted) return;
      if (!f) {
        alert("File not found");
        navigate(-1);
        return;
      }

      setFile(f);
      setContent(f.content || "");
      setNewFileName(f.name || "");
    }

    load();
    return () => {
      mounted = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId]);

  /* ---------------- Menu ---------------- */
  const handleMenuClick = (event) => {
    event.stopPropagation();
    setAnchorEl(event.currentTarget);
  };
  const handleMenuClose = () => setAnchorEl(null);

  /* ---------------- Rename ---------------- */
  const handleRenameOpen = () => {
    handleMenuClose();
    setRenameOpen(true);
  };
  const handleRenameSave = async () => {
    const name = newFileName.trim();
    if (!name || !fileId) return;
    await updateFile(fileId, { name });
    setFile((prev) => ({ ...prev, name }));
    setRenameOpen(false);
  };

  /* ---------------- Delete ---------------- */
  const handleDeleteOpen = () => {
    handleMenuClose();
    setDeleteConfirmOpen(true);
  };
  const handleDeleteConfirm = async () => {
    if (!fileId) return;
    await db.files.delete(fileId);
    if (file?.directoryId) await fetchFiles(file.directoryId);
    navigate(-1);
  };

  /* ---------------- Save ---------------- */
  const handleSave = async () => {
    if (!fileId) return;
    await updateFile(fileId, { content });
    setFile((prev) => ({ ...prev, content }));
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setContent(file?.content || "");
    setIsEditing(false);
  };

  const isEmpty = !content || content.trim() === "";

  const markdownStyles = {
    width: "100%",
    overflowX: "auto",
    wordWrap: "break-word",
    "& pre": {
      backgroundColor: theme.palette.mode === "dark" ? "#0d1117" : "#f6f8fa",
      padding: 2,
      borderRadius: 2,
      overflowX: "auto",
      whiteSpace: "pre-wrap",
      wordWrap: "break-word",
      "& code": { whiteSpace: "pre-wrap", wordWrap: "break-word" },
    },
  };

  const paperStyles = {
    p: 3,
    minHeight: "70vh",
    border: `1px solid ${theme.palette.divider}`,
    overflowX: "auto",
    overflowY: "auto",
    width: "100%",
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4, overflowX: "hidden" }}>
      {/* Header */}
      <Box sx={{ mb: 3, display: "flex", alignItems: "center", gap: 1 }}>
        <IconButton onClick={() => navigate(-1)}>
          <ArrowBackIosIcon />
        </IconButton>

        <Typography
          variant="h6"
          fontWeight={700}
          sx={{ flex: 1, overflow: "hidden", textOverflow: "ellipsis" }}
          title={file?.name}
        >
          {file?.name}
        </Typography>

        <IconButton onClick={handleMenuClick}>
          <MoreHorizIcon />
        </IconButton>

        <Menu anchorEl={anchorEl} open={open} onClose={handleMenuClose}>
          <MenuItem
            onClick={() => {
              handleMenuClose();
              setIsEditing(true);
            }}
          >
            <ListItemIcon>
              <EditRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Edit Content</ListItemText>
          </MenuItem>

          <MenuItem onClick={handleRenameOpen}>
            <ListItemIcon>
              <DriveFileRenameOutlineRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Rename File</ListItemText>
          </MenuItem>

          <MenuItem onClick={handleDeleteOpen} sx={{ color: "error.main" }}>
            <ListItemIcon sx={{ color: "error.main" }}>
              <DeleteOutlineRoundedIcon fontSize="small" />
            </ListItemIcon>
            <ListItemText>Delete File</ListItemText>
          </MenuItem>
        </Menu>
      </Box>

      {/* Markdown Editor */}
      {isEditing ? (
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column-reverse" : "row",
            gap: 2,
            minHeight: "70vh",
          }}
        >
          <TextareaAutosize
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: isMobile ? "100%" : "50%",
              minHeight: isMobile ? "50vh" : "70vh",
              fontFamily: "monospace",
              fontSize: isMobile ? 16 : 14,
              padding: 12,
              borderRadius: 4,
              border: `1px solid ${theme.palette.divider}`,
              backgroundColor: theme.palette.background.paper,
              color: theme.palette.text.primary,
              resize: "vertical",
              overflow: "auto",
              outline: "none",
            }}
          />

          <Paper
            sx={{
              width: isMobile ? "100%" : "50%",
              p: 3,
              border: `1px solid ${theme.palette.divider}`,
              overflowX: "auto",
              overflowY: "auto",
              minHeight: isMobile ? "50vh" : "70vh",
            }}
          >
            <Box sx={markdownStyles}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {content || "*Nothing to preview yet.*"}
              </ReactMarkdown>
            </Box>
          </Paper>
        </Box>
      ) : (
        <Paper sx={paperStyles}>
          {isEmpty ? (
            <Typography color="text.secondary" fontStyle="italic">
              No content yet. Use the menu to edit.
            </Typography>
          ) : (
            <Box sx={markdownStyles}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[rehypeRaw]}
              >
                {content}
              </ReactMarkdown>
            </Box>
          )}
        </Paper>
      )}

      {/* Save / Cancel */}
      {isEditing && (
        <Stack
          direction="row"
          justifyContent="flex-end"
          spacing={1}
          sx={{ mt: 2 }}
        >
          <Button
            variant="contained"
            startIcon={<SaveRoundedIcon />}
            onClick={handleSave}
          >
            Save
          </Button>
          <Button variant="outlined" onClick={handleCancelEdit}>
            Cancel
          </Button>
        </Stack>
      )}

      {/* Rename Dialog */}
      <Dialog
        open={renameOpen}
        onClose={() => setRenameOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Rename File</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="File name"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setRenameOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={handleRenameSave}>
            Save
          </Button>
        </DialogActions>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog
        open={deleteConfirmOpen}
        onClose={() => setDeleteConfirmOpen(false)}
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete File</DialogTitle>
        <DialogContent>
          <Typography>
            Are you sure you want to delete "{file?.name}"?
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>Cancel</Button>
          <Button
            color="error"
            variant="contained"
            onClick={handleDeleteConfirm}
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
}
