import { useMemo } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme, CssBaseline, useMediaQuery } from "@mui/material";

import Dashboard from "./pages/Dashboard";
import FileBoard from "./pages/FileBoard";
import FileEditorPage from "./pages/FileEditorPage";

export default function App() {
  // Detect system dark mode preference
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");

  // Create MUI theme based on system preference
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode: prefersDarkMode ? "dark" : "light",
          primary: {
            main: "#1976d2",
          },
          secondary: {
            main: "#9c27b0",
          },
        },
        typography: {
          fontFamily: "Roboto, Arial, sans-serif",
        },
      }),
    [prefersDarkMode]
  );

  return (
    <ThemeProvider theme={theme}>
      {/* CssBaseline resets styles for dark/light */}
      <CssBaseline />
      <Router>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/folder/:dirId" element={<FileBoard />} />
          <Route path="/file/:fileId" element={<FileEditorPage />} />
        </Routes>
      </Router>
    </ThemeProvider>
  );
}