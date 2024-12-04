import React from 'react';
import { useLocation, Navigate } from 'react-router-dom';
import UserForm from '../components/UserForm';

const UserManagementPage = () => {
  const location = useLocation();
  const isNewUser = location.state?.isNewUser;

  // If this is an update (not new user) but no userId exists, redirect to login
  if (!isNewUser && !localStorage.getItem('userId')) {
    return <Navigate to="/login" />;
  }

  return (
    <div>
      <UserForm isNewUser={isNewUser} />
    </div>
  );
};

export default UserManagementPage; 