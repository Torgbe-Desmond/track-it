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
      try {
        const f = await getFile(fileId);

        if (!mounted) return;

        if (!f) {
          alert("File not found");
          navigate(-1);
          return;
        }

        setFile(f);
        setContent(typeof f.content === "string" ? f.content : "");
        setNewFileName(f.name || "");
      } catch (err) {
        console.error("Failed to load file:", err);
      }
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

  const handleMenuClose = () => {
    setAnchorEl(null);
  };

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

    try {
      await db.files.delete(fileId);

      if (file?.directoryId) {
        await fetchFiles(file.directoryId);
      }

      navigate(-1);
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  /* ---------------- Save Content ---------------- */

  const handleSave = async () => {
    if (!fileId) return;

    await updateFile(fileId, { content });

    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setContent(file?.content || "");
    setIsEditing(false);
  };

  /* ---------------- UI Helpers ---------------- */

  if (!file) {
    return (
      <Container sx={{ py: 6 }}>
        <Typography color="text.secondary">Loading file...</Typography>
      </Container>
    );
  }

  const isEmpty = !content || content.trim() === "";

  const markdownStyles = {
    "& h1,h2,h3,h4,h5,h6": { fontWeight: 600 },
    "& blockquote": {
      borderLeft: `4px solid ${theme.palette.divider}`,
      pl: 2,
      color: theme.palette.text.secondary,
      fontStyle: "italic",
      bgcolor: theme.palette.action.hover,
    },
    "& pre": {
      backgroundColor:
        theme.palette.mode === "dark" ? "#0d1117" : "#f6f8fa",
      padding: 2,
      borderRadius: 2,
      overflow: "auto",
    },
    "& code": {
      fontFamily: "monospace",
      fontSize: "0.9em",
      bgcolor:
        theme.palette.mode === "dark" ? "#161b22" : "#f6f8fa",
      px: 0.5,
      py: 0.2,
      borderRadius: 1,
    },
    "& a": {
      color: theme.palette.primary.main,
      textDecoration: "underline",
    },
    "& ul,& ol": { pl: 4, mb: 2 },
    "& table": { width: "100%", borderCollapse: "collapse", mb: 2 },
    "& th,& td": {
      border: `1px solid ${theme.palette.divider}`,
      padding: 1,
      textAlign: "left",
    },
    "& th": { bgcolor: theme.palette.action.hover },
  };

  /* ---------------- UI ---------------- */

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Header */}

      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
          }}
        >
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackIosIcon />
          </IconButton>

          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ flexGrow: 1 }}
            noWrap
          >
            {file.name}
          </Typography>

          <IconButton
            id="file-options-button"
            onClick={handleMenuClick}
          >
            <MoreHorizIcon />
          </IconButton>

          <Menu
            id="file-menu"
            anchorEl={anchorEl}
            open={open}
            onClose={handleMenuClose}
            MenuListProps={{
              "aria-labelledby": "file-options-button",
            }}
          >
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

            <MenuItem
              onClick={handleDeleteOpen}
              sx={{ color: "error.main" }}
            >
              <ListItemIcon sx={{ color: "error.main" }}>
                <DeleteOutlineRoundedIcon fontSize="small" />
              </ListItemIcon>
              <ListItemText>Delete File</ListItemText>
            </MenuItem>
          </Menu>
        </Box>

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
      </Box>

      {/* Viewer */}

      {!isEditing && (
        <Paper
          sx={{
            p: 3,
            minHeight: "70vh",
            border: `1px solid ${theme.palette.divider}`,
          }}
        >
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

      {/* Editor */}

      {isEditing && (
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
            minHeight: "70vh",
          }}
        >
          <TextareaAutosize
            value={content}
            onChange={(e) => setContent(e.target.value)}
            style={{
              width: isMobile ? "100%" : "50%",
              minHeight: "70vh",
              fontFamily: "monospace",
              padding: 12,
              borderRadius: 4,
              border: "1px solid #ccc",
            }}
          />

          <Paper
            sx={{
              width: isMobile ? "100%" : "50%",
              p: 3,
              border: `1px solid ${theme.palette.divider}`,
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
      )}

      {/* Rename Dialog */}

      <Dialog open={renameOpen} onClose={() => setRenameOpen(false)}>
        <DialogTitle>Rename File</DialogTitle>

        <DialogContent>
          <TextField
            autoFocus
            fullWidth
            label="File name"
            value={newFileName}
            onChange={(e) => setNewFileName(e.target.value)}
            sx={{ mt: 1 }}
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
      >
        <DialogTitle>Delete File</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete "{file.name}"?
          </Typography>
        </DialogContent>

        <DialogActions>
          <Button onClick={() => setDeleteConfirmOpen(false)}>
            Cancel
          </Button>

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