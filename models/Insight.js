// models/Insight.js
const mongoose = require("mongoose");

const InsightSchema = new mongoose.Schema({
  end_year: { type: String },
  intensity: { type: Number },
  sector: { type: String },
  topic: { type: String },
  insight: { type: String },
  url: { type: String },
  region: { type: String },
  start_year: { type: String },
  impact: { type: mongoose.Schema.Types.Mixed },
  added: { type: String },
  published: { type: String },
  country: { type: String },
  relevance: { type: Number },
  pestle: { type: String },
  source: { type: String },
  title: { type: String },
  likelihood: { type: Number },
  city: { type: String },
  swot: { type: String }
});

module.exports = mongoose.model("Insight", InsightSchema);
