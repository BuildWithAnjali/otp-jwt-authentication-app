// src/components/OtpVerify.jsx
import React, { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";
import axios from 'axios';




const OtpVerify = () => {
  const [otp, setOtp] = useState("");
  const navigate = useNavigate();

  // Handle OTP verification
const handleVerify = async (e) => {
  e.preventDefault();

  if (!otp || otp.length !== 6) {
    Swal.fire("Invalid OTP", "OTP must be 6 digits.", "error");
    return;
  }

  const email = localStorage.getItem("userEmail"); // Make sure this was saved earlier
  if (!email) {
    Swal.fire("Error", "Email not found. Please go back and try again.", "error");
    return;
  }

  try {
    const response = await axios.post("http://localhost:5000/api/auth/verify-otp", {
      email,
      otp,
    });

    localStorage.setItem("rememberToken", response.data.rememberToken);

    Swal.fire("OTP Verified!", "Welcome!", "success");
    setTimeout(() => navigate("/home"), 1500);
  } catch (error) {
    Swal.fire("Invalid OTP", error.response?.data?.message || "Please try again.", "error");
  }
};


  return (
    <div className="container mt-5">
     <h2 style={{ color: '#ff6347', textAlign: 'center' }}>Otp Verifiction</h2> 

      <form className="w-50 mx-auto" onSubmit={handleVerify}>
        <input
          type="text"
          className="form-control mb-3 text-center"
          placeholder="Enter 6-digit OTP"
          maxLength={6}
          value={otp}
          onChange={(e) => setOtp(e.target.value)}
          required
        />
        <button className="btn btn-warning w-100" type="submit">
          Verify OTP
        </button>
      </form>
    </div>
  );
};

export default OtpVerify;
