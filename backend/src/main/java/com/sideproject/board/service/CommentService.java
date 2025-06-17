package com.sideproject.board.service;

import com.sideproject.board.dto.CommentDTO;
import com.sideproject.board.entity.Comment;
import com.sideproject.board.entity.User;
import com.sideproject.board.entity.Post;

import com.sideproject.board.repository.UserRepository;
import com.sideproject.board.repository.PostRepository;
import com.sideproject.board.repository.CommentRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import org.springframework.stereotype.Service;

import org.springframework.transaction.annotation.Transactional;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;

@Service
@RequiredArgsConstructor
public class CommentService {

  private final CommentRepository commentRepository;
  private final PostRepository postRepository;
  private final UserRepository userRepository;

  // 댓글 목록 조회
  // ✅ 페이지네이션 적용된 댓글 조회 메서드
  public Page<CommentDTO> getCommentsByPostId(Long postId, Long userId, Pageable pageable) {
    return commentRepository.findByPostId(postId, pageable)
        .map(comment -> new CommentDTO(comment, userId)); // ✅ `CommentDTO` 변환 시 `userId` 추가
  }

  // 댓글 추가
  @Transactional
  public CommentDTO addComment(Long postId, Long userId, String content) {
    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new RuntimeException("게시글이 존재하지 않습니다."));
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("사용자가 존재하지 않습니다."));

    Comment comment = new Comment();
    comment.setPost(post);
    comment.setUser(user);
    comment.setContent(content);

    commentRepository.save(comment);

    return new CommentDTO(comment, userId);
  }

  // 댓글 삭제
  @Transactional
  public void deleteComment(Long commentId, Long userId) {
    Comment comment = commentRepository.findById(commentId)
        .orElseThrow(() -> new RuntimeException("댓글이 존재하지 않습니다."));

    if (!comment.getUser().getId().equals(userId)) {
      throw new RuntimeException("본인의 댓글만 삭제할 수 있습니다.");
    }

    commentRepository.delete(comment);
  }

  // 댓글 수정
  @Transactional
  public CommentDTO updateComment(Long commentId, Long userId, String newContent) {
    Comment comment = commentRepository.findById(commentId)
        .orElseThrow(() -> new RuntimeException("댓글이 존재하지 않습니다."));

    if (!comment.getUser().getId().equals(userId)) {
      throw new RuntimeException("본인의 댓글만 수정할 수 있습니다.");
    }

    comment.setContent(newContent);
    comment.setUpdatedAt(LocalDateTime.now());
    commentRepository.save(comment);

    return new CommentDTO(comment, userId);
  }
}