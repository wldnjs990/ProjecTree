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

## 공용 prettier 설정

- 다음 익스텐션을 설치해주세요.
- Prettier - Code formatter
  ![alt text](image-1.png)

- prettier를 vscode에 적용하기 위한 익스텐션입니다.

- settings.json 파일에 다음 코드를 추가해주세요.
- 파일을 저장할때, .prettierrc.json에서 설정한 포멧으로 코드가 정돈됩니다.
- {}는 빼고 넣어주세요.

```json
// settings.json
{
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "editor.formatOnSave": true
}
```

## tailwindcss 익스텐션 설치

- 다음 익스텐션을 설치해주세요.
- Tailwind CSS IntelliSense
  ![alt text](image.png)

- 테일윈드 클래스 자동완성을 도와주는 익스텐션입니다.

## 프로젝트 alias 설정

- @/를 사용하면 ./src 루트 경로를 이용할 수 있습니다.
- alias 설정하기 위한 코드는 다음과 같습니다. 다음 프로젝트 할 때 참고하세요.

```json
// tsconfig.app.json에 추가
"paths": {
  "@/*": ["./src/*"]
},
```

```json
// tsconfig.json에 추가
"compilerOptions": {
  "baseUrl": ".",
  "paths": {
    "@/*": ["./src/*"]
  }
}
```

- 그리고 vite 프로젝트에서 vite-tsconfig-paths 이 패키지를 설치해야합니다.

```bash
# npm일때
npm install vite-tsconfig-paths
# pnpm일때
pnpm install vite-tsconfig-paths
```

```javascript
import tsconfigPaths from 'vite-tsconfig-paths';
// vite.config.ts
// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(), // tsconfigPaths 추가하면 끝
  ],
});
```

## route 등록

- route 등록은 src/routes/publicRoutes.tsx 파일에서 등록하시면 됩니다.

```tsx
import HomePage from '@/pages/HomePage';
import type { RouteObject } from 'react-router';

export const publicRoutes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
    loader: async () => {},
  },
  // 여기 추가!
];
```

- 이 코드를 복사해서 gpt한테 객체 라우트 방식에 대해 알려달라하고 공부해주세요(기존 route와 사용법이 좀 다릅니다.)

## shadcn 사용법

- shadcn 공식 홈페이지에서 필요한 컴포넌트를 긁어올 수 있습니다.

```bash
npx shadcn@latest add button
npx shadcn@latest add card
```

- 설치하면 src/components/ui 경로에 해당 컴포넌트가 추가됩니다.
- 이렇게 만들어지는 컴포넌트는 모두가 공용으로 사용할거라 코드 수정을 하려면 팀원들과 먼저 이야기를 나눠야 합니다.
- 만약 Button 컴포넌트를 긁어왔다면 사용할 파일에 Button 컴포넌트를 import 해서 사용하면 됩니다.

```tsx
import { Button } from '@/components/ui/button';

export default function HomePage() {
  return (
    <>
      <div>예시용 homepage입니다.</div>
      <Button
        className="w-20"
        onClick={() => {
          alert('일반 html 태그 사용하는것처럼 쓰면 됩니당.');
        }}
      >
        Shadcn 버튼 컴포넌트
      </Button>
    </>
  );
}
```

- className이나 onClick 등 거의 모든 기능들을 컴포넌트에 사용할 수 있으니 이걸로 커스텀하시면 됩니다.
