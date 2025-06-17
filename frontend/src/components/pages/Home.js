import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Home = () => {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5;
  const [searchType, setSearchType] = useState("title");
  const [searchKeyword, setSearchKeyword] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");

    fetch("http://localhost:8080/api/posts", {
      headers: token ? { "Authorization": `Bearer ${token}` } : {},
    })
      .then(response => response.json())
      .then(data => setPosts(data))
      .catch(error => console.error("Error fetching posts:", error));
  }, []);

  const handleWriteClick = () => {
    const token = localStorage.getItem("token");
    if (token) {
      navigate("/write");
    } else {
      alert("로그인 후 이용해주세요.");
      navigate("/login");
    }
  };

  const handleRowClick = async (postId) => {
    try {
      await fetch(`http://localhost:8080/api/posts/${postId}/increase-views`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        }
      });
      setPosts(posts.map(post =>
        post.id === postId ? { ...post, views: post.views + 1 } : post
      ));
      navigate(`/post/${postId}`);
    } catch (error) {
      console.error("조회수 증가 실패:", error);
    }
  };

  const handleSearch = () => {
    setCurrentPage(1);
  };

  const filteredPosts = posts.filter(post => {
    if (searchType === "title") {
      return post.title.toLowerCase().includes(searchKeyword.toLowerCase());
    } else if (searchType === "name") {
      return post.name.toLowerCase().includes(searchKeyword.toLowerCase());
    } else if (searchType === "content") {
      return post.content.toLowerCase().includes(searchKeyword.toLowerCase());
    }
    return true;
  });

  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = filteredPosts.slice().sort((a, b) => b.id - a.id).slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);

  return (
    <>
      <div className="search-container">
        <select value={searchType} onChange={(e) => setSearchType(e.target.value)}>
          <option value="name">작성자</option>
          <option value="title">제목</option>
          <option value="content">내용</option>
        </select>
        <input type="text" placeholder="검색어를 입력하세요" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
        <button className="search-button" onClick={handleSearch}>검색</button>
      </div>

      <table className="board">
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>조회수</th>
          </tr>
        </thead>
        <tbody>
          {currentPosts.length > 0 ? (
            currentPosts.map((post) => (
              <tr key={post.id}>
                <td>{post.id}</td>
                <td>
                  <Link to={`/post/${post.id}`} style={{ textDecoration: 'none', color: 'blue' }} onClick={() => handleRowClick(post.id)}>
                    {post.title.length > 15 ? post.title.slice(0, 30) + "..." : post.title}
                  </Link>
                </td>
                <td>{post.name}</td>
                <td>{post.views}</td>
              </tr>
            ))
          ) : (
            <tr><td colSpan="4">게시글이 없습니다.</td></tr>
          )}
        </tbody>
      </table>

      <div className="pagination">
        <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="pagination-btn">«</button>
        <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="pagination-btn">‹</button>
        {Array.from({ length: totalPages }, (_, i) => (
          <button key={i + 1} onClick={() => setCurrentPage(i + 1)} className={`pagination-btn ${currentPage === i + 1 ? "active" : ""}`}>{i + 1}</button>
        ))}
        <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-btn">›</button>
        <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="pagination-btn">»</button>
      </div>

      <div className="write-button">
        <button onClick={handleWriteClick}>글쓰기</button>
      </div>
    </>
  );
};

export default Home;
