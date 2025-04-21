const Transaction = require("../models/Transaction");

// GET all
exports.getTransactions = async (req, res) => {
  const transactions = await Transaction.find().sort({ date: -1 });
  res.json(transactions);
};

// POST
exports.addTransaction = async (req, res) => {
  try {
    const { amount, date, description } = req.body;
    const newTx = await Transaction.create({ amount, date, description });
    res.status(201).json(newTx);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE
exports.deleteTransaction = async (req, res) => {
  try {
    await Transaction.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};
