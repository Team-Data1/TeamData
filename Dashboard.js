import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function Dashboard() {
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!token) {
        setError("Please log in to access the dashboard.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:5001/student", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error("Session expired or invalid token. Please log in again.");
          } else if (response.status === 404) {
            throw new Error("Student endpoint not found. Please ensure the backend is running.");
          }
          throw new Error(`Failed to fetch student data: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setStudent(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching student data:", error);
        setError(error.message);
        if (
          error.message.includes("Session expired") ||
          error.message.includes("invalid token")
        ) {
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    fetchStudentData();
  }, [token, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  if (error) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "Arial, sans-serif",
          fontSize: "1.5rem",
          color: "#e74c3c",
          backgroundColor: "#faeec4", // Updated to light peach
        }}
      >
        <h2>{error}</h2>
      </div>
    );
  }

  if (!student) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100vh",
          fontFamily: "Arial, sans-serif",
          fontSize: "1.5rem",
          color: "#333",
          backgroundColor: "#faeec4", // Updated to light peach
        }}
      >
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: "'Arial', sans-serif",
        display: "flex",
        minHeight: "100vh",
        backgroundColor: "#faeec4", // Updated to light peach
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating Elements (Books/Pencils) */}
      <div
        style={{
          position: "absolute",
          top: "15%",
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
          top: "50%",
          right: "10%",
          width: "30px",
          height: "30px",
          background: "url('https://img.icons8.com/ios-filled/50/000000/pencil.png') no-repeat center",
          backgroundSize: "contain",
          animation: "float 8s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "10%",
          width: "35px",
          height: "35px",
          background: "url('https://img.icons8.com/ios-filled/50/000000/graduation-cap.png') no-repeat center",
          backgroundSize: "contain",
          animation: "float 7s ease-in-out infinite",
        }}
      />

      {/* Sidebar */}
      <div
        style={{
          width: isSidebarOpen ? "250px" : "0",
          height: "100vh",
          backgroundColor: "#2c3e50",
          position: "fixed",
          top: 0,
          left: 0,
          overflowX: "hidden",
          transition: "width 0.3s ease",
          padding: isSidebarOpen ? "20px" : "0",
          boxShadow: isSidebarOpen ? "2px 0 10px rgba(0,0,0,0.2)" : "none",
          zIndex: 1000,
        }}
      >
        {isSidebarOpen && (
          <>
            <h2
              style={{
                margin: "0 0 30px 0",
                color: "#ecf0f1",
                fontSize: "1.8rem",
                fontWeight: "bold",
                textAlign: "center",
                borderBottom: "1px solid #34495e",
                paddingBottom: "10px",
              }}
            >
              Menu
            </h2>
            <div
              style={{
                backgroundColor: "#34495e",
                padding: "15px",
                borderRadius: "8px",
                marginBottom: "20px",
              }}
            >
              <p
                style={{
                  color: "#ecf0f1",
                  margin: "5px 0",
                  fontSize: "1rem",
                }}
              >
                <strong>Name:</strong> {student.name}
              </p>
              <p
                style={{
                  color: "#ecf0f1",
                  margin: "5px 0",
                  fontSize: "1rem",
                }}
              >
                <strong>Student ID:</strong> {student.id}
              </p>
            </div>
            <nav>
              <ul style={{ listStyleType: "none", padding: 0 }}>
                {[
                  { to: "/courses", label: "Courses" },
                  { to: "/exams", label: "Exams & Results" },
                  { to: "/bookexchange", label: "Book Exchange" },
                  { to: "/interview-prep", label: "Interview Preparation" },
                  { to: "/attendance", label: "Attendance" },
                  { to: "/exampreparationassistant", label: "Exam Preparation Assistant" },
                  { to: "/profile", label: "Profile" },
                ].map((link) => (
                  <li
                    key={link.to}
                    style={{
                      marginBottom: "15px",
                    }}
                  >
                    <Link
                      to={link.to}
                      style={{
                        textDecoration: "none",
                        color: "#ecf0f1",
                        fontSize: "1.1rem",
                        display: "block",
                        padding: "10px 15px",
                        borderRadius: "5px",
                        transition: "background-color 0.3s ease",
                      }}
                      onMouseEnter={(e) =>
                        (e.target.style.backgroundColor = "#3498db")
                      }
                      onMouseLeave={(e) =>
                        (e.target.style.backgroundColor = "transparent")
                      }
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </>
        )}
      </div>

      {/* Main Content */}
      <div
        style={{
          marginLeft: isSidebarOpen ? "250px" : "0",
          padding: "40px 20px",
          width: "100%",
          transition: "margin-left 0.3s ease",
          backgroundColor: "transparent", // Transparent to show the background color of the parent
        }}
      >
        {/* Toggle Button (Hamburger Icon) */}
        <button
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: "20px",
            left: "20px",
            backgroundColor: "#2c3e50",
            color: "#fff",
            border: "none",
            borderRadius: "5px",
            padding: "10px 15px",
            fontSize: "1.2rem",
            cursor: "pointer",
            zIndex: 1001,
            transition: "background-color 0.3s ease",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#3498db")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#2c3e50")}
        >
          ☰
        </button>

        {/* Illustration */}
        <img
          src="/assets/dashboard-illustration.png" // Reference the image from the public folder
          alt="Student using portal"
          style={{
            width: "300px",
            maxWidth: "100%",
            margin: "0 auto 20px",
            display: "block",
            animation: "fadeIn 1s ease-in-out",
          }}
          onError={(e) => {
            e.target.src = "https://img.freepik.com/free-vector/online-learning-concept_52683-37481.jpg";
            console.error("Failed to load dashboard illustration, using fallback image.");
          }}
        />

        <h1
          style={{
            fontSize: "2.5rem",
            fontWeight: "bold",
            color: "#2c3e50",
            textAlign: "center",
            marginBottom: "40px",
            textShadow: "1px 1px 2px rgba(0,0,0,0.1)",
            animation: "fadeIn 1s ease-in-out",
          }}
        >
          Welcome, {student.name}
        </h1>

        {/* Flexbox container for the three sections */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "30px",
            marginTop: "30px",
            flexWrap: "wrap",
          }}
        >
          {/* Courses Box */}
          <Link
            to="/courses"
            style={{
              flex: 1,
              minWidth: "300px",
              maxWidth: "350px",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease, box-shadow 0.3s ease",
                cursor: "pointer",
                textAlign: "center",
                height: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "fadeIn 1s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#2c3e50",
                  margin: 0,
                }}
              >
                Your Courses
              </h2>
            </div>
          </Link>

          {/* Exams Box */}
          <Link
            to="/exams"
            style={{
              flex: 1,
              minWidth: "300px",
              maxWidth: "350px",
              textDecoration: "none",
              color: "inherit",
            }}
          >
            <div
              style={{
                backgroundColor: "#fff",
                border: "1px solid #ddd",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                transition: "transform 0.2s ease, box-shadow 0.3s ease",
                cursor: "pointer",
                textAlign: "center",
                height: "100px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                animation: "fadeIn 1s ease-in-out",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = "translateY(-5px)";
                e.currentTarget.style.boxShadow = "0 6px 15px rgba(0,0,0,0.15)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.1)";
              }}
            >
              <h2
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#2c3e50",
                  margin: 0,
                }}
              >
                Upcoming Exams
              </h2>
            </div>
          </Link>

          {/* Notifications Box */}
          
        </div>
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

export default Dashboard;