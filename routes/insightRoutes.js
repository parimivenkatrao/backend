// routes/insightRoutes.js
const express = require("express");
const Insight = require("../models/Insight");

const router = express.Router();

// Helper to escape regex special chars
function escapeRegExp(string) {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

// Build a Mongo query from query params. Uses case-insensitive exact match for strings.
function buildQueryFromParams(q) {
  const allowed = [
    "end_year",
    "topic",
    "sector",
    "region",
    "pestle",
    "source",
    "swot",
    "country",
    "city"
  ];

  const query = {};
  allowed.forEach((key) => {
    if (q[key]) {
      const val = String(q[key]).trim();
      if (val === "") return;
      // Use case-insensitive exact match via regex to tolerate case/whitespace
      query[key] = { $regex: `^${escapeRegExp(val)}$`, $options: "i" };
    }
  });
  return query;
}

// GET /api/insights with filters
router.get("/", async (req, res) => {
  try {
    const query = buildQueryFromParams(req.query);
    const insights = await Insight.find(query).limit(500);
    res.json(insights);
  } catch (err) {
    console.error("Error fetching insights:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// Simple stats endpoint for charts
router.get("/stats", async (req, res) => {
  try {
    // Build filters from query params so stats reflect current filters
    const filters = buildQueryFromParams(req.query);

    const matchStage = {
      $match: {
        start_year: { $nin: ["", null] },
        ...filters,
      },
    };

    const intensityByYear = await Insight.aggregate([
      matchStage,
      {
        $group: {
          _id: "$start_year",
          avgIntensity: { $avg: "$intensity" },
          count: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    const likelihoodByYear = await Insight.aggregate([
      matchStage,
      {
        $group: {
          _id: "$start_year",
          avgLikelihood: { $avg: "$likelihood" },
        },
      },
      { $sort: { _id: 1 } },
    ]);

    res.json({ intensityByYear, likelihoodByYear });
  } catch (err) {
    console.error("Error fetching stats:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
