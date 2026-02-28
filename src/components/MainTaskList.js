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
  ListItem,
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
  alpha,
} from "@mui/material";

import MenuIcon from "@mui/icons-material/Menu";
import AddIcon from "@mui/icons-material/Add";
import SearchIcon from "@mui/icons-material/Search";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";

const drawerWidth = 260;

const priorityColors = {
  low: "success",
  medium: "warning",
  high: "error",
};

const MainTaskList = () => {
  const { tasks, toggleComplete } = useTasks();
  const navigate = useNavigate();
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up("md")); 

  const [mobileOpen, setMobileOpen] = useState(false);
  const [filter, setFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);

  // ────────────────────────────────────────────────
  // Filtering (unchanged logic)
  // ────────────────────────────────────────────────
  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        const matchesSearch =
          task.title.toLowerCase().includes(search.toLowerCase()) ||
          (task.description ?? "").toLowerCase().includes(search.toLowerCase());

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
    <Box sx={{ width: drawerWidth, pt: 2 }}>
      <Typography
        variant="subtitle2"
        sx={{
          px: 3,
          pb: 1,
          color: "text.secondary",
          fontWeight: 600,
          letterSpacing: 0.5,
        }}
      >
        FILTERS
      </Typography>

      <List disablePadding>
        {filters.map((item) => (
          <ListItem disablePadding key={item}>
            <ListItemButton
              selected={filter === item}
              onClick={() => {
                setFilter(item);
                if (!isDesktop) setMobileOpen(false);
              }}
              sx={{
                py: 1.1,
                px: 3,
                "&.Mui-selected": {
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.18),
                  },
                },
              }}
            >
              <ListItemText
                primary={item}
                primaryTypographyProps={{
                  fontWeight: filter === item ? 600 : 400,
                  color: filter === item ? "primary.main" : "text.primary",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>

      <Divider sx={{ my: 2 }} />

      <Typography
        variant="subtitle2"
        sx={{
          px: 3,
          pb: 1,
          color: "text.secondary",
          fontWeight: 600,
          letterSpacing: 0.5,
        }}
      >
        PRIORITY
      </Typography>

      <List disablePadding>
        {priorities.map((item) => (
          <ListItem disablePadding key={item}>
            <ListItemButton
              selected={priorityFilter === item}
              onClick={() => {
                setPriorityFilter(item);
                if (!isDesktop) setMobileOpen(false);
              }}
              sx={{
                py: 1.1,
                px: 3,
                "&.Mui-selected": {
                  bgcolor: alpha(theme.palette.primary.main, 0.12),
                  "&:hover": {
                    bgcolor: alpha(theme.palette.primary.main, 0.18),
                  },
                },
              }}
            >
              <ListItemText
                primary={item}
                primaryTypographyProps={{
                  fontWeight: priorityFilter === item ? 600 : 400,
                  color:
                    priorityFilter === item ? "primary.main" : "text.primary",
                }}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      {/* ─── App Bar ──────────────────────────────────────────────── */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          borderBottom: `1px solid ${theme.palette.divider}`,
          bgcolor: "background.paper",
          color: "text.primary",
        }}
      >
        <Toolbar sx={{ minHeight: 64 }}>
          {!isDesktop && (
            <IconButton
              edge="start"
              color="inherit"
              onClick={() => setMobileOpen(true)}
              sx={{ mr: 1.5 }}
            >
              <MenuIcon />
            </IconButton>
          )}

          <Typography
            variant="h6"
            component="div"
            sx={{
              flexGrow: 1,
              fontWeight: 600,
              letterSpacing: "-0.015em",
            }}
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
                width: 320,
                maxWidth: "100%",
                "& .MuiOutlinedInput-root": {
                  bgcolor: alpha(theme.palette.common.white, 0.15),
                  borderRadius: 2,
                  "& fieldset": { borderColor: "divider" },
                  "&:hover fieldset": { borderColor: "primary.main" },
                },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
            />
          ) : (
            <IconButton
              color="inherit"
              onClick={() => setShowSearch(!showSearch)}
              sx={{ ml: 1 }}
            >
              <SearchIcon />
            </IconButton>
          )}
        </Toolbar>

        {/* Mobile search bar */}
        {!isDesktop && showSearch && (
          <Box sx={{ px: 2, pb: 2, bgcolor: "background.paper" }}>
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
                    <SearchIcon fontSize="small" />
                  </InputAdornment>
                ),
              }}
              sx={{
                "& .MuiOutlinedInput-root": {
                  bgcolor: "background.default",
                  borderRadius: 2,
                },
              }}
            />
          </Box>
        )}
      </AppBar>

      {/* ─── Drawer ───────────────────────────────────────────────── */}
      <Drawer
        variant={isDesktop ? "permanent" : "temporary"}
        open={isDesktop || mobileOpen}
        onClose={() => setMobileOpen(false)}
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
            borderRight: `1px solid ${theme.palette.divider}`,
            bgcolor: "background.paper",
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* ─── Main Content ─────────────────────────────────────────── */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: { xs: 2, sm: 3 },
          pt: { xs: 10, md: 10 },
          pb: { xs: 10, sm: 6 },
          bgcolor: "background.default",
          minHeight: "100vh",
        }}
      >
        {filteredTasks.length === 0 ? (
          <Box
            sx={{
              height: "60vh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              flexDirection: "column",
              color: "text.secondary",
              gap: 2,
            }}
          >
            <SearchIcon sx={{ fontSize: 64, opacity: 0.2 }} />
            <Typography variant="h6" color="text.secondary">
              No tasks found
            </Typography>
            <Typography variant="body2">
              Try adjusting your filters or search terms
            </Typography>
          </Box>
        ) : (
          filteredTasks.map((task) => (
            <Paper
              key={task.id}
              elevation={0}
              sx={{
                mb: 2,
                p: 2.5,
                borderRadius: 2,
                border: `1px solid ${theme.palette.divider}`,
                transition: "all 0.15s ease",
                bgcolor: task.completed
                  ? alpha(theme.palette.action.selected, 0.1)
                  : "background.paper",
                "&:hover": {
                  transform: "translateY(-1px)",
                  boxShadow: theme.shadows[2],
                },
              }}
            >
              <Box sx={{ display: "flex", alignItems: "flex-start", gap: 1.5 }}>
                <Checkbox
                  checked={task.completed}
                  onChange={() => toggleComplete(task.id)}
                  sx={{ mt: 0.3 }}
                />

                <Box
                  sx={{ flex: 1, cursor: "pointer" }}
                  onClick={() => navigate(`/tasks/${task.id}`)}
                >
                  <Typography
                    variant="subtitle1"
                    sx={{
                      fontWeight: 500,
                      textDecoration: task.completed ? "line-through" : "none",
                      color: task.completed ? "text.disabled" : "text.primary",
                      mb: 0.5,
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
                        mb: 1.5,
                      }}
                    >
                      {task.description}
                    </Typography>
                  )}

                  <Box
                    sx={{
                      display: "flex",
                      alignItems: "center",
                      gap: 1.5,
                      flexWrap: "wrap",
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 0.5,
                        color:
                          task.dueDate &&
                          new Date(task.dueDate) < new Date() &&
                          !task.completed
                            ? "error.main"
                            : "text.secondary",
                      }}
                    >
                      <CalendarTodayIcon fontSize="inherit" />
                      <Typography variant="caption">
                        {task.dueDate
                          ? new Date(task.dueDate).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })
                          : "No due date"}
                      </Typography>
                    </Box>

                    {task.priority && (
                      <Chip
                        size="small"
                        label={task.priority.toUpperCase()}
                        color={priorityColors[task.priority] ?? "default"}
                        variant="outlined"
                      />
                    )}
                  </Box>
                </Box>
              </Box>
            </Paper>
          ))
        )}
      </Box>

      {/* ─── Floating Action Button ──────────────────────────────── */}
      <Fab
        color="primary"
        aria-label="add task"
        sx={{
          position: "fixed",
          bottom: 24,
          right: 24,
          boxShadow: theme.shadows[4],
        }}
        onClick={() => navigate("/tasks/add")}
      >
        <AddIcon />
      </Fab>
    </Box>
  );
};

export default MainTaskList;
