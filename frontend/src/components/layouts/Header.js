import { Link } from "react-router-dom";
import { useEffect, useState } from "react";

const Header = ({ isLoggedIn, setIsLoggedIn }) => {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      setUserName(user.name); // user 객체에서 name 가져오기
    }
  }, [isLoggedIn]); // isLoggedIn 변경될 때마다 다시 체크

  const handleLogout = (e) => {
    e.preventDefault(); // Link의 기본 동작(즉, to="/"로 이동)을 막음
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setIsLoggedIn(false); // ✅ 즉시 상태 업데이트
    setUserName(""); // 사용자 이름 초기화
    alert("로그아웃 되었습니다.");
  };

  return (
    <header className="header">
      <span>
        <Link to="/">Home</Link>
      </span>
      <div>
        {isLoggedIn ? (
          <>
            <span style={{ fontSize: "1rem", marginRight: "10px" }}>[ {userName} ]님 환영합니다.</span>{/* ✅ 로그인한 사용자 이름 표시 */}
            <Link to="/" onClick={handleLogout}>로그아웃</Link>
          </>
        ) : (
          <>
            <Link to="/signup">회원가입</Link>
            <Link to="/login">로그인</Link>
          </>
        )}
      </div>
    </header>
  );
};

export default Header;
