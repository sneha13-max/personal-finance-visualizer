import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";

const COLORS = ["#8884d8", "#82ca9d", "#ffc658", "#ff7f50", "#a29bfe"];

const CategoryPieChart = ({ transactions }) => {
  if (!transactions || transactions.length === 0) return null;

  const grouped = transactions.reduce((acc, txn) => {
    const key = txn.category || "Uncategorized";
    acc[key] = (acc[key] || 0) + Number(txn.amount);
    return acc;
  }, {});

  const data = Object.entries(grouped).map(([name, value]) => ({
    name,
    value,
  }));

  return (
    <motion.div
      className="bg-white p-6 rounded shadow mt-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <h2 className="text-2xl font-semibold text-blue-600 mb-4">
        Expenses by Category
      </h2>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {data.map((entry, index) => (
              <Cell key={index} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  );
};

export default CategoryPieChart;
