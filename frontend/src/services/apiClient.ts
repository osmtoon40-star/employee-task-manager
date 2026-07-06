import axios from 'axios';

export const apiClient = axios.create({
  baseURL: 'https://api.enterprise.com/v1',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default apiClient;
