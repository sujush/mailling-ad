# 자동 메일링 광고 프로그램 MVP

수신자 리스트 관리 + 메일 템플릿 에디터 기반의 이메일 마케팅 도구입니다.

## 기술 스택

| 구분 | 기술 |
|------|------|
| Backend | Node.js + Express + better-sqlite3 |
| Frontend | React 18 + Vite 5 + Axios |
| DB | SQLite (WAL 모드) |

## 프로젝트 구조

```
mailing-ad/
├── backend/
│   ├── server.js              # Express 진입점 (포트 3001)
│   ├── .env.example           # 환경변수 템플릿
│   └── src/
│       ├── models/db.js       # SQLite 스키마 초기화
│       ├── routes/            # recipients / lists / templates
│       ├── controllers/       # HTTP 핸들러
│       └── services/          # 비즈니스 로직
└── frontend/
    └── src/
        ├── api/               # Axios API 레이어
        ├── hooks/             # useRecipients / useLists
        ├── components/        # UI 컴포넌트
        └── pages/             # 수신자 / 리스트 / 템플릿 페이지
```

## 시작하기

### 1. 클론

```bash
git clone https://github.com/sujush/mailling-ad.git
cd mailling-ad
```

### 2. 백엔드 실행

```bash
cd backend
cp .env.example .env
npm install
node server.js
# → http://localhost:3001
```

### 3. 프론트엔드 실행

```bash
cd frontend
npm install
npm run dev
# → http://localhost:5173
```

## API 엔드포인트

### 수신자

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/recipients` | 목록 조회 (페이지네이션 + 검색) |
| POST | `/api/recipients` | 수신자 추가 |
| PUT | `/api/recipients/:id` | 수신자 수정 |
| DELETE | `/api/recipients/:id` | 수신자 삭제 |
| POST | `/api/recipients/:id/unsubscribe` | 수신거부 |

### 리스트

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/lists` | 리스트 목록 |
| POST | `/api/lists` | 리스트 생성 |
| PUT | `/api/lists/:id` | 리스트 수정 |
| DELETE | `/api/lists/:id` | 리스트 삭제 |
| POST | `/api/lists/:id/add-recipient` | 수신자 추가 |

### 템플릿

| 메서드 | 경로 | 설명 |
|--------|------|------|
| GET | `/api/templates` | 템플릿 목록 |
| GET | `/api/templates/:id` | 템플릿 상세 |
| POST | `/api/templates` | 템플릿 생성 |
| PUT | `/api/templates/:id` | 템플릿 수정 |
| DELETE | `/api/templates/:id` | 템플릿 삭제 |
| POST | `/api/templates/:id/preview` | 변수 치환 미리보기 |

### 템플릿 변수

HTML 콘텐츠와 제목에 `{{변수명}}` 형식으로 변수를 삽입할 수 있습니다.

```json
POST /api/templates/1/preview
{
  "variables": {
    "name": "홍길동",
    "cta_url": "https://example.com"
  }
}
```

## 주요 기능

- **수신자 관리**: 이메일/이름 검색(300ms debounce), 태그, 수신거부 토글
- **리스트 관리**: 수신자 그룹화, 리스트별 수신자 수 집계
- **템플릿 에디터**: `{{변수명}}` 자동 감지 및 배지 표시
- **템플릿 미리보기**: 변수값 입력 후 iframe으로 실시간 확인
- **Mock fallback**: 백엔드 미연결 시 프론트엔드 독립 동작
