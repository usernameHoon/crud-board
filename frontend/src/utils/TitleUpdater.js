import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const TitleUpdater = () => {
  const location = useLocation();

  useEffect(() => {
    const titles = {
      "/": "홈 | MyApp",
      "/signup": "회원가입 | MyApp",
      "/login": "로그인 | MyApp",
      "/write": "글쓰기 | MyApp",
      "/post-edit": "게시글 수정 | MyApp",
    };

    // PostDetail과 PostEdit의 경우 postId가 동적으로 변함
    if (location.pathname.startsWith("/post/")) {
      document.title = "게시글 상세 | MyApp";
    } else if (location.pathname.startsWith("/post-edit/")) {
      document.title = "게시글 수정 | MyApp";
    } else {
      document.title = titles[location.pathname] || "MyApp";
    }
  }, [location]);

  return null;
};

export default TitleUpdater;
