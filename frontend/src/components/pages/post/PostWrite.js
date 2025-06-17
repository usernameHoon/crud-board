import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { handlePostWrite } from "../../../handlers/postHandlers";

import { getToken } from "../../../services/authService";
import { handleInputChange, handleFileChange, checkUserAuthentication } from "../../../utils/formUtils"; // ✅ 유틸 추가

const PostWrite = () => {
  const navigate = useNavigate();
  const storedUser = localStorage.getItem("user");
  const user = storedUser ? JSON.parse(storedUser) : null;

  const [formData, setFormData] = useState({
    name: user?.name || "",
    title: "",
    content: "",
  });

  const [attachments, setAttachments] = useState([]);

  useEffect(() => {
    checkUserAuthentication(navigate, getToken); // ✅ 유틸 사용
  }, [navigate]);

  const handleSubmit = (e) => {
    handlePostWrite(e, formData, attachments, navigate);
  };

  return (
    <main className="main-content">
      <form onSubmit={handleSubmit} className="post-form" encType="multipart/form-data">
        <div className="form-container">
          <table className="custom-form-table">
            <tbody>
              <tr>
                <td>
                  <label htmlFor="name">작성자</label>
                </td>
                <td>
                  <input type="text" id="name" name="name" readOnly value={formData.name} />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="title">제목</label>
                </td>
                <td>
                  <input
                    type="text"
                    id="title"
                    name="title"
                    required
                    placeholder="제목을 입력하세요"
                    value={formData.title}
                    onChange={(e) => handleInputChange(e, setFormData)}
                  />
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="content">내용</label>
                </td>
                <td>
                  <textarea
                    id="content"
                    name="content"
                    rows="10"
                    required
                    placeholder="내용을 입력하세요"
                    value={formData.content}
                    onChange={(e) => handleInputChange(e, setFormData)}
                  ></textarea>
                </td>
              </tr>
              <tr>
                <td>
                  <label htmlFor="attachment">첨부파일</label>
                </td>
                <td>
                  <input
                    type="file"
                    id="attachment"
                    name="attachment"
                    multiple
                    onChange={(e) => handleFileChange(e, setAttachments)}
                  />
                </td>
              </tr>
            </tbody>
          </table>
          <div className="form-actions">
            <button type="submit" className="submit-btn">
              작성 완료
            </button>
            <button type="button" className="cancel-btn" onClick={() => navigate('/')}>
              취소
            </button>
          </div>
        </div>
      </form>
    </main>
  );
};

export default PostWrite;
