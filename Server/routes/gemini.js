
require('dotenv').config();
const express = require('express');
const router = express.Router();
const axios = require('axios');

// POST /api/roadmap/generate-gemini
// Receives roadmap details, sends to Gemini, and returns the plan
router.post('/generate-gemini', async (req, res) => {
  try {
    const { skills, goals, hasResume } = req.body;

    // Compose prompt for Gemini
    const prompt = `Given the following user details:\n- Skills: ${skills.join(', ')}\n- Target Role: ${goals.targetRole} at ${goals.targetCompany}\n- Timeline: ${goals.timeline} days\n- Resume: ${goals.resumeContent}\n- Aspirations: ${goals.aspirations}\nGenerate a personalized 30-day interview preparation plan. For each day, include: key topics, practice tasks, daily checkup questions, and progress tracking. Format as a JSON array of 30 days.`;


    // Get Gemini API key from environment variable
    const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
    if (!GEMINI_API_KEY) {
      return res.status(500).json({ message: 'Gemini API key not configured in environment.' });
    }

    // Call Gemini API
    // Use Gemini 2.5 model endpoint
    const geminiResponse = await axios.post(
      `https://generativelanguage.googleapis.com/v1/models/gemini-2.5-flash:generateContent?key=${GEMINI_API_KEY}`,
      {
        contents: [{ parts: [{ text: prompt }] }]
      }
    );

    // Extract plan from Gemini response
    const plan = geminiResponse.data.candidates?.[0]?.content?.parts?.[0]?.text || '';

    // Return plan to frontend
    res.json({ plan });
  } catch (error) {
    console.error('Error generating plan from Gemini:', error?.response?.data || error);
    res.status(500).json({ message: 'Failed to generate plan from Gemini', error: error?.message || error });
  }
});

module.exports = router;
