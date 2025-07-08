import { addComment, deleteComment, editComment, fetchComments } from "../services/commentServices";
import { getToken } from "../services/authService";

export const handleCommentWrite = async (
  postId,
  newComment,
  setNewComment,
  setComments,
  setCurrentPage,
  setTotalPages,
  navigate
) => {
  if (!newComment.trim()) return alert("댓글을 입력하세요.");

  const token = getToken();
  if (!token) {
    alert("로그인 후 이용해주세요.");
    return navigate("/login");
  }

  try {
    await addComment(postId, newComment, token); // 작성 요청

    setNewComment("");
    setCurrentPage(1); // 페이지 초기화

    const updatedData = await fetchComments(postId, 1, token);
    setComments(updatedData.content.sort((a, b) => b.id - a.id));
    setTotalPages(updatedData.totalPages);
  } catch (error) {
    console.error("댓글 작성 오류:", error);
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

export const handleCommentEdit = async (postId, commentId, content, setComments, setEditingComment) => {
  const token = getToken();
  if (!token) return;

  try {
    const updatedComment = await editComment(postId, commentId, content, token);

    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId ? updatedComment : comment
      )
    );

    setEditingComment(null);
  } catch (error) {
    console.error("댓글 수정 중 오류:", error);
  }
};

