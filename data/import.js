// data/import.js
const fs = require("fs");
const path = require("path");
const dotenv = require("dotenv");
const connectDB = require("../config/db");
const Insight = require("../models/Insight");

dotenv.config();

const jsonPath = path.join(__dirname, "jsondata.json");

const importData = async () => {
  try {
    await connectDB();

    const raw = fs.readFileSync(jsonPath, "utf-8");
    const data = JSON.parse(raw);

    await Insight.deleteMany({});
    console.log("Old data cleared");

    await Insight.insertMany(data);
    console.log(" JSON data imported successfully");

    process.exit(0);
  } catch (err) {
    console.error(" Error importing data:", err);
    process.exit(1);
  }
};

importData();
