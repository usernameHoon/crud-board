import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

import { fetchPost } from '../../../services/postServices';
import { getUserIdFromToken } from '../../../services/authService';

import { handlePostDelete } from '../../../handlers/postHandlers';

import Comment from './Comment';

const PostDetail = () => {
  const { postId } = useParams(); // URL에서 postId 가져오기
  const navigate = useNavigate(); // ✅ 삭제 후 홈으로 이동할 때 사용
  const [post, setPost] = useState(null);
  const [isAuthor, setIsAuthor] = useState(false); // ✅ 작성자인지 여부 저장

  useEffect(() => {
    const userId = getUserIdFromToken();

    fetchPost(postId).then((data) => {
      setPost(data);
      if (data.userId === userId) {
        setIsAuthor(true);
      }
    }).catch((error) => console.error("Error fetching post:", error));
  }, [postId]);

  return post ? (
    <>
      <div
        className="content-container"
        style={{
          width: "70%",
          margin: "50px auto",
          fontFamily: "'Arial', sans-serif",
        }}
      >
        <div className="button-container">
          <button className="list-button" onClick={() => navigate('/')}>
            글 목록
          </button>
          {/* ✅ 게시글 작성자만 "수정" 및 "삭제" 버튼을 볼 수 있도록 설정 */}
          {isAuthor && (
            <>
              <button
                onClick={() => navigate(`/post-edit/${postId}`)}
                className="edit-button"
              >
                글 수정
              </button>
              <button onClick={() => handlePostDelete(postId, navigate)} className="delete-button">
                글 삭제
              </button>
            </>
          )}
        </div>

        <table className="content-table">
          <tbody>
            <tr>
              <td>
                <strong>작성자</strong>
              </td>
              <td>{post.name}</td>
            </tr>
            <tr>
              <td>
                <strong>제목</strong>
              </td>
              <td>{post.title}</td>
            </tr>
            <tr>
              <td>
                <strong>작성일</strong>
              </td>
              <td>{new Date(post.createdAt).toLocaleString()}</td>
            </tr>
            <tr>
              <td>
                <strong>조회수</strong>
              </td>
              <td>{post.views}</td>
            </tr>
            <tr>
              <td colSpan="2" className="description">
                {post.content}
              </td>
            </tr>
            <tr>
              <td><strong>첨부파일</strong></td>
              <td>
                {post.attachments && post.attachments.length > 0 ? (
                  post.attachments.map((attachment) => (
                    <div key={attachment.id}>
                      <a href={`http://localhost:8080/download/${attachment.id}`} download>
                        {attachment.fileName}
                      </a>
                    </div>
                  ))
                ) : (
                  "첨부파일 없음"
                )}
              </td>
            </tr>

          </tbody>
        </table>

        <Comment postId={postId} />
      </div>
    </>
  ) : <p>Loading...</p>;
};

export default PostDetail;
