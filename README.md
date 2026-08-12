# MCMORY Frontend

## 프로젝트 소개

MCMORY는 럭셔리 브랜드 선물을 고를 때 발생하는 고민을 줄이기 위한 **AI 기반 취향 분석 및 선물 추천 서비스**입니다.

사용자 본인과 소중한 사람들의 취향을 기록하고, 선물 목적·관계·상황·예산 등의 정보를 바탕으로 적절한 선물을 추천하는 것을 목표로 합니다.

### 주요 기능

- 로그인 및 회원가입
- 사용자와 지인의 취향 정보 관리
- 취향 체크리스트
- 선물 조건 입력 및 AI 기반 상품 추천
- 추천 상품 저장 및 관리
- 초대장 관리
- 마이페이지

현재 저장소는 공통 디자인 토큰, 글로벌 스타일, 폰트 및 기본 디렉터리 등 프론트엔드 개발 환경을 구성한 상태입니다.

## 기술 스택

| 구분 | 기술 | 역할 |
| --- | --- | --- |
| UI | React 19 | 컴포넌트 기반 사용자 인터페이스 구현 |
| 빌드 도구 | Vite 8 | 개발 서버 및 프로덕션 번들 생성 |
| 언어 | JavaScript | 애플리케이션 개발 언어 |
| 스타일 | Tailwind CSS 4 | 유틸리티 기반 스타일링 및 디자인 토큰 연동 |
| 라우팅 | React Router 7 | 페이지 경로 및 화면 전환 관리 |
| 폰트 | Pretendard Variable | 서비스 공통 한글 웹폰트 |
| 코드 검사 | ESLint | 코드 품질 및 문법 검사 |

Android 하이브리드 앱 환경은 추후 Capacitor를 이용해 구성할 예정입니다. API 통신과 서버 상태 관리 도구는 백엔드 연동 시점에 추가합니다.

## 디렉터리 구조

```text
mcmory-frontend/
├─ public/                    # URL로 직접 접근하는 정적 파일
├─ src/
│  ├─ app/
│  │  └─ App.jsx             # 애플리케이션 최상위 컴포넌트
│  ├─ assets/
│  │  ├─ icons/              # 공통 SVG 아이콘
│  │  └─ images/             # 로고, 상품 등 이미지 리소스
│  ├─ components/
│  │  ├─ layout/             # 헤더, 내비게이션 등 공통 레이아웃
│  │  └─ ui/                 # 버튼, 입력창, 카드 등 공통 UI
│  ├─ pages/                 # 라우트에 대응하는 페이지 컴포넌트
│  ├─ styles/
│  │  ├─ global.css          # reset 및 앱 전체 기본 스타일
│  │  └─ tokens.css          # 색상과 타이포그래피 디자인 토큰
│  ├─ index.css              # Tailwind, 폰트, 전역 CSS 진입점
│  └─ main.jsx               # React 애플리케이션 진입점
├─ index.html                # Vite HTML 진입점과 모바일 메타데이터
├─ vite.config.js            # Vite, Tailwind 및 경로 별칭 설정
├─ eslint.config.js          # ESLint 설정
└─ package.json              # 의존성 및 npm 스크립트
```

### 주요 디렉터리 역할

- `app`: 전역 Provider와 Router 등 애플리케이션의 최상위 구성을 관리합니다.
- `assets`: 코드에서 사용하는 아이콘과 이미지 리소스를 관리합니다.
- `components/ui`: 특정 기능에 의존하지 않는 재사용 가능한 UI 컴포넌트를 관리합니다.
- `components/layout`: 여러 페이지가 공유하는 화면 구조를 관리합니다.
- `pages`: URL 경로 단위의 최상위 화면을 관리합니다.
- `styles/tokens.css`: 브랜드 색상, 상태 색상, 폰트 크기 및 굵기를 관리합니다.
- `styles/global.css`: 브라우저 기본 스타일 초기화와 모바일 화면의 공통 동작을 관리합니다.

기능별 디렉터리, API, 상태 관리 구조는 실제 기능 개발이 시작될 때 필요한 범위만 추가합니다.

## 실행 방법

```bash
npm install
npm run dev
```

코드 검사와 프로덕션 빌드는 다음 명령으로 실행합니다.

```bash
npm run lint
npm run build
```
