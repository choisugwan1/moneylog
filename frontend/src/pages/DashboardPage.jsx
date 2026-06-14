import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";
import SummaryCards from "../components/SummaryCards";
import ExpensePieChart from "../components/ExpensePieChart";
import TransactionList from "../components/TransactionList";

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  const [editingId, setEditingId] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0, 7)
  );

  const [filterType, setFilterType] = useState("");
  const [filterCategory, setFilterCategory] = useState("");

  const [type, setType] = useState("EXPENSE");
  const [category, setCategory] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().slice(0, 10));
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const getToken = () => localStorage.getItem("token");

  const fetchMe = async (token) => {
    try {
      const res = await axios.get("http://localhost:3000/auth/me", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setUser(res.data.user);
    } catch (error) {
      setUser(null);
      navigate("/login");
    }
  };

  const fetchTransactions = async (
    token,
    month = selectedMonth,
    type = filterType,
    category = filterCategory
  ) => {
    try {
      const params = new URLSearchParams();

      if (month) params.append("month", month);
      if (type) params.append("type", type);
      if (category) params.append("category", category);

      const res = await axios.get(
        `http://localhost:3000/transactions?${params.toString()}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setTransactions(res.data.transactions);
    } catch (error) {
      setTransactions([]);
    }
  };

  const fetchSummary = async (
    token,
    month = new Date().toISOString().slice(0, 7)
  ) => {
    try {
      const res = await axios.get(
        `http://localhost:3000/transactions/summary?month=${month}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setSummary(res.data);
    } catch (error) {
      setSummary({
        income: 0,
        expense: 0,
        balance: 0,
      });
    }
  };

  const refreshData = async () => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    await fetchTransactions(token, selectedMonth, filterType, filterCategory);
    await fetchSummary(token, selectedMonth);
  };

  useEffect(() => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    fetchMe(token);
    fetchTransactions(token, selectedMonth);
    fetchSummary(token, selectedMonth);
  }, []);

  const handleSubmitTransaction = async () => {
    try {
      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      const transactionData = {
        type,
        category,
        amount: Number(amount),
        description,
        date,
      };

      if (editingId) {
        await axios.put(
          `http://localhost:3000/transactions/${editingId}`,
          transactionData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("거래 수정 성공");
        setEditingId(null);
      } else {
        await axios.post(
          "http://localhost:3000/transactions",
          transactionData,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        setMessage("거래 등록 성공");
      }

      setCategory("");
      setAmount("");
      setDescription("");
      setDate(new Date().toISOString().slice(0, 10));
      setType("EXPENSE");

      await refreshData();
    } catch (error) {
      setMessage(error.response?.data?.message || "거래 저장 실패");
    }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const token = getToken();

      if (!token) {
        navigate("/login");
        return;
      }

      await axios.delete(`http://localhost:3000/transactions/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setMessage("거래 삭제 성공!");
      await refreshData();
    } catch (error) {
      setMessage(error.response?.data?.message || "거래 삭제 실패");
    }
  };

  const handleStartEdit = (transaction) => {
    setEditingId(transaction.id);
    setType(transaction.type);
    setCategory(transaction.category);
    setAmount(transaction.amount);
    setDescription(transaction.description);
    setDate(transaction.date.slice(0, 10));
  };

  const handleMonthChange = async (e) => {
    const month = e.target.value;
    setSelectedMonth(month);

    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    await fetchTransactions(token, month, filterType, filterCategory);
    await fetchSummary(token, month);
  };

  const handleApplyFilter = async () => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    await fetchTransactions(token, selectedMonth, filterType, filterCategory);
  };

  const handleResetFilter = async () => {
    const token = getToken();

    if (!token) {
      navigate("/login");
      return;
    }

    setFilterType("");
    setFilterCategory("");

    await fetchTransactions(token, selectedMonth, "", "");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  const expenseCategoryData = Object.values(
    transactions
      .filter((transaction) => transaction.type === "EXPENSE")
      .reduce((acc, transaction) => {
        const category = transaction.category || "기타";

        if (!acc[category]) {
          acc[category] = {
            name: category,
            value: 0,
          };
        }

        acc[category].value += transaction.amount;

        return acc;
      }, {})
  );

  return (
    <div className="dashboard-page">
      <header className="dashboard-header">
        <div className="header-left">
          <h1 className="logo">
            Money<span>Log</span>
          </h1>
          <span className="divider">|</span>
          <span className="page-name">대시보드</span>
        </div>

        <div className="header-right">
          <span>로그인한 사용자: {user?.email}</span>
          <button className="logout-button" onClick={handleLogout}>
            로그아웃
          </button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="month-filter">
          <label>조회 월 :</label>
          <input
            type="month"
            value={selectedMonth}
            onChange={handleMonthChange}
          />
        </div>

        <h2 className="section-title">이번 달 요약</h2>

        <SummaryCards summary={summary} />

        <ExpensePieChart expenseCategoryData={expenseCategoryData} />

        <section className="panel">
          <h2 className="panel-title">거래 등록</h2>

          <div className="transaction-form">
            <select value={type} onChange={(e) => setType(e.target.value)}>
              <option value="EXPENSE">지출</option>
              <option value="INCOME">수입</option>
            </select>

            <input
              type="text"
              placeholder="카테고리 (예: 식비)"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />

            <input
              type="number"
              placeholder="금액 (예: 15000)"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
            />

            <input
              type="text"
              placeholder="설명 (선택)"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />

            <input
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />

            <button
              className="primary-button"
              onClick={handleSubmitTransaction}
            >
              {editingId ? "거래 수정" : "거래 등록"}
            </button>
          </div>

          {message && <p className="message">{message}</p>}
        </section>

        <section className="panel">
          <h2 className="panel-title">거래 내역</h2>

          <div className="filter-box">
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
            >
              <option value="">전체</option>
              <option value="INCOME">수입</option>
              <option value="EXPENSE">지출</option>
            </select>

            <input
              type="text"
              placeholder="카테고리 검색"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
            />

            <button className="primary-button" onClick={handleApplyFilter}>
              필터 적용
            </button>

            <button className="edit-button" onClick={handleResetFilter}>
              초기화
            </button>
          </div>

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

                    <strong
                      className={isIncome ? "income-text" : "expense-text"}
                    >
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
                        onClick={() =>
                          handleDeleteTransaction(transaction.id)
                        }
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
      </main>
    </div>
  );
}

export default DashboardPage;