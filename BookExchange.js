import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

function BookExchange() {
  const [books, setBooks] = useState([]);
  const [newBook, setNewBook] = useState({
    title: "",
    author: "",
    price: "",
    condition: "",
    contact: "",
  });
  const [student, setStudent] = useState(null);
  const [error, setError] = useState(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStudentData = async () => {
      if (!token) {
        console.log("No token found, redirecting to login");
        setError("Please log in to access the book exchange.");
        navigate("/login");
        return;
      }

      try {
        console.log("Fetching student data with token:", token);
        const response = await fetch("http://localhost:5001/student", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        console.log("Student data response status:", response.status);
        if (!response.ok) {
          const errorData = await response.json();
          if (response.status === 401 || response.status === 403) {
            throw new Error("Session expired or invalid token. Please log in again.");
          }
          throw new Error(
            `Failed to fetch student data: ${response.statusText} (${response.status})${
              errorData.error ? ` - ${errorData.error}` : ""
            }`
          );
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        console.log("Student data fetched successfully:", data);
        setStudent(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching student data:", error);
        setError(error.message);
        if (
          error.message.includes("Session expired") ||
          error.message.includes("invalid token")
        ) {
          console.log("Token invalid or expired, redirecting to login");
          localStorage.removeItem("token");
          navigate("/login");
        }
      }
    };

    const fetchBooks = async () => {
      try {
        const response = await fetch("http://localhost:5001/books");
        if (!response.ok) {
          throw new Error(`Failed to fetch books: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setBooks(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching books:", error);
        setError(error.message);
      }
    };

    fetchStudentData();
    fetchBooks();
  }, [token, navigate]);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook({ ...newBook, [name]: value });
  };

  const handlePostBook = async (e) => {
    e.preventDefault();
    if (
      !newBook.title ||
      !newBook.author ||
      !newBook.price ||
      !newBook.condition ||
      !newBook.contact
    ) {
      alert("Please fill in all fields.");
      return;
    }

    const bookToPost = {
      title: newBook.title,
      author: newBook.author,
      price: parseFloat(newBook.price),
      condition: newBook.condition,
      contact: newBook.contact,
    };

    try {
      const response = await fetch("http://localhost:5001/books", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(bookToPost),
      });

      if (!response.ok) {
        const errorData = await response.json();
        if (response.status === 401 || response.status === 403) {
          throw new Error("Session expired or invalid token. Please log in again.");
        }
        throw new Error(
          `Failed to post book: ${response.statusText} (${response.status})${
            errorData.error ? ` - ${errorData.error}` : ""
          }`
        );
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setBooks([...books, data]);
      setNewBook({
        title: "",
        author: "",
        price: "",
        condition: "",
        contact: "",
      });
      setError(null);
      alert("Book posted successfully!");
    } catch (error) {
      console.error("Error posting book:", error);
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

  if (error) {
    console.log("Rendering error state:", error);
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
          background: "linear-gradient(135deg, #d4a5f9 0%, #f5c6cb 100%)",
        }}
      >
        <h2>{error}</h2>
      </div>
    );
  }

  if (!student) {
    console.log("Rendering loading state");
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
          background: "linear-gradient(135deg, #d4a5f9 0%, #f5c6cb 100%)",
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
        background: "linear-gradient(135deg, #d4a5f9 0%, #f5c6cb 100%)",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* Floating Elements (Money, Pens, Books, Students) */}
      <div
        style={{
          position: "absolute",
          top: "10%",
          left: "5%",
          width: "40px",
          height: "40px",
          background: "url('https://img.icons8.com/ios-filled/50/000000/money.png') no-repeat center",
          backgroundSize: "contain",
          animation: "rotateAndMove 8s linear infinite",
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
          animation: "rotateAndMove 10s linear infinite",
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
          animation: "rotateAndMove 9s linear infinite",
        }}
      />
      <div
        style={{
          position: "absolute",
          top: "30%",
          right: "20%",
          width: "35px",
          height: "35px",
          background: "url('https://img.icons8.com/ios-filled/50/000000/student-male.png') no-repeat center",
          backgroundSize: "contain",
          animation: "rotateAndMove 7s linear infinite",
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
          backgroundColor: "transparent",
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
          src="/assets/book-exchange-illustration.png"
          alt="Book exchange illustration"
          style={{
            width: "300px",
            maxWidth: "100%",
            margin: "0 auto 20px",
            display: "block",
            animation: "bounceIn 1s ease-out",
          }}
          onError={(e) => {
            e.target.src = "https://img.freepik.com/free-vector/book-exchange-concept-illustration_12345680.htm";
            console.error("Failed to load book exchange illustration, using fallback image.");
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
            animation: "bounceIn 1s ease-out",
          }}
        >
          Book Exchange
        </h1>

        {/* Form to Post a Book */}
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            marginBottom: "30px",
            maxWidth: "600px",
            margin: "0 auto",
            animation: "bounceIn 1s ease-out",
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
            List a Book for Sale
          </h2>
          <form onSubmit={handlePostBook}>
            {[
              { label: "Title", name: "title", type: "text" },
              { label: "Author", name: "author", type: "text" },
              { label: "Price (₹)", name: "price", type: "number" },
              { label: "Contact (Email/Phone)", name: "contact", type: "text" },
            ].map((field) => (
              <div
                key={field.name}
                style={{
                  marginBottom: "15px",
                  display: "flex",
                  flexDirection: "column",
                  gap: "5px",
                }}
              >
                <label
                  style={{
                    fontSize: "1rem",
                    fontWeight: "600",
                    color: "#555",
                  }}
                >
                  {field.label}:
                </label>
                <input
                  type={field.type}
                  name={field.name}
                  value={newBook[field.name]}
                  onChange={handleInputChange}
                  style={{
                    width: "100%",
                    padding: "10px",
                    border: "1px solid #ccc",
                    borderRadius: "5px",
                    fontSize: "1rem",
                    transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = "#d4a5f9";
                    e.target.style.boxShadow = "0 0 5px rgba(212, 165, 249, 0.5)";
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = "#ccc";
                    e.target.style.boxShadow = "none";
                  }}
                />
              </div>
            ))}
            <div
              style={{
                marginBottom: "15px",
                display: "flex",
                flexDirection: "column",
                gap: "5px",
              }}
            >
              <label
                style={{
                  fontSize: "1rem",
                  fontWeight: "600",
                  color: "#555",
                }}
              >
                Condition:
              </label>
              <select
                name="condition"
                value={newBook.condition}
                onChange={handleInputChange}
                style={{
                  width: "100%",
                  padding: "10px",
                  border: "1px solid #ccc",
                  borderRadius: "5px",
                  fontSize: "1rem",
                  transition: "border-color 0.3s ease, box-shadow 0.3s ease",
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = "#d4a5f9";
                  e.target.style.boxShadow = "0 0 5px rgba(212, 165, 249, 0.5)";
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = "#ccc";
                  e.target.style.boxShadow = "none";
                }}
              >
                <option value="">Select Condition</option>
                <option value="Like New">Like New</option>
                <option value="Good">Good</option>
                <option value="Fair">Fair</option>
                <option value="Poor">Poor</option>
              </select>
            </div>
            <button
              type="submit"
              style={{
                width: "100%",
                padding: "12px",
                backgroundColor: "#d4a5f9",
                color: "white",
                border: "none",
                borderRadius: "5px",
                fontSize: "1.1rem",
                fontWeight: "bold",
                cursor: "pointer",
                transition: "background-color 0.3s ease, transform 0.3s ease",
              }}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = "#c78ef7";
                e.target.style.transform = "scale(1.02)";
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = "#d4a5f9";
                e.target.style.transform = "scale(1)";
              }}
            >
              Post Book
            </button>
          </form>
        </div>

        {/* List of Available Books */}
        <div
          style={{
            backgroundColor: "#fff",
            border: "1px solid #ddd",
            padding: "25px",
            borderRadius: "10px",
            boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
            maxWidth: "800px",
            margin: "0 auto",
            animation: "bounceIn 1s ease-out",
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
            Available Books
          </h2>
          {books.length > 0 ? (
            <ul style={{ listStyleType: "none", padding: 0 }}>
              {books.map((book) => (
                <li
                  key={book._id}
                  style={{
                    borderBottom: "1px solid #eee",
                    padding: "15px 0",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <div
                    style={{
                      flex: 1,
                    }}
                  >
                    <strong
                      style={{
                        fontSize: "1.2rem",
                        color: "#2c3e50",
                      }}
                    >
                      {book.title}
                    </strong>{" "}
                    by{" "}
                    <span
                      style={{
                        fontStyle: "italic",
                        color: "#555",
                      }}
                    >
                      {book.author}
                    </span>{" "}
                    <br />
                    <span
                      style={{
                        fontSize: "0.95rem",
                        color: "#777",
                      }}
                    >
                      Condition: {book.condition}
                    </span>{" "}
                    <br />
                    <span
                      style={{
                        fontSize: "0.95rem",
                        color: "#e74c3c",
                        fontWeight: "bold",
                      }}
                    >
                      Price: ₹{book.price}
                    </span>{" "}
                    <br />
                    <span
                      style={{
                        fontSize: "0.95rem",
                        color: "#777",
                      }}
                    >
                      Seller: {book.sellerName}
                    </span>{" "}
                    <br />
                    <span
                      style={{
                        fontSize: "0.95rem",
                        color: "#777",
                      }}
                    >
                      Contact: {book.contact}
                    </span>
                  </div>
                  <button
                    style={{
                      padding: "8px 15px",
                      backgroundColor: "#f5c6cb",
                      color: "#2c3e50",
                      border: "none",
                      borderRadius: "5px",
                      fontSize: "1rem",
                      fontWeight: "bold",
                      cursor: "pointer",
                      transition: "background-color 0.3s ease, transform 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.backgroundColor = "#f7a8b8";
                      e.target.style.transform = "scale(1.05)";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.backgroundColor = "#f5c6cb";
                      e.target.style.transform = "scale(1)";
                    }}
                    onClick={() =>
                      alert(
                        `Contact ${book.sellerName} at ${book.contact} to buy this book!`
                      )
                    }
                  >
                    I'm Interested
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p
              style={{
                textAlign: "center",
                color: "#777",
                fontSize: "1.1rem",
                animation: "bounceIn 1s ease-out",
              }}
            >
              No books available for exchange.
            </p>
          )}
        </div>
      </div>

      {/* CSS Animations */}
      <style>
        {`
          @keyframes rotateAndMove {
            0% {
              transform: translate(0, 0) rotate(0deg);
            }
            50% {
              transform: translate(20px, -20px) rotate(180deg);
            }
            100% {
              transform: translate(0, 0) rotate(360deg);
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
            70% {
              transform: scale(0.9);
            }
            100% {
              transform: scale(1);
            }
          }
        `}
      </style>
    </div>
  );
}

export default BookExchange;