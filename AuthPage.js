import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

function AuthPage({ setToken, isSignup }) {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: "", email: "", password: "" });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = `http://localhost:5001/${isSignup ? "signup" : "login"}`;

    try {
      const response = await axios.post(url, formData);
      if (!isSignup) {
        localStorage.setItem("token", response.data.token);
        setToken(response.data.token);
        navigate("/main");
      } else {
        alert(response.data.message);
        navigate("/login"); // Redirect to login after signup
      }
    } catch (error) {
      alert(error.response?.data?.error || "An error occurred");
    }
  };

  return (
    <div style={{ width: "300px", margin: "auto", padding: "20px", border: "1px solid #ccc", borderRadius: "5px" }}>
      <h2>{isSignup ? "Signup" : "Login"}</h2>
      <form onSubmit={handleSubmit}>
        {isSignup && <input name="username" onChange={handleChange} placeholder="Username" required />}
        <input name="email" onChange={handleChange} placeholder="Email" required />
        <input name="password" type="password" onChange={handleChange} placeholder="Password" required />
        <button type="submit">{isSignup ? "Signup" : "Login"}</button>
      </form>
      <button onClick={() => navigate(isSignup ? "/login" : "/signup")}>
        {isSignup ? "Already have an account? Login" : "Don't have an account? Signup"}
      </button>
    </div>
  );
}

export default AuthPage;
