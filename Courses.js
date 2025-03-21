import React from "react";
import { Link } from "react-router-dom";

function Courses() {
  // Sample course data (replace with API fetch later)
  const courses = [
    { id: 1, name: "Introduction to Programming", progress: 75, instructor: "Dr. Smith" },
    { id: 2, name: "Web Development Basics", progress: 50, instructor: "Prof. Johnson" },
    { id: 3, name: "Data Structures", progress: 20, instructor: "Ms. Lee" },
    { id: 4, name: "Big Data", progress: 25, instructor: "Ms. Lalli" },
    { id: 5, name: "Natural Language Processing", progress: 30, instructor: "Mr. Rajeshar" },
  ];

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        minHeight: "100vh",
        background: "linear-gradient(135deg, #a1c4fd 0%, #c2e9fb 100%)", // Light blue gradient for a learning theme
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
      }}
    >
      {/* Floating Elements (Books/Notebooks/Pencils) */}
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
          background: "url('https://img.icons8.com/ios-filled/50/000000/notebook.png') no-repeat center",
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
          background: "url('https://img.icons8.com/ios-filled/50/000000/pencil.png') no-repeat center",
          backgroundSize: "contain",
          animation: "float 7s ease-in-out infinite",
        }}
      />

      {/* Illustration */}
      <img
        src="/assets/courses-illustration.png" // Reference the image from the public folder
        alt="Education illustration"
        style={{
          width: "300px",
          maxWidth: "100%",
          margin: "20px 0",
          animation: "fadeIn 1s ease-in-out",
        }}
        onError={(e) => {
          e.target.src = "https://img.freepik.com/free-vector/education-concept-illustration_12345678.htm";
          console.error("Failed to load courses illustration, using fallback image.");
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
          Your Courses
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
          {courses.length > 0 ? (
            <ul
              style={{
                listStyleType: "none",
                padding: 0,
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                maxWidth: "600px", // Center the list and limit its width
              }}
            >
              {courses.map((course) => (
                <li
                  key={course.id}
                  style={{
                    padding: "15px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    backgroundColor: "#fafafa",
                    textAlign: "left",
                    transition: "transform 0.2s ease, box-shadow 0.3s ease",
                    animation: "fadeIn 1s ease-in-out",
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
                  <strong style={{ fontSize: "1.2rem", color: "#007BFF" }}>{course.name}</strong>
                  <p style={{ margin: "5px 0", color: "#555" }}>
                    Progress: {course.progress}% <br />
                    Instructor: {course.instructor}
                  </p>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ color: "#555" }}>No courses available.</p>
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
            transition: "background-color 0.3s ease",
            backgroundColor: "#fff",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = "#e6f0ff")}
          onMouseLeave={(e) => (e.target.style.backgroundColor = "#fff")}
        >
          Back to Dashboard
        </Link>
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

export default Courses;