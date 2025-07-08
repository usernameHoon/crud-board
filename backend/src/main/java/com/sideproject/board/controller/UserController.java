package com.sideproject.board.controller;

import com.sideproject.board.dto.LoginRequestDTO;
import com.sideproject.board.dto.UserRequestDTO;
import com.sideproject.board.entity.User;
import com.sideproject.board.service.JwtService;
import com.sideproject.board.service.UserService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import lombok.RequiredArgsConstructor;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api")
@RequiredArgsConstructor
public class UserController {

  private final UserService userService;
  private final JwtService jwtService;

  // 로그인
  @PostMapping("/login")
  public ResponseEntity<Map<String, String>> login(@RequestBody LoginRequestDTO request) {
    User user = userService.authenticateUser(request.getEmail(), request.getPassword());

    if (user == null) {
      return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(Map.of("message", "이메일 또는 비밀번호가 일치하지 않습니다."));
    }

    String token = jwtService.generateToken(user);

    Map<String, String> response = new HashMap<>();
    response.put("token", token);
    response.put("email", user.getEmail());
    response.put("name", user.getName());

    return ResponseEntity.ok(response);
  }

  // 회원가입
  @PostMapping("/signup")
  public ResponseEntity<?> register(@RequestBody UserRequestDTO requestDTO) {
    userService.registerUser(requestDTO);
    return ResponseEntity.ok(Map.of("message", "회원가입 성공"));
  }
}