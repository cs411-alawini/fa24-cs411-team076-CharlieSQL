import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { userService } from '../services/services';

const LoginPage = () => {
  const navigate = useNavigate();
  const [userId, setUserId] = useState('');
  const [isNewUser, setIsNewUser] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!isNewUser) {
      try {
        const { exists } = await userService.checkUserExists(userId);
        
        if (!exists) {
          console.log(24, `User ID ${userId} not recognized:`, exists);
          alert('User ID not recognized. Please sign up if you are a new user.');
          return;
        } else {
          console.log(28, `User ID ${userId} verified:`, exists);
        }
        
        localStorage.setItem('userId', userId);
        navigate('/');
      } catch (error) {
        console.error('Error checking user:', error);
        alert('Error checking user ID. Please try again.');
      }
    } else {
      navigate('/user-management', { state: { isNewUser: true } });
    }
  };

  return (
    <div className="h-full bg-blue-100 flex items-center justify-center">
      <div className="bg-white rounded-2xl p-8 w-full max-w-md m-4">
        <h2 className="text-center text-3xl font-extrabold text-gray-900 mb-8">
          {isNewUser ? 'Get New User ID' : 'Sign in to your account'}
        </h2>

        <div className="bg-gray-50 rounded-xl shadow p-6">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {!isNewUser && (
              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700">
                  User ID
                </label>
                <div className="mt-1">
                  <input
                    id="userId"
                    name="userId"
                    type="number"
                    required
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                  />
                </div>
              </div>
            )}

            <div>
              <button
                type="submit"
                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                {isNewUser ? 'Create new profile' : 'Sign in'}
              </button>
            </div>

            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setIsNewUser(!isNewUser);
                  setUserId('');
                }}
                className="text-sm text-indigo-600 hover:text-indigo-500"
              >
                {isNewUser ? 'Already have a User ID? Sign in' : 'Need a User ID? Sign up'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 