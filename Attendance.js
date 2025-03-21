import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";

function Attendance() {
  // Sample attendance data (replace with API fetch later)
  const attendanceData = [
    { id: 1, course: "Introduction to Programming", totalClasses: 20, attended: 18 },
    { id: 2, course: "Web Development Basics", totalClasses: 15, attended: 12 },
    { id: 3, course: "Data Structures", totalClasses: 25, attended: 20 },
  ];

  // State to control the animation of the percentage bars
  const [animateBars, setAnimateBars] = useState(false);

  useEffect(() => {
    // Trigger the bar animation after the component mounts
    setAnimateBars(true);
  }, []);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #a8e6cf 0%, #ffffff 100%)", // Soft green to white gradient
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      {/* Floating Elements (Checkmarks, Calendars, Notebooks) */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "40px",
          height: "40px",
          background: "url('https://img.icons8.com/ios-filled/50/000000/checkmark.png') no-repeat center",
          backgroundSize: "contain",
          animation: "pulse 3s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "60%",
          right: "10%",
          width: "30px",
          height: "30px",
          background: "url('https://img.icons8.com/ios-filled/50/000000/calendar.png') no-repeat center",
          backgroundSize: "contain",
          animation: "pulse 4s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "15%",
          width: "35px",
          height: "35px",
          background: "url('https://img.icons8.com/ios-filled/50/000000/notebook.png') no-repeat center",
          backgroundSize: "contain",
          animation: "pulse 3.5s ease-in-out infinite",
        }}
      />

      {/* Illustration */}
      <img
        src="/assets/attendance-illustration.png" // Reference the image from the public folder
        alt="Attendance illustration"
        style={{
          width: "300px",
          maxWidth: "100%",
          margin: "20px 0",
          animation: "slideIn 1s ease-out",
        }}
        onError={(e) => {
          e.target.src = "https://img.freepik.com/free-vector/attendance-concept-illustration_12345681.htm";
          console.error("Failed to load attendance illustration, using fallback image.");
        }}
      />

      {/* Main Content */}
      <div
        style={{
          maxWidth: "800px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            color: "#333",
            fontSize: "2.5rem",
            marginBottom: "30px",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
            animation: "slideIn 1s ease-out",
          }}
        >
          Attendance
        </h1>

        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
        >
          {attendanceData.length > 0 ? (
            <ul
              style={{
                listStyleType: "none",
                padding: 0,
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                maxWidth: "600px",
              }}
            >
              {attendanceData.map((record, index) => {
                const percentage = ((record.attended / record.totalClasses) * 100).toFixed(2);
                return (
                  <li
                    key={record.id}
                    style={{
                      padding: "15px",
                      border: "1px solid #ccc",
                      borderRadius: "5px",
                      backgroundColor: "#fafafa",
                      textAlign: "left",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      animation: `slideIn 1s ease-out ${index * 0.2}s both`,
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-5px)";
                      e.currentTarget.style.boxShadow = "0 4px 10px rgba(0,0,0,0.15)";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <strong style={{ fontSize: "1.2rem", color: "#007BFF" }}>{record.course}</strong>
                    <p style={{ margin: "5px 0", color: "#555" }}>
                      Total Classes: {record.totalClasses} <br />
                      Attended: {record.attended} <br />
                      Attendance Percentage: {percentage}%
                    </p>
                    <div
                      style={{
                        width: "100%",
                        backgroundColor: "#e0e0e0",
                        borderRadius: "5px",
                        height: "10px",
                        marginTop: "10px",
                        overflow: "hidden",
                      }}
                    >
                      <div
                        style={{
                          width: animateBars ? `${percentage}%` : "0%",
                          height: "100%",
                          backgroundColor: percentage >= 75 ? "#4CAF50" : percentage >= 50 ? "#FFC107" : "#F44336",
                          transition: "width 1.5s ease-in-out",
                        }}
                      />
                    </div>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p style={{ color: "#555", animation: "slideIn 1s ease-out" }}>
              No attendance records available.
            </p>
          )}
        </div>

        <Link
          to="/dashboard"
          style={{
            textDecoration: "none",
            color: "#007BFF",
            fontSize: "1.2rem",
            padding: "10px 20px",
            display: "inline-block",
            borderRadius: "5px",
            transition: "background-color 0.3s ease, transform 0.3s ease",
            backgroundColor: "#fff",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            animation: "slideIn 1s ease-out",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#e6f0ff";
            e.target.style.transform = "scale(1.05)";
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = "#fff";
            e.target.style.transform = "scale(1)";
          }}
        >
          Back to Dashboard
        </Link>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes pulse {
            0% {
              transform: scale(1);
              opacity: 0.7;
            }
            50% {
              transform: scale(1.2);
              opacity: 1;
            }
            100% {
              transform: scale(1);
              opacity: 0.7;
            }
          }

          @keyframes slideIn {
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

export default Attendance;