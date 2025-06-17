import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { fetchComments } from "../../../services/commentServices";
import { getToken } from "../../../services/authService";

import {
  handleCommentWrite,
  handleCommentDelete,
  handleCommentEdit,
} from "../../../handlers/commentHandlers";

const Comment = ({ postId }) => {
  const navigate = useNavigate();
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    const loadComments = async () => {
      try {
        const token = getToken();
        const data = await fetchComments(postId, currentPage, token);
        setComments(data.content.sort((a, b) => b.id - a.id));
        setTotalPages(data.totalPages);
      } catch (error) {
        console.error(error);
      }
    };
    loadComments();
  }, [postId, currentPage]);

  return (
    <div className="comment-container">
      <div className="comment-header">댓글</div>
      {comments.length > 0 ? (
        comments.map((comment, index) => (
          <div className="comment-item" key={comment.id || `comment-${index}`}>
            <strong>{comment.username}</strong>
            <span className="comment-meta">
              {new Date(comment.updatedAt ?? comment.createdAt).toLocaleString()} {comment.edited && " (수정됨) "}
              {Boolean(comment.author) && (
                <>
                  |<button onClick={() => { setEditingComment(comment.id); setEditContent(comment.content); }} className="link">수정</button>
                  |<button onClick={() => handleCommentDelete(postId, comment.id, setComments)} className="link delete">삭제</button>
                </>
              )}
            </span>
            {editingComment === comment.id ? (
              <div className="comment-input-container">
                <textarea value={editContent} onChange={(e) => setEditContent(e.target.value)} />
                <div style={{ textAlign: "right" }}>
                  <button onClick={() => handleCommentEdit(postId, comment.id, editContent, setComments, setEditingComment)} className="comment-btn">수정 완료</button>
                  <button onClick={() => setEditingComment(null)} className="comment-btn">취소</button>
                </div>
              </div>
            ) : (
              <p className="comment-body">{comment.content}</p>
            )}
          </div>
        ))
      ) : (
        <p>댓글이 없습니다.</p>
      )}

      {totalPages > 1 && (
        <div className="pagination">
          <button onClick={() => setCurrentPage(1)} disabled={currentPage === 1} className="pagination-btn">«</button>
          <button onClick={() => setCurrentPage(currentPage - 1)} disabled={currentPage === 1} className="pagination-btn">‹</button>

          {[...Array(totalPages)].map((_, i) => {
            const pageNumber = i + 1;
            return (
              <button
                key={`pagination-${postId || "unknown"}-${pageNumber}`} // postId가 없을 경우 "unknown"을 사용하여 key 충돌 방지
                onClick={() => setCurrentPage(pageNumber)}
                className={`pagination-btn ${currentPage === pageNumber ? "active" : ""}`}
              >
                {pageNumber}
              </button>
            );
          })}

          <button onClick={() => setCurrentPage(currentPage + 1)} disabled={currentPage === totalPages} className="pagination-btn">›</button>
          <button onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} className="pagination-btn">»</button>
        </div>
      )}

      <div className="comment-input-container">
        <textarea placeholder="댓글을 입력하세요. (로그인 후 이용해주세요.)" maxLength="3000" value={newComment} onChange={(e) => setNewComment(e.target.value)} />
        <div style={{ textAlign: "right" }}>
          <button onClick={() => handleCommentWrite(postId, newComment, setNewComment, setComments, setCurrentPage, navigate)} className="comment-btn">댓글 작성</button>
        </div>
      </div>
    </div>
  );
};

export default Comment;
