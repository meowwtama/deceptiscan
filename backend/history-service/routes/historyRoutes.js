const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/authMiddleware");

const {
  createHistory,
  getAllHistory,
  getHistoryById,
  updateHistory,
  deleteHistory,
} = require("../controllers/historyController");

// All routes below require a valid ID token
router.use(verifyToken);

router.post("/:service", createHistory);
router.get("/:service", getAllHistory);
router.get("/:service/:id", getHistoryById);
router.put("/:service/:id", updateHistory);
router.delete("/:service/:id", deleteHistory);

module.exports = router;
