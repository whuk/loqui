# Loqui - Chat UI Client PRD

## 1. 개요

### 1.1 프로젝트 정보
- **프로젝트명**: Loqui (라틴어로 "말하다")
- **버전**: 1.0.0
- **기술 스택**: Next.js 14+ (App Router), TypeScript, Tailwind CSS
- **백엔드**: Spring/Kotlin 기반 API Gateway + Chat Backend (기존 구축)

### 1.2 프로젝트 목표
ChatGPT와 유사한 사용자 경험을 제공하는 채팅 클라이언트 구축
- 깔끔하고 직관적인 대화형 인터페이스
- 실시간 메시지 스트리밍
- 반응형 디자인 (Desktop/Mobile)

---

## 2. 사용자 요구사항

### 2.1 핵심 기능
| 기능 | 우선순위 | 설명 |
|------|----------|------|
| 로그인/로그아웃 | P0 | JWT 기반 인증 |
| 채팅 인터페이스 | P0 | 메시지 송수신, 대화 목록 |
| 설정 화면 | P1 | 테마, 프로필 등 기본 설정 |

### 2.2 사용자 스토리

#### 인증 (Authentication)
- **US-001**: 사용자는 이메일/비밀번호로 로그인할 수 있다
- **US-002**: 사용자는 로그아웃하여 세션을 종료할 수 있다
- **US-003**: 사용자는 "로그인 유지" 옵션을 선택할 수 있다
- **US-004**: 인증되지 않은 사용자는 로그인 페이지로 리다이렉트된다

#### 채팅 (Chat)
- **US-010**: 사용자는 새 대화를 시작할 수 있다
- **US-011**: 사용자는 메시지를 입력하고 전송할 수 있다
- **US-012**: 사용자는 AI의 응답을 실시간 스트리밍으로 볼 수 있다
- **US-013**: 사용자는 이전 대화 목록을 확인할 수 있다
- **US-014**: 사용자는 이전 대화를 선택하여 계속할 수 있다
- **US-015**: 사용자는 대화를 삭제할 수 있다
- **US-016**: 사용자는 대화 제목을 편집할 수 있다

#### 설정 (Settings)
- **US-020**: 사용자는 다크/라이트 테마를 전환할 수 있다
- **US-021**: 사용자는 프로필 정보를 확인할 수 있다
- **US-022**: 사용자는 비밀번호를 변경할 수 있다

---

## 3. 기술 명세

### 3.1 기술 스택
```yaml
Frontend:
  Framework: Next.js 14+ (App Router)
  Language: TypeScript 5.x
  Styling: Tailwind CSS 3.x
  State: Zustand 또는 React Context
  HTTP Client: fetch (native) 또는 axios
  Forms: React Hook Form + Zod
  Icons: Lucide React

Authentication:
  Type: JWT Bearer Token
  Storage: httpOnly Cookie (권장) 또는 localStorage
  Refresh: Refresh Token Rotation
```

### 3.2 프로젝트 구조
```
loqui/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (auth)/            # 인증 관련 라우트 그룹
│   │   │   ├── login/
│   │   │   └── layout.tsx
│   │   ├── (main)/            # 메인 앱 라우트 그룹
│   │   │   ├── chat/
│   │   │   │   ├── [id]/      # 개별 대화
│   │   │   │   └── page.tsx   # 새 대화
│   │   │   ├── settings/
│   │   │   └── layout.tsx
│   │   ├── layout.tsx
│   │   └── page.tsx           # 루트 → /chat 리다이렉트
│   ├── components/
│   │   ├── auth/              # 로그인 폼 등
│   │   ├── chat/              # 채팅 UI 컴포넌트
│   │   │   ├── ChatInput.tsx
│   │   │   ├── ChatMessage.tsx
│   │   │   ├── ChatList.tsx
│   │   │   └── Sidebar.tsx
│   │   ├── settings/          # 설정 컴포넌트
│   │   └── ui/                # 공통 UI 컴포넌트
│   ├── hooks/                 # 커스텀 훅
│   ├── lib/                   # 유틸리티, API 클라이언트
│   ├── stores/                # 상태 관리
│   └── types/                 # TypeScript 타입 정의
├── public/
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
└── package.json
```

### 3.3 API 연동 명세 (예상)

#### 인증 API
```typescript
// POST /api/auth/login
interface LoginRequest {
  email: string;
  password: string;
  rememberMe?: boolean;
}

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
  user: {
    id: string;
    email: string;
    name: string;
  };
}

// POST /api/auth/logout
// POST /api/auth/refresh
```

#### 채팅 API
```typescript
// GET /api/conversations
interface Conversation {
  id: string;
  title: string;
  createdAt: string;
  updatedAt: string;
}

// POST /api/conversations
interface CreateConversationRequest {
  title?: string;
}

// GET /api/conversations/:id/messages
interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  createdAt: string;
}

// POST /api/conversations/:id/messages (SSE Stream)
interface SendMessageRequest {
  content: string;
}

// DELETE /api/conversations/:id
// PATCH /api/conversations/:id
```

#### 설정 API
```typescript
// GET /api/users/me
// PATCH /api/users/me
// POST /api/users/me/password
```

---

## 4. UI/UX 명세

### 4.1 화면 구성

