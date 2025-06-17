package com.sideproject.board.controller;

import com.sideproject.board.dto.CommentDTO;
import com.sideproject.board.entity.User;
import com.sideproject.board.repository.UserRepository;
import com.sideproject.board.service.CommentService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import lombok.RequiredArgsConstructor;

import java.security.Principal;
import java.util.Map;

@RestController
@RequestMapping("/api/posts/{postId}/comments")
@RequiredArgsConstructor
public class CommentController {

  private final CommentService commentService;
  private final UserRepository userRepository;

  // 댓글 목록 조회
  // ✅ 페이지네이션 적용된 댓글 목록 조회 API
  @GetMapping
  public ResponseEntity<Page<CommentDTO>> getComments(
      @PathVariable("postId") Long postId,
      Pageable pageable) {
    Long userId = null;
    String email = null;

    Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
    if (authentication != null && authentication.getPrincipal() instanceof UserDetails) {
      email = ((UserDetails) authentication.getPrincipal()).getUsername();
    }

    if (email != null) {
      User user = userRepository.findByEmail(email).orElse(null);
      if (user != null) {
        userId = user.getId();
      }
    }

    return ResponseEntity.ok(commentService.getCommentsByPostId(postId, userId, pageable));
  }

  // 댓글 추가
  @PostMapping
  public ResponseEntity<CommentDTO> addComment(
      @PathVariable("postId") Long postId,
      @RequestBody Map<String, String> request,
      Principal principal) {

    String email = principal.getName();
    User user = userRepository.findByEmail(email).orElse(null);

    if (user == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
    }

    Long userId = user.getId();
    String content = request.get("content");

    return ResponseEntity.ok(commentService.addComment(postId, userId, content));
  }

  // 댓글 삭제
  @DeleteMapping("/{commentId}")
  public ResponseEntity<Void> deleteComment(
      @PathVariable("postId") Long postId,
      @PathVariable("commentId") Long commentId,
      Principal principal) {

    String email = principal.getName();

    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

    Long userId = user.getId();

    commentService.deleteComment(commentId, userId);
    return ResponseEntity.noContent().build();
  }

  // 댓글 수정
  @PutMapping("/{commentId}")
  public ResponseEntity<CommentDTO> updateComment(
      @PathVariable("postId") Long postId,
      @PathVariable("commentId") Long commentId,
      @RequestBody Map<String, String> request,
      Principal principal) {

    String email = principal.getName();

    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    Long userId = user.getId();

    CommentDTO updatedComment = commentService.updateComment(commentId, userId, request.get("content"));

    return ResponseEntity.ok(updatedComment);
  }

}