package com.sideproject.board.entity;

import jakarta.persistence.*;

import lombok.*;

@Entity
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Table(name = "users")
public class User {

  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id; // 회원 ID

  @Column(nullable = false, unique = true)
  private String email; // 회원 이메일

  @Column(nullable = false)
  private String password; // 비밀번호

  @Column(nullable = false)
  private String name; // 회원 이름
}