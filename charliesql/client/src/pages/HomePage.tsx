import React from 'react';
import { Link } from 'react-router-dom';

const HomePage = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      <Link 
        to="/user-management"
        className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-2">User Management</h2>
        <p className="text-gray-600">Create, view, or delete user profiles</p>
      </Link>
      
      <Link 
        to="/daily-update"
        className="bg-white shadow rounded-lg p-6 hover:shadow-lg transition-shadow"
      >
        <h2 className="text-xl font-semibold text-gray-900 mb-2">Daily Updates</h2>
        <p className="text-gray-600">Log daily health metrics and lifestyle information</p>
      </Link>
    </div>
  );
};

export default HomePage; 