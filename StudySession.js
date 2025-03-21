// models/StudySession.js
const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true, // To associate sessions with a user
  },
  subject: {
    type: String,
    required: true,
  },
  topic: {
    type: String,
    required: true,
  },
  duration: {
    type: Number,
    required: true,
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    required: true,
  },
  completed: {
    type: Boolean,
    default: false,
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('StudySession', studySessionSchema);