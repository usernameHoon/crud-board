package com.sideproject.board.controller;

import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.beans.factory.annotation.Autowired;

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

  private static final String UPLOAD_DIR = "C:/Users/Master/Desktop/Projects/React/uploads/board/";

  @GetMapping("/download/{fileId}")
  public ResponseEntity<Resource> downloadFile(@PathVariable("fileId") Long fileId) {
    try {
      System.out.println("📌 파일 다운로드 요청: fileId = " + fileId);

      if (attachmentRepository == null) {
        System.out.println("❌ attachmentRepository가 null입니다.");
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
      }

      Attachment attachment = attachmentRepository.findById(fileId)
          .orElseThrow(() -> new RuntimeException("파일을 찾을 수 없습니다."));

      System.out.println("✅ 저장된 파일명: " + attachment.getStoredFileName());

      Path filePath = Paths.get(UPLOAD_DIR, attachment.getStoredFileName());
      Resource resource = new FileSystemResource(filePath.toFile());

      if (!resource.exists()) {
        System.out.println("❌ 파일이 존재하지 않음: " + filePath.toString());
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
      }

      return ResponseEntity.ok()
          .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + attachment.getFileName() + "\"")
          .body(resource);
    } catch (Exception e) {
      e.printStackTrace();
      return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(null);
    }
  }
}
