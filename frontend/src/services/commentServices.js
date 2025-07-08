const API_BASE_URL = "http://localhost:8080/api/posts";

export const fetchComments = async (postId, page = 1, token) => {
  const response = await fetch(`${API_BASE_URL}/${postId}/comments?page=${page - 1}&size=5`, {
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });

  return response.json();
};

export const addComment = async (postId, content, token) => {
  const response = await fetch(`${API_BASE_URL}/${postId}/comments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error(`댓글 작성 실패: ${response.status}`);
  }

  return response.json();
}

export const deleteComment = async (postId, commentId, token) => {
  return fetch(`${API_BASE_URL}/${postId}/comments/${commentId}`, {
    method: "DELETE",
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
};

export const editComment = async (postId, commentId, content, token) => {
  const response = await fetch(`${API_BASE_URL}/${postId}/comments/${commentId}`, {
    method: "PUT",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    body: JSON.stringify({ content }),
  });

  if (!response.ok) {
    throw new Error(`댓글 수정 실패: ${response.status}`);
  }

  return response.json();
}
