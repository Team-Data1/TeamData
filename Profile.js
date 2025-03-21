import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

function Profile() {
  const [profile, setProfile] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [error, setError] = useState(null);
  const [photo, setPhoto] = useState(null); // For the new photo file
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch user profile on mount
  useEffect(() => {
    const fetchProfile = async () => {
      if (!token) {
        setError("Please log in to access your profile.");
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
            throw new Error("Profile endpoint not found. Please ensure the backend is running.");
          }
          throw new Error(`Failed to fetch profile: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setProfile({
          name: data.name,
          studentId: data.id,
          email: data.email,
          photo: data.photo,
        });
        setError(null);
      } catch (error) {
        console.error("Error fetching profile:", error);
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

    fetchProfile();
  }, [token, navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setProfile((prev) => ({ ...prev, [name]: value }));
  };

  const handlePhotoChange = (e) => {
    setPhoto(e.target.files[0]);
  };

  const handleSave = async () => {
    if (!token) {
      setError("Please log in to save your profile.");
      navigate("/login");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", profile.name);
      formData.append("email", profile.email);
      if (photo) {
        formData.append("photo", photo);
      }

      const response = await fetch("http://localhost:5001/student", {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Session expired or invalid token. Please log in again.");
        }
        throw new Error(`Failed to save profile: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setProfile({
        name: data.name,
        studentId: data.id,
        email: data.email,
        photo: data.photo,
      });
      setPhoto(null); // Clear the photo input
      setIsEditing(false);
      setError(null);
      alert("Profile saved successfully!");
    } catch (error) {
      console.error("Error saving profile:", error);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
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
          background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
          animation: "fadeIn 1s ease-out",
        }}
      >
        <h2>{error}</h2>
      </div>
    );
  }

  if (!profile) {
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
          background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
          animation: "fadeIn 1s ease-out",
        }}
      >
        <h2>Loading...</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        minHeight: '100vh',
        background: "linear-gradient(135deg, #f5f7fa, #c3cfe2)",
        position: "relative",
        overflow: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        padding: "20px",
        animation: "gradientShift 15s ease-in-out infinite, pageEnter 1.5s ease-out",
      }}
    >
      {/* Floating Elements (Profile-related icons) */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "40px",
          height: "40px",
          background: "url('https://img.icons8.com/ios-filled/50/000000/user.png') no-repeat center",
          backgroundSize: "contain",
          animation: "floatWithRotate 6s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "60%",
          right: "10%",
          width: "30px",
          height: "30px",
          background: "url('https://img.icons8.com/ios-filled/50/000000/email.png') no-repeat center",
          backgroundSize: "contain",
          animation: "floatWithRotate 8s ease-in-out infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          bottom: "20%",
          left: "15%",
          width: "35px",
          height: "35px",
          background: "url('https://img.icons8.com/ios-filled/50/000000/identification-documents.png') no-repeat center",
          backgroundSize: "contain",
          animation: "floatWithRotate 7s ease-in-out infinite",
        }}
      />

      {/* Main Content */}
      <div
        style={{
          maxWidth: '800px',
          textAlign: 'center',
          animation: "fadeInUp 1s ease-out",
        }}
      >
        <h1
          style={{
            color: '#333',
            fontSize: '2.5rem',
            marginBottom: '30px',
            textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
            animation: "textPop 1.5s ease-out",
          }}
        >
          Profile
        </h1>

        <div
          style={{
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '12px',
            boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            marginBottom: '20px',
            animation: "scaleIn 1s ease-out",
          }}
        >
          {/* Display the user's photo */}
          <div style={{ marginBottom: '20px' }}>
            <img
              src={
                profile.photo ||
                "https://via.placeholder.com/150?text=User+Photo"
              }
              alt="User Profile"
              style={{
                width: '150px',
                height: '150px',
                borderRadius: '50%',
                objectFit: 'cover',
                border: '3px solid #007BFF',
                animation: "zoomIn 1.2s ease-out",
              }}
            />
          </div>

          {isEditing ? (
            <div style={{ textAlign: 'left' }}>
              <div style={{ marginBottom: '15px', animation: "slideInFromLeft 0.8s ease-out" }}>
                <label style={{ display: 'block', color: '#555', marginBottom: '5px', fontWeight: 'bold' }}>
                  Photo:
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '1rem',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    transition: 'border-color 0.3s ease',
                  }}
                  onFocus={(e) => (e.target.style.borderColor = '#007BFF')}
                  onBlur={(e) => (e.target.style.borderColor = '#ccc')}
                />
              </div>
              <div style={{ marginBottom: '15px', animation: "slideInFromLeft 0.8s ease-out 0.2s both" }}>
                <label style={{ display: 'block', color: '#555', marginBottom: '5px', fontWeight: 'bold' }}>
                  Name:
                </label>
                <input
                  type="text"
                  name="name"
                  value={profile.name}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#007BFF';
                    e.target.style.boxShadow = '0 0 5px rgba(0, 123, 255, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ccc';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px', animation: "slideInFromLeft 0.8s ease-out 0.4s both" }}>
                <label style={{ display: 'block', color: '#555', marginBottom: '5px', fontWeight: 'bold' }}>
                  Student ID:
                </label>
                <input
                  type="text"
                  name="studentId"
                  value={profile.studentId}
                  disabled
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    fontSize: '1rem',
                    backgroundColor: '#f0f0f0',
                  }}
                />
              </div>
              <div style={{ marginBottom: '15px', animation: "slideInFromLeft 0.8s ease-out 0.6s both" }}>
                <label style={{ display: 'block', color: '#555', marginBottom: '5px', fontWeight: 'bold' }}>
                  Email:
                </label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleInputChange}
                  style={{
                    width: '100%',
                    padding: '8px',
                    borderRadius: '5px',
                    border: '1px solid #ccc',
                    fontSize: '1rem',
                    transition: 'border-color 0.3s ease, box-shadow 0.3s ease',
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = '#007BFF';
                    e.target.style.boxShadow = '0 0 5px rgba(0, 123, 255, 0.3)';
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = '#ccc';
                    e.target.style.boxShadow = 'none';
                  }}
                />
              </div>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', animation: "fadeIn 1s ease-out 0.8s both" }}>
                <button
                  onClick={handleSave}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#4CAF50',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    transition: 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
                    animation: "pulse 2s infinite ease-in-out",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#45a049';
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#4CAF50';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Save
                </button>
                <button
                  onClick={() => setIsEditing(false)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#f44336',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    transition: 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
                    animation: "pulse 2s infinite ease-in-out",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#da190b';
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#f44336';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Cancel
                </button>
              </div>
            </div>
          ) : (
            <div style={{ textAlign: 'left' }}>
              <p style={{ margin: '10px 0', color: '#555', animation: "slideInFromLeft 0.8s ease-out" }}>
                <strong style={{ color: '#007BFF' }}>Name:</strong> {profile.name}
              </p>
              <p style={{ margin: '10px 0', color: '#555', animation: "slideInFromLeft 0.8s ease-out 0.2s both" }}>
                <strong style={{ color: '#007BFF' }}>Student ID:</strong> {profile.studentId}
              </p>
              <p style={{ margin: '10px 0', color: '#555', animation: "slideInFromLeft 0.8s ease-out 0.4s both" }}>
                <strong style={{ color: '#007BFF' }}>Email:</strong> {profile.email}
              </p>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px', animation: "fadeIn 1s ease-out 0.6s both" }}>
                <button
                  onClick={() => setIsEditing(true)}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#007BFF',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    transition: 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
                    animation: "pulse 2s infinite ease-in-out",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#0056b3';
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#007BFF';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Edit Profile
                </button>
                <button
                  onClick={handleLogout}
                  style={{
                    padding: '10px 20px',
                    backgroundColor: '#e74c3c',
                    color: 'white',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: 'pointer',
                    fontSize: '1.1rem',
                    transition: 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
                    animation: "pulse 2s infinite ease-in-out",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.backgroundColor = '#c0392b';
                    e.target.style.transform = 'scale(1.05)';
                    e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.backgroundColor = '#e74c3c';
                    e.target.style.transform = 'scale(1)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>

        <Link
          to="/dashboard"
          style={{
            textDecoration: 'none',
            color: '#007BFF',
            fontSize: '1.2rem',
            padding: '10px 20px',
            display: 'inline-block',
            borderRadius: '5px',
            backgroundColor: '#fff',
            boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
            transition: 'transform 0.3s ease, background-color 0.3s ease, box-shadow 0.3s ease',
            animation: "pulse 2s infinite ease-in-out",
          }}
          onMouseEnter={(e) => {
            e.target.style.backgroundColor = '#e6f0ff';
            e.target.style.transform = 'scale(1.05)';
            e.target.style.boxShadow = '0 4px 10px rgba(0, 0, 0, 0.2)';
          }}
          onMouseLeave={(e) => {
            e.target.style.backgroundColor = '#fff';
            e.target.style.transform = 'scale(1)';
            e.target.style.boxShadow = '0 2px 5px rgba(0, 0, 0, 0.1)';
          }}
        >
          Back to Dashboard
        </Link>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          /* Page Entrance Animation */
          @keyframes pageEnter {
            0% {
              opacity: 0;
              transform: scale(0.95);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          /* Background Gradient Shift */
          @keyframes gradientShift {
            0% {
              background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
            }
            50% {
              background: linear-gradient(135deg, #c3cfe2, #f5f7fa);
            }
            100% {
              background: linear-gradient(135deg, #f5f7fa, #c3cfe2);
            }
          }

          /* Enhanced Floating Animation with Rotation */
          @keyframes floatWithRotate {
            0% {
              transform: translateY(0px) rotate(0deg);
              opacity: 0.8;
            }
            50% {
              transform: translateY(-20px) rotate(10deg);
              opacity: 1;
            }
            100% {
              transform: translateY(0px) rotate(0deg);
              opacity: 0.8;
            }
          }

          /* Zoom In for Profile Photo */
          @keyframes zoomIn {
            0% {
              opacity: 0;
              transform: scale(0.5);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          /* Fade In Up for Main Content */
          @keyframes fadeInUp {
            0% {
              opacity: 0;
              transform: translateY(30px);
            }
            100% {
              opacity: 1;
              transform: translateY(0);
            }
          }

          /* Text Pop for Heading */
          @keyframes textPop {
            0% {
              opacity: 0;
              transform: scale(0.5);
            }
            50% {
              transform: scale(1.1);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          /* Scale In for Profile Container */
          @keyframes scaleIn {
            0% {
              opacity: 0;
              transform: scale(0.9);
            }
            100% {
              opacity: 1;
              transform: scale(1);
            }
          }

          /* Slide In for Profile Fields */
          @keyframes slideInFromLeft {
            0% {
              opacity: 0;
              transform: translateX(-50px);
            }
            100% {
              opacity: 1;
              transform: translateX(0);
            }
          }

          /* Fade In for Buttons */
          @keyframes fadeIn {
            0% {
              opacity: 0;
            }
            100% {
              opacity: 1;
            }
          }

          /* Pulse Animation for Buttons */
          @keyframes pulse {
            0% {
              transform: scale(1);
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
            50% {
              transform: scale(1.03);
              box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
            }
            100% {
              transform: scale(1);
              box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
            }
          }

          /* Responsive Adjustments */
          @media (max-width: 768px) {
            h1 {
              font-size: 2rem;
            }
            img {
              width: 120px;
              height: 120px;
            }
            div {
              padding: 15px;
            }
            input, button {
              font-size: 0.9rem;
              padding: 8px;
            }
          }

          @media (max-width: 480px) {
            h1 {
              font-size: 1.5rem;
            }
            img {
              width: 100px;
              height: 100px;
            }
            a, button {
              font-size: 1rem;
              padding: 8px 16px;
            }
          }
        `}
      </style>
    </div>
  );
}

export default Profile;