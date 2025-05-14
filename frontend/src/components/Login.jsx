// src/components/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2";
import axios from 'axios';
import { Link } from "react-router-dom";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const navigate = useNavigate();

 
  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("http://localhost:5000/api/auth/login", form);

      const { otp, user } = response.data;

      // ✅ Save user email & ID for OTP verification page
       localStorage.setItem("accessToken", response.data.accessToken);
      localStorage.setItem("userEmail", user.email);
      localStorage.setItem("userId", user.id);
      localStorage.setItem("otp", otp); 

      Swal.fire(
        "Login Successful!",
        `OTP sent to ${user.email}. OTP: ${otp}`, // ✅ Show OTP for testing
        "success"
      );

      setTimeout(() => navigate("/otp-verify"), 1500);
    } catch (error) {
      Swal.fire(
        "Login Failed!",
        error.response?.data?.message || "Something went wrong.",
        "error"
      );
    }
  };

  return (
    <div className="container mt-5 ">
  <h2 style={{ color: '#ff6347', textAlign: 'center' }}>Login</h2>  


      <form className="w-50 mx-auto" onSubmit={handleLogin}>
        <input
          type="email"
          className="form-control mb-3"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        />
        <input
          type="password"
          className="form-control mb-3"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
           autoComplete="current-password"  
        />
        <button className="btn btn-success w-100" type="submit">
          Login
        </button>
        <p>Don't have an account? <Link to="/signup">Sign Up</Link></p>
      </form>
    </div>
  );
};

export default Login;
