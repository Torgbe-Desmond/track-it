import { Card, Box, Typography } from "@mui/material";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";

export default function ProjectCard({ project, onClick }) {
  return (
    <Card
      elevation={0}
      variant="outlined"
      onClick={onClick}
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
    >
      <Box sx={{ display: "flex", alignItems: "center", gap: 1.5, minWidth: 0 }}>
        <FolderRoundedIcon
          sx={{ fontSize: 34, color: "primary.main", flexShrink: 0 }}
        />
        <Typography variant="body1" fontWeight={500} noWrap sx={{ flex: 1 }}>
          {project.name}
        </Typography>
      </Box>
    </Card>
  );
}