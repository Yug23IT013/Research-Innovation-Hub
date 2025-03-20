const express = require("express");
const cors = require("cors");
const path = require("path");
const connectDB = require("./config/db");

require("dotenv").config();
const app = express();

// Connect to MongoDB
connectDB();



// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on http://localhost:${PORT}`));
