# 📋 ProjecTree 프론트엔드 README

## 🗂️ 폴더구조
- 폴더구조는 보편적으로 사용되는 react 폴더구조를 사용합니다.
```
src/
├── apis/                              # API 호출 함수
│   ├── index.ts
│   ├── client.ts                      # axios 인스턴스
│   └── auth/                          # 백엔드 앱 단위로 분리
│       ├── index.ts
│       ├── login.ts
│       └── register.ts
│
├── assets/                            # 정적 자원 (이미지, 아이콘)
│   ├── images/
│   │   └── logo.png
│   └── icons/
│       └── search.svg
│
├── components/                        # 공용 UI 컴포넌트
│   ├── index.ts
│   ├── Button/
│   │   ├── index.ts
│   │   ├── Button.tsx
│   │   └── useButton.ts               # 컴포넌트 전용 훅 (필요시)
│   └── Modal/
│       ├── index.ts
│       ├── Modal.tsx
│       └── Modal.types.ts             # 외부 공유 타입 (필요시)
│
├── constants/                         # 공용 상수
│   ├── index.ts
│   ├── routes.ts
│   └── messages.ts
│
├── hooks/                             # 공용 커스텀 훅
│   ├── index.ts
│   ├── useSocket.ts                   # 단일 훅은 파일로
│   └── webrtc/                        # 복잡한 기능은 폴더로
│       ├── index.ts
│       ├── useRoom.ts
│       ├── useLocalStream.ts
│       └── usePeerConnection.ts
│
├── layouts/                           # 공유 레이아웃
│   ├── index.ts
│   ├── MainLayout.tsx                 # Header + Sidebar + Footer
│   ├── AuthLayout.tsx                 # 로그인/회원가입용
│   └── AdminLayout.tsx                # 관리자용
│
├── libs/                              # 서드파티 라이브러리 설정
│   ├── index.ts
│   ├── queryClient.ts                 # React Query 설정
│   └── dayjs.ts                       # dayjs 플러그인/로케일
│
├── pages/                             # 라우트 단위 페이지
│   └── dashboard/
│       ├── DashboardPage.tsx          # 페이지 컴포넌트
│       ├── components/                # 페이지 전용 컴포넌트
│       │   └── StatCard/
│       │       ├── StatCard.tsx
│       │       └── useStatCard.ts
│       ├── hooks/                     # 페이지 전용 훅
│       │   └── useDashboardData.ts
│       ├── utils/                     # 페이지 전용 유틸
│       │   └── formatStats.ts
│       └── constants/                 # 페이지 전용 상수
│           └── dashboardConfig.ts
│
├── providers/                         # Context Provider 모음
│   ├── index.tsx                      # 모든 Provider 조합
│   ├── QueryProvider.tsx
│   ├── AuthProvider.tsx
│   └── ThemeProvider.tsx
│
├── routers/                           # 라우터 설정
│   ├── index.ts                       # 전체 라우터 조합
│   ├── publicRoutes.tsx               # 비로그인 접근 가능
│   ├── privateRoutes.tsx              # 로그인 필요
│   └── loaders/                       # Route loader (인증 체크 등)
│       ├── index.ts
│       └── authLoader.ts
│
├── stores/                            # 전역 상태 관리 (Zustand)
│   ├── index.ts
│   └── useAuthStore.ts                # 도메인별 스토어
│
├── styles/                            # 전역 스타일
│   └── global.css                     # Tailwind 지시어, 전역 CSS
│
├── types/                             # 공용 타입 정의
│   ├── index.ts
│   ├── user.ts                        # 도메인별 타입
│   └── api.ts                         # API 응답 타입
│
├── utils/                             # 공용 유틸 함수
│   ├── index.ts
│   ├── format.ts                      # 포맷팅 함수
│   └── validate.ts                    # 유효성 검사 함수
│
├── App.tsx                            # 앱 루트 컴포넌트
└── main.tsx                           # 엔트리 포인트
```