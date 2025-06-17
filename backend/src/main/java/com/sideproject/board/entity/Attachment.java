package com.sideproject.board.entity;

import jakarta.persistence.*;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.UUID;

@Data
@NoArgsConstructor
@Entity
@Table(name = "attachments")
public class Attachment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id; // 파일 ID

  private String fileName; // 원래 파일명 (사용자에게 표시)
  private String storedFileName; // UUID 논리 파일명 (실제 저장되는 파일명)
  private String filePath; // 파일 경로

  @ManyToOne(fetch = FetchType.LAZY)
  @JoinColumn(name = "post_id")
  private Post post;

  public Attachment(String fileName, String filePath) {
    this.fileName = fileName;
    this.storedFileName = UUID.randomUUID().toString() + "_" + fileName; // UUID 적용
    this.filePath = filePath;
  }
}
