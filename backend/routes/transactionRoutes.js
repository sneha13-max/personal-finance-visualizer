// backend/routes/transactionRoutes.js

const express = require("express");
const router = express.Router();
const Transaction = require("../models/Transaction");

// Get all transactions
router.get("/", async (req, res) => {
  try {
    const transactions = await Transaction.find().sort({ date: -1 });
    res.json(transactions);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Add a transaction
router.post("/", async (req, res) => {
  const { amount, date, description, category } = req.body;

  if (!amount || !date || !description || !category) {
    return res.status(400).json({ message: "All fields are required" });
  }

  try {
    const newTransaction = new Transaction({
      amount,
      date,
      description,
      category,
    });
    await newTransaction.save();
    res.status(201).json(newTransaction);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Delete a transaction
router.delete("/:id", async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Transaction deleted" });
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

// Update a transaction
router.put("/:id", async (req, res) => {
  const { amount, date, description, category } = req.body;

  try {
    const updated = await Transaction.findByIdAndUpdate(
      req.params.id,
      { amount, date, description, category },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
