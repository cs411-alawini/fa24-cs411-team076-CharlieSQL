import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { MantineProvider } from '@mantine/core';
import Layout from './components/Layout';
import UILayout from './components/UILayout';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import UserManagementPage from './pages/UserManagementPage';
import DailyUpdatePage from './pages/DailyUpdatePage';

const App: React.FC = () => {
  const isAuthenticated = () => {
    return localStorage.getItem('userId') !== null;
  };

  // Protected Route component
  const ProtectedRoute = ({ children, title }: { children: React.ReactNode, title?: string }) => {
    if (!isAuthenticated()) {
      return <Navigate to="/login" />;
    }
    return (
      <Layout>
        <UILayout title={title}>
          {children}
        </UILayout>
      </Layout>
    );
  };

  // Conditional Layout component - uses Layout only if not new user
  const ConditionalLayout = ({ children, titles }: { children: React.ReactNode, titles?: string[] }) => {
    const location = useLocation();
    const isNewUser = location.state?.isNewUser;
    let title = isNewUser ? titles![0] : titles![1] || "User Management";
    if (isNewUser) {
      return (
        <div className="flex-col w-screen h-screen bg-blue-100">
          <UILayout title={title}>
            {children}
          </UILayout>
        </div>
      );
    }
    return <ProtectedRoute title={title}>{children}</ProtectedRoute>;
  };

  return (
    <MantineProvider>
      <Router>
        <Routes>
          <Route path="/login" element={
            <UILayout title="Login">
              <LoginPage />
            </UILayout>
          } />
          <Route path="/" element={
            <ProtectedRoute title="Home">
              <HomePage />
            </ProtectedRoute>
          } />
          <Route path="/user-management" element={
            <ConditionalLayout titles={["Create User Profile", "Update User Profile"]}>
              <UserManagementPage />
            </ConditionalLayout>
          } />
          <Route path="/daily-update" element={
            <ProtectedRoute title="Daily Health Update">
              <DailyUpdatePage />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </MantineProvider>
  );
}

export default App;
