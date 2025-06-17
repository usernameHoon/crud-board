package com.sideproject.board.dto;

import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

import java.util.List;

@Getter
@Setter
public class PostDTO {

  private Long id; // 게시글 ID
  private Long userId; // 작성자 ID
  private String email; // 작성자 이메일
  private String name; // 작성자 이름
  private String title; // 게시글 제목
  private String content; // 게시글 내용
  private LocalDateTime createdAt; // 작성 시간
  private int views; // 조회수
  private List<AttachmentDTO> attachments; // 첨부파일 리스트
}
