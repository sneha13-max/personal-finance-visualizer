import React from "react";

const Dashboard = ({ transactions }) => {
  const totalExpenses = transactions.reduce(
    (acc, transaction) => acc + transaction.amount,
    0
  );

  const categoryBreakdown = transactions.reduce((acc, transaction) => {
    acc[transaction.category] =
      (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});

  const mostRecentTransaction = transactions[transactions.length - 1];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-8">
      <div className="p-4 bg-white shadow rounded">
        <h3 className="text-xl font-semibold">Total Expenses</h3>
        <p className="text-lg">{totalExpenses} INR</p>
      </div>
      <div className="p-4 bg-white shadow rounded">
        <h3 className="text-xl font-semibold">Category Breakdown</h3>
        <ul>
          {Object.entries(categoryBreakdown).map(
            ([category, amount], index) => (
              <li key={index}>
                <strong>{category}:</strong> {amount} INR
              </li>
            )
          )}
        </ul>
      </div>
      <div className="p-4 bg-white shadow rounded">
        <h3 className="text-xl font-semibold">Most Recent Transaction</h3>
        <p>
          {mostRecentTransaction
            ? mostRecentTransaction.description
            : "No transactions yet"}
        </p>
        <p>
          {mostRecentTransaction ? mostRecentTransaction.amount : "N/A"} INR
        </p>
      </div>
    </div>
  );
};

export default Dashboard;
