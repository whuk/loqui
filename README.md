# Loqui

ChatGPT 스타일의 채팅 UI 클라이언트입니다.

## Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **State**: Zustand
- **Form**: React Hook Form + Zod
- **Testing**: Vitest + React Testing Library

## Getting Started

```bash
# 의존성 설치
npm install

# 개발 서버 실행
npm run dev

# 테스트 실행
npm test
```

## Project Structure

```
src/
├── app/                 # Next.js App Router 페이지
│   ├── (auth)/         # 인증 관련 (로그인)
│   └── (main)/         # 메인 레이아웃 (채팅, 설정)
├── components/         # React 컴포넌트
│   ├── auth/          # 인증 컴포넌트
│   ├── chat/          # 채팅 컴포넌트
│   └── common/        # 공통 컴포넌트
├── lib/               # 유틸리티 (API 클라이언트, 서비스)
├── stores/            # Zustand 상태 관리
└── types/             # TypeScript 타입 정의
```

## Features

- JWT 기반 인증
- 실시간 메시지 스트리밍 (SSE)
- 대화 목록 관리
- 다크/라이트 테마
- 반응형 디자인

## Development

개발 환경에서는 아무 자격 증명으로도 로그인이 가능합니다.

## License

Private
# loqui
