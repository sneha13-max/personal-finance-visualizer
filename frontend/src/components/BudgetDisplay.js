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
    const month = now.toLocaleString("default", { month: "short" });
    const year = now.getFullYear().toString();
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

  const chartData = categories.map((category) => ({
    category,
    Budgeted: budgets[category] || 0,
    Spent: getTotalSpent(category),
  }));

  useEffect(() => {
    fetchBudgets();
  }, []);

  return (
    <div className="bg-white p-6 rounded shadow mt-6 overflow-x-auto">
      <h2 className="text-2xl font-semibold text-blue-600 mb-6">
        Monthly Budget Overview
      </h2>

      {/* Table Format */}
      <table className="w-full table-auto border-collapse text-left mb-10">
        <thead>
          <tr className="bg-gray-100">
            <th className="p-3">Category</th>
            <th className="p-3">Budgeted (₹)</th>
            <th className="p-3">Spent (₹)</th>
            <th className="p-3">Left (₹)</th>
          </tr>
        </thead>
        <tbody>
          {categories.map((category) => {
            const budget = budgets[category] || 0;
            const spent = getTotalSpent(category);
            const left = budget - spent;

            return (
              <tr key={category} className="border-t">
                <td className="p-3 font-medium">{category}</td>
                <td className="p-3">{budget}</td>
                <td className="p-3">{spent}</td>
                <td
                  className={`p-3 font-semibold ${
                    left < 0 ? "text-red-600" : "text-green-600"
                  }`}
                >
                  {left}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      {/* Chart */}
      <h2 className="text-2xl font-semibold text-blue-600 mb-6">
        Budget vs Actual Spending
      </h2>
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
