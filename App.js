import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Route, Routes, Navigate, useLocation } from "react-router-dom";
import Signup from "./Signup";
import Login from "./Login";
import MainPage from "./MainPage";
import Dashboard from "./Dashboard";
import BookExchange from "./BookExchange";
import ExamPreparationAssistant from "./ExamPreparationAssistant";
import Courses from "./Courses";
import Exams from "./Exams";
import InterviewPrep from "./InterviewPrep";
import Attendance from "./Attendance";
import Profile from "./Profile";

function App() {
  const [token, setToken] = useState(localStorage.getItem("token"));
  const [shouldReloadFromLogin, setShouldReloadFromLogin] = useState(false);

  useEffect(() => {
    const handleBeforeUnload = (event) => {
      // Check if the user has already made a choice
      const userChoice = localStorage.getItem("reloadFromLogin");
      if (!userChoice) {
        // Show confirmation prompt
        const message = "Do you want to reload from the login page? (This will log you out)";
        event.preventDefault();
        event.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);

    // Check if the user chose to reload from login
    const userChoice = localStorage.getItem("reloadFromLogin");
    if (userChoice === "true") {
      localStorage.removeItem("token");
      localStorage.removeItem("reloadFromLogin");
      setToken(null);
      setShouldReloadFromLogin(true);
    }

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
    };
  }, []);

  // Protected Route component to handle authentication
  const ProtectedRoute = ({ element }) => {
    return token ? element : <Navigate to="/login" />;
  };

  return (
    <Router>
      <Routes>
        <Route path="/" element={token ? <Navigate to="/main" /> : <Navigate to="/login" />} />
        <Route path="/signup" element={<Signup setToken={setToken} />} />
        <Route path="/login" element={<Login setToken={setToken} />} />
        <Route path="/main" element={<ProtectedRoute element={<MainPage />} />} />
        <Route path="/dashboard" element={<ProtectedRoute element={<Dashboard />} />} />
        <Route path="/BookExchange" element={<ProtectedRoute element={<BookExchange />} />} />
        <Route path="/courses" element={<ProtectedRoute element={<Courses />} />} />
        <Route path="/exams" element={<ProtectedRoute element={<Exams />} />} />
        <Route path="/interview-prep" element={<ProtectedRoute element={<InterviewPrep />} />} />
        <Route path="/attendance" element={<ProtectedRoute element={<Attendance />} />} />
        <Route path="/profile" element={<ProtectedRoute element={<Profile />} />} />
        <Route path="/ExamPreparationAssistant" element={<ProtectedRoute element={<ExamPreparationAssistant />} />} />
      </Routes>
    </Router>
  );
}

export default App;