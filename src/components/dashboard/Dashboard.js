import { useState, useEffect } from "react";
import { Container, useTheme } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useDexieFileSystem } from "../hooks/useDexieFileSystem";

import ProjectHeader from "./ProjectHeader";
import ProjectList from "./ProjectList";
import NewProjectDialog from "./NewProjectDialog";

export default function Dashboard() {
  const theme = useTheme();
  const navigate = useNavigate();
  const { directories, fetchDirectories, addDirectory } = useDexieFileSystem();

  const [newProjectOpen, setNewProjectOpen] = useState(false);

  useEffect(() => {
    fetchDirectories(null);
  }, [fetchDirectories]);

  const handleProjectCreated = () => {
    setNewProjectOpen(false);
    fetchDirectories(null);
  };

  return (
    <Container maxWidth="md" disableGutters sx={{ pb: { xs: 10, sm: 6 } }}>
      <ProjectHeader onAddProject={() => setNewProjectOpen(true)} />

      <ProjectList
        projects={directories}
        onProjectClick={(id) => navigate(`/folder/${id}`)}
      />

      <NewProjectDialog
        open={newProjectOpen}
        onClose={() => setNewProjectOpen(false)}
        onCreate={handleProjectCreated}
        addDirectory={addDirectory}
      />
    </Container>
  );
}