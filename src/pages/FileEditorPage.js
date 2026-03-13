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

  // Fixed markdown styles with proper overflow handling
  const markdownStyles = {
    // Base container styles
    width: "100%",
    overflowX: "auto",
    wordWrap: "break-word",

    // Typography
    "& h1,h2,h3,h4,h5,h6": {
      fontWeight: 600,
      wordWrap: "break-word",
    },

    // Blockquotes
    "& blockquote": {
      borderLeft: `4px solid ${theme.palette.divider}`,
      pl: 2,
      color: theme.palette.text.secondary,
      fontStyle: "italic",
      bgcolor: theme.palette.action.hover,
      wordWrap: "break-word",
      overflowX: "auto",
    },

    // Code blocks - main overflow fix
    "& pre": {
      backgroundColor: theme.palette.mode === "dark" ? "#0d1117" : "#f6f8fa",
      padding: 2,
      borderRadius: 2,
      overflowX: "auto", // Horizontal scroll for code blocks
      overflowY: "hidden",
      maxWidth: "100%",
      whiteSpace: "pre-wrap", // Allow wrapping for better mobile experience
      wordWrap: "break-word",
      "& code": {
        whiteSpace: "pre-wrap", // Allow wrapping in code blocks
        wordWrap: "break-word",
        backgroundColor: "transparent",
        padding: 0,
      },
    },

    // Inline code
    "& code": {
      fontFamily: "monospace",
      fontSize: "0.9em",
      bgcolor: theme.palette.mode === "dark" ? "#161b22" : "#f6f8fa",
      px: 0.5,
      py: 0.2,
      borderRadius: 1,
      whiteSpace: "pre-wrap",
      wordWrap: "break-word",
    },

    // Links
    "& a": {
      color: theme.palette.primary.main,
      textDecoration: "underline",
      wordWrap: "break-word",
    },

    // Lists
    "& ul,& ol": {
      pl: 4,
      mb: 2,
      wordWrap: "break-word",
    },

    // Tables - another common overflow culprit
    "& table": {
      width: "100%",
      borderCollapse: "collapse",
      mb: 2,
      display: "block",
      overflowX: "auto", // Horizontal scroll for tables
      maxWidth: "100%",
    },

    "& th,& td": {
      border: `1px solid ${theme.palette.divider}`,
      padding: 1,
      textAlign: "left",
      wordWrap: "break-word",
      minWidth: "100px", // Prevent tiny columns
    },

    "& th": {
      bgcolor: theme.palette.action.hover,
    },

    // Images
    "& img": {
      maxWidth: "100%",
      height: "auto",
    },

    // Paragraphs and other elements
    "& p": {
      wordWrap: "break-word",
      overflowWrap: "break-word",
    },

    "& div": {
      wordWrap: "break-word",
      overflowWrap: "break-word",
    },
  };

  // Additional styles for the Paper container
  const paperStyles = {
    p: 3,
    minHeight: "70vh",
    border: `1px solid ${theme.palette.divider}`,
    overflowX: "auto", // Add scroll to Paper if content overflows
    overflowY: "auto",
    width: "100%",
  };

  /* ---------------- UI ---------------- */

  return (
    <Container maxWidth="lg" sx={{ py: 4, overflowX: "hidden" }}>
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

          <Typography variant="h6" fontWeight={700} sx={{ flexGrow: 1 }} noWrap>
            {file.name}
          </Typography>

          <IconButton id="file-options-button" onClick={handleMenuClick}>
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

            <MenuItem onClick={handleDeleteOpen} sx={{ color: "error.main" }}>
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

      {/* Editor */}

      {isEditing && (
        <Box
          sx={{
            display: "flex",
            flexDirection: isMobile ? "column" : "row",
            gap: 2,
            minHeight: "70vh",
            width: "100%",
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
              resize: "vertical",
              overflow: "auto",
            }}
          />

          <Paper
            sx={{
              width: isMobile ? "100%" : "50%",
              p: 3,
              border: `1px solid ${theme.palette.divider}`,
              overflowX: "auto",
              overflowY: "auto",
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
        maxWidth="xs"
        fullWidth
      >
        <DialogTitle>Delete File</DialogTitle>

        <DialogContent>
          <Typography>
            Are you sure you want to delete "{file.name}"?
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
