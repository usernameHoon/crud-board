# CRUD Board Project

이 프로젝트는 게시판 기능을 갖춘 CRUD 웹 애플리케이션입니다. 프론트엔드는 React로, 백엔드는 Spring Boot로 구현되어 있습니다.

## 📁 디렉토리 구조

```
crud-board/
├── backend/       # Spring Boot 기반 백엔드 서버
├── frontend/      # React 기반 프론트엔드 클라이언트
└── README.md      # 프로젝트 설명서
```

## 🚀 실행 방법

### Backend 실행

1. Java 11 이상 설치
2. MySQL 등 데이터베이스 설정
3. `backend/` 디렉토리에서 다음 명령어 실행:

```bash
./mvnw spring-boot:run
```

또는 IDE (IntelliJ 등)에서 `CrudBoardApplication`을 실행

### Frontend 실행

1. Node.js 16 이상 설치
2. `frontend/` 디렉토리에서 다음 명령어 실행:

```bash
npm install
npm start
```

## 🧩 주요 기능

- 게시글 등록, 조회, 수정, 삭제 (CRUD)
- 사용자 인터페이스를 통한 게시글 관리
- RESTful API 기반 통신

## 🛠 기술 스택

- **Backend**: Spring Boot, JPA, MySQL
- **Frontend**: React, Axios, HTML/CSS
- **Build Tools**: Maven, npm

## 실행 화면
- 추후 추가 예정
