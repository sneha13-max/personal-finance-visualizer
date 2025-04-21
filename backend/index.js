// backend/index.js

require("dotenv").config(); // Load .env at the top

const express = require("express");
const cors = require("cors");
const connectDB = require("./config/db");

const app = express();

app.use(cors());
app.use(express.json());

// Connect to the database
connectDB();

// Routes
app.use("/api/transactions", require("./routes/transactionRoutes"));
app.use("/api/budgets", require("./routes/budgetRoutes")); // Add this line for budgets

// Define other routes as necessary (e.g., for user authentication or other features)
app.get("/", (req, res) => {
  res.send("Hello from backend");
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`Server running on port ${PORT}`);
);
