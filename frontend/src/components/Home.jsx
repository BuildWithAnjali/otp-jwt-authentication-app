// src/pages/Home.jsx

import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LogoutButton from "../components/Logout"; // ⬅️ Import it here

const Home = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (!accessToken) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await axios.get("/api/auth/me", {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        setUser(res.data);
      } catch (err) {
        console.log("Error fetching user data", err);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  return (
    <div style={{ padding: '20px' }}>
      <h1>Welcome, {user ? user.username : "User"}</h1>
      <LogoutButton /> {/* ⬅️ Use logout button here */}
    </div>
  );
};

export default Home;
