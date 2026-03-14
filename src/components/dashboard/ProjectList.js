import { Box, Stack, Typography } from "@mui/material";
import FolderRoundedIcon from "@mui/icons-material/FolderRounded";
import ProjectCard from "./ProjectCard";

export default function ProjectList({ projects, onProjectClick }) {
  if (projects.length === 0) {
    return (
      <Box sx={{ py: 12, textAlign: "center", color: "text.secondary" }}>
        <FolderRoundedIcon sx={{ fontSize: 64, opacity: 0.3, mb: 2 }} />
        <Typography variant="body1" gutterBottom>
          You don't have any projects yet
        </Typography>
        <Typography variant="body2">
          Click the menu button (⋮) and select "Add Project" to get started
        </Typography>
      </Box>
    );
  }

  return (
    <Stack sx={{ pb: 4 }}>
      {projects.map((project) => (
        <ProjectCard
          key={project.id}
          project={project}
          onClick={() => onProjectClick(project.id)}
        />
      ))}
    </Stack>
  );
}