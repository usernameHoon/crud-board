import { jwtDecode } from "jwt-decode";

import { apiRequest } from "./apiService";

export const getToken = () => localStorage.getItem("token");

export const getUserIdFromToken = () => {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode(token).userId;
  } catch (error) {
    console.error("JWT 디코딩 오류:", error);
    return null;
  }
};

export const loginUser = async (form, setIsLoggedIn, navigate, setError) => {
  try {
    const data = await apiRequest("http://localhost:8080/api/login", "POST", form);
    localStorage.setItem("token", data.token);
    localStorage.setItem("user", JSON.stringify({ userId: data.userId, email: data.email, name: data.name }));

    alert("로그인 성공!");
    setIsLoggedIn(true);
    navigate("/");
  } catch (error) {
    setError(error.message);
  }
};

export const registerUser = async (form, navigate, setError) => {
  try {
    await apiRequest("http://localhost:8080/api/signup", "POST", {
      email: form.email,
      password: form.password,
      name: form.name,
    });

    alert("회원가입 성공!");
    navigate("/login");
  } catch (error) {
    setError("이미 존재하는 이메일입니다.");
  }
};