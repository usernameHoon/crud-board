import React, { useState } from "react";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/layouts/Header";
import Footer from "./components/layouts/Footer";
import Register from "./components/pages/member/Register";
import Login from "./components/pages/member/Login";
import Home from "./components/pages/Home";
import PostWrite from "./components/pages/post/PostWrite";
import PostDetail from "./components/pages/post/PostDetail";
import PostEdit from "./components/pages/post/PostEdit";  // ✅ PostEdit 추가
import PrivateRoute from "./router/PrivateRoute";
import NotFound from "./components/pages/NotFound";


import "./styles/styles.css";
import TitleUpdater from "./utils/TitleUpdater";

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(() => !!localStorage.getItem("token"));

  return (
    <Router>
      <TitleUpdater />
      <div className="app">
        <main>
          <Header isLoggedIn={isLoggedIn} setIsLoggedIn={setIsLoggedIn} />
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/signup" element={<Register />} />
            <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
            <Route path="/write" element={<PrivateRoute><PostWrite /></PrivateRoute>} />
            <Route path="/post/:postId" element={<PostDetail />} />
            <Route path="/post-edit/:postId" element={<PrivateRoute><PostEdit /></PrivateRoute>} />  {/* ✅ 수정 페이지 라우트 추가 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
};


export default App;
