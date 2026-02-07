import axios from 'axios';

// Use relative path /api instead of localhost:5000
const API_BASE_URL = '/api';

console.log('API_BASE_URL:', API_BASE_URL);

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

export default api;
