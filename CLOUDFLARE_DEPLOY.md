# Cloudflare Pages 배포 가이드

이 프로젝트를 Cloudflare Pages에 배포하는 방법입니다.

## 1단계: Cloudflare Pages 프로젝트 생성

1. [Cloudflare Dashboard](https://dash.cloudflare.com/)에 로그인합니다.
2. 왼쪽 메뉴에서 **Pages**를 클릭합니다.
3. **Create a project** 버튼을 클릭합니다.
4. **Connect to Git**을 선택하고 GitHub/GitLab/Bitbucket 리포지토리를 연결합니다.

## 2단계: 빌드 설정

프로젝트 연결 후 다음 설정을 입력합니다:

### 빌드 설정

- **Framework preset**: `Vite` (또는 `None`)
- **Build command**: `npm install && npm run build`
- **Build output directory**: `dist`
- **Root directory (advanced)**: `/` (기본값 유지)

### 환경 변수 (필요한 경우)

현재 프로젝트는 기본 환경 변수가 필요하지 않습니다.

## 3단계: 배포

1. **Save and Deploy** 버튼을 클릭합니다.
2. 배포가 완료될 때까지 기다립니다 (보통 2-5분 소요).
3. 배포가 완료되면 사이트 URL이 생성됩니다 (예: `https://42e01ffc.mathstudy-epq.pages.dev`).

## SSL/TLS 오류 해결 방법

`ERR_SSL_VERSION_OR_CIPHER_MISMATCH` 오류가 발생하는 경우 다음을 확인하세요:

### 방법 1: SSL/TLS 모드 확인 (가장 중요)

1. Cloudflare Dashboard에서 **SSL/TLS** 메뉴로 이동합니다.
2. **Overview** 탭에서 **SSL/TLS encryption mode**를 확인합니다.
3. 다음 중 하나로 설정합니다:
   - **Full** (권장): Cloudflare와 원본 서버 간 암호화
   - **Full (strict)**: Full과 동일하지만 유효한 인증서 필요
   - **Flexible**: Cloudflare와 방문자 간에만 암호화 (권장하지 않음)

**중요**: Cloudflare Pages의 경우 **Full** 또는 **Full (strict)** 모드를 사용해야 합니다.

### 방법 2: 배포 완료 대기

1. Cloudflare Pages 대시보드에서 배포 상태를 확인합니다.
2. 배포가 **Success** 상태가 될 때까지 기다립니다.
3. SSL 인증서 발급에는 최대 24시간이 걸릴 수 있습니다 (보통 몇 분 내 완료).

### 방법 3: 브라우저 캐시 및 DNS 캐시 지우기

1. **브라우저 캐시 지우기**:
   - Chrome/Edge: `Ctrl+Shift+Delete` (Windows) 또는 `Cmd+Shift+Delete` (Mac)
   - 캐시된 이미지 및 파일 선택 후 삭제

2. **DNS 캐시 지우기**:
   ```bash
   # macOS
   sudo dscacheutil -flushcache; sudo killall -HUP mDNSResponder
   
   # Windows
   ipconfig /flushdns
   
   # Linux
   sudo systemd-resolve --flush-caches
   ```

3. 브라우저를 완전히 종료한 후 다시 열어 사이트에 접속합니다.

### 방법 4: 사이트 URL 확인

1. Cloudflare Pages 대시보드에서 프로젝트를 엽니다.
2. **Custom domains** 섹션을 확인합니다.
3. 기본 `.pages.dev` 도메인을 사용하는 경우 SSL이 자동으로 설정됩니다.
4. 커스텀 도메인을 사용하는 경우 DNS 설정이 올바른지 확인하세요.

### 방법 5: 배포 재시도

1. Cloudflare Pages 대시보드에서 프로젝트를 엽니다.
2. **Deployments** 탭으로 이동합니다.
3. 최신 배포의 **Retry deployment** 버튼을 클릭합니다.

### 방법 6: 프로젝트 삭제 후 재생성

위 방법들이 작동하지 않는 경우:

1. Cloudflare Pages에서 프로젝트를 삭제합니다.
2. 새 프로젝트를 생성하고 동일한 설정으로 다시 배포합니다.
3. 이 과정에서 SSL 인증서가 새로 발급됩니다.

## 커스텀 도메인 설정 (선택사항)

1. Cloudflare Pages 프로젝트에서 **Custom domains** 탭으로 이동합니다.
2. **Set up a custom domain** 버튼을 클릭합니다.
3. 도메인을 입력하고 지시에 따라 DNS 레코드를 설정합니다.
4. DNS 전파에는 최대 24시간이 걸릴 수 있습니다 (보통 몇 분 내 완료).

## 문제 해결

### 배포가 실패하는 경우

1. **Build logs 확인**:
   - Cloudflare Pages 대시보드에서 배포를 클릭합니다.
   - **Build logs** 탭에서 오류 메시지를 확인합니다.

2. **로컬 빌드 테스트**:
   ```bash
   npm install
   npm run build
   ```
   로컬에서 빌드가 성공하는지 확인합니다.

3. **Node.js 버전 확인**:
   - `package.json`에서 Node.js 버전 요구사항을 확인합니다.
   - 필요시 Cloudflare Pages의 환경 변수에서 `NODE_VERSION`을 설정합니다.

### 사이트가 제대로 표시되지 않는 경우

1. **Base 경로 확인**:
   - `vite.config.mjs`의 `base` 설정이 올바른지 확인합니다.
   - Cloudflare Pages의 경우 일반적으로 `/`를 사용합니다.

2. **빌드 출력 디렉토리 확인**:
   - `dist` 폴더에 `index.html`이 있는지 확인합니다.
   - 빌드 후 `dist` 폴더의 내용을 확인합니다.

3. **404 오류 발생 시**:
   - Cloudflare Pages는 SPA(Single Page Application)를 지원합니다.
   - `_redirects` 파일을 `dist` 폴더에 추가할 수 있습니다:
     ```
     /*    /index.html   200
     ```

## 로컬에서 빌드 테스트

배포 전에 로컬에서 빌드를 테스트할 수 있습니다:

```bash
# 의존성 설치
npm install

# 빌드
npm run build

# 빌드 결과 미리보기
npm run preview
```

빌드가 성공하면 `dist` 폴더에 파일이 생성됩니다.

## 참고 자료

- [Cloudflare Pages 문서](https://developers.cloudflare.com/pages/)
- [Cloudflare SSL/TLS 설정](https://developers.cloudflare.com/ssl/)
- [Vite 배포 가이드](https://vitejs.dev/guide/static-deploy.html)
