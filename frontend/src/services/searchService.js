export const filterPosts = (posts, searchType, searchKeyword) => {
  if (!searchKeyword)
    return posts; // 검색어가 없으면 전체 목록 반환

  const trimmedKeyword = searchKeyword.trim().toLowerCase();

  return posts.filter((post) => {
    if (searchType === "title") {
      return post.title.toLowerCase().includes(trimmedKeyword);
    } else if (searchType === "name") {
      return post.name.toLowerCase().includes(trimmedKeyword);
    } else if (searchType === "content") {
      return post.content.toLowerCase().includes(trimmedKeyword);
    }
    return false;
  });
};
