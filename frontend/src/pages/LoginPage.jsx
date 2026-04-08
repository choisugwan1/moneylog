import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

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
    <div style={{ padding: "50px" }}>
      <h1>로그인</h1>

      <div>
        <input
          type="email"
          placeholder="이메일"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>

      <br />

      <div>
        <input
          type="password"
          placeholder="비밀번호"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>

      <br />

      <button onClick={handleLogin}>로그인</button>

      <p>{message}</p>

      <p>
        계정이 없으면 <Link to="/register">회원가입</Link>
      </p>
    </div>
  );
}

export default LoginPage;