// FolderCard.jsx
import { Box, Typography, IconButton } from "@mui/material";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import MoreVertIcon from "@mui/icons-material/MoreVert";
import { useTheme } from "@mui/material/styles";

export default function FolderCard({ directory, onNavigate, onMenuClick }) {
  const theme = useTheme();

  return (
    <Box
      onClick={onNavigate}
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        p: 1.5,
        borderRadius: 1,
        cursor: "pointer",
        "&:hover": { backgroundColor: theme.palette.action.hover },
      }}
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
        <FolderRoundedIcon sx={{ fontSize: 32, color: theme.palette.primary.main }} />
        <Typography variant="body1" noWrap>
          {directory.name}
        </Typography>
      </Box>

      <IconButton
        size="small"
        onClick={(e) => onMenuClick(e, directory)}
      >
        <MoreVertIcon />
      </IconButton>
    </Box>
  );
}