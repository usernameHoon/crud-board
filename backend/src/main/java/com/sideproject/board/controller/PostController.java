package com.sideproject.board.controller;

import com.sideproject.board.dto.PostDTO;
import com.sideproject.board.entity.User;
import com.sideproject.board.service.PostService;
import com.sideproject.board.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import lombok.RequiredArgsConstructor;

import java.io.IOException;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api")
public class PostController {

  private final PostService postService;
  private final UserService userService;

  // 게시글 전체 조회
  @GetMapping("/posts")
  public List<PostDTO> getAllPosts() {
    return postService.getAllPosts();
  }

  // 게시글 상세 조회
  @GetMapping("/posts/{postId}")
  public ResponseEntity<PostDTO> getPostById(@PathVariable("postId") Long postId) {
    PostDTO postDTO = postService.getPostById(postId);
    return ResponseEntity.ok(postDTO);
  }

  // 게시글 작성
  @PostMapping("/posts")
  public ResponseEntity<Map<String, Object>> submitPost(
      @RequestParam("name") String name,
      @RequestParam("title") String title,
      @RequestParam("content") String content,
      @RequestParam(value = "attachment[]", required = false) MultipartFile[] attachments) {

    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    if (principal == null || !(principal instanceof UserDetails)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(Collections.singletonMap("error", "로그인이 필요합니다."));
    }

    String email = ((UserDetails) principal).getUsername();
    User user = userService.findByEmail(email);

    if (user == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
          .body(Collections.singletonMap("error", "사용자 정보를 찾을 수 없습니다."));
    }

    try {
      Long postId = postService.savePost(user.getId(), name, title, content, attachments);

      Map<String, Object> response = new HashMap<>();
      response.put("message", "게시글이 작성되었습니다.");
      response.put("postId", postId);

      return ResponseEntity.ok(response);
    } catch (IOException e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body(Collections.singletonMap("error", "첨부파일 저장에 실패하였습니다: " + e.getMessage()));
    }
  }

  // 게시글 삭제
  @DeleteMapping("/posts/{postId}")
  public ResponseEntity<String> deletePost(@PathVariable("postId") Long postId) {
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();

    if (principal == null || !(principal instanceof UserDetails)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
    }

    String email = ((UserDetails) principal).getUsername();
    User user = userService.findByEmail(email);

    if (user == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("사용자 정보를 찾을 수 없습니다.");
    }

    try {
      postService.deletePost(postId, user.getId());
      return ResponseEntity.ok("게시글이 삭제되었습니다.");
    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
    }
  }

  // 게시글 수정
  @PutMapping("/posts/{postId}")
  public ResponseEntity<String> updatePost(
      @PathVariable("postId") Long postId,
      @RequestParam("title") String title,
      @RequestParam("content") String content,
      @RequestParam(value = "attachments", required = false) MultipartFile[] attachments,
      @RequestParam(value = "deletedAttachments", required = false) String deletedAttachmentsJson) {
    Object principal = SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    if (!(principal instanceof UserDetails)) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("로그인이 필요합니다.");
    }

    String email = ((UserDetails) principal).getUsername();
    User user = userService.findByEmail(email);

    if (user == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body("사용자 정보를 찾을 수 없습니다.");
    }

    try {
      postService.updatePost(postId, user.getId(), title, content, attachments, deletedAttachmentsJson);
      return ResponseEntity.ok("게시글이 수정되었습니다.");
    } catch (RuntimeException e) {
      return ResponseEntity.status(HttpStatus.FORBIDDEN).body(e.getMessage());
    } catch (IOException e) {
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
          .body("첨부파일 저장에 실패하였습니다: " + e.getMessage());
    }
  }

  // 조회 수 증가
  @PutMapping("/posts/{postId}/increase-views")
  public ResponseEntity<Void> increaseViews(@PathVariable("postId") Long postId) {
    postService.increaseViews(postId);
    return ResponseEntity.ok().build();
  }
}
