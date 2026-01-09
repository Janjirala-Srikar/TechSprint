const mongoose = require('mongoose');

const roadmapSchema = new mongoose.Schema({
  title: { type: String },
  description: { type: String },
  skills: { type: [String] }, // Add skills field
  goals: {
    targetRole: { type: String },
    targetCompany: { type: String },
    timeline: { type: String },
    aspirations: { type: String },
  }, // Add goals field
  hasResume: { type: Boolean }, // Add hasResume field
  steps: [
    {
      stepTitle: { type: String, required: true },
      stepDescription: { type: String },
      completed: { type: Boolean, default: false },
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Roadmap', roadmapSchema);