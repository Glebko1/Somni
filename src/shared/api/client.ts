import axios from 'axios';

import { secureStorage } from '../storage/secureStorage';

export const apiClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'https://api.somni.app/v1',
  timeout: 15000
});

apiClient.interceptors.request.use(async (config) => {
  const token = await secureStorage.get('authToken');

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});
