import { useState } from "react";
import axios from "axios";

function App() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const handleLogin = async () => {
    try {
      const res = await axios.post(
        "http://localhost:3000/auth/login",
        {
          email,
          password,
        }
      );

      const token = res.data.token;

      localStorage.setItem("token", token);

      setMessage("로그인 성공!");
    } catch (err) {
      setMessage("로그인 실패");
    }
  };

  return (
    <div style={{ padding: "50px" }}>
      <h1>로그인</h1>

      <input
        placeholder="이메일"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />

      <br />

      <input
        type="password"
        placeholder="비밀번호"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />

      <br />

      <button onClick={handleLogin}>로그인</button>

      <p>{message}</p>
    </div>
  );
}

export default App;