// App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

import MainTaskList from './components/MainTaskList';
import AddTask from './components/AddTask';
import EditTask from './components/EditTask';
import TaskDetails from './components/TaskDetails';
import CategoryLayout from './layouts/CategoryLayout';
import CategoriesPage from './pages/CategoriesPage';

const glassBackground = "rgba(255, 255, 255, 0.06)";
const glassBorder = "1px solid rgba(255, 255, 255, 0.08)";
const glassBlur = "blur(20px)";

 const darkTheme = createTheme({
  palette: {
    mode: "dark",
    background: {
      default: "#0f172a", // deep slate
      paper: "rgba(255,255,255,0.04)",
    },
    primary: {
      main: "#6366f1", // soft indigo
    },
    secondary: {
      main: "#22d3ee", // cyan accent
    },
    success: {
      main: "#22c55e",
    },
    error: {
      main: "#ef4444",
    },
  },

  // shape: {
  //   borderRadius: 2,
  // },

  typography: {
    fontFamily: `"Inter", "Roboto", sans-serif`,
  },

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          background: `
            radial-gradient(circle at 20% 20%, rgba(99,102,241,0.15), transparent 40%),
            radial-gradient(circle at 80% 80%, rgba(34,211,238,0.1), transparent 40%),
            #0f172a
          `,
          minHeight: "100vh",
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          background: glassBackground,
          backdropFilter: glassBlur,
          WebkitBackdropFilter: glassBlur,
          border: glassBorder,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          background: glassBackground,
          backdropFilter: glassBlur,
          WebkitBackdropFilter: glassBlur,
          border: glassBorder,
          boxShadow: "0 8px 32px rgba(0,0,0,0.4)",
        },
      },
    },

    MuiAppBar: {
      styleOverrides: {
        root: {
          background: "rgba(15, 23, 42, 0.6)",
          backdropFilter: "blur(24px)",
          WebkitBackdropFilter: "blur(24px)",
          borderBottom: glassBorder,
          boxShadow: "none",
        },
      },
    },

    MuiDrawer: {
      styleOverrides: {
        paper: {
          background: glassBackground,
          backdropFilter: glassBlur,
          WebkitBackdropFilter: glassBlur,
          borderRight: glassBorder,
        },
      },
    },

    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 1,
          textTransform: "none",
          backdropFilter: "blur(12px)",
        },
        contained: {
          background: "rgba(99,102,241,0.8)",
          boxShadow: "0 4px 20px rgba(99,102,241,0.4)",
          "&:hover": {
            background: "rgba(99,102,241,1)",
          },
        },
        outlined: {
          border: glassBorder,
        },
      },
    },

    MuiTextField: {
      styleOverrides: {
        root: {
          "& .MuiOutlinedInput-root": {
            background: "rgba(255,255,255,0.04)",
            backdropFilter: "blur(12px)",
            borderRadius: 12,
          },
        },
      },
    },
  },
});

function App() {
  // const themeColorMeta = document.querySelector("meta[name='theme-color']");
  // if (themeColorMeta) {
  //   themeColorMeta.setAttribute("content", "#FFFFFF");
  // }

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
          <Routes>
            {/* Root → Categories overview (new main view) */}
            <Route path="/" element={<CategoriesPage />} />

            {/* Nested: Category-specific task views */}
            <Route path="/categories/:categoryId" element={<CategoryLayout />}>
              <Route index element={<MainTaskList />} />           {/* shows tasks of this category */}
              <Route path="tasks/add" element={<AddTask />} />      {/* add task in this category */}
              <Route path="tasks/:taskId" element={<TaskDetails />} />
              <Route path="tasks/:taskId/edit" element={<EditTask />} />
            </Route>

            {/* Optional: global fallback or all-tasks view */}
            {/* <Route path="/all-tasks" element={<AllTasksView />} /> */}
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}



export default App;