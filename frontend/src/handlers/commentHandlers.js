import { addComment, deleteComment, editComment } from "../services/commentServices";
import { getToken } from "../services/authService";

export const handleCommentWrite = async (postId, newComment, setNewComment, setComments, setCurrentPage, navigate) => {
  if (!newComment.trim())
    return alert("댓글을 입력하세요.");

  const token = getToken();

  if (!token) {
    alert("로그인 후 이용해주세요.");
    return navigate("/login");
  }
  try {
    const addedComment = await addComment(postId, newComment, token);
    setNewComment("");
    setComments((prev) => [addedComment, ...prev]);
    setCurrentPage(1);
  } catch (error) {
    console.error("Error adding comment:", error);
  }
};

export const handleCommentDelete = async (postId, commentId, setComments) => {
  if (!window.confirm("정말 이 댓글을 삭제하시겠습니까?"))
    return;

  const token = getToken();

  try {
    await deleteComment(postId, commentId, token);
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  } catch (error) {
    console.error("Error deleting comment:", error);
  }
};

export const handleCommentEdit = async (postId, commentId, editContent, setComments, setEditingComment) => {
  if (!editContent.trim())
    return alert("댓글을 입력하세요.");

  const token = getToken();

  try {
    await editComment(postId, commentId, editContent, token);
    setComments((prev) =>
      prev.map((c) => (c.id === commentId ? { ...c, content: editContent, edited: true } : c))
    );
    setEditingComment(null);
  } catch (error) {
    console.error("Error updating comment:", error);
  }
};
