import axios from 'axios';
import { UserInfo, BiometricsInfo, ConditionsInfo, LifestyleInfo } from '../models/dataTypes';

const BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3007';

export const httpClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json'
    }
});

// User APIs
export const getUsers = (): Promise<UserInfo[]> => {
    return httpClient.get('/api/users').then(res => res.data);
};

export const createUser = (userData: Omit<UserInfo, 'User_Id'>): Promise<UserInfo> => {
    return httpClient.post('/api/users', userData).then(res => res.data);
};

export const deleteUser = (userId: number): Promise<void> => {
    return httpClient.delete(`/api/users/${userId}`);
};

// Biometrics APIs
export const getBiometrics = (): Promise<BiometricsInfo[]> => {
    return httpClient.get('/api/biometrics').then(res => res.data);
};

export const updateBiometrics = (data: Omit<BiometricsInfo, 'BioEntryDate'>): Promise<BiometricsInfo> => {
    return httpClient.post('/api/daily/biometrics', data).then(res => res.data);
};

// Conditions APIs
export const updateConditions = (data: Omit<ConditionsInfo, 'CondEntryDate'>): Promise<ConditionsInfo> => {
    return httpClient.post('/api/daily/conditions', data).then(res => res.data);
};

// Lifestyle APIs
export const updateLifestyle = (data: Omit<LifestyleInfo, 'LifeEntryDate'>): Promise<LifestyleInfo> => {
    return httpClient.post('/api/daily/lifestyle', data).then(res => res.data);
};

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