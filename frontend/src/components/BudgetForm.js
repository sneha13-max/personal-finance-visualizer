import React, { useState } from "react";
import axios from "axios";

const categories = ["Food", "Transport", "Utilities", "Entertainment", "Other"];

const BudgetForm = ({ fetchBudgets, setBudgets }) => {
  const initialState = {
    Food: "",
    Transport: "",
    Utilities: "",
    Entertainment: "",
    Other: "",
  };

  const [budget, setBudget] = useState(initialState);

  const handleChange = (e) => {
    setBudget({
      ...budget,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const now = new Date();
    const month = now.toLocaleString("default", { month: "short" }); // e.g., "Apr"
    const year = now.getFullYear().toString(); // e.g., "2025"

    try {
      await axios.post(`${process.env.REACT_APP_API_URL}/budgets/save`, {
        month,
        year,
        budgets: Object.entries(budget).map(([category, amount]) => ({
          category,
          amount: parseFloat(amount),
        })),
      });

      // Update UI and reset
      // setBudgets({ ...budget });
      await fetchBudgets();
      alert("Budgets saved successfully ✅");

      // Reset form values to zero
      setBudget({
        Food: "",
        Transport: "",
        Utilities: "",
        Entertainment: "",
        Other: "",
      });
    } catch (error) {
      console.error("Error saving budget:", error);
      alert("❌ Failed to save budget");
    }
  };

  return (
    <div className="bg-white p-6 rounded shadow mt-6">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        Set Monthly Budgets
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {categories.map((category) => (
          <div key={category} className="flex justify-between">
            <label className="font-semibold">{category}</label>
            <input
              type="number"
              name={category}
              value={budget[category]}
              onChange={handleChange}
              placeholder={`Enter ${category} Budget`}
              className="border border-gray-300 px-4 py-2 rounded-md"
              required
            />
          </div>
        ))}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition duration-200"
        >
          Save Budgets
        </button>
      </form>
    </div>
  );
};

export default BudgetForm;
