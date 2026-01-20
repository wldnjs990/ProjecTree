# MSW (Mock Service Worker) 사용 가이드

우리 프로젝트는 프론트엔드 개발 단계에서 실제 API가 없어도 원활한 개발을 하기 위해 **MSW (Mock Service Worker)**를 도입했습니다.
이 문서는 MSW의 설치부터 동작 원리, 그리고 추후 실제 서버 연동 방법까지 설명합니다.

---

## 1. MSW 설치 및 설정 과정 (Checklist)

만약 새로운 팀원이 프로젝트를 받아 세팅한다면, 이미 설정 파일(`package.json`, `src/mocks/*`)이 다 있으므로 `pnpm install`만 하면 자동으로 적용됩니다.
하지만 원리를 알기 위해 최초 설정 과정을 기록해 둡니다.

> **주의:** 반드시 프로젝트 루트(`ProjecTree`)가 아닌 **웹 프로젝트 폴더(`ProjecTree-web`)** 내부에서 명령어를 실행해야 합니다.

### (1) 패키지 설치
```bash
# ProjecTree-web 폴더에서 실행
pnpm add -D msw
```

### (2) 서비스 워커 초기화 (중요)
브라우저에서 네트워크를 가로채기 위한 핵심 파일(`mockServiceWorker.js`)을 `public` 폴더에 생성합니다.
```bash
pnpm dlx msw init public --save
```

---

## 2. 프로젝트 파일 구조 및 역할

MSW를 위해 새로 추가된 폴더와 파일들의 역할입니다.

```
src/
├── mocks/
│   ├── handlers.ts      # [대본] "이 주소로 요청오면 이 데이터를 줘라" (API 명세 정의)
│   └── browser.ts       # [무대 감독] 위 핸들러를 가지고 가짜 서버를 실행시키는 리모컨
├── main.tsx             # [스위치] 앱 시작 전 개발 환경(DEV)이면 MSW를 켜는 코드 포함
└── pages/.../data/mockData.ts # [재료] 핸들러가 꺼내 쓸 실제 더미 데이터 (JSON)
```

- **`mockServiceWorker.js` (`public` 폴더)**: 실제 브라우저 뒤에서 동작하는 일꾼입니다. 절대 지우면 안 됩니다!

---

## 3. 동작 원리

컴포넌트가 데이터를 요청할 때의 흐름이 **[직접 가져오기]**에서 **[배달 시키기]**로 바뀌었습니다.

1.  **컴포넌트 (`WorkspaceContent.tsx`)**:
    - `fetch('/api/workspaces/my')`를 호출하여 데이터를 달라고 소리칩니다.
2.  **MSW (Worker)**:
    - 요청을 중간에서 가로챕니다.
    - `handlers.ts`를 확인합니다. "아, 이 요청은 내가 처리할게!"
3.  **MSW (Handler)**:
    - `mockData.ts`에 있는 데이터를 꺼내서 진짜 응답처럼 포장해 돌려줍니다.
4.  **컴포넌트**:
    - 진짜 서버에서 온 줄 알고 데이터를 받아 화면에 그립니다.

---

## 4. [중요] 추후 실제 백엔드 연동 방법

백엔드 API가 완성되면 MSW를 끄고 실제 서버와 연결해야 합니다. 아주 간단합니다!

### (1) MSW 끄기 (`src/main.tsx`)
`enableMocking` 함수를 실행하는 부분을 주석 처리하거나 지우면 됩니다.

```tsx
// src/main.tsx

// enableMocking().then(() => {   <-- 여기를 주석 처리!
  createRoot(document.getElementById('root')!).render(<App />);
// });
```
이렇게 하면 더 이상 가짜 서버가 동작하지 않고, 모든 요청이 네트워크 너머 진짜 서버로 날아갑니다.

### (2) API 주소 변경 (`WorkspaceContent.tsx` 등)
만약 실제 서버의 주소가 우리가 쓰던 가짜 주소(`api/workspaces/my`)와 다르다면, `fetch` 안에 있는 주소만 바꿔주면 됩니다.

```tsx
// 변경 전
fetch('/api/workspaces/my')

// 변경 후 (예시)
fetch('http://api.projectree.com/v1/projects')
```

---

### Tip. API 새로 추가하기
새로운 API가 필요하면 `src/mocks/handlers.ts` 파일에 가서 목록을 하나 더 추가하면 됩니다.

```typescript
http.get('/api/new-feature', () => {
    return HttpResponse.json({ data: "새로운 데이터" })
}),
```

이제 백엔드 기다리지 말고 자유롭게 개발하세요! 🚀
