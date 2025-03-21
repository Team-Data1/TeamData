import React from "react";
import { Link } from "react-router-dom";

function Exams() {
  // Sample exam and result data (replace with API fetch later)
  const upcomingExams = [
    { id: 1, subject: "Programming Basics", date: "2025-04-01", time: "10:00 AM" },
    { id: 2, subject: "Web Development", date: "2025-04-05", time: "2:00 PM" },
    { id: 3, subject: "Big Data", date: "2025-04-07", time: "2:00 PM" },
    { id: 4, subject: "Natural Language Processing", date: "2025-04-09", time: "2:00 PM" },
  ];
  const pastResults = [
    { id: 1, subject: "Mathematics", date: "2025-03-10", score: 85 },
    { id: 2, subject: "Database Systems", date: "2025-03-15", score: 92 },
  ];

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", // Warm orange to yellow gradient
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      {/* Wave Background Animation */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          background: "url('https://www.transparenttextures.com/patterns/white-wave.png') repeat",
          opacity: 0.1,
          animation: "wave 15s linear infinite",
          zIndex: 0,
        }}
      />

      {/* Illustration */}
      <img
        src="/assets/exams-illustration.png" // Reference the image from the public folder
        alt="Exam illustration"
        style={{
          width: "300px",
          maxWidth: "100%",
          margin: "20px 0",
          animation: "popIn 0.8s ease-out",
          zIndex: 1,
        }}
        onError={(e) => {
          e.target.src = "https://img.freepik.com/free-vector/exam-preparation-concept-illustration_12345679.htm";
          console.error("Failed to load exams illustration, using fallback image.");
        }}
      />

      {/* Main Content */}
      <div
        style={{
          maxWidth: "800px",
          textAlign: "center",
          zIndex: 1,
        }}
      >
        <h1
          style={{
            color: "#333",
            fontSize: "2.5rem",
            marginBottom: "30px",
            textShadow: "1px 1px 2px rgba(0, 0, 0, 0.1)",
            animation: "popIn 0.8s ease-out",
          }}
        >
          Exams & Results
        </h1>

        {/* Upcoming Exams Section */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              color: "#ff6f61",
              fontSize: "1.8rem",
              marginBottom: "15px",
              animation: "popIn 0.8s ease-out",
            }}
          >
            Upcoming Exams
          </h2>
          {upcomingExams.length > 0 ? (
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
              {upcomingExams.map((exam, index) => (
                <li
                  key={exam.id}
                  style={{
                    padding: "15px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    backgroundColor: "#fafafa",
                    textAlign: "left",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    animation: `popIn 0.8s ease-out ${index * 0.1}s both`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 0 15px rgba(255, 111, 97, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <strong style={{ fontSize: "1.2rem", color: "#333" }}>{exam.subject}</strong>
                  <p style={{ margin: "5px 0", color: "#555" }}>
                    Date: {exam.date} <br />
                    Time: {exam.time}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#555", animation: "popIn 0.8s ease-out" }}>
              No upcoming exams.
            </p>
          )}
        </div>

        {/* Past Results Section */}
        <div
          style={{
            backgroundColor: "#fff",
            padding: "20px",
            borderRadius: "8px",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            marginBottom: "20px",
          }}
        >
          <h2
            style={{
              color: "#ff6f61",
              fontSize: "1.8rem",
              marginBottom: "15px",
              animation: "popIn 0.8s ease-out",
            }}
          >
            Past Results
          </h2>
          {pastResults.length > 0 ? (
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
              {pastResults.map((result, index) => (
                <li
                  key={result.id}
                  style={{
                    padding: "15px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    backgroundColor: "#fafafa",
                    textAlign: "left",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    animation: `popIn 0.8s ease-out ${(upcomingExams.length + index) * 0.1}s both`,
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "scale(1.02)";
                    e.currentTarget.style.boxShadow = "0 0 15px rgba(255, 111, 97, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "scale(1)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                >
                  <strong style={{ fontSize: "1.2rem", color: "#333" }}>{result.subject}</strong>
                  <p style={{ margin: "5px 0", color: "#555" }}>
                    Date: {result.date} <br />
                    Score: {result.score}%
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#555", animation: "popIn 0.8s ease-out" }}>
              No past results available.
            </p>
          )}
        </div>

        <Link
          to="/dashboard"
          style={{
            textDecoration: "none",
            color: "#ff6f61",
            fontSize: "1.2rem",
            padding: "10px 20px",
            display: "inline-block",
            borderRadius: "5px",
            transition: "background-color 0.3s ease, transform 0.3s ease",
            backgroundColor: "#fff",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            animation: "popIn 0.8s ease-out",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = "#ffe6e6";
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
          @keyframes wave {
            0% {
              background-position: 0 0;
            }
            100% {
              background-position: 1000px 0;
            }
          }

          @keyframes popIn {
            0% {
              opacity: 0;
              transform: scale(0.8);
            }
            80% {
              transform: scale(1.05);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}

export default Exams;