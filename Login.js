import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function Login({ setToken }) {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const response = await axios.post('http://localhost:5001/login', formData);
      const token = response.data.token;
      localStorage.setItem('token', token);
      setToken(token);
      navigate('/main');
    } catch (err) {
      console.error("Login error:", err);
      console.error("Error response:", err.response);
      let errorMessage = err.response?.data?.error || err.message || "An error occurred during login.";
      if (err.response?.status === 404) {
        errorMessage = "Login endpoint not found. Please ensure the backend server is running.";
      }
      setError(errorMessage);
      alert(errorMessage);
    }
  };

  const loginStyles = {
    background: {
      minHeight: "100vh",
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      background: "#d1d5db", // Muted gray background to match the image
      position: "relative",
      overflow: "hidden",
    },
    subtleOverlay: {
      position: "absolute",
      top: 0,
      left: 0,
      width: "100%",
      height: "100%",
      background: "radial-gradient(circle, rgba(255, 255, 255, 0.1) 0%, transparent 70%)",
      animation: "pulseOverlay 10s ease-in-out infinite",
      zIndex: 1,
    },
    container: {
      maxWidth: "400px",
      width: "100%",
      padding: "30px",
      background: "#ffffff", // White background for the card
      borderRadius: "12px",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.1)",
      animation: "floatIn 1s ease-out",
      zIndex: 2,
    },
    heading: {
      textAlign: "center",
      color: "#4b5563", // Muted gray-blue
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
      border: "1px solid #e5e7eb", // Light gray border
      borderRadius: "8px",
      background: "#f3f4f6", // Very light gray background
      color: "#4b5563", // Muted gray-blue text
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
      background: "#6b7280", // Muted gray button to match the dull theme
      color: "#ffffff",
      border: "none",
      borderRadius: "8px",
      fontSize: "16px",
      cursor: "pointer",
      animation: "bounceIn 0.7s ease-out",
      animationDelay: "0.4s",
      animationFillMode: "forwards",
      opacity: 1, // Ensure button is visible
      transition: "background-color 0.3s ease, transform 0.3s ease",
      display: "block", // Ensure the button is visible
      width: "100%", // Match the input width
      marginTop: "10px", // Add spacing between inputs and button
      textAlign: "center", // Center the text
      textTransform: "uppercase", // Match common button styling
      fontWeight: "500", // Make the text slightly bold
    },
    signupLink: {
      textAlign: "center",
      marginTop: "15px",
      color: "#6b7280", // Muted gray
      animation: "fadeIn 0.8s ease-out",
      animationDelay: "0.6s",
      animationFillMode: "forwards",
      opacity: 0,
    },
    error: {
      color: "#ef4444", // Muted red for errors
      textAlign: "center",
      marginBottom: "15px",
      animation: "shake 0.5s ease-in-out",
    },
  };

  return (
    <div style={loginStyles.background}>
      <style>
        {`
          @keyframes pulseOverlay {
            0% {
              transform: scale(1);
              opacity: 0.5;
            }
            50% {
              transform: scale(1.2);
              opacity: 0.3;
            }
            100% {
              transform: scale(1);
              opacity: 0.5;
            }
          }

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

          input::placeholder {
            color: #9ca3af; // Muted gray placeholder
          }

          input:focus {
            outline: none;
            border-color: #6b7280; // Muted gray on focus
            box-shadow: 0 0 8px rgba(107, 114, 128, 0.3);
          }

          button:hover {
            background-color: #4b5563; // Darker muted gray on hover
            transform: scale(1.02);
          }

          a {
            color: #6b7280; // Muted gray for the link
            text-decoration: none;
            font-weight: 500;
          }

          a:hover {
            text-decoration: underline;
          }
        `}
      </style>

      <div style={loginStyles.subtleOverlay}></div>
      <div style={loginStyles.container}>
        <h2 style={loginStyles.heading}>Login</h2>
        {error && <p style={loginStyles.error}>{error}</p>}
        <form onSubmit={handleSubmit} style={loginStyles.form}>
          <div>
            <input
              name="email"
              onChange={handleChange}
              placeholder="Email"
              type="email"
              style={loginStyles.input}
              required
            />
          </div>
          <div>
            <input
              name="password"
              type="password"
              onChange={handleChange}
              placeholder="Password"
              style={loginStyles.input}
              required
            />
          </div>
          <button type="submit" style={loginStyles.button}>
            Login
          </button>
        </form>
        <p style={loginStyles.signupLink}>
          Don't have an account? <a href="/signup">Signup</a>
        </p>
      </div>
    </div>
  );
}

export default Login;