import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const categories = ["Food", "Transport", "Utilities", "Entertainment", "Other"];

const BudgetDisplay = ({ transactions }) => {
  const [budgets, setBudgets] = useState({});

  const getCurrentMonthYear = () => {
    const now = new Date();
    const month = now.toLocaleString("default", { month: "short" }); // e.g., "Apr"
    const year = now.getFullYear().toString(); // e.g., "2025"
    return { month, year };
  };

  const fetchBudgets = async () => {
    try {
      const { month, year } = getCurrentMonthYear();
      const res = await axios.get(
        `${process.env.REACT_APP_API_URL}/budgets?month=${month}&year=${year}`
      );
      const rawBudgets = res.data?.budgets || [];

      const formatted = rawBudgets.reduce((acc, item) => {
        acc[item.category] = item.amount;
        return acc;
      }, {});

      setBudgets(formatted);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  const getTotalSpent = (category) => {
    return transactions
      .filter((txn) => txn.category === category)
      .reduce((acc, txn) => acc + txn.amount, 0);
  };

  // Chart data combining both budgeted and actual amounts
  const chartData = categories.map((category) => ({
    category,
    Budgeted: budgets[category] || 0,
    Spent: getTotalSpent(category),
  }));

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow mt-6">
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        Monthly Budget
      </h2>

      {/* Breakdown in text format */}
      <div className="space-y-4 mb-8">
        {categories.map((category) => (
          <div key={category} className="flex justify-between">
            <span className="font-semibold">{category}</span>
            <div className="flex items-center space-x-4">
              <span className="text-gray-600">
                Budget: ₹{budgets[category] || 0}
              </span>
              <span className="text-gray-600">
                Spent: ₹{getTotalSpent(category)}
              </span>
              <span className="text-gray-600">
                Left: ₹{(budgets[category] || 0) - getTotalSpent(category)}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Budget vs Actual Bar Chart */}
      <h3 className="text-xl font-semibold mb-2 text-gray-700">
        Budget vs Actual Spending
      </h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 10, right: 20, bottom: 10, left: 0 }}
        >
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Budgeted" fill="#3B82F6" />
          <Bar dataKey="Spent" fill="#F59E0B" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default BudgetDisplay;
