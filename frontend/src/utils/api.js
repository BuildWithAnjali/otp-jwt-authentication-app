// utils/api.js or directly in your component
import axios from 'axios';

export const logoutUser = async (accessToken) => {
  try {
    const response = await axios.post(
      'http://localhost:5000/api/auth/logout',
      {}, // no body needed
      {
        headers: {
          Authorization: `Bearer ${accessToken}`, // send token in header
        },
      }
    );
    return response.data;
  } catch (error) {
    console.error('Logout error:', error.response?.data || error.message);
    throw error;
  }
};
