import React, { useEffect, useState } from "react";
import axios from "axios";
import { getTransactions } from "./services/api";
import TransactionForm from "./components/TransactionForm";
import TransactionList from "./components/TransactionList";
import CategoryPieChart from "./components/CategoryPieChart";
import BudgetForm from "./components/BudgetForm";
import BudgetDisplay from "./components/BudgetDisplay";
import { motion } from "framer-motion";

function App() {
  const [transactions, setTransactions] = useState([]);
  const [budgets, setBudgets] = useState({});
  const [editing, setEditing] = useState(null);

  const getCurrentMonthYear = () => {
    const now = new Date();
    const month = now.toLocaleString("default", { month: "short" }); // e.g., "Apr"
    const year = now.getFullYear().toString(); // e.g., "2025"
    return { month, year };
  };

  const fetchTransactions = async () => {
    const data = await getTransactions();
    setTransactions(data);
  };

  const fetchBudgets = async () => {
    try {
      const { month, year } = getCurrentMonthYear();
      const res = await axios.get(
        `http://localhost:5000/api/budgets/${month}/${year}`
      );
      const rawBudgets = res.data?.budgets || [];

      // Convert to key-value pair object
      const formattedBudgets = rawBudgets.reduce((acc, item) => {
        acc[item.category] = item.amount;
        return acc;
      }, {});

      setBudgets(formattedBudgets);
    } catch (error) {
      console.error("Error fetching budgets:", error);
    }
  };

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <nav className="bg-blue-600 p-4">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
          <h1 className="text-2xl text-white font-semibold">
            💸 Finance Tracker
          </h1>
        </div>
      </nav>

      <div className="max-w-3xl mx-auto p-6">
        <motion.div
          className="space-y-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <TransactionForm
            fetchTransactions={fetchTransactions}
            editing={editing}
            setEditing={setEditing}
          />
          <TransactionList
            transactions={transactions}
            fetchTransactions={fetchTransactions}
            setEditing={setEditing}
          />
          <BudgetForm fetchBudgets={fetchBudgets} setBudgets={setBudgets} />
          <BudgetDisplay budgets={budgets} transactions={transactions} />
          <CategoryPieChart transactions={transactions} />
        </motion.div>
      </div>
    </div>
  );
}

export default App;
