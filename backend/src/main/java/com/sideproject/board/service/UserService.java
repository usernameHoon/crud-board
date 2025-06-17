package com.sideproject.board.service;

import com.sideproject.board.dto.UserRequestDTO;
import com.sideproject.board.entity.User;
import com.sideproject.board.exception.AuthenticationFailedException;
import com.sideproject.board.exception.DuplicateEmailException;
import com.sideproject.board.repository.UserRepository;

import lombok.RequiredArgsConstructor;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@RequiredArgsConstructor
public class UserService {

  private final UserRepository userRepository;
  private final PasswordEncoder passwordEncoder;

  public User findByEmail(String email) {

    return userRepository.findByEmail(email)
        .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
  }

  public void registerUser(UserRequestDTO requestDTO) {

    if (userRepository.findByEmail(requestDTO.getEmail()).isPresent()) {
      throw new DuplicateEmailException("이미 존재하는 이메일입니다: " + requestDTO.getEmail());
    }

    User user = User.builder()
        .email(requestDTO.getEmail())
        .password(passwordEncoder.encode(requestDTO.getPassword()))
        .name(requestDTO.getName())
        .build();
    userRepository.save(user);
  }

  public User login(String email, String password) {

    User user = userRepository.findByEmail(email)
        .orElseThrow(() -> new AuthenticationFailedException("이메일이 존재하지 않습니다."));

    if (!passwordEncoder.matches(password, user.getPassword())) {
      throw new AuthenticationFailedException("비밀번호가 일치하지 않습니다.");
    }

    return user;
  }

  public User authenticateUser(String email, String password) {

    Optional<User> userOptional = userRepository.findByEmail(email);

    if (userOptional.isPresent()) {
      User user = userOptional.get();

      if (passwordEncoder.matches(password, user.getPassword())) {
        return user;
      }
    }

    return null;
  }
}
