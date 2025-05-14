// src/App.jsx
import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Signup from "./components/Signup";
import Login from "./components/Login";
import { useNavigate } from "react-router-dom";


import OtpVerify from "./components/OtpVerify";
import Home from "./components/Home";
import { isAccessTokenValid, autoLogin } from "./utils/authService";
import { useEffect } from "react";


const App = () =>{
const navigate = useNavigate();

useEffect(() => {
  const checkAuth = async () => {
    const accessToken = localStorage.getItem("accessToken");

    if (isAccessTokenValid(accessToken)) {
      // allow access
    } else {
      const success = await autoLogin();
      if (!success) {
        navigate("/login");
      }
    }
  };

  checkAuth();
}, []);
  return (
 
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp-verify" element={<OtpVerify />} />
        <Route path="/home" element={<Home />} />
      </Routes>
   
  );
};

export default App;

