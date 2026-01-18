import { defineConfig } from 'vite';

// GitHub Pages 배포를 위한 base 경로 설정
// 리포지토리 이름이 'username.github.io'가 아닌 경우, 
// base를 '/리포지토리이름/'으로 설정하세요.
// 예: base: '/math-master-site/'
// 환경 변수로도 설정 가능: process.env.BASE_PATH || '/'
const base = process.env.BASE_PATH || '/';

export default defineConfig({
  base: base,
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
