const express = require("express");
const router = express.Router();
const Budget = require("../models/budgetModel");

// Save or update budget for a month-year
router.post("/save", async (req, res) => {
  const { month, year, budgets } = req.body;

  try {
    let existing = await Budget.findOne({ month, year });

    if (existing) {
      existing.budgets = budgets;
      await existing.save();
    } else {
      await Budget.create({ month, year, budgets });
    }

    res.json({ message: "Budget saved successfully" });
  } catch (error) {
    console.error("Error saving budget:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Get budget for a specific month-year
router.get("/", async (req, res) => {
  const { month, year } = req.query;

  try {
    const budget = await Budget.findOne({ month, year });
    res.json(budget || { budgets: [] });
  } catch (error) {
    console.error("Error fetching budget:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
