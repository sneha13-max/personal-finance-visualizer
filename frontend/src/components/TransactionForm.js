import React, { useState, useEffect } from "react";
import { addTransaction, updateTransaction } from "../services/api";
import { motion } from "framer-motion";

const categories = ["Food", "Transport", "Utilities", "Entertainment", "Other"];

const TransactionForm = ({ fetchTransactions, editing, setEditing }) => {
  const [form, setForm] = useState({
    amount: "",
    date: "",
    description: "",
    category: "", // This must match model field name
  });

  useEffect(() => {
    if (editing) {
      setForm({
        amount: editing.amount || "",
        date: editing.date || "",
        description: editing.description || "",
        category: editing.category || "",
      });
    }
  }, [editing]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Prevent form submission if category is not selected
    if (!form.category || form.category.trim() === "") {
      alert("Please select a valid category.");
      return;
    }

    if (editing) {
      await updateTransaction(editing._id, form);
      setEditing(null);
    } else {
      await addTransaction(form);
    }

    setForm({
      amount: "",
      date: "",
      description: "",
      category: "",
    });

    fetchTransactions();
  };

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="bg-white shadow-lg rounded-lg p-8 mb-6 space-y-6"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        Add Transaction
      </h2>

      <div className="space-y-4">
        <div>
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={form.amount}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <input
            type="text"
            name="description"
            placeholder="Description"
            value={form.description}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <select
            name="category"
            value={form.category}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 px-4 py-3 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">Select Category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-md hover:bg-blue-700 transition duration-200"
        >
          {editing ? "Update Transaction" : "Add Transaction"}
        </button>
      </div>
    </motion.form>
  );
};

export default TransactionForm;
