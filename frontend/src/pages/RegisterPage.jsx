import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:3000/auth/register", {
        email,
        password,
      });

      setMessage("회원가입 성공! 로그인 페이지로 이동합니다.");

      setTimeout(() => {
        navigate("/login");
      }, 700);
    } catch (error) {
      setMessage(error.response?.data?.message || "회원가입 실패");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-logo">
          Money<span>Log</span>
        </h1>

        <p className="auth-subtitle">새 계정을 만들고 소비 관리를 시작하세요</p>

        <div className="auth-form">
          <input
            type="email"
            placeholder="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleRegister}>회원가입</button>
        </div>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-link-text">
          이미 계정이 있으면 <Link to="/login">로그인</Link>
        </p>
      </div>
    </div>
  );
}

export default RegisterPage;