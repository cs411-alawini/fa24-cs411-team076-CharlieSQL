import React from 'react';
import UserForm from '../components/UserForm';
import UserList from '../components/UserList';
import { Link } from 'react-router-dom';

const UserManagementPage = () => {
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900">
            User Management
          </h1>
          <Link 
            to="/"
            className="text-indigo-600 hover:text-indigo-900"
          >
            Back to Home
          </Link>
        </div>
        
        <div className="mb-12">
          <UserForm />
        </div>
        
        <div className="bg-white shadow rounded-lg">
          <UserList />
        </div>
      </div>
    </div>
  );
};

export default UserManagementPage; 