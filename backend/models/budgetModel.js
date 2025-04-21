const mongoose = require("mongoose");

const budgetSchema = new mongoose.Schema({
  month: String,
  year: String,
  budgets: [
    {
      category: String,
      amount: Number,
    },
  ],
});

module.exports = mongoose.model("Budget", budgetSchema);
