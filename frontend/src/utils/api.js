import axios from 'axios';
const API_BASE_URL = window.location.hostname === 'localhost' ? 'http://localhost:5000/api' : `/api`;
console.log('API_BASE_URL:', API_BASE_URL);
const api = axios.create({ baseURL: API_BASE_URL, headers: { 'Content-Type': 'application/json' } });
export default api;