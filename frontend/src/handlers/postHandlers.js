import { deletePost, updatePost, createPost } from "../services/postServices";

import { getToken } from "../services/authService";

// 게시글 삭제 핸들러
export const handlePostDelete = async (postId, navigate) => {
  if (!window.confirm("정말 이 게시글을 삭제하시겠습니까?"))
    return;

  const token = getToken();

  if (!token) {
    alert("로그인이 필요합니다.");
    return;
  }

  try {
    const response = await deletePost(postId, token);
    if (response.ok) {
      alert("게시글이 삭제되었습니다.");
      navigate("/");
    } else {
      alert("게시글 삭제 실패");
    }
  } catch (error) {
    console.error("Error deleting post:", error);
  }
};

// 게시글 수정 핸들러
export const handlePostUpdate = async (e, postId, formData, attachments, deletedAttachments, newFiles, token, navigate) => {
  e.preventDefault();

  const formDataObject = new FormData();
  formDataObject.append("name", formData.name);
  formDataObject.append("title", formData.title);
  formDataObject.append("content", formData.content);

  newFiles.forEach((file) => {
    formDataObject.append("attachments", file);
  });

  if (deletedAttachments.length > 0) {
    formDataObject.append("deletedAttachments", JSON.stringify(deletedAttachments));
  }

  try {
    const response = await updatePost(postId, formDataObject, token);
    if (response.ok) {
      alert("게시글이 수정되었습니다.");
      navigate(`/post/${postId}`);
    } else {
      alert("게시글 수정 실패");
    }
  } catch (error) {
    console.error("Error updating post:", error);
    alert("오류가 발생했습니다.");
  }
};

// 게시글 작성 핸들러
export const handlePostWrite = async (e, formData, attachments, navigate) => {
  e.preventDefault();

  const data = new FormData();
  data.append("name", formData.name);
  data.append("title", formData.title);
  data.append("content", formData.content);

  attachments.forEach((file) => {
    data.append("attachments", file);
  });

  try {
    const token = getToken();
    if (!token) {
      alert("로그인이 필요합니다.");
      return navigate("/login");
    }

    const response = await createPost(data, token);
    if (response.ok) {
      const result = await response.json();
      alert("게시글이 작성되었습니다.");
      navigate(`/post/${result.postId}`);
    } else {
      alert("게시글 작성에 실패하였습니다.");
    }
  } catch (error) {
    console.error("Error submitting the form:", error);
    alert("오류가 발생하였습니다.");
  }
};
