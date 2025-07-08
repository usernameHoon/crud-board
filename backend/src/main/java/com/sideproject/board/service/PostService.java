package com.sideproject.board.service;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.sideproject.board.dto.AttachmentDTO;
import com.sideproject.board.dto.PostDTO;
import com.sideproject.board.entity.Attachment;
import com.sideproject.board.entity.Post;
import com.sideproject.board.entity.User;
import com.sideproject.board.repository.CommentRepository;
import com.sideproject.board.repository.PostRepository;
import com.sideproject.board.repository.UserRepository;

import jakarta.transaction.Transactional;

import lombok.RequiredArgsConstructor;

import org.modelmapper.ModelMapper;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.File;
import java.io.IOException;

import java.util.List;
import java.util.stream.Collectors;
import java.util.UUID;

import com.fasterxml.jackson.core.type.TypeReference;

@Service
@RequiredArgsConstructor
public class PostService {

  private final PostRepository postRepository;
  private final CommentRepository commentRepository;
  private final UserRepository userRepository;
  private final ModelMapper modelMapper;

  @Value("${file.upload-dir}")
  private String uploadDir;

  // 게시글 작성
  @Transactional
  public Long savePost(Long userId, String name, String title, String content, MultipartFile[] attachments)
      throws IOException {
    User user = userRepository.findById(userId)
        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));

    Post post = new Post();
    post.setUser(user);
    post.setName(name);
    post.setTitle(title);
    post.setContent(content);

    File uploadDirectory = new File(uploadDir);

    if (!uploadDirectory.exists()) {
      uploadDirectory.mkdirs();
    }

    if (attachments != null && attachments.length > 0) {
      for (MultipartFile file : attachments) {
        if (!file.isEmpty()) {
          String originalFileName = file.getOriginalFilename();
          String extension = originalFileName.substring(originalFileName.lastIndexOf("."));
          String uuidFileName = UUID.randomUUID().toString() + extension;

          File dest = new File(uploadDir + uuidFileName);
          file.transferTo(dest);

          System.out.println("✅ 저장된 파일: " + dest.getAbsolutePath());

          Attachment attachment = new Attachment(originalFileName, dest.getAbsolutePath());
          attachment.setStoredFileName(uuidFileName);
          post.addAttachment(attachment);
        }
      }
    }

    Post savedPost = postRepository.save(post);
    return savedPost.getId();
  }

  // 게시글 전체 조회
  public List<PostDTO> getAllPosts() {
    List<Post> posts = postRepository.findAll();

    return posts.stream()
        .map(post -> {
          PostDTO dto = modelMapper.map(post, PostDTO.class);
          dto.setUserId(post.getUser().getId());
          dto.setName(post.getUser().getName());
          return dto;
        })
        .collect(Collectors.toList());
  }

  // 게시글 상세 조회
  public PostDTO getPostById(Long postId) {
    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

    PostDTO dto = modelMapper.map(post, PostDTO.class);
    dto.setUserId(post.getUser().getId());
    dto.setName(post.getUser().getName());

    List<AttachmentDTO> attachmentDTOs = post.getAttachments().stream()
        .map(attachment -> new AttachmentDTO(
            attachment.getId(),
            attachment.getFileName(),
            attachment.getStoredFileName(),
            attachment.getFilePath(),
            post.getId()))
        .collect(Collectors.toList());

    dto.setAttachments(attachmentDTOs);

    return dto;
  }

  // 조회수 증가
  @Transactional
  public void increaseViews(Long postId) {
    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));
    post.setViews(post.getViews() + 1);
    postRepository.save(post);
  }

  // 게시글 삭제
  @Transactional
  public void deletePost(Long postId, Long userId) {
    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new RuntimeException("게시글이 존재하지 않습니다."));

    if (!post.getUser().getId().equals(userId)) {
      throw new RuntimeException("본인의 게시글만 삭제할 수 있습니다.");
    }

    commentRepository.deleteByPostId(postId);
    postRepository.delete(post);
  }

  // 게시글 수정
  @Transactional
  public void updatePost(Long postId, Long userId, String title, String content, MultipartFile[] attachments,
      String deletedAttachmentsJson) throws IOException {

    Post post = postRepository.findById(postId)
        .orElseThrow(() -> new RuntimeException("게시글을 찾을 수 없습니다."));

    if (!post.getUser().getId().equals(userId)) {
      throw new RuntimeException("게시글 수정 권한이 없습니다.");
    }

    post.setTitle(title);
    post.setContent(content);

    // ✅ 삭제 요청된 첨부파일 처리
    if (deletedAttachmentsJson != null && !deletedAttachmentsJson.isEmpty()) {
      ObjectMapper objectMapper = new ObjectMapper();
      List<Long> deletedIds = objectMapper.readValue(deletedAttachmentsJson, new TypeReference<List<Long>>() {
      });

      List<Attachment> attachmentsToRemove = post.getAttachments().stream()
          .filter(attachment -> deletedIds.contains(attachment.getId()))
          .collect(Collectors.toList());

      attachmentsToRemove.forEach(post.getAttachments()::remove);
    }

    // ✅ 새 첨부파일 처리
    if (attachments != null && attachments.length > 0) {
      for (MultipartFile file : attachments) {
        if (!file.isEmpty()) {
          String originalFileName = file.getOriginalFilename();
          String extension = originalFileName.substring(originalFileName.lastIndexOf(".")); // 예: .txt
          String storedFileName = UUID.randomUUID().toString() + extension;

          File dest = new File(uploadDir + storedFileName);
          file.transferTo(dest);

          System.out.println("📌 저장된 파일: " + dest.getAbsolutePath());

          Attachment attachment = new Attachment();
          attachment.setFileName(originalFileName); // 사용자에게 보여질 이름
          attachment.setStoredFileName(storedFileName); // 서버에 저장된 이름
          attachment.setFilePath(dest.getAbsolutePath()); // 전체 경로
          attachment.setPost(post);

          post.addAttachment(attachment);
        }
      }
    }

    postRepository.save(post);
  }
}
