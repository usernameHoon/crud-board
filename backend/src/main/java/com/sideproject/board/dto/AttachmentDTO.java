package com.sideproject.board.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class AttachmentDTO {

  private Long id; // 첨부 파일 ID
  private String fileName; // 원래 파일명 (사용자 표시용)
  private String storedFileName; // UUID 논리 파일명 (보안 목적)
  private String filePath; // 첨부 파일 경로
  private Long postId; // 게시글 ID
}
