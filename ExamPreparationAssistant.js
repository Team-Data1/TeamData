import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  ChevronRight, 
  Calendar, 
  BookOpen, 
  Clock, 
  CheckCircle, 
  AlertTriangle, 
  BarChart2, 
  Clipboard 
} from 'lucide-react';

const ExamPreparationAssistant = () => {
  // State Management
  const [studySessions, setStudySessions] = useState([]);
  const [newSession, setNewSession] = useState({
    subject: '',
    topic: '',
    duration: 60,
    difficulty: 'Medium',
  });
  const [activeView, setActiveView] = useState('dashboard');
  const [studyGoals, setStudyGoals] = useState({
    dailyStudyHours: 2,
    weeklySessions: 10,
  });
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  // Fetch Study Sessions on Mount
  useEffect(() => {
    const fetchStudySessions = async () => {
      if (!token) {
        setError("Please log in to access the exam preparation assistant.");
        navigate("/login");
        return;
      }

      try {
        const response = await fetch("http://localhost:5001/study-sessions", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          if (response.status === 401 || response.status === 403) {
            throw new Error("Session expired or invalid token. Please log in again.");
          }
          throw new Error(`Failed to fetch study sessions: ${response.statusText}`);
        }

        const data = await response.json();
        if (data.error) {
          throw new Error(data.error);
        }

        setStudySessions(data);
        setError(null);
      } catch (error) {
        console.error("Error fetching study sessions:", error);
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

    fetchStudySessions();
  }, [token, navigate]);

  // Add Study Session
  const addStudySession = async () => {
    if (!newSession.subject || !newSession.topic) {
      alert('Please fill in all fields');
      return;
    }

    const session = {
      subject: newSession.subject,
      topic: newSession.topic,
      duration: newSession.duration,
      difficulty: newSession.difficulty,
      completed: false,
      date: new Date().toISOString(),
    };

    try {
      const response = await fetch("http://localhost:5001/study-sessions", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(session),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Session expired or invalid token. Please log in again.");
        }
        throw new Error(`Failed to add study session: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setStudySessions([...studySessions, data]);
      setNewSession({
        subject: '',
        topic: '',
        duration: 60,
        difficulty: 'Medium',
      });
      setError(null);
    } catch (error) {
      console.error("Error adding study session:", error);
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

  // Complete Study Session
  const completeStudySession = async (id) => {
    try {
      const sessionToUpdate = studySessions.find((session) => session._id === id);
      if (!sessionToUpdate) return;

      const response = await fetch(`http://localhost:5001/study-sessions/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ ...sessionToUpdate, completed: true }),
      });

      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Session expired or invalid token. Please log in again.");
        }
        throw new Error(`Failed to update study session: ${response.statusText}`);
      }

      const data = await response.json();
      if (data.error) {
        throw new Error(data.error);
      }

      setStudySessions(studySessions.map((session) =>
        session._id === id ? data : session
      ));
      setError(null);
    } catch (error) {
      console.error("Error updating study session:", error);
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

  // Calculate Study Metrics
  const calculateStudyMetrics = useCallback(() => {
    const totalSessions = studySessions.length;
    const completedSessions = studySessions.filter((s) => s.completed).length;
    const completionRate = totalSessions > 0 ? (completedSessions / totalSessions) * 100 : 0;
    const totalStudyTime = studySessions.reduce(
      (acc, session) => acc + (session.completed ? session.duration : 0),
      0
    );

    return {
      totalSessions,
      completedSessions,
      completionRate,
      totalStudyTime,
    };
  }, [studySessions]);

  // Render Study Planner
  const renderStudyPlanner = () => (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '15px',
          display: 'flex',
          alignItems: 'center',
          color: '#333',
        }}
      >
        <Clipboard style={{ marginRight: '8px', color: '#007BFF' }} /> Study Planner
      </h2>

      {/* New Session Form */}
      <div style={{ marginBottom: '15px' }}>
        <input
          type="text"
          placeholder="Subject"
          value={newSession.subject}
          onChange={(e) => setNewSession({ ...newSession, subject: e.target.value })}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            marginBottom: '8px',
            fontSize: '1rem',
          }}
        />
        <input
          type="text"
          placeholder="Topic"
          value={newSession.topic}
          onChange={(e) => setNewSession({ ...newSession, topic: e.target.value })}
          style={{
            width: '100%',
            padding: '8px',
            border: '1px solid #ccc',
            borderRadius: '5px',
            marginBottom: '8px',
            fontSize: '1rem',
          }}
        />
        <div style={{ display: 'flex', gap: '8px' }}>
          <select
            value={newSession.duration}
            onChange={(e) => setNewSession({ ...newSession, duration: Number(e.target.value) })}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '1rem',
            }}
          >
            <option value={30}>30 mins</option>
            <option value={60}>1 hour</option>
            <option value={90}>1.5 hours</option>
            <option value={120}>2 hours</option>
          </select>
          <select
            value={newSession.difficulty}
            onChange={(e) => setNewSession({ ...newSession, difficulty: e.target.value })}
            style={{
              width: '100%',
              padding: '8px',
              border: '1px solid #ccc',
              borderRadius: '5px',
              fontSize: '1rem',
            }}
          >
            <option value="Easy">Easy</option>
            <option value="Medium">Medium</option>
            <option value="Hard">Hard</option>
          </select>
        </div>
        <button
          onClick={addStudySession}
          style={{
            width: '100%',
            backgroundColor: '#007BFF',
            color: 'white',
            padding: '8px',
            borderRadius: '5px',
            border: 'none',
            marginTop: '8px',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background-color 0.3s ease',
          }}
          onMouseEnter={(e) => (e.target.style.backgroundColor = '#0056b3')}
          onMouseLeave={(e) => (e.target.style.backgroundColor = '#007BFF')}
        >
          Add Study Session
        </button>
      </div>

      {/* Session List */}
      <div>
        <h3 style={{ fontWeight: '600', marginBottom: '8px', color: '#333' }}>
          Planned Sessions
        </h3>
        {studySessions.map((session) => (
          <div
            key={session._id}
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px',
              borderBottom: '1px solid #ccc',
              backgroundColor: session.completed ? '#e6ffed' : 'transparent',
            }}
          >
            <div>
              <p style={{ fontWeight: 'bold', color: '#333' }}>
                {session.subject} - {session.topic}
              </p>
              <p style={{ fontSize: '0.875rem', color: '#555' }}>
                {session.duration} mins | {session.difficulty} Difficulty
              </p>
            </div>
            {!session.completed && (
              <button
                onClick={() => completeStudySession(session._id)}
                style={{
                  backgroundColor: '#4CAF50',
                  color: 'white',
                  padding: '4px 12px',
                  borderRadius: '5px',
                  border: 'none',
                  cursor: 'pointer',
                  fontSize: '0.875rem',
                }}
              >
                Complete
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );

  // Render Dashboard
  const renderDashboard = () => {
    const metrics = calculateStudyMetrics();

    return (
      <div
        style={{
          backgroundColor: '#fff',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
        }}
      >
        <h2
          style={{
            fontSize: '1.5rem',
            fontWeight: 'bold',
            marginBottom: '15px',
            display: 'flex',
            alignItems: 'center',
            color: '#333',
          }}
        >
          <BarChart2 style={{ marginRight: '8px', color: '#007BFF' }} /> Study Dashboard
        </h2>

        {/* Study Goals */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
            marginBottom: '15px',
          }}
        >
          <div
            style={{
              backgroundColor: '#e6f0ff',
              padding: '15px',
              borderRadius: '5px',
            }}
          >
            <p style={{ fontSize: '0.875rem', color: '#555' }}>Daily Study Goal</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
              {studyGoals.dailyStudyHours} hrs
            </p>
          </div>
          <div
            style={{
              backgroundColor: '#e6ffed',
              padding: '15px',
              borderRadius: '5px',
            }}
          >
            <p style={{ fontSize: '0.875rem', color: '#555' }}>Weekly Sessions</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
              {studyGoals.weeklySessions}
            </p>
          </div>
        </div>

        {/* Study Metrics */}
        <div
          style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '15px',
          }}
        >
          <div
            style={{
              backgroundColor: '#fff3cd',
              padding: '15px',
              borderRadius: '5px',
            }}
          >
            <p style={{ fontSize: '0.875rem', color: '#555' }}>Total Sessions</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
              {metrics.totalSessions}
            </p>
          </div>
          <div
            style={{
              backgroundColor: '#f3e8ff',
              padding: '15px',
              borderRadius: '5px',
            }}
          >
            <p style={{ fontSize: '0.875rem', color: '#555' }}>Completion Rate</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
              {metrics.completionRate.toFixed(1)}%
            </p>
          </div>
          <div
            style={{
              backgroundColor: '#ffe6e6',
              padding: '15px',
              borderRadius: '5px',
              gridColumn: 'span 2',
            }}
          >
            <p style={{ fontSize: '0.875rem', color: '#555' }}>Total Study Time</p>
            <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#333' }}>
              {(metrics.totalStudyTime / 60).toFixed(1)} hrs
            </p>
          </div>
        </div>
      </div>
    );
  };

  // Render Progress Tracker
  const renderProgressTracker = () => (
    <div
      style={{
        backgroundColor: '#fff',
        padding: '20px',
        borderRadius: '8px',
        boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
      }}
    >
      <h2
        style={{
          fontSize: '1.5rem',
          fontWeight: 'bold',
          marginBottom: '15px',
          display: 'flex',
          alignItems: 'center',
          color: '#333',
        }}
      >
        <AlertTriangle style={{ marginRight: '8px', color: '#f59e0b' }} /> Progress Alerts
      </h2>

      {/* Difficulty Distribution */}
      <div style={{ marginBottom: '15px' }}>
        <h3 style={{ fontWeight: '600', marginBottom: '8px', color: '#333' }}>
          Session Difficulty Distribution
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <div
            style={{
              width: '100%',
              backgroundColor: '#e6ffed',
              padding: '8px',
              borderRadius: '5px',
            }}
          >
            <p style={{ color: '#333' }}>
              Easy: {studySessions.filter((s) => s.difficulty === 'Easy').length}
            </p>
          </div>
          <div
            style={{
              width: '100%',
              backgroundColor: '#fef9c3',
              padding: '8px',
              borderRadius: '5px',
            }}
          >
            <p style={{ color: '#333' }}>
              Medium: {studySessions.filter((s) => s.difficulty === 'Medium').length}
            </p>
          </div>
          <div
            style={{
              width: '100%',
              backgroundColor: '#ffe6e6',
              padding: '8px',
              borderRadius: '5px',
            }}
          >
            <p style={{ color: '#333' }}>
              Hard: {studySessions.filter((s) => s.difficulty === 'Hard').length}
            </p>
          </div>
        </div>
      </div>

      {/* Upcoming and Missed Sessions */}
      <div>
        <h3 style={{ fontWeight: '600', marginBottom: '8px', color: '#333' }}>
          Session Alerts
        </h3>
        {studySessions
          .filter((s) => !s.completed)
          .map((session) => (
            <div
              key={session._id}
              style={{
                backgroundColor: '#ffedd5',
                padding: '12px',
                borderRadius: '5px',
                marginBottom: '8px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
              }}
            >
              <div>
                <p style={{ fontWeight: 'bold', color: '#c2410c' }}>
                  Pending: {session.subject} - {session.topic}
                </p>
                <p style={{ fontSize: '0.875rem', color: '#555', display: 'flex', alignItems: 'center' }}>
                  <Clock style={{ marginRight: '4px', color: '#f97316' }} />
                  Difficulty: {session.difficulty}
                </p>
              </div>
              <AlertTriangle style={{ color: '#f97316' }} />
            </div>
          ))}
      </div>
    </div>
  );

  // Main Render
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
          backgroundColor: "#f9f9f9",
        }}
      >
        <h2>{error}</h2>
      </div>
    );
  }

  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        maxWidth: '800px',
        margin: '0 auto',
        padding: '20px',
        textAlign: 'center',
        backgroundColor: '#f9f9f9',
        minHeight: '100vh',
      }}
    >
      <h1
        style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: '#333',
          textShadow: '1px 1px 2px rgba(0, 0, 0, 0.1)',
        }}
      >
        <BookOpen style={{ marginRight: '12px', color: '#007BFF' }} /> Exam Preparation Assistant
      </h1>

      {/* Navigation */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          marginBottom: '30px',
          gap: '15px',
        }}
      >
        <button
          onClick={() => setActiveView('dashboard')}
          style={{
            padding: '8px 16px',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: activeView === 'dashboard' ? '#007BFF' : '#fff',
            color: activeView === 'dashboard' ? '#fff' : '#333',
            border: activeView === 'dashboard' ? 'none' : '1px solid #ccc',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background-color 0.3s ease',
          }}
        >
          <BarChart2 style={{ marginRight: '8px' }} /> Dashboard
        </button>
        <button
          onClick={() => setActiveView('study-planner')}
          style={{
            padding: '8px 16px',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: activeView === 'study-planner' ? '#007BFF' : '#fff',
            color: activeView === 'study-planner' ? '#fff' : '#333',
            border: activeView === 'study-planner' ? 'none' : '1px solid #ccc',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background-color 0.3s ease',
          }}
        >
          <Clipboard style={{ marginRight: '8px' }} /> Study Planner
        </button>
        <button
          onClick={() => setActiveView('progress-tracker')}
          style={{
            padding: '8px 16px',
            borderRadius: '5px',
            display: 'flex',
            alignItems: 'center',
            backgroundColor: activeView === 'progress-tracker' ? '#007BFF' : '#fff',
            color: activeView === 'progress-tracker' ? '#fff' : '#333',
            border: activeView === 'progress-tracker' ? 'none' : '1px solid #ccc',
            cursor: 'pointer',
            fontSize: '1rem',
            transition: 'background-color 0.3s ease',
          }}
        >
          <AlertTriangle style={{ marginRight: '8px' }} /> Progress Tracker
        </button>
      </div>

      {/* Conditional Rendering of Views */}
      {activeView === 'dashboard' && renderDashboard()}
      {activeView === 'study-planner' && renderStudyPlanner()}
      {activeView === 'progress-tracker' && renderProgressTracker()}

      {/* Back to Dashboard Link */}
      <Link
        to="/dashboard"
        style={{
          textDecoration: 'none',
          color: '#007BFF',
          fontSize: '1.2rem',
          padding: '10px 20px',
          display: 'inline-block',
          borderRadius: '5px',
          transition: 'background-color 0.3s ease',
          backgroundColor: '#fff',
          boxShadow: '0 2px 5px rgba(0, 0, 0, 0.1)',
          marginTop: '20px',
        }}
        onMouseEnter={(e) => (e.target.style.backgroundColor = '#e6f0ff')}
        onMouseLeave={(e) => (e.target.style.backgroundColor = '#fff')}
      >
        Back to Dashboard
      </Link>
    </div>
  );
};

export default ExamPreparationAssistant;