import axios from "axios";
const API_URL = "http://localhost:5000/api/transactions";
const BUDGET_API_URL = "http://localhost:5000/api/budgets";

export const getTransactions = async () => {
  const res = await fetch(API_URL);
  const data = await res.json();
  return data;
};

export const addTransaction = async (transaction) => {
  await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction),
  });
};

export const updateTransaction = async (id, transaction) => {
  await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(transaction),
  });
};

export const deleteTransaction = async (id) => {
  await fetch(`${API_URL}/${id}`, { method: "DELETE" });
};

// export const getBudgets = async () => {
//   const res = await fetch(BUDGET_API_URL);
//   const data = await res.json();
//   return data;
// };

export const getBudget = async (month, year) => {
  const res = await fetch(
    `http://localhost:5000/api/budgets?month=${month}&year=${year}`
  );
  const data = await res.json();
  return data;
};

export const saveBudgets = async (budgetData) => {
  await fetch(BUDGET_API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(budgetData),
  });
};

export const fetchBudgets = async (userId, month, year) => {
  try {
    const res = await axios.get(`${BUDGET_API_URL}/${userId}/${month}/${year}`);
    return res.data; // This should return the data like { budgets: [...] }
  } catch (error) {
    console.error("Error fetching budgets:", error);
    return null; // Return null in case of error
  }
};