#### 로그인 화면 (`/login`)
```
┌─────────────────────────────────────┐
│                                     │
│           [Loqui Logo]              │
│                                     │
│     ┌─────────────────────────┐     │
│     │ Email                   │     │
│     └─────────────────────────┘     │
│     ┌─────────────────────────┐     │
│     │ Password            👁  │     │
│     └─────────────────────────┘     │
│     ☐ 로그인 상태 유지              │
│                                     │
│     [        로그인        ]        │
│                                     │
└─────────────────────────────────────┘
```

#### 채팅 화면 (`/chat`, `/chat/[id]`)
```
┌──────────────┬──────────────────────────────────┐
│              │                                  │
│ [+ 새 대화]  │     대화 제목                    │
│              │                                  │
│ ─────────────│  ┌────────────────────────────┐  │
│ 📄 대화 1    │  │ User: 안녕하세요           │  │
│ 📄 대화 2    │  └────────────────────────────┘  │
│ 📄 대화 3    │  ┌────────────────────────────┐  │
│              │  │ Assistant: 안녕하세요!     │  │
│              │  │ 무엇을 도와드릴까요?       │  │
│              │  └────────────────────────────┘  │
│              │                                  │
│              │                                  │
│              │                                  │
│ ─────────────│  ┌────────────────────────────┐  │
│ [⚙️ 설정]    │  │ 메시지 입력...         [➤] │  │
│ [🚪 로그아웃]│  └────────────────────────────┘  │
└──────────────┴──────────────────────────────────┘
     Sidebar              Main Chat Area
     (280px)              (flex-1)
```

#### 설정 화면 (`/settings`)
```
┌──────────────┬──────────────────────────────────┐
│              │                                  │
│   Sidebar    │  설정                            │
│              │  ─────────────────────────────   │
│              │                                  │
│              │  테마                            │
│              │  ○ 라이트  ● 다크  ○ 시스템     │
│              │                                  │
│              │  프로필                          │
│              │  이름: [____________]            │
│              │  이메일: user@example.com        │
│              │                                  │
│              │  비밀번호 변경                   │
│              │  [현재 비밀번호]                 │
│              │  [새 비밀번호]                   │
│              │  [비밀번호 확인]                 │
│              │  [      저장      ]              │
│              │                                  │
└──────────────┴──────────────────────────────────┘
```

### 4.2 디자인 시스템

#### 색상 팔레트
```css
:root {
  /* Light Mode */
  --bg-primary: #ffffff;
  --bg-secondary: #f7f7f8;
  --bg-tertiary: #ececf1;
  --text-primary: #202123;
  --text-secondary: #6e6e80;
  --accent: #10a37f;
  --accent-hover: #1a7f64;
  --border: #e5e5e5;

  /* Dark Mode */
  --dark-bg-primary: #343541;
  --dark-bg-secondary: #202123;
  --dark-bg-tertiary: #444654;
  --dark-text-primary: #ececf1;
  --dark-text-secondary: #8e8ea0;
}
```

#### 타이포그래피
```css
font-family: 'Pretendard', -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;

/* Headings */
h1: 24px, font-weight: 600
h2: 20px, font-weight: 600
h3: 16px, font-weight: 600

/* Body */
body: 14px, font-weight: 400
small: 12px, font-weight: 400
```

### 4.3 반응형 브레이크포인트
```css
/* Mobile */
@media (max-width: 639px) {
  /* 사이드바 숨김, 햄버거 메뉴 */
}

/* Tablet */
@media (min-width: 640px) and (max-width: 1023px) {
  /* 축소된 사이드바 */
}

/* Desktop */
@media (min-width: 1024px) {
  /* 전체 레이아웃 */
}
```

---

## 5. 비기능 요구사항

### 5.1 성능
- First Contentful Paint (FCP): < 1.5s
- Time to Interactive (TTI): < 3s
- 메시지 스트리밍 지연: < 100ms

### 5.2 접근성
- WCAG 2.1 AA 준수
- 키보드 네비게이션 지원
- 스크린 리더 호환

### 5.3 보안
- JWT 토큰 안전한 저장 (httpOnly Cookie 권장)
- XSS 방지 (Content Sanitization)
- CSRF 방지
- API 요청 시 Authorization 헤더 포함

### 5.4 브라우저 지원
- Chrome 90+
- Firefox 90+
- Safari 14+
- Edge 90+

---

## 6. 마일스톤

### Phase 1: 기본 구조 (MVP)
- [ ] Next.js 프로젝트 초기화
- [ ] Tailwind CSS 설정
- [ ] 기본 레이아웃 구성
- [ ] 로그인/로그아웃 구현
- [ ] JWT 인증 흐름

### Phase 2: 채팅 기능
- [ ] 채팅 UI 컴포넌트
- [ ] 대화 목록 사이드바
- [ ] 메시지 송수신
- [ ] SSE 스트리밍 구현
- [ ] 대화 CRUD

### Phase 3: 설정 및 마무리
- [ ] 다크/라이트 테마
- [ ] 설정 화면
- [ ] 반응형 최적화
- [ ] 에러 핸들링
- [ ] 로딩 상태 UI

---

## 7. 참고 자료

### 7.1 디자인 레퍼런스
- ChatGPT UI (https://chat.openai.com)
- Claude UI (https://claude.ai)

### 7.2 기술 문서
- Next.js App Router: https://nextjs.org/docs/app
- Tailwind CSS: https://tailwindcss.com/docs
- Zustand: https://zustand-demo.pmnd.rs/

---

*문서 작성일: 2026-01-08*
*최종 수정: 2026-01-08*
