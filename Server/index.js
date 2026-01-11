require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

/* =======================
   Middleware
======================= */

app.use(
  cors({
    origin: [
      "http://localhost:8080", // local frontend
      process.env.FRONTEND_URL, // Vercel frontend
    ].filter(Boolean),
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    credentials: true,
  })
);

app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

/* =======================
   MongoDB Connection
======================= */

const mongoURI = process.env.MONGO_URI;

if (mongoURI) {
  mongoose
    .connect(mongoURI)
    .then(() => console.log("✅ MongoDB connected"))
    .catch((err) =>
      console.error("❌ MongoDB connection error:", err.message)
    );
} else {
  console.warn("⚠️ MONGO_URI not set. Skipping DB connection.");
}

/* =======================
   Routes
======================= */

const roadmapRoutes = require("./routes/roadmap");
const geminiRoutes = require("./routes/gemini");

app.use("/api/roadmap", roadmapRoutes);
app.use("/api/gemini", geminiRoutes);

// Health check
app.get("/", (req, res) => {
  res.json({ status: "Backend running 🚀" });
});

/* =======================
   LOCAL vs VERCEL START
======================= */

const PORT = process.env.PORT || 5000;

// ✅ Run server ONLY in local/dev
if (process.env.NODE_ENV !== "production") {
  app.listen(PORT, () => {
    console.log(`✅ Server running locally on http://localhost:${PORT}`);
  });
}

// ✅ Export app for Vercel
module.exports = app;
