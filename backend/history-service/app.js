// 1. Load environment variables from .env
require("dotenv").config();

const express = require("express");
const historyRoutes = require("./routes/historyRoutes");

const app = express();

// 2. Middleware: parse JSON bodies
app.use(express.json());

// 3. Mount the history routes at /history
//    (All endpoints will be prefixed with /history)
app.use("/history", historyRoutes);

// 4. Read port from .env or default to 8004
const PORT = process.env.PORT || 8004;

app.listen(PORT, () => {
  console.log(`History Service listening on http://0.0.0.0:${PORT}`);
});