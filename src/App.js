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

const theme = createTheme({
  palette: {
    primary: { main: '#1976d2' },
  },
});

function App() {
  const themeColorMeta = document.querySelector("meta[name='theme-color']");
  if (themeColorMeta) {
    themeColorMeta.setAttribute("content", "#FFFFFF");
  }

  return (
    <ThemeProvider theme={theme}>
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