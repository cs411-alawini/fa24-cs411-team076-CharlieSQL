import axios from 'axios';
import { UserInfo, BiometricsInfo, ConditionsInfo, LifestyleInfo } from '../models/dataTypes';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

export const userService = {
  createUser: async (userData: any) => {
    const response = await fetch(`${BASE_URL}/api/users/create`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  updateUser: async (userId: string, userData: any) => {
    const response = await fetch(`${BASE_URL}/api/users/update/${userId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userData),
    });
    return response.json();
  },

  checkUserExists: async (userId: string) => {
    const response = await fetch(`${BASE_URL}/api/users/check/${userId}`);
    return response.json();
  },

  deleteUser: async (userId: string) => {
    const response = await fetch(`${BASE_URL}/api/users/delete/${userId}`, {
      method: 'DELETE',
    });
    return response.json();
  }
};

export const dailyService = {
  submitBiometricsAndConditions: async (data: any) => {
    const response = await fetch(`${BASE_URL}/api/daily/biometricsAndConditions`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  },

  submitLifestyle: async (data: any) => {
    const response = await fetch(`${BASE_URL}/api/daily/lifestyle`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    return response.json();
  }
};

export const httpClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// Advanced Query APIs
export const getAdvancedQuery1 = () => {
    return httpClient.get('/api/query/1').then(res => res.data);
};

export const getAdvancedQuery2 = () => {
    return httpClient.get('/api/query/2').then(res => res.data);
};

export const getAdvancedQuery3 = () => {
    return httpClient.get('/api/query/3').then(res => res.data);
};

export const getAdvancedQuery4 = () => {
    return httpClient.get('/api/query/4').then(res => res.data);
};

export const doctorService = {
    getDoctorStats: async () => {
        const response = await fetch(`${BASE_URL}/api/doctor-view`);
        if (!response.ok) {
            throw new Error('Failed to fetch doctor statistics');
        }
        return response.json();
    }
};

export const viewUserService = {
    getUserViewData: async (userId: string, type: string, date: string) => {
        const exists = await userService.checkUserExists(userId);
        if (!exists.exists) {
            throw new Error('User not found');
        }
        
        const response = await fetch(`${BASE_URL}/api/view-user/${userId}/${type}/${date}`);
        if (!response.ok) {
            throw new Error('Failed to fetch user view data');
        }
        return response.json();
    }
};