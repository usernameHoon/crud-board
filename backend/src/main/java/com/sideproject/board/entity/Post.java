package com.sideproject.board.entity;

import jakarta.persistence.*;

import lombok.Data;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Data
@NoArgsConstructor
@Entity
@Table(name = "posts")
public class Post {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id; // 게시글 ID

  private String name; // 작성자 이름
  private String title; // 게시글 내용

  private int views; // 조회수

  @ManyToOne(fetch = FetchType.LAZY) // 다대일 관계 설정
  @JoinColumn(name = "user_id", nullable = false) // 외래키 설정
  private User user; // 작성자

  @Column(columnDefinition = "TEXT")
  private String content; // 게시글 내용

  private LocalDateTime createdAt; // 작성 시간

  @OneToMany(mappedBy = "post", cascade = CascadeType.ALL, orphanRemoval = true)
  private List<Attachment> attachments = new ArrayList<>(); // 첨부파일 리스트

  // 엔티티가 DB에 persist 되기 전에 작성 시간을 설정
  @PrePersist
  public void prePersist() {
    createdAt = LocalDateTime.now();
  }

  // 양방향 연관관계 편의 메소드
  public void addAttachment(Attachment attachment) {
    attachments.add(attachment);
    attachment.setPost(this);
  }
}