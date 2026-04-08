import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function DashboardPage() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });

  const navigate = useNavigate();

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

  const fetchTransactions = async (token) => {
    try {
      const res = await axios.get("http://localhost:3000/transactions", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setTransactions(res.data.transactions);
    } catch (error) {
      setTransactions([]);
    }
  };

  const fetchSummary = async (token) => {
    try {
      const currentMonth = new Date().toISOString().slice(0, 7);

      const res = await axios.get(
        `http://localhost:3000/transactions/summary?month=${currentMonth}`,
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

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/login");
      return;
    }

    fetchMe(token);
    fetchTransactions(token);
    fetchSummary(token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div style={{ padding: "50px" }}>
      <h1>MoneyLog 대시보드</h1>

      <p>로그인한 사용자 이메일: {user?.email}</p>

      <button onClick={handleLogout}>로그아웃</button>

      <hr />

      <h2>이번 달 요약</h2>
      <p>수입: {summary.income}원</p>
      <p>지출: {summary.expense}원</p>
      <p>잔액: {summary.balance}원</p>

      <hr />

      <h2>거래 목록</h2>

      {transactions.length === 0 ? (
        <p>거래 내역이 없습니다.</p>
      ) : (
        <ul>
          {transactions.map((transaction) => (
            <li key={transaction.id}>
              [{transaction.type}] {transaction.category} /{" "}
              {transaction.amount}원 / {transaction.description} /{" "}
              {new Date(transaction.date).toLocaleDateString()}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DashboardPage;