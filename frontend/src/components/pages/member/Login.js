import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

import { loginUser } from "../../../services/authService";

const Login = ({ setIsLoggedIn }) => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    loginUser(form, setIsLoggedIn, navigate, setError);
  };

  return (
    <div
      className="search-container"
      style={{ flexDirection: "column", width: "30%", marginTop: "50px" }}
    >
      <h2 style={{ textAlign: "center" }}>로그인</h2>

      <form onSubmit={handleSubmit}>
        <input
          type="email"
          name="email"
          placeholder="이메일"
          required
          onChange={handleChange}
          value={form.email}
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <input
          type="password"
          name="password"
          placeholder="비밀번호"
          required
          onChange={handleChange}
          value={form.password}
          style={{ width: "100%", marginBottom: "20px" }}
        />
        <button type="submit" className="search-button" style={{ width: "100%" }}>
          로그인
        </button>
        {error && (
          <p style={{ color: "red", textAlign: "center" }}>{error}</p>
        )}
      </form>
      <p style={{ textAlign: "center", marginTop: "10px" }}>
        계정이 없으신가요? <Link to="/signup">회원가입</Link>
      </p>
    </div>
  );
};

export default Login;
