package com.sideproject.board.dto;

import com.sideproject.board.entity.Comment;

import java.time.LocalDateTime;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class CommentDTO {

  private Long id; // 댓글 ID
  private String username; // 작성자 이름
  private String content; // 댓글 내용
  private LocalDateTime createdAt; // 작성된 시간
  private LocalDateTime updatedAt; // 수정된 시간
  private boolean isAuthor; // 본인 여부 확인
  private boolean isEdited; // 댓글이 수정되었는지 여부 확인

  public CommentDTO(Comment comment, Long currentUserId) {
    this.id = comment.getId();
    this.username = (comment.getUser() != null) ? comment.getUser().getName() : "Unknown";
    this.content = comment.getContent();
    this.createdAt = comment.getCreatedAt();
    this.updatedAt = comment.getUpdatedAt();
    this.isAuthor = (comment.getUser() != null) && (currentUserId != null)
        && comment.getUser().getId().equals(currentUserId);
    this.isEdited = comment.getUpdatedAt() != null &&
        !comment.getUpdatedAt().equals(comment.getCreatedAt());
  }
}
