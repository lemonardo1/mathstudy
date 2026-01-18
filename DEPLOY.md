# GitHub Pages 배포 가이드

이 프로젝트를 GitHub Pages에 배포하는 방법입니다.

## 1단계: GitHub 리포지토리 생성

1. GitHub에 로그인하고 새 리포지토리를 생성합니다.
2. 리포지토리 이름을 입력합니다 (예: `math-master-site`)

## 2단계: 코드 푸시

터미널에서 다음 명령어를 실행합니다:

```bash
# Git 초기화 (아직 안 했다면)
git init

# 모든 파일 추가
git add .

# 첫 커밋
git commit -m "Initial commit"

# GitHub 리포지토리 추가 (YOUR_USERNAME과 YOUR_REPO_NAME을 실제 값으로 변경)
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git

# 메인 브랜치로 푸시
git branch -M main
git push -u origin main
```

## 3단계: GitHub Pages 설정

1. GitHub 리포지토리 페이지로 이동합니다.
2. **Settings** 탭을 클릭합니다.
3. 왼쪽 메뉴에서 **Pages**를 클릭합니다.
4. **Source** 섹션에서:
   - **Deploy from a branch** 선택
   - Branch를 `gh-pages`로 설정하고 `/ (root)` 선택
   - 또는 **GitHub Actions** 선택 (권장)

## 4단계: GitHub Actions 사용 (권장)

이미 `.github/workflows/deploy.yml` 파일이 포함되어 있습니다.

1. 코드를 푸시하면 자동으로 GitHub Actions가 실행됩니다.
2. **Actions** 탭에서 배포 진행 상황을 확인할 수 있습니다.
3. 배포가 완료되면 **Settings > Pages**에서 사이트 URL을 확인할 수 있습니다.

## 5단계: 리포지토리 이름에 맞게 base 경로 설정 (선택사항)

만약 리포지토리 이름이 `math-master-site`가 아니라면, `vite.config.mjs` 파일을 수정해야 합니다:

```javascript
import { defineConfig } from 'vite';

export default defineConfig({
  base: '/YOUR_REPO_NAME/',  // 리포지토리 이름으로 변경
  server: {
    port: 3000,
    open: true,
    host: true
  },
  build: {
    outDir: 'dist',
    assetsDir: 'assets'
  }
});
```

**참고**: 리포지토리 이름이 `username.github.io` 형식이면 base를 `/`로 설정하세요.

## 배포 확인

배포가 완료되면 다음 URL로 접속할 수 있습니다:
- `https://YOUR_USERNAME.github.io/YOUR_REPO_NAME/`
- 또는 `https://YOUR_USERNAME.github.io/` (리포지토리 이름이 `username.github.io`인 경우)

## 문제 해결

### 배포가 실패하는 경우
1. **Actions** 탭에서 로그를 확인하세요.
2. Node.js 버전이 맞는지 확인하세요 (package.json 확인).
3. 빌드 오류가 있는지 확인하세요 (`npm run build` 로컬에서 테스트).

### 사이트가 제대로 표시되지 않는 경우
1. `vite.config.mjs`의 `base` 경로가 올바른지 확인하세요.
2. 브라우저 캐시를 지우고 다시 시도하세요.
3. GitHub Pages 설정에서 올바른 브랜치가 선택되었는지 확인하세요.

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
