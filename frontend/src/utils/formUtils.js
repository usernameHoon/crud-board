// 로그인 여부 확인 (Write.js에서 사용)
export const checkUserAuthentication = (navigate, getToken) => {
  const token = getToken();
  if (!token) {
    alert("로그인 후 이용해주세요.");
    navigate("/login");
  }
};

// 입력값 변경 핸들러
export const handleInputChange = (e, setFormData) => {
  const { name, value } = e.target;
  setFormData((prev) => ({ ...prev, [name]: value }));
};

// 파일 선택 핸들러
export const handleFileChange = (e, setAttachments) => {
  setAttachments(Array.from(e.target.files));
};

// FormData 생성 함수
export const prepareFormData = (formData, attachments, deletedAttachments = []) => {
  const data = new FormData();
  data.append("name", formData.name);
  data.append("title", formData.title);
  data.append("content", formData.content);

  attachments.forEach((file) => {
    data.append("attachments", file);
  });

  if (deletedAttachments.length > 0) {
    data.append("deletedAttachments", JSON.stringify(deletedAttachments));
  }

  return data;
};

// 첨부파일 삭제 핸들러
export const handleDeleteAttachment = (attachmentId, setDeletedAttachments, setAttachments) => {
  setDeletedAttachments((prev) => [...prev, attachmentId]);
  setAttachments((prev) => prev.filter((attachment) => attachment.id !== attachmentId));
};