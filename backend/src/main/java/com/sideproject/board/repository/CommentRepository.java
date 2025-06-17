package com.sideproject.board.repository;

import com.sideproject.board.entity.Comment;

import org.springframework.data.jpa.repository.JpaRepository;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface CommentRepository extends JpaRepository<Comment, Long> {

  List<Comment> findByPostIdOrderByCreatedAtDesc(Long postId);

  void deleteByPostId(Long postId);

  Page<Comment> findByPostId(Long postId, Pageable pageable);
}