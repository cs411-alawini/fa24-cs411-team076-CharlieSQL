import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { userService } from '../services/services';

interface UserFormProps {
  isNewUser: boolean;
}

const UserForm: React.FC<UserFormProps> = ({ isNewUser }) => {
  const navigate = useNavigate();
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
      </form>
    </div>
  );
};

export default UserForm; 