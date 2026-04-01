const prisma = require("../lib/prisma");

const createTransactionService = async (userId, data) => {
  const { type, amount, category, description, date } = data;

  const transaction = await prisma.transaction.create({
    data: {
      type,
      amount,
      category,
      description,
      date: new Date(date),
      userId,
    },
  });

  return transaction;
};

const getTransactionsService = async(userId, filters)=>{
    const {type, category, month} = filters;

    const where = {
        userId,
    };

    if (type) {
        where.type = type;
    }
    
    if (category) {
        where.category = category;
    }
    
    if (month){
        const startDate = new Date(`${month}-01`);
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + 1);

        where.date = {
            gte : startDate,
            lt : endDate,
        };
    }

    const transactions = await prisma.transaction.findMany({
        where,
        orderBy: {date: "desc"},
    });

    return transactions;
};

const updateTransactionService = async (userId, transactionId, data) =>{
    const existingTransaction = await prisma.transaction.findUnique({
        where: {id : transactionId},
    });

    if (!existingTransaction){
        throw new Error("거래를 찾을 수 없습니다");
    }
    
    if (existingTransaction.userId !== userId){
        throw new Error("본인의 거래만 수정할 수 있습니다");
    }

    const {type, amount, category, description, date} = data;

    const uqdatedTransaction = await prisma.transation.update({
        where: {id : transactionId},
        data: {
            type,
            amount,
            category,
            description,
            date: new Date(date),
        },
    });
    return uqdatedTransaction;
};

const deleteTransactionService = async(userId, transactionId) => {
    const existingTransaction = await prisma.transaction.findUnique({
        where: {id : transactionId},
    });

    if (!existingTransaction){
        throw new Error("거래를 찾을 수 없습니다");
    }

    if (existingTransaction.userId !== userId){
        throw new Error("본인의 거래만 삭제할 수 있습니다");
    }

    await prisma.transaction.delete({
        where: {id: transactionId},
    });
};

const getTransactionSummaryService = async(userId, month) => {
    if (!month){
        throw new Error("month 쿼리가 필요합니다. 예 : 2026-04");
    }

    const startDate = new Date(`${month}-01`);
    const endDate = new Date(startDate);
    endDate.setMonth(endDate.getMonth() + 1);

    const transactions = await prisma.transaction.findMany({
        where: {
            userId,
            date: {
                gte: startDate,
                lt: endDate,
            },
        },
    });

    let income = 0;
    let expense = 0;

    for (const transaction of transactions) {
        if (transaction.type === "income"){
            income += transaction.amount;
        }else if (transaction.type === "expense"){
            expense += transaction.amount;
        }
    }

    const balance = income - expense;

    return {
        income,
        expense,
        balance,
    };
};

module.exports = {
  createTransactionService,
  getTransactionsService,
  updateTransactionService,
  deleteTransactionService,
  getTransactionSummaryService
};