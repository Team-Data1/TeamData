import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function InterviewPrep() {
  const [tips, setTips] = useState([]);
  const [newTip, setNewTip] = useState("");
  const [commonQuestions, setCommonQuestions] = useState([]);
  const [mockInterviews, setMockInterviews] = useState([]);
  const [newInterview, setNewInterview] = useState({
    mentor: "",
    date: "",
    time: "",
  });
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!token) {
        setError("Please log in to access interview preparation.");
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
          }
          throw new Error(`Failed to fetch student data: ${response.statusText} (${response.status})`);
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

    const fetchTips = async () => {
      try {
        const response = await fetch("http://localhost:5001/interview-tips");
        if (!response.ok) {
          throw new Error(`Failed to fetch tips: ${response.statusText} (${response.status})`);
        }

        const data = await response.json();
        setTips(data);
      } catch (error) {
        console.error("Error fetching tips:", error);
        setError(error.message);
      }
    };

    const fetchCommonQuestions = async () => {
      try {
        const response = await fetch("http://localhost:5001/common-questions");
        if (!response.ok) {
          throw new Error(`Failed to fetch common questions: ${response.statusText} (${response.status})`);
        }

        const data = await response.json();
        setCommonQuestions(data);
      } catch (error) {
        console.error("Error fetching common questions:", error);
        setError(error.message);
      }
    };

    const fetchMockInterviews = async () => {
      if (!token) return;

      try {
        const response = await fetch("http://localhost:5001/mock-interviews", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch mock interviews: ${response.statusText} (${response.status})`);
        }

        const data = await response.json();
        setMockInterviews(data);
      } catch (error) {
        console.error("Error fetching mock interviews:", error);
        setError(error.message);
      }
    };

    fetchStudentData();
    fetchTips();
    fetchCommonQuestions();
    fetchMockInterviews();
  }, [token, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleTipSubmit = async (e) => {
    e.preventDefault();
    if (!newTip) {
      alert("Please enter a tip.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/interview-tips", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ tip: newTip }),
      });

      if (!response.ok) {
        throw new Error(`Failed to post tip: ${response.statusText} (${response.status})`);
      }

      const data = await response.json();
      setTips([...tips, data]);
      setNewTip("");
      setError(null);
    } catch (error) {
      console.error("Error posting tip:", error);
      setError(error.message);
    }
  };

  const handleInterviewSubmit = async (e) => {
    e.preventDefault();
    if (!newInterview.mentor || !newInterview.date || !newInterview.time) {
      alert("Please fill in all fields.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5001/mock-interviews", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newInterview),
      });

      if (!response.ok) {
        throw new Error(`Failed to schedule interview: ${response.statusText} (${response.status})`);
      }

      const data = await response.json();
      setMockInterviews([...mockInterviews, data]);
      setNewInterview({ mentor: "", date: "", time: "" });
      setError(null);
      alert("Mock interview scheduled successfully!");
    } catch (error) {
      console.error("Error scheduling interview:", error);
      setError(error.message);
    }
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
          background: "linear-gradient(135deg, #a3bffa 0%, #ffffff 100%)", // Gradient for error state
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
          background: "linear-gradient(135deg, #a3bffa 0%, #ffffff 100%)", // Gradient for loading state
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
        background: "linear-gradient(135deg, #a3bffa 0%, #ffffff 100%)", // Soft blue to white gradient
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating Elements (Microphones, Resumes, Briefcases, Clocks) */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "40px",
          height: "40px",
          background: "url('https://img.icons8.com/ios-filled/50/000000/microphone.png') no-repeat center",
          backgroundSize: "contain",
          animation: "float 5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "50%",
          right: "10%",
          width: "30px",
          height: "30px",
          background: "url('https://img.icons8.com/ios-filled/50/000000/resume.png') no-repeat center",
          backgroundSize: "contain",
          animation: "float 6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "15%",
          width: "35px",
          height: "35px",
          background: "url('https://img.icons8.com/ios-filled/50/000000/briefcase.png') no-repeat center",
          backgroundSize: "contain",
          animation: "float 5.5s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: "20%",
          width: "35px",
          height: "35px",
          background: "url('https://img.icons8.com/ios-filled/50/000000/clock.png') no-repeat center",
          backgroundSize: "contain",
          animation: "float 4.5s ease-in-out infinite",
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
          backgroundColor: "transparent", // Transparent to show the gradient background
        }}
      >
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
          src="/assets/interview-prep-illustration.png" // Reference the image from the public folder
          alt="Interview preparation illustration"
          style={{
            width: "300px",
            maxWidth: "100%",
            margin: "0 auto 20px",
            display: "block",
            animation: "fadeIn 1s ease-out",
          }}
          onError={(e) => {
            e.target.src = "https://img.freepik.com/free-vector/job-interview-concept-illustration_12345682.htm";
            console.error("Failed to load interview prep illustration, using fallback image.");
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
            animation: "fadeIn 1s ease-out",
          }}
        >
          Interview Preparation
        </h1>

        {/* Interview Tips Section */}
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            marginBottom: "30px",
            maxWidth: "800px",
            margin: "0 auto",
            animation: "fadeIn 1s ease-out",
          }}
        >
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Interview Tips
          </h2>
          {tips.length > 0 ? (
            <ul
              style={{
                listStyleType: "none",
                padding: 0,
                margin: 0,
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                textAlign: "left",
              }}
            >
              {tips.map((tip, index) => (
                <li
                  key={tip._id}
                  style={{
                    padding: "10px",
                    backgroundColor: "#fafafa",
                    borderRadius: "5px",
                    color: "#555",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    animation: `fadeIn 1s ease-out ${index * 0.1}s both`,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.02)";
                    e.target.style.boxShadow = "0 0 10px rgba(163, 191, 250, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  {tip.tip} <br />
                  <span style={{ fontSize: "0.9rem", color: "#777" }}>
                    Posted by: {tip.userName} on{" "}
                    {new Date(tip.createdAt).toLocaleDateString()}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ textAlign: "center", color: "#777", animation: "fadeIn 1s ease-out" }}>
              No tips available. Be the first to add one!
            </p>
          )}

          {/* Add New Tip Form */}
          <form onSubmit={handleTipSubmit} style={{ marginTop: "20px" }}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              <label
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#555",
                }}
              >
                Share Your Interview Tip:
              </label>
              <textarea
                value={newTip}
                onChange={(e) => setNewTip(e.target.value)}
                placeholder="Enter your tip here..."
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  fontSize: "1rem",
                  minHeight: "80px",
                  resize: "vertical",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#a3bffa";
                  e.target.style.boxShadow = "0 0 5px rgba(163, 191, 250, 0.5)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#ccc";
                  e.target.style.boxShadow = "none";
                }}
              />
              <button
                type="submit"
                style={{
                  padding: "10px",
                  backgroundColor: "#a3bffa",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  transition: "background-color 0.3s ease, transform 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#8aa4f8";
                  e.target.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#a3bffa";
                  e.target.style.transform = "scale(1)";
                }}
              >
                Submit Tip
              </button>
            </div>
          </form>
        </div>

        {/* Common Questions Section */}
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            marginBottom: "30px",
            maxWidth: "800px",
            margin: "0 auto",
            animation: "fadeIn 1s ease-out",
          }}
        >
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Common Interview Questions
          </h2>
          {commonQuestions.length > 0 ? (
            <ul
              style={{
                listStyleType: "none",
                padding: 0,
                margin: "0 auto",
                display: "flex",
                flexDirection: "column",
                gap: "10px",
                textAlign: "left",
                maxWidth: "600px",
              }}
            >
              {commonQuestions.map((question, index) => (
                <li
                  key={question._id}
                  style={{
                    padding: "10px",
                    backgroundColor: "#fafafa",
                    borderRadius: "5px",
                    color: "#555",
                    transition: "transform 0.3s ease, box-shadow 0.3s ease",
                    animation: `fadeIn 1s ease-out ${index * 0.1}s both`,
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = "scale(1.02)";
                    e.target.style.boxShadow = "0 0 10px rgba(163, 191, 250, 0.5)";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = "scale(1)";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  {question.question}
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ textAlign: "center", color: "#777", animation: "fadeIn 1s ease-out" }}>
              No common questions available.
            </p>
          )}
        </div>

        {/* Schedule a Mock Interview Section */}
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            marginBottom: "30px",
            maxWidth: "800px",
            margin: "0 auto",
            animation: "fadeIn 1s ease-out",
          }}
        >
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Schedule a Mock Interview
          </h2>
          <form onSubmit={handleInterviewSubmit}>
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: "15px",
                maxWidth: "500px",
                margin: "0 auto",
              }}
            >
              <div>
                <label
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#555",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Select Mentor:
                </label>
                <select
                  value={newInterview.mentor}
                  onChange={(e) =>
                    setNewInterview({ ...newInterview, mentor: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "1rem",
                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#a3bffa";
                    e.target.style.boxShadow = "0 0 5px rgba(163, 191, 250, 0.5)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#ccc";
                    e.target.style.boxShadow = "none";
                  }}
                >
                  <option value="">Select a mentor</option>
                  <option value="John Doe">John Doe</option>
                  <option value="Jane Smith">Jane Smith</option>
                  <option value="Alex Brown">Alex Brown</option>
                </select>
              </div>
              <div>
                <label
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#555", // Fixed: Added closing quote
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Date:
                </label>
                <input
                  type="date"
                  value={newInterview.date}
                  onChange={(e) =>
                    setNewInterview({ ...newInterview, date: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "1rem",
                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#a3bffa";
                    e.target.style.boxShadow = "0 0 5px rgba(163, 191, 250, 0.5)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#ccc";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <div>
                <label
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#555",
                    display: "block",
                    marginBottom: "5px",
                  }}
                >
                  Time:
                </label>
                <input
                  type="time"
                  value={newInterview.time}
                  onChange={(e) =>
                    setNewInterview({ ...newInterview, time: e.target.value })
                  }
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "1rem",
                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#a3bffa";
                    e.target.style.boxShadow = "0 0 5px rgba(163, 191, 250, 0.5)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#ccc";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
              <button
                type="submit"
                style={{
                  padding: "10px",
                  backgroundColor: "#a3bffa",
                  color: "white",
                  border: "none",
                  borderRadius: "5px",
                  cursor: "pointer",
                  fontSize: "1.1rem",
                  transition: "background-color 0.3s ease, transform 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.backgroundColor = "#8aa4f8";
                  e.target.style.transform = "scale(1.02)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.backgroundColor = "#a3bffa";
                  e.target.style.transform = "scale(1)";
                }}
              >
                Schedule Now
              </button>
            </div>
          </form>

          {/* Display Scheduled Mock Interviews */}
          {mockInterviews.length > 0 && (
            <div style={{ marginTop: "20px" }}>
              <h3
                style={{
                  fontSize: "1.5rem",
                  fontWeight: "bold",
                  color: "#333",
                  marginBottom: "15px",
                  textAlign: "center",
                }}
              >
                Your Scheduled Mock Interviews
              </h3>
              <ul
                style={{
                  listStyleType: "none",
                  padding: 0,
                  margin: "0 auto",
                  display: "flex",
                  flexDirection: "column",
                  gap: "10px",
                  textAlign: "left",
                  maxWidth: "600px",
                }}
              >
                {mockInterviews.map((interview, index) => (
                  <li
                    key={interview._id}
                    style={{
                      padding: "10px",
                      backgroundColor: "#fafafa",
                      borderRadius: "5px",
                      color: "#555",
                      transition: "transform 0.3s ease, box-shadow 0.3s ease",
                      animation: `fadeIn 1s ease-out ${index * 0.1}s both`,
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = "scale(1.02)";
                      e.target.style.boxShadow = "0 0 10px rgba(163, 191, 250, 0.5)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = "scale(1)";
                      e.target.style.boxShadow = "none";
                    }}
                  >
                    Mentor: {interview.mentor} <br />
                    Date: {new Date(interview.date).toLocaleDateString()} <br />
                    Time: {interview.time}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Recommended Resources Section */}
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            marginBottom: "30px",
            maxWidth: "800px",
            margin: "0 auto",
            animation: "fadeIn 1s ease-out",
          }}
        >
          <h2
            style={{
              fontSize: "1.8rem",
              fontWeight: "bold",
              color: "#333",
              marginBottom: "20px",
              textAlign: "center",
            }}
          >
            Recommended Resources
          </h2>
          <ul
            style={{
              listStyleType: "none",
              padding: 0,
              margin: "0 auto",
              display: "flex",
              flexDirection: "column",
              gap: "10px",
              textAlign: "left",
              maxWidth: "600px",
            }}
          >
            {[
              {
                title: "How to Ace Your Interview",
                url: "https://ung.edu/career-services/online-career-resources/interview-well/tips-for-a-successful-interview.php",
              },
              {
                title: "Top 50 Interview Questions",
                url: "https://www.geeksforgeeks.org/common-interview-questions-and-answers/",
              },
              {
                title: "Mock Interview Practice Video",
                url: "https://www.youtube.com/playlist?list=PL-oyHJILmuGn4WQMJc3YP_m6ftnpNZx2q",
              },
            ].map((resource, index) => (
              <li
                key={index}
                style={{
                  padding: "10px",
                  backgroundColor: "#fafafa",
                  borderRadius: "5px",
                  color: "#555",
                  transition: "transform 0.3s ease, box-shadow 0.3s ease",
                  animation: `fadeIn 1s ease-out ${index * 0.1}s both`,
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "scale(1.02)";
                  e.target.style.boxShadow = "0 0 10px rgba(163, 191, 250, 0.5)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "scale(1)";
                  e.target.style.boxShadow = "none";
                }}
              >
                <a
                  href={resource.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{
                    color: "#007BFF",
                    textDecoration: "none",
                  }}
                >
                  {resource.title}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <Link
          to="/dashboard"
          style={{
            textDecoration: "none",
            color: "#007BFF",
            fontSize: "1.2rem",
            padding: "10px 20px",
            display: "block",
            textAlign: "center",
            borderRadius: "5px",
            transition: "background-color 0.3s ease, transform 0.3s ease",
            backgroundColor: "#fff",
            boxShadow: "0 2px 5px rgba(0, 0, 0, 0.1)",
            maxWidth: "200px",
            margin: "0 auto",
            animation: "fadeIn 1s ease-out",
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
          @keyframes float {
            0% {
              transform: translateY(0);
            }
            50% {
              transform: translateY(-15px);
            }
            100% {
              transform: translateY(0);
            }
          }

          @keyframes fadeIn {
            0% {
              opacity: 0;
              transform: translateY(10px);
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

export default InterviewPrep;