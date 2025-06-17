package com.sideproject.board.entity;

import jakarta.persistence.*;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@Entity
@Getter
@Setter
@NoArgsConstructor
@Table(name = "comments")
public class Comment {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id; // 댓글 ID

  @ManyToOne
  @JoinColumn(name = "post_id", nullable = false)
  private Post post; // 게시글 ID

  @ManyToOne
  @JoinColumn(name = "user_id", nullable = false)
  private User user; // 작성자 ID

  @Column(nullable = false, length = 3000)
  private String content; // 댓글 내용

  private LocalDateTime createdAt = LocalDateTime.now(); // 생성 시간

  @Column(nullable = true) // 수정된 시간이 null 가능하도록 설정
  private LocalDateTime updatedAt;
}