import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import "./LoginPage.css";



function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:3000/auth/login", {
        email,
        password,
      });

      const token = res.data.token;

      localStorage.setItem("token", token);

      setMessage("로그인 성공!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 500);
    } catch (error) {
      setMessage(error.response?.data?.message || "로그인 실패");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h1 className="auth-logo">
          Money<span>Log</span>
        </h1>

        <p className="auth-subtitle">내 소비를 한눈에 관리하세요</p>
        
        <div className="auth-form">
          <input
            type="email"
            placehodler="이메일"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input 
            type="password"
            placeholder="비밀번호"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button onClick={handleLogin}>로그인</button>
        </div>

        {message && <p className="auth-message">{message}</p>}

        <p className="auth-link-text">
          계정이 없으면 <Link to="/register">회원가입</Link>
        </p>
      </div>
    </div>
  );
}
export default LoginPage;