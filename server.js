const express = require("express");
const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const cors = require("cors");
const multer = require("multer");
const path = require("path");

const app = express();
app.use(cors({ origin: "http://localhost:3000" }));
app.use(express.json());

// Serve uploaded files statically
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/");
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});
const upload = multer({ storage });

// Create the uploads directory if it doesn't exist
const fs = require("fs");
if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Connect to MongoDB
mongoose
  .connect("mongodb://localhost:27017/student-portal", {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  username: String,
  email: { type: String, unique: true },
  password: String,
  photo: String,
});
const User = mongoose.model("User", userSchema);

// Study Session Schema
const studySessionSchema = new mongoose.Schema({
  userId: String,
  subject: String,
  topic: String,
  duration: Number,
  difficulty: String,
  completed: Boolean,
  date: { type: Date, required: true },
});
const StudySession = mongoose.model("StudySession", studySessionSchema);

// Book Schema
const bookSchema = new mongoose.Schema({
  title: String,
  author: String,
  price: Number,
  condition: String,
  contact: String,
  sellerId: String,
  sellerName: String,
  createdAt: { type: Date, default: Date.now },
});
const Book = mongoose.model("Book", bookSchema);

// Middleware to verify JWT token
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) {
    return res.status(401).json({ error: "Unauthorized: No token provided" });
  }

  jwt.verify(token, "your-secret-key", (err, user) => {
    if (err) {
      console.error("Token verification failed:", err.message);
      return res.status(403).json({ error: `Invalid token: ${err.message}` });
    }
    req.user = user;
    next();
  });
};

// Signup Endpoint
app.post("/signup", async (req, res) => {
  const { username, email, password } = req.body;
  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: "Email already exists" });
    }

    const user = new User({ username, email, password, photo: "" });
    await user.save();
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error("Error during signup:", error);
    res.status(500).json({ error: "Error during signup" });
  }
});

// Login Endpoint
app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email, password });
    if (!user) return res.status(401).json({ error: "Invalid email or password" });

    const token = jwt.sign({ id: user._id, email: user.email }, "your-secret-key", {
      expiresIn: "7d", // Increased to 7 days for testing
    });
    res.json({ token });
  } catch (error) {
    console.error("Error during login:", error);
    res.status(500).json({ error: "Error during login" });
  }
});

// Get Student Data Endpoint
app.get("/student", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("username email photo");
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      id: user._id,
      name: user.username,
      email: user.email,
      photo: user.photo ? `http://localhost:5001/${user.photo}` : null,
    });
  } catch (error) {
    console.error("Error fetching student data:", error);
    res.status(500).json({ error: "Error fetching student data" });
  }
});

// Update Student Profile
app.put("/student", authenticateToken, upload.single("photo"), async (req, res) => {
  try {
    const updates = {
      username: req.body.name,
      email: req.body.email,
    };
    if (req.file) {
      updates.photo = `uploads/${req.file.filename}`;
    }
    const user = await User.findByIdAndUpdate(req.user.id, updates, { new: true });
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }
    res.json({
      id: user._id,
      name: user.username,
      email: user.email,
      photo: user.photo ? `http://localhost:5001/${user.photo}` : null,
    });
  } catch (error) {
    console.error("Error updating student data:", error);
    res.status(500).json({ error: "Error updating student data" });
  }
});

// Get Study Sessions
app.get("/study-sessions", authenticateToken, async (req, res) => {
  try {
    const sessions = await StudySession.find({ userId: req.user.id });
    res.json(sessions);
  } catch (error) {
    console.error("Error fetching study sessions:", error);
    res.status(500).json({ error: "Error fetching study sessions" });
  }
});

// Add a new Study Session
app.post("/study-sessions", authenticateToken, async (req, res) => {
  try {
    const session = new StudySession({
      userId: req.user.id,
      subject: req.body.subject,
      topic: req.body.topic,
      duration: req.body.duration,
      difficulty: req.body.difficulty,
      completed: req.body.completed,
      date: new Date(req.body.date),
    });
    await session.save();
    res.status(201).json(session);
  } catch (error) {
    console.error("Error adding study session:", error);
    res.status(500).json({ error: "Error adding study session" });
  }
});

