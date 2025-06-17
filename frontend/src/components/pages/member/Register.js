import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom"; // Link와 useNavigate 사용

import { registerUser } from "../../../services/authService";

const Register = () => {
  const [form, setForm] = useState({ email: "", password: "", confirmPassword: "", name: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (form.password !== form.confirmPassword) {
      setError("비밀번호가 일치하지 않습니다.");
      return;
    }

    registerUser(form, navigate, setError);
  };

  return (
    <div className="search-container" style={{ flexDirection: "column", width: "30%", marginTop: "50px" }}>
      <h2 style={{ textAlign: "center" }}>회원가입</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="이름"
          required
          onChange={handleChange}
          value={form.name}
          style={{ width: "100%", marginBottom: "10px" }}
        />
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
          style={{ width: "100%", marginBottom: "10px" }}
        />
        <input
          type="password"
          name="confirmPassword"
          placeholder="비밀번호 확인"
          required
          onChange={handleChange}
          value={form.confirmPassword}
          style={{ width: "100%", marginBottom: "20px" }}
        />
        <button type="submit" className="search-button" style={{ width: "100%" }}>
          회원가입
        </button>
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}
      </form>
      <p style={{ textAlign: "center", marginTop: "10px" }}>
        이미 계정이 있으신가요? <Link to="/login">로그인</Link>
      </p>
    </div>
  );
};

export default Register;
