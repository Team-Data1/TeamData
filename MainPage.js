import React from "react";
import { Link } from "react-router-dom";

function MainPage() {
  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.href = "/login";
  };

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      {/* Floating Elements (Books/Leaves) */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "40px",
          height: "40px",
          background: "url('https://img.icons8.com/ios-filled/50/000000/book.png') no-repeat center",
          backgroundSize: "contain",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "60%",
          right: "10%",
          width: "30px",
          height: "30px",
          background: "url('https://img.icons8.com/ios-filled/50/000000/leaf.png') no-repeat center",
          backgroundSize: "contain",
          animation: "float 8s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "15%",
          width: "35px",
          height: "35px",
          background: "url('https://img.icons8.com/ios-filled/50/000000/book.png') no-repeat center",
          backgroundSize: "contain",
          animation: "float 7s ease-in-out infinite",
        }}
      />

      {/* Illustration */}
      <img
        src="/assets/student-illustration.png" // Reference the image from the public folder
        alt="Student working at desk"
        style={{
          width: "300px",
          maxWidth: "100%",
          margin: "20px 0",
          animation: "fadeIn 1s ease-in-out",
        }}
        onError={(e) => {
          e.target.src = "https://img.freepik.com/free-vector/online-learning-concept_52683-37481.jpg";
          console.error("Failed to load student illustration, using fallback image.");
        }}
      />

      {/* Main Content */}
      <div
        style={{
          maxWidth: "800px",
          textAlign: "center",
          animation: "fadeIn 1s ease-in-out",
        }}
      >
        <h1
          style={{
            color: "#333",
            fontSize: "2.5rem",
            marginBottom: "30px",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
          }}
        >
          Welcome to the Student Portal
        </h1>
        <nav
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
        >
          <ul
            style={{
              listStyleType: "none",
              padding: 0,
              margin: 0,
              display: "flex",
              flexDirection: "column",
              gap: "15px",
            }}
          >
            <li>
              <Link
                to="/dashboard"
                style={{
                  textDecoration: "none",
                  color: "#007BFF",
                  fontSize: "1.2rem",
                  padding: "10px 20px",
                  display: "block",
                  borderRadius: "5px",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#e6f0ff")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                Dashboard
              </Link>
            </li>
            <li>
              <Link
                to="/bookexchange"
                style={{
                  textDecoration: "none",
                  color: "#007BFF",
                  fontSize: "1.2rem",
                  padding: "10px 20px",
                  display: "block",
                  borderRadius: "5px",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#e6f0ff")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                Book Exchange
              </Link>
            </li>
            <li>
              <Link
                to="/courses"
                style={{
                  textDecoration: "none",
                  color: "#007BFF",
                  fontSize: "1.2rem",
                  padding: "10px 20px",
                  display: "block",
                  borderRadius: "5px",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#e6f0ff")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                Courses
              </Link>
            </li>
            <li>
              <Link
                to="/exams"
                style={{
                  textDecoration: "none",
                  color: "#007BFF",
                  fontSize: "1.2rem",
                  padding: "10px 20px",
                  display: "block",
                  borderRadius: "5px",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#e6f0ff")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                Exams & Results
              </Link>
            </li>
            <li>
              <Link
                to="/exampreparationassistant"
                style={{
                  textDecoration: "none",
                  color: "#007BFF",
                  fontSize: "1.2rem",
                  padding: "10px 20px",
                  display: "block",
                  borderRadius: "5px",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#e6f0ff")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                Exam Preparation Assistant
              </Link>
            </li>
            <li>
              <Link
                to="/interview-prep"
                style={{
                  textDecoration: "none",
                  color: "#007BFF",
                  fontSize: "1.2rem",
                  padding: "10px 20px",
                  display: "block",
                  borderRadius: "5px",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#e6f0ff")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                Interview Preparation
              </Link>
            </li>
            <li>
              <Link
                to="/attendance"
                style={{
                  textDecoration: "none",
                  color: "#007BFF",
                  fontSize: "1.2rem",
                  padding: "10px 20px",
                  display: "block",
                  borderRadius: "5px",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#e6f0ff")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                Attendance
              </Link>
            </li>
            <li>
              <Link
                to="/profile"
                style={{
                  textDecoration: "none",
                  color: "#007BFF",
                  fontSize: "1.2rem",
                  padding: "10px 20px",
                  display: "block",
                  borderRadius: "5px",
                  transition: "background-color 0.3s ease",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#e6f0ff")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                Profile
              </Link>
            </li>
            <li>
              <button
                onClick={handleLogout}
                style={{
                  textDecoration: "none",
                  color: "#e74c3c",
                  fontSize: "1.2rem",
                  padding: "10px 20px",
                  display: "block",
                  borderRadius: "5px",
                  transition: "background-color 0.3s ease",
                  border: "none",
                  background: "none",
                  cursor: "pointer",
                  width: "100%",
                  textAlign: "center",
                }}
                onMouseEnter={(e) => (e.target.style.backgroundColor = "#ffe6e6")}
                onMouseLeave={(e) => (e.target.style.backgroundColor = "transparent")}
              >
                Logout
              </button>
            </li>
          </ul>
        </nav>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes float {
            0% {
              transform: translateY(0px);
            }
            50% {
              transform: translateY(-20px);
            }
            100% {
              transform: translateY(0px);
            }
          }

          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(20px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }
        `}
      </style>
    </div>
  );
}

export default MainPage;