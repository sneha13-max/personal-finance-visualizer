import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const MonthlyBarChart = ({ transactions }) => {
  const monthlyData = transactions.reduce((acc, transaction) => {
    const month = new Date(transaction.date).getMonth();
    const year = new Date(transaction.date).getFullYear();
    const key = `${year}-${month + 1}`;

    if (!acc[key]) {
      acc[key] = { month: key, amount: 0 };
    }

    acc[key].amount += transaction.amount;
    return acc;
  }, {});

  const chartData = Object.values(monthlyData);

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Monthly Expenses</h2>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="amount" fill="#8884d8" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyBarChart;
