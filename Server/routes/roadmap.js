const express = require('express');
const router = express.Router();
const Roadmap = require('../models/Roadmap');

// POST /api/roadmap
// Save roadmap details to the database
router.post('/', async (req, res) => {
  try {
    console.log('Incoming request body:', req.body); // Log the request body

    const { title, description, skills, goals, hasResume, steps } = req.body;

    // Validate and sanitize resume content
    if (goals && goals.resumeContent) {
      goals.resumeContent = goals.resumeContent.replace(/[^\x20-\x7E\n]/g, ''); // Remove non-printable characters
    }

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
// Upload and process resume content and store it in the goals object
router.post('/upload', async (req, res) => {
  try {
    if (!req.files || !req.files.resume) {
      return res.status(400).json({ message: 'No resume file uploaded' });
    }

    const resumeFile = req.files.resume;
    const resumeContent = resumeFile.data.toString('utf-8');

    console.log('Uploaded resume content:', resumeContent);

    // Extract plain text from resume content
    const plainTextResume = resumeContent.replace(/[^\x20-\x7E\n]/g, '');

    // Store plain text resume in the goals object
    const { goals } = req.body;
    if (!goals) {
      return res.status(400).json({ message: 'Goals object is missing in the request body' });
    }

    goals.resumeContent = plainTextResume;

    // Save updated roadmap with plain text resume content
    const roadmapData = { ...req.body, goals };
    const newRoadmap = new Roadmap(roadmapData);
    await newRoadmap.save();

    res.status(201).json({ message: 'Roadmap saved successfully with plain text resume content', roadmap: newRoadmap });
  } catch (error) {
    console.error('Error processing resume upload:', error);
    res.status(500).json({ message: 'Failed to process resume upload', error });
  }
});

module.exports = router;