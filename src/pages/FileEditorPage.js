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
} from "@mui/material";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import SaveRoundedIcon from "@mui/icons-material/SaveRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import ArrowBackRoundedIcon from "@mui/icons-material/ArrowBackRounded";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { useDexieFileSystem } from "../hooks/useDexieFileSystem";
import { db } from "../db/_db";
import rehypeRaw from "rehype-raw";

export default function FileEditorPage() {
  const { fileId } = useParams();
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const { getFile, updateFile, fetchFiles } = useDexieFileSystem();

  const [file, setFile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [content, setContent] = useState("");

  // Load file with race-condition protection
  useEffect(() => {
    let isCancelled = false;

    async function load() {
      const f = await getFile(fileId);
      if (!isCancelled) {
        if (!f) {
          alert("File not found");
          navigate(-1);
          return;
        }
        setFile(f);
        setContent(typeof f.content === "string" ? f.content : "");
      }
    }

    load();

    return () => {
      isCancelled = true;
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [fileId]);

  const handleSave = async () => {
    // Pass an object with the 'content' key
    await updateFile(fileId, { content: content });
    setIsEditing(false);
  };
  const handleDelete = async () => {
    if (window.confirm("Delete this file?")) {
      await db.files.delete(fileId);
      if (file?.directoryId) fetchFiles(file.directoryId);
      navigate(-1);
    }
  };

  if (!file) return null;

  const isEmpty =
    !content || (typeof content === "string" && content.trim() === "");

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 3 }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            gap: 2,
            flexWrap: "wrap",
            mb: 1,
          }}
        >
          <IconButton onClick={() => navigate(-1)}>
            <ArrowBackRoundedIcon />
          </IconButton>
          <Typography
            variant="h6"
            fontWeight={700}
            sx={{ flexGrow: 1, minWidth: 0 }}
            noWrap
          >
            {file.name}
          </Typography>
        </Box>

        <Stack
          direction="row"
          display="flex"
          justifyContent="flex-end"
          width="100%"
          spacing={1}
          sx={{ flexWrap: "wrap" }}
        >
          {isEditing ? (
            <Button
              variant="contained"
              startIcon={<SaveRoundedIcon />}
              onClick={handleSave}
            >
              Save
            </Button>
          ) : (
            <Button
              variant="outlined"
              startIcon={<EditRoundedIcon />}
              onClick={() => setIsEditing(true)}
            >
              Edit
            </Button>
          )}
          <Button
            variant="outlined"
            color="error"
            startIcon={<DeleteOutlineRoundedIcon />}
            onClick={handleDelete}
          >
            Delete
          </Button>
        </Stack>
      </Box>

      {!isEditing && (
        <Paper
          sx={{
            p: 3,
            minHeight: "70vh",
            bgcolor: "background.paper",
            overflowY: "auto",
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: 2,
          }}
        >
          {isEmpty ? (
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontStyle: "italic" }}
            >
              No content yet. Click “Edit” to add your Markdown.
            </Typography>
          ) : (
            <Box
              sx={{
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
                "& ul, & ol": { pl: 4, mb: 2 },
                "& table": { width: "100%", borderCollapse: "collapse", mb: 2 },
                "& th, & td": {
                  border: `1px solid ${theme.palette.divider}`,
                  padding: 1,
                  textAlign: "left",
                },
                "& th": { bgcolor: theme.palette.action.hover },
              }}
            >
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
            onChange={(e) => setContent(e.target.value || "")}
            style={{
              width: isMobile ? "100%" : "50%",
              minHeight: "70vh",
              fontFamily: "monospace",
              fontSize: 14,
              border: "1px solid #ccc",
              borderRadius: 4,
              padding: 12,
              boxSizing: "border-box",
              resize: "vertical",
              backgroundColor: theme.palette.background.default,
              color: theme.palette.text.primary,
            }}
          />
          <Paper
            sx={{
              width: isMobile ? "100%" : "50%",
              p: 3,
              overflowY: "auto",
              bgcolor: "background.paper",
              border: `1px solid ${theme.palette.divider}`,
              borderRadius: 2,
            }}
          >
            <Box
              sx={{
                "& h1,h2,h3,h4,h5,h6": { fontWeight: 600 },
                "& table": { width: "100%", borderCollapse: "collapse", mb: 2 },
                "& th, & td": {
                  border: `1px solid ${theme.palette.divider}`,
                  padding: 1,
                  textAlign: "left",
                },
              }}
            >
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
    </Container>
  );
}
