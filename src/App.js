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
// import Dashboard, Settings...

const theme = createTheme({ palette: { primary: { main: '#1976d2' } } });

function App() {

  const  themeColorMeta = document.querySelector("meta[name='theme-color']")
  themeColorMeta.setAttribute("content","#1976d2")

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <LocalizationProvider dateAdapter={AdapterDayjs}>
        <Router>
          <Routes>
            <Route path="/" element={<MainTaskList />} />
            <Route path="/tasks/add" element={<AddTask />} />
            <Route path="/tasks/:id" element={<TaskDetails />} />
            <Route path="/tasks/:id/edit" element={<EditTask />} />
            {/* <Route path="/settings" element={<Settings />} /> */}
          </Routes>
        </Router>
      </LocalizationProvider>
    </ThemeProvider>
  );
}

export default App;