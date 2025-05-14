// src/utils/authService.js
import axios from "axios";

export const isAccessTokenValid = (token) => {
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000;
    return Date.now() < expiry;
  } catch (e) {
    return false;
  }
};

export const autoLogin = async () => {
  try {
    const rememberToken = localStorage.getItem("rememberToken");
    if (!rememberToken) return false;

    const res = await axios.post("/api/auth/auto-login", { rememberToken });
    localStorage.setItem("accessToken", res.data.accessToken);
    return true;
  } catch (err) {
    return false;
  }
};
