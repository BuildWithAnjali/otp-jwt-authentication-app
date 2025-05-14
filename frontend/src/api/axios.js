import axios from 'axios';

// Create an Axios instance
const instance = axios.create({
  baseURL: 'http://localhost:5000/api/', // Backend API URL
});

// Set up the Authorization header for authenticated requests
instance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`; // Attach JWT token to the headers
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Global error handler to catch expired tokens and redirect to login
instance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or not valid, redirect to login
      localStorage.removeItem('accessToken');
      window.location.href = '/login'; // Redirect to login page
    }
    return Promise.reject(error);
  }
);

export default instance;
