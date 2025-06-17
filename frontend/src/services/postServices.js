const API_BASE_URL = "http://localhost:8080/api/posts";

export const fetchPost = async (postId) => {
  const response = await fetch(`${API_BASE_URL}/${postId}`);
  return response.json();
};

export const deletePost = async (postId, token) => {
  return fetch(`${API_BASE_URL}/${postId}`, {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${token}`,
    },
    credentials: "include",
  });
};

export const updatePost = async (postId, formData, token) => {
  return fetch(`${API_BASE_URL}/${postId}`, {
    method: "PUT",
    body: formData,
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
};

export const createPost = async (formData, token) => {
  return fetch(`${API_BASE_URL}`, {
    method: "POST",
    body: formData,
    headers: {
      "Authorization": `Bearer ${token}`,
    },
  });
};
