const express = require("express");
const router = express.Router();

// Sample Data (Replace with MongoDB later)
const researchProjects = [
    { id: 1, title: "AI for Healthcare", description: "Using AI to improve diagnosis." },
    { id: 2, title: "Renewable Energy", description: "Innovative solar energy solutions." }
];

const startups = [
    { id: 1, name: "GreenTech", industry: "Sustainable Energy", funding: "$500K" },
    { id: 2, name: "AgriTech", industry: "Smart Farming", funding: "$300K" }
];

const iprRecords = [
    { id: 1, title: "AI-Powered Diagnostics", status: "Approved" },
    { id: 2, title: "Eco-Friendly Batteries", status: "Pending" }
];

// Route to get dashboard data
router.get("/dashboard", (req, res) => {
    res.json({
        researchProjects,
        startups,
        iprRecords
    });
});

module.exports = router;
