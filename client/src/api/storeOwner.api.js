import api from './axios';

export const getDashboard = () => api.get('/store-owner/dashboard').then((r) => r.data);
