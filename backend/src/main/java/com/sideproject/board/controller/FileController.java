package com.sideproject.board.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;

import org.springframework.core.io.FileSystemResource;
import org.springframework.core.io.Resource;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RestController;

import com.sideproject.board.entity.Attachment;
import com.sideproject.board.repository.AttachmentRepository;

import java.nio.file.Path;
import java.nio.file.Paths;

@RestController
@CrossOrigin(origins = "*")
public class FileController {

  @Autowired
  private AttachmentRepository attachmentRepository;

  @Value("${file.upload-dir}")
  private String uploadDir; // ← 이제 설정파일에서 주입받음

  @GetMapping("/download/{fileId}")
  public ResponseEntity<Resource> downloadFile(@PathVariable("fileId") Long fileId) {
    try {
      System.out.println("📌 파일 다운로드 요청: fileId = " + fileId);

      Attachment attachment = attachmentRepository.findById(fileId)
          .orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다."));

      System.out.println("저장된 파일명: " + attachment.getStoredFileName());

      Path filePath = Paths.get(uploadDir, attachment.getStoredFileName());
      Resource resource = new FileSystemResource(filePath.toFile());

      if (!resource.exists()) {
        System.out.println("❌ 파일이 존재하지 않음: " + filePath.toString());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
      }

      String originalFileName = attachment.getFileName();
      String encodedFileName = org.springframework.web.util.UriUtils.encode(originalFileName,
          java.nio.charset.StandardCharsets.UTF_8);
      String contentDisposition = "attachment; filename*=UTF-8''" + encodedFileName;

      return ResponseEntity.ok()
          .header(HttpHeaders.CONTENT_DISPOSITION, contentDisposition)
          .body(resource);

    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
  }
}
