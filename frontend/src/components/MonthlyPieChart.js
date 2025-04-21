import React from "react";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import dayjs from "dayjs";

const COLORS = [
  "#8884d8",
  "#82ca9d",
  "#ffc658",
  "#ff7f50",
  "#8dd1e1",
  "#a4de6c",
  "#d0ed57",
  "#8884d8",
];

const getMonthName = (dateStr) => {
  return dayjs(dateStr).format("MMM");
};

const MonthlyPieChart = ({ transactions }) => {
  const monthlyMap = {};

  transactions.forEach((txn) => {
    const month = getMonthName(txn.date); // e.g., "Jan"
    monthlyMap[month] = (monthlyMap[month] || 0) + txn.amount;
  });

  const monthlyData = Object.entries(monthlyMap).map(([month, value]) => ({
    name: month,
    value,
  }));

  return (
    <div className="bg-white p-4 rounded-lg shadow mt-6">
      <h3 className="text-lg font-semibold mb-4">Expenses by Month</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={monthlyData}
            dataKey="value"
            nameKey="name"
            cx="50%"
            cy="50%"
            outerRadius={100}
            label
          >
            {monthlyData.map((entry, index) => (
              <Cell
                key={`cell-${index}`}
                fill={COLORS[index % COLORS.length]}
              />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </div>
  );
};

export default MonthlyPieChart;
