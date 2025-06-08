require("dotenv").config();

// Initialize Admin before anything else
const { initializeFirebaseAdmin } = require("./middleware/firebaseAdmin");
initializeFirebaseAdmin();

const express = require("express");
const cors = require("cors");
const verifyToken = require("./middleware/authMiddleware");
const articleRoutes = require("./routes/articleRoutes");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/health", (req, res) => res.json({ status: "articles-service up" }));

// All /articles routes require auth
app.use("/articles", verifyToken, articleRoutes);

const PORT = process.env.PORT || 5005;
app.listen(PORT, () => console.log(`Articles Service listening on port ${PORT}`));
