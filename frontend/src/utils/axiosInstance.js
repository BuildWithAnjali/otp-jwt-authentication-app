import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api/auth', // adjust if needed
  withCredentials: true,
});

export default API;
