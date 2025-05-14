// src/components/LogoutButton.jsx

// import { useNavigate } from "react-router-dom";
import axios from "axios";
import Swal from "sweetalert2";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    const accessToken = localStorage.getItem("accessToken");

    try {
      await axios.post("http://localhost:5000/api/auth/logout", {}, {
        headers: {
          Authorization: `Bearer ${accessToken}`
        }
      });

      // Clear tokens from localStorage
      localStorage.removeItem("accessToken");
      localStorage.removeItem("rememberToken");


Swal.fire("succesfully logged out!", "Welcome!", "success");
    setTimeout(() => navigate("/login"), 1500);
     
    } catch (error) {
      console.error("Logout failed", error);
      Swal.fire("some error occured", "try again.", "error");
    }
  };

  return (
    <button onClick={handleLogout} style={{ padding: '10px 20px', marginTop: '20px' }}>
      Logout
    </button>
  );
};

export default LogoutButton;
