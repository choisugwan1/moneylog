const express = require("express");
const router = express.Router();

const { 
    createTransaction ,
    getTransactions,
    updateTransaction,
    deleteTransaction,
    getTransactionSummary,
} = require("../controllers/transactionConstroller");

const authMiddelware = require("../middleware/authMiddleware");

router.post("/", authMiddleware, createTransaction);
router.get("/", authMiddleware, getTransations);
router.put("/:id", authMiddleware, updateTransaction);
router.delete("/:id", authMiddleware, deleteTransaction);
router.get("/summary",authMiddelware, getTransactionSummary);
module.exports = router;