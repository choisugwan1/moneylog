import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./DashboardPage.css";


function DashboardPage() {
  const [user, setUser] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [summary, setSummary] = useState({
    income: 0,
    expense: 0,
    balance: 0,
  });
  const [editingId, setEditingId] = useState(null);
  const  [selectedMonth, setSelectedMonth] = useState(
    new Date().toISOString().slice(0,7)
  );


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

  const fetchTransactions = async (token, month = selectedMonth) => {
    try {
      const res = await axios.get(`http://localhost:3000/transactions?month=${month}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

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

  await fetchTransactions(token, selectedMonth);
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

      if (!token){
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
    }else {
      await axios.post(
        "http://localhost:3000/transactions",
        transactionData,
        {
          headers: {
            Authorization : `Bearer ${token}`,
          },
        }
      );

      setMessage("거래 등록 성공");
    }

    setCategory("");
    setAmount("");
    setDescription("");
    setDate(new Date().toISOString().slice(0,10));
    setType("EXPENSE");

    await refreshData();
  }catch(error){
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
    setDate(transaction.date.slice(0,10));
  };

  const handleMonthChange = async (e) => {
    const month = e.target.value;
    setSelectedMonth(month);

    const token = getToken();
    if (!token){
      navigate("/login");
      return;
    }

    await fetchTransactions(token, month);
    await fetchSummary(token, month);
  }

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/login");
  };

  return (
    <div className= "dashboard-page">
      <h1>MoneyLog 대시보드</h1>

      <p>로그인한 사용자 이메일: {user?.email}</p>

      <button onClick={handleLogout}>로그아웃</button>

      <div>
        <label>조회 월:</label>
        <input
          type="month"
          value={selectedMonth}
          onChange={handleMonthChange}
        />
      </div>

      <hr />

      <h2>이번 달 요약</h2>
      <p>수입: {summary.income}원</p>
      <p>지출: {summary.expense}원</p>
      <p>잔액: {summary.balance}원</p>

      <hr />

      <h2>거래 등록</h2>

      <div>
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="INCOME">수입</option>
          <option value="EXPENSE">지출</option>
        </select>
      </div>

      <br />

      <div>
        <input
          type="text"
          placeholder="카테고리"
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        />
      </div>

      <br />

      <div>
        <input
          type="number"
          placeholder="금액"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>

      <br />

      <div>
        <input
          type="text"
          placeholder="설명"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      <br />

      <div>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
        />
      </div>

      <br />

      <button onClick={handleSubmitTransaction}>
        {editingId ? "거래 수정" : "거래 등록"}
      </button>

      <p>{message}</p>

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
              {new Date(transaction.date).toLocaleDateString()}{" "}
              <button onClick={() => handleDeleteTransaction(transaction.id)}>
                삭제
              </button>
              <button onClick={() => handleStartEdit(transaction)}>
                수정
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default DashboardPage;