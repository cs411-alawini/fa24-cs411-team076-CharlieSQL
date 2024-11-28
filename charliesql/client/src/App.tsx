import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import HomePage from './pages/HomePage';
import UserManagementPage from './pages/UserManagementPage';
import DailyUpdatePage from './pages/DailyUpdatePage';
import LoginPage from './pages/LoginPage';

const App: React.FC = () => {
  // Simple auth check
  const isAuthenticated = () => {
    return localStorage.getItem('userId') !== null;
  };

  // Protected Route component
  const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    return <>{children}</>;
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route 
          path="/" 
          element={
            <ProtectedRoute>
              <HomePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/user-management" 
          element={
            <ProtectedRoute>
              <UserManagementPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/daily-update" 
          element={
            <ProtectedRoute>
              <DailyUpdatePage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  );
}

export default App;
