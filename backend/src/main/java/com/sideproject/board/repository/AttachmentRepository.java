package com.sideproject.board.repository;

import com.sideproject.board.entity.Attachment;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AttachmentRepository extends JpaRepository<Attachment, Long> {
  // 특정 게시글(postId)에 속한 모든 첨부파일 가져오기
  List<Attachment> findByPostId(Long postId);
}
