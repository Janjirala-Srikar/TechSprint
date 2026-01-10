require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
const PORT = process.env.PORT || 5000;

/* =======================
   Middleware
======================= */

// ✅ Enable CORS (frontend: localhost:8080)
app.use(cors({
  origin: 'http://localhost:8080',
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  credentials: true
}));

// Parse JSON
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ limit: '10mb', extended: true }));

app.use(express.json());

/* =======================
   MongoDB Connection
======================= */

const mongoURI =
  process.env.MONGO_URI || 'mongodb://dummy:dummy@localhost:27017/dummydb';

mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('✅ MongoDB connected successfully'))
  .catch((err) => console.error('❌ MongoDB connection error:', err));

/* =======================
   Routes
======================= */

// Import routes
const roadmapRoutes = require('./routes/roadmap');
const geminiRoutes = require('./routes/gemini');

// Use routes
app.use('/api/roadmap', roadmapRoutes);
app.use('/api/gemini', geminiRoutes);

// Health check
app.get('/', (req, res) => {
  res.send('Backend is running 🚀');
});

/* =======================
   Start Server
======================= */

app.listen(PORT, () => {
  console.log(`✅ Server running at http://localhost:${PORT}`);
});