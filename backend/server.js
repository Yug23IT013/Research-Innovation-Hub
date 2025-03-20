const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

require("dotenv").config();
const app = express();

// Connect to MongoDB
connectDB();

/ CORS Configuration
app.use(cors({
    origin: "*", // In production, replace with your frontend URL
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type", "Authorization"]
}));

// Middleware
app.use(express.json());

// Serve static files from frontend directory
app.use(express.static(path.join(__dirname, "../frontend")));

// Default route to serve index.html
app.get("/", (req, res) => {
    res.sendFile(path.join(__dirname, "../frontend", "index.html"));
});

// Routes
app.use("/api/auth", require("./routes/authRoutes"));
app.use("/api", require("./routes/dashboardRoutes"));

// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ 
        message: "Something went wrong!",
        error: process.env.NODE_ENV === 'development' ? err.message : undefined
    });
});

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
