import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import TaskBoard from './pages/TaskBoard';
import EditTask from './components/EditTask';

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/tasks/:categoryId" element={<TaskBoard />} />
        <Route path="/tasks/:categoryId/edit/:id" element={<EditTask />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;