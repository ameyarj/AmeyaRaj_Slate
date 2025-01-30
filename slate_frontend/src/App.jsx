import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider } from '@mui/material';
import { theme } from './theme/theme';
import Login from './components/auth/Login';
import SchoolDashboard from './components/dashboard/SchoolDashboard';
import ParentDashboard from './components/dashboard/ParentDashboard';
import StudentDashboard from './components/dashboard/StudentDashboard';
import Layout from './components/shared/Layout';
import PrivateRoute from './components/shared/PrivateRoute';
import Signup from './components/auth/Signup';
import ForgotPassword from './components/auth/ForgotPassword';
import ResetPassword from './components/auth/ResetPassword';
function App() {
  return (
    <ThemeProvider theme={theme}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password/:token" element={<ResetPassword />} />
          <Route path="/" element={<PrivateRoute><Layout /></PrivateRoute>}>
            <Route path="school" element={<SchoolDashboard />} />
            <Route path="parent" element={<ParentDashboard />} />
            <Route path="student" element={<StudentDashboard />} />
            <Route path="" element={<Navigate to="/login" replace />} />
            
          </Route>
        </Routes>
      </BrowserRouter>
    </ThemeProvider>
  );
}

export default App;
