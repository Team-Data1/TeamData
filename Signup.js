import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Signup({ setToken }) {
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post('http://localhost:5001/signup', formData);
      alert('User registered successfully');
      navigate('/login');
    } catch (err) {
      console.error("Signup error:", err);
      console.error("Error response:", err.response);
      let errorMessage = err.response?.data?.error || err.message || "An error occurred during signup.";
      if (err.response?.status === 404) {
        errorMessage = "Signup endpoint not found. Please ensure the backend server is running.";
      }
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const signupStyles = {
    background: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "linear-gradient(120deg, #f9e2af 0%, #f5f7fa 100%)", // Warm gradient
      position: "relative",
      overflow: "hidden",
    },
    particleOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "transparent",
      zIndex: 1,
      pointerEvents: "none", // Allows clicks to pass through
    },
    container: {
      maxWidth: "400px",
      width: "100%",
      padding: "30px",
      background: "#ffffff",
      borderRadius: "12px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      animation: "floatIn 1s ease-out",
      zIndex: 2,
    },
    heading: {
      textAlign: "center",
      color: "#854d0e", // Warm brown to match gradient
      marginBottom: "25px",
      animation: "fadeIn 1s ease-out",
      fontFamily: "'Roboto', sans-serif",
      fontWeight: 500,
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "15px",
    },
    input: {
      width: "100%",
      padding: "12px",
      border: "1px solid #fef3c7", // Light yellow border
      borderRadius: "8px",
      background: "#fff7ed", // Very light warm background
      color: "#854d0e",
      fontSize: "16px",
      boxSizing: "border-box",
      animation: "slideIn 0.6s ease-out",
      animationDelay: "0.2s",
      animationFillMode: "forwards",
      opacity: 0,
      transition: "border-color 0.3s ease, box-shadow 0.3s ease",
    },
    button: {
      padding: "12px",
      background: "#d97706", // Warm amber button
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      cursor: "pointer",
      animation: "bounceIn 0.7s ease-out",
      animationDelay: "0.4s",
      animationFillMode: "forwards",
      opacity: 1,
      transition: "background-color 0.3s ease, transform 0.3s ease",
      width: "100%",
      marginTop: "10px",
      textAlign: "center",
      textTransform: "uppercase",
      fontWeight: "500",
    },
    error: {
      color: "#dc2626", // Red for errors
      textAlign: "center",
      marginBottom: "15px",
      animation: "shake 0.5s ease-in-out",
    },
  };

  return (
    <div style={signupStyles.background}>
      <style>
        {`
          @keyframes floatIn {
            from {
              opacity: 0;
              transform: translateY(20px);
            }
            to {
              opacity: 1;
              transform: translateY(0);
            }
          }

          @keyframes fadeIn {
            from {
              opacity: 0;
            }
            to {
              opacity: 1;
            }
          }

          @keyframes slideIn {
            from {
              opacity: 0;
              transform: translateX(-20px);
            }
            to {
              opacity: 1;
              transform: translateX(0);
            }
          }

          @keyframes bounceIn {
            0% {
              opacity: 0;
              transform: scale(0.3);
            }
            50% {
              opacity: 1;
              transform: scale(1.05);
            }
            100% {
              transform: scale(1);
              opacity: 1;
            }
          }

          @keyframes shake {
            0%, 100% {
              transform: translateX(0);
            }
            25% {
              transform: translateX(-5px);
            }
            50% {
              transform: translateX(5px);
            }
            75% {
              transform: translateX(-5px);
            }
          }

          @keyframes floatParticle {
            0% {
              transform: translate(0, 0);
              opacity: 0.7;
            }
            50% {
              transform: translate(${Math.random() * 50 - 25}px, ${Math.random() * 50 - 25}px);
              opacity: 0.3;
            }
            100% {
              transform: translate(0, -100px);
              opacity: 0;
            }
          }

          .particle {
            position: absolute;
            width: 6px;
            height: 6px;
            background: rgba(255, 255, 255, 0.8);
            border-radius: 50%;
            animation: floatParticle 6s infinite ease-in-out;
          }

          input::placeholder {
            color: #d4a373; // Warm placeholder color
          }

          input:focus {
            outline: none;
            border-color: #d97706; // Amber on focus
            box-shadow: 0 0 8px rgba(217, 119, 6, 0.3);
          }

          button:hover {
            background-color: #854d0e; // Darker brown on hover
            transform: scale(1.02);
          }
        `}
      </style>

      {/* Particle Overlay */}
      <div style={signupStyles.particleOverlay}>
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="particle"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      <div style={signupStyles.container}>
        <h2 style={signupStyles.heading}>Signup</h2>
        {error && <p style={signupStyles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={signupStyles.form}>
          <div>
            <input
              name="username"
              onChange={handleChange}
              placeholder="Username"
              style={signupStyles.input}
              required
            />
          </div>
          <div>
            <input
              name="email"
              onChange={handleChange}
              placeholder="Email"
              type="email"
              style={signupStyles.input}
              required
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              placeholder="Password"
              style={signupStyles.input}
              required
            />
          </div>
          <button type="submit" style={signupStyles.button}>
            Signup
          </button>
        </form>
      </div>
    </div>
  );
}

export default Signup;