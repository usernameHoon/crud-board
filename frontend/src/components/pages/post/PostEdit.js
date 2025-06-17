import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";

import { fetchPost } from "../../../services/postServices";
import { getToken } from "../../../services/authService";
import { handlePostUpdate } from "../../../handlers/postHandlers";
import { handleInputChange, handleFileChange, handleDeleteAttachment } from "../../../utils/formUtils";

const PostEdit = () => {
  const { postId } = useParams();
  const navigate = useNavigate();
  const token = getToken();

  const [formData, setFormData] = useState({
    name: "",
    title: "",
    content: "",
  });

  const [attachments, setAttachments] = useState([]);
  const [deletedAttachments, setDeletedAttachments] = useState([]);
  const [newFiles, setNewFiles] = useState([]);

  useEffect(() => {
    const loadPost = async () => {
      try {
        const data = await fetchPost(postId);
        setFormData({
          name: data.name,
          title: data.title,
          content: data.content,
        });
        setAttachments(data.attachments || []);
      } catch (error) {
        console.error("Error fetching post:", error);
      }
    };

    loadPost();
  }, [postId]);

  const handleSubmit = (e) => {
    handlePostUpdate(e, postId, formData, attachments, deletedAttachments, newFiles, token, navigate);
  };

  return (
    <main className="main-content">
      <form onSubmit={handleSubmit} className="post-form" encType="multipart/form-data">
        <div className="form-container">
          <table className="custom-form-table">
            <tbody>
              <tr>
                <td><label htmlFor="name">작성자</label></td>
                <td>
                  <input type="text" id="name" name="name" readOnly value={formData.name} />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="title">제목</label></td>
                <td>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    value={formData.title}
                    onChange={(e) => handleInputChange(e, setFormData)}
                  />
                </td>
              </tr>
              <tr>
                <td><label htmlFor="content">내용</label></td>
                <td>
                  <textarea
                    id="content"
                    name="content"
                    rows="10"
                    required
                    value={formData.content}
                    onChange={(e) => handleInputChange(e, setFormData)}
                  ></textarea>
                </td>
              </tr>
              <tr>
                <td><label>기존 첨부파일</label></td>
                <td>
                  {attachments.length > 0 ? (
                    attachments.map((attachment) => (
                      <div key={attachment.id}>
                        <a href={`http://localhost:8080/download/${attachment.filePath}`} download>
                          {attachment.fileName || "첨부파일"}
                        </a>
                        <button
                          className="attachment-del-btn"
                          type="button"
                          onClick={() => handleDeleteAttachment(attachment.id, setDeletedAttachments, setAttachments)}
                        >
                          ✖
                        </button>
                      </div>
                    ))
                  ) : (
                    <p>첨부파일 없음</p>
                  )}
                </td>
              </tr>
              <tr>
                <td><label htmlFor="attachment">새 첨부파일</label></td>
                <td>
                  <input type="file" id="attachment" name="attachment" multiple onChange={(e) => handleFileChange(e, setNewFiles)} />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="form-actions">
            <button type="submit" className="submit-btn">수정 완료</button>
            <button type="button" className="cancel-btn" onClick={() => navigate(-1)}>취소</button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default PostEdit;
