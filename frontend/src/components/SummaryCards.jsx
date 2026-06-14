function SummaryCards({ summary }) {
  return (
    <section className="summary-grid">
      <div className="summary-card">
        <div className="summary-icon income-bg">↑</div>
        <div>
          <p className="summary-label">수입</p>
          <p className="summary-value income-text">
            {summary.income.toLocaleString()}원
          </p>
          <p className="summary-desc">이번 달 총 수입</p>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-icon expense-bg">↓</div>
        <div>
          <p className="summary-label">지출</p>
          <p className="summary-value expense-text">
            {summary.expense.toLocaleString()}원
          </p>
          <p className="summary-desc">이번 달 총 지출</p>
        </div>
      </div>

      <div className="summary-card">
        <div className="summary-icon balance-bg">💳</div>
        <div>
          <p className="summary-label">잔액</p>
          <p className="summary-value balance-text">
            {summary.balance.toLocaleString()}원
          </p>
          <p className="summary-desc">수입 - 지출</p>
        </div>
      </div>
    </section>
  );
}

export default SummaryCards;