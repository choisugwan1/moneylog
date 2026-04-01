const {
  createTransactionService,
  getTransactionsService,
  updateTransactionService,
  deleteTransactionService,
  getTransactionSummaryService,
} = require("../services/transactionService");

const createTransaction = async (req, res) => {
  try {
    const userId = req.user.userId;

    const transaction = await createTransactionService(
      userId,
      req.body
    );

    res.status(201).json({
      message: "거래 생성 성공",
      transaction,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

const getTransactions = async(req, res) => {
    try{
        const userId = req.user.userId;
        const filters = req.query;

        const transactions = await getTransactionsService(userId, filters);
        res.status(200).json({
            transactions,
        });
    }catch(error){
        res.status(400).json({
            message: error.message,
        });
    }
};

const updateTransaction = async (req, res) => {
    try{
        const userId = req.user.userId;
        const transactionId = Number(req.params.id);

        const updatedTransaction = await updateTransactionService(
            userId,
            transactionId,
            req.body,
        );

        res.status(200).json({
            message : "거래 수정 성공",
            transaction: updatedTransaction,
        });
    }catch(error){
        res.status(400).json({
            message: error.message,
        });
    }
};

const deleteTransaction = async(req,res) => {
    try{
        const userId = req.user.userId;
        const transactionId = Number(req.params.id);

        await deleteTransactionService(userId, transactionId);

        res.status(200).json({
            message: "거래 삭제 성공",
        });
    }catch(error){
        res.status(400).json({
            message: error.message,
        });
    }
};

const getTransactionSummary = async(req, res)=> {
    try{
        const userId = req.user.userId;
        
        const {month} = req.query;

        const summary = await getTransactionSummaryService(userId, month);

        res.status(200).json(summary);
        
    }catch(error){
        res.staus(400).json({
            message: error.message,
        });
    }
};

module.exports = {
  createTransaction,
  getTransactions,
  updateTransaction,
  deleteTransaction,
  getTransactionSummary,
};