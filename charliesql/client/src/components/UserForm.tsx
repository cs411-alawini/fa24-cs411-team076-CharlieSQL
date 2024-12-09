import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../services/services';

interface UserFormProps {
  isNewUser: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ isNewUser }) => {
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [formData, setFormData] = useState({
    age: '',
    gender: '',
    country: '',
    diagnosis: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const userId = localStorage.getItem('userId');
    
    console.log("Sending form data:", formData);
    
    try {
      if (isNewUser) {
        const response = await userService.createUser(formData);
        localStorage.setItem('userId', response[0].User_Id.toString());
        alert('User successfully created!');
      } else {
        if (!userId) return;
        await userService.updateUser(userId, formData);
        alert('User successfully updated!');
      }
      navigate('/');
    } catch (error) {
      console.error(`Error ${isNewUser ? 'creating' : 'updating'} user:`, error);
      alert(`User ${isNewUser ? 'creation' : 'update'} failed!`);
    }
  };

  const handleDelete = async () => {
    const userId = localStorage.getItem('userId');
    if (!userId) return;

    try {
      await userService.deleteUser(userId);
      localStorage.removeItem('userId');
      alert('User successfully deleted');
      navigate('/login');
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  return (
    <div className="bg-white shadow rounded-lg p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <input
            type="number"
            placeholder="Age"
            min="0"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.age}
            onChange={(e) => setFormData({...formData, age: e.target.value})}
            required
          />
        </div>
        <div>
          <select
            value={formData.gender}
            onChange={(e) => setFormData({...formData, gender: e.target.value})}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select Gender</option>
            <option value="Male">Male</option>
            <option value="Female">Female</option>
          </select>
        </div>
        <div>
          <input
            type="text"
            placeholder="Country"
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
            value={formData.country}
            onChange={(e) => setFormData({...formData, country: e.target.value})}
          />
        </div>
        <div>
          <select
            value={formData.diagnosis}
            onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
            className="w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          >
            <option value="">Select Diagnosis</option>
            <option value="Positive">Positive</option>
            <option value="Negative">Negative</option>
          </select>
        </div>
        <div>
          {!isNewUser && 
          <Link 
            to="/"
            className="text-indigo-600 hover:text-indigo-900"
          >
              Back to Home
          </Link>}
        </div>
        <button
          type="submit"
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          {isNewUser ? 'Create User' : 'Update User'}
        </button>
        {!isNewUser && (
        <button
          type="button"
          onClick={() => setShowDeleteConfirm(true)}
          className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-400 hover:bg-red-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
        >
          Delete User
        </button>)}
      </form>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="relative bg-white rounded-lg p-8 max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Confirm Delete</h3>
            <p className="text-sm text-gray-500 mb-6">
              Are you sure? There's no undoing this action and it will remove your user ID and all corresponding log entries.
            </p>
            <div className="flex justify-end space-x-4">
              <button
                type="button"
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={() => {
                  setShowDeleteConfirm(false);
                  handleDelete();
                }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-400 hover:bg-red-500 rounded-md"
              >
                Yes, Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserForm; 