import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTasks } from "../hooks/useTasks";
import {
  AppBar,
  Toolbar,
  Typography,
  Box,
  Drawer,
  List,
  ListItemButton,
  ListItemText,
  IconButton,
  TextField,
  Fab,
  Checkbox,
  Chip,
  Paper,
  Divider,
  InputAdornment,
  useTheme,
  useMediaQuery,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";

const drawerWidth = 240;

const priorityColors = {
  low: "success",
  medium: "warning",
  high: "error",
};

const MainTaskList = () => {
  const { tasks, toggleComplete } = useTasks();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("sm"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // ===============================
  // Filtering Logic
  // ===============================
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          task.description?.toLowerCase().includes(search.toLowerCase());

        if (!matchesSearch) return false;

        if (filter === "Active") return !task.completed;
        if (filter === "Completed") return task.completed;
        if (filter === "Today")
          return (
            task.dueDate &&
            new Date(task.dueDate).toDateString() === new Date().toDateString()
          );
        if (filter === "Overdue")
          return (
            task.dueDate &&
            !task.completed &&
            new Date(task.dueDate) < new Date()
          );

        return true;
      })
      .filter(
        (task) =>
          priorityFilter === "All" ||
          task.priority === priorityFilter.toLowerCase(),
      );
  }, [tasks, search, filter, priorityFilter]);

  const filters = ["All", "Active", "Completed", "Today", "Overdue"];
  const priorities = ["All", "Low", "Medium", "High"];

  const drawerContent = (
    <>
      <Toolbar />
      <Typography variant="h6" sx={{ p: 2 }}>
        Filters
      </Typography>
      <List>
        {filters.map((item) => (
          <ListItemButton
            key={item}
            selected={filter === item}
            onClick={() => {
              setFilter(item);
              if (!isDesktop) setMobileOpen(false);
            }}
          >
            <ListItemText primary={item} />
          </ListItemButton>
        ))}
      </List>
      <Divider />
      <Typography variant="h6" sx={{ p: 2 }}>
        Priority
      </Typography>
      <List>
        {priorities.map((item) => (
          <ListItemButton
            key={item}
            selected={priorityFilter === item}
            onClick={() => {
              setPriorityFilter(item);
              if (!isDesktop) setMobileOpen(false);
            }}
          >
            <ListItemText primary={item} />
          </ListItemButton>
        ))}
      </List>
    </>
  );

  return (
    <Box sx={{ display: "flex", height: "100vh", marginTop:showSearch && "45px" }}>
      {/* ===============================
          APP BAR
      ================================= */}
      <AppBar position="fixed" sx={{ zIndex: theme.zIndex.drawer + 1 }}>
        <Toolbar>
          {!isDesktop && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 1 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            sx={{ flexGrow: 1, textDecoration: "none", color: "inherit" }}
          >
            Task Tracker
          </Typography>

          {isDesktop ? (
            <TextField
              size="small"
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{
                bgcolor: "white",
                borderRadius: 1,
                width: 300,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          ) : (
            <IconButton
              color="inherit"
              onClick={() => setShowSearch(!showSearch)}
            >
              <SearchIcon />
            </IconButton>
          )}
        </Toolbar>

        {!isDesktop && showSearch && (
          <Box sx={{ p: 2, bgcolor: "background.paper" }}>
            <TextField
              fullWidth
              size="small"
              autoFocus
              placeholder="Search tasks..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon />
                  </InputAdornment>
                ),
              }}
            />
          </Box>
        )}
      </AppBar>

      {/* ===============================
          DRAWER
      ================================= */}
      <Drawer
        variant={isDesktop ? "permanent" : "temporary"}
        open={isDesktop || mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* ===============================
          MAIN CONTENT - MOBILE STYLE
      ================================= */}
      <Box component="main" sx={{ flexGrow: 1, p: 2, mt: isDesktop ? 8 : 10 }}>
        {filteredTasks.map((task) => (
          <Paper
            key={task.id}
            elevation={0}
            sx={{
              p: 2,
              mb: 2,
              border: "1px solid",
              borderColor: "divider",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "flex-start",
                cursor: "pointer",
              }}
            >
              <Checkbox
                checked={task.completed}
                onChange={() => toggleComplete(task.id)}
              />

              <Box
                sx={{ flex: 1 }}
                onClick={() => navigate(`/tasks/${task.id}`)}
              >
                <Typography
                  fontWeight={500}
                  noWrap
                  sx={{
                    textDecoration: task.completed ? "line-through" : "none",
                  }}
                >
                  {task.title}
                </Typography>

                {task.description && (
                  <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{
                      display: "-webkit-box",
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: "vertical",
                      overflow: "hidden",
                    }}
                  >
                    {task.description}
                  </Typography>
                )}

                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    mt: 1,
                  }}
                >
                  <Typography variant="caption" color="primary">
                    {task.dueDate
                      ? new Date(task.dueDate).toLocaleDateString()
                      : "No due date"}
                  </Typography>

                  <Chip
                    size="small"
                    label={task.priority?.toUpperCase()}
                    color={priorityColors[task.priority] || "default"}
                  />
                </Box>
              </Box>
            </Box>
          </Paper>
        ))}
      </Box>

      {/* ===============================
          FAB
      ================================= */}
      <Fab
        color="primary"
        sx={{ position: "fixed", bottom: 24, right: 24 }}
        onClick={() => navigate("/tasks/add")}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default MainTaskList;
