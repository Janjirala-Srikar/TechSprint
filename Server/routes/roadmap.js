const express = require('express');
const router = express.Router();
const Roadmap = require('../models/Roadmap');

// POST /api/roadmap
// Save roadmap details to the database
router.post('/', async (req, res) => {
  try {
    console.log('Incoming request body:', req.body); // Log the request body

    const { title, description, skills, goals, hasResume, steps } = req.body;

    const roadmapData = { title, description, skills, goals, hasResume, steps };
    const newRoadmap = new Roadmap(roadmapData);
    await newRoadmap.save();
    res.status(201).json({ message: 'Roadmap saved successfully', roadmap: newRoadmap });
  } catch (error) {
    console.error('Error saving roadmap:', error);
    res.status(500).json({ message: 'Failed to save roadmap', error });
  }
});

// POST /api/roadmap/upload
// Upload and process resume content
router.post('/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ message: 'No resume file uploaded' });
    }

    const resumeFile = req.files.resume;
    const resumeContent = resumeFile.data.toString('utf-8');

    console.log('Uploaded resume content:', resumeContent);

    res.status(200).json({ resumeContent });
  } catch (error) {
    console.error('Error processing resume upload:', error);
    res.status(500).json({ message: 'Failed to process resume upload', error });
  }
});

module.exports = router;