function TransactionList({
  transactions,
  handleStartEdit,
  handleDeleteTransaction,
}) {
  return (
    <section className="panel">
      <h2 className="panel-title">거래 내역</h2>

      {transactions.length === 0 ? (
        <p className="empty-text">거래 내역이 없습니다.</p>
      ) : (
        <div className="transaction-list">
          {transactions.map((transaction) => {
            const isIncome = transaction.type === "INCOME";

            return (
              <div className="transaction-item" key={transaction.id}>
                <div className="transaction-info">
                  <div
                    className={`transaction-icon ${
                      isIncome ? "income-bg" : "expense-bg"
                    }`}
                  >
                    {isIncome ? "💵" : "🛒"}
                  </div>

                  <div>
                    <strong>{transaction.category}</strong>
                    <p>{transaction.description || "설명 없음"}</p>
                  </div>
                </div>

                <span
                  className={`type-badge ${
                    isIncome ? "badge-income" : "badge-expense"
                  }`}
                >
                  {isIncome ? "수입" : "지출"}
                </span>

                <strong className={isIncome ? "income-text" : "expense-text"}>
                  {isIncome ? "+" : "-"}
                  {transaction.amount.toLocaleString()}원
                </strong>

                <span className="transaction-date">
                  {new Date(transaction.date).toLocaleDateString()}
                </span>

                <div className="action-buttons">
                  <button
                    className="edit-button"
                    onClick={() => handleStartEdit(transaction)}
                  >
                    수정
                  </button>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteTransaction(transaction.id)}
                  >
                    삭제
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default TransactionList;