// Update a Study Session
app.put("/study-sessions/:id", authenticateToken, async (req, res) => {
  try {
    const session = await StudySession.findOneAndUpdate(
      { _id: req.params.id, userId: req.user.id },
      req.body,
      { new: true }
    );
    if (!session) return res.status(404).json({ error: "Session not found" });
    res.json(session);
  } catch (error) {
    console.error("Error updating study session:", error);
    res.status(500).json({ error: "Error updating study session" });
  }
});

// Get All Books
app.get("/books", async (req, res) => {
  try {
    const books = await Book.find();
    console.log("Fetched books:", books);
    res.json(books);
  } catch (error) {
    console.error("Error fetching books:", error);
    res.status(500).json({ error: "Error fetching books: " + error.message });
  }
});

// Post a New Book
app.post("/books", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      console.log("User not found for ID:", req.user.id);
      return res.status(404).json({ error: "User not found" });
    }

    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      price: req.body.price,
      condition: req.body.condition,
      contact: req.body.contact,
      sellerId: req.user.id,
      sellerName: user.username,
    });

    console.log("Attempting to save book:", book);
    await book.save();
    console.log("Book saved successfully:", book);

    res.status(201).json(book);
  } catch (error) {
    console.error("Error posting book:", error);
    res.status(500).json({ error: "Error posting book: " + error.message });
  }
});

// Interview Tip Schema
const interviewTipSchema = new mongoose.Schema({
  tip: String,
  userId: String,
  userName: String,
  createdAt: { type: Date, default: Date.now },
});
const InterviewTip = mongoose.model("InterviewTip", interviewTipSchema);

// Common Question Schema
const commonQuestionSchema = new mongoose.Schema({
  question: String,
  createdAt: { type: Date, default: Date.now },
});
const CommonQuestion = mongoose.model("CommonQuestion", commonQuestionSchema);

// Mock Interview Schema
const mockInterviewSchema = new mongoose.Schema({
  userId: String,
  userName: String,
  mentor: String,
  date: Date,
  time: String,
  createdAt: { type: Date, default: Date.now },
});
const MockInterview = mongoose.model("MockInterview", mockInterviewSchema);

// Get All Interview Tips
app.get("/interview-tips", async (req, res) => {
  try {
    const tips = await InterviewTip.find();
    res.json(tips);
  } catch (error) {
    console.error("Error fetching interview tips:", error);
    res.status(500).json({ error: "Error fetching interview tips" });
  }
});

// Post a New Interview Tip
app.post("/interview-tips", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const tip = new InterviewTip({
      tip: req.body.tip,
      userId: req.user.id,
      userName: user.username,
    });
    await tip.save();
    res.status(201).json(tip);
  } catch (error) {
    console.error("Error posting interview tip:", error);
    res.status(500).json({ error: "Error posting interview tip" });
  }
});

// Get All Common Questions
app.get("/common-questions", async (req, res) => {
  try {
    const questions = await CommonQuestion.find();
    res.json(questions);
  } catch (error) {
    console.error("Error fetching common questions:", error);
    res.status(500).json({ error: "Error fetching common questions" });
  }
});

// Get Mock Interviews for a User
app.get("/mock-interviews", authenticateToken, async (req, res) => {
  try {
    const interviews = await MockInterview.find({ userId: req.user.id });
    res.json(interviews);
  } catch (error) {
    console.error("Error fetching mock interviews:", error);
    res.status(500).json({ error: "Error fetching mock interviews" });
  }
});

// Schedule a New Mock Interview
app.post("/mock-interviews", authenticateToken, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    const interview = new MockInterview({
      userId: req.user.id,
      userName: user.username,
      mentor: req.body.mentor,
      date: new Date(req.body.date),
      time: req.body.time,
    });
    await interview.save();
    res.status(201).json(interview);
  } catch (error) {
    console.error("Error scheduling mock interview:", error);
    res.status(500).json({ error: "Error scheduling mock interview" });
  }
});

// Start the server
app.listen(5001, () => {
  console.log("Server running on http://localhost:5001");
});