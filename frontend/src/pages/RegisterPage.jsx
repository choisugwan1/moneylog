import { useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";

function RegisterPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // 페이지를 코드로 이동시키는 함수이다. 회원가입 성공 후 로그인 페이지로 이동 시키려고 쓴다

  const handleRegister = async () => {
    try {
      await axios.post("http://localhost:3000/auth/register", {
        email,
        password,
      });

      setMessage("회원가입 성공! 로그인 페이지로 이동합니다.");

      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (error) {
      setMessage(error.response?.data?.message || "회원가입 실패");
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h1>회원가입</h1>

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

      <button onClick={handleRegister}>회원가입</button>

      <p>{message}</p>

      <p>
        이미 계정이 있으면 <Link to="/login">로그인</Link>
      </p>
    </div>
  );
}

export default RegisterPage;