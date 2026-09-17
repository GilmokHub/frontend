import {defineConfig, loadEnv} from 'vite' // loadEnv 추가
import react from '@vitejs/plugin-react'

export default defineConfig(({mode}) => {
    // .env 파일의 환경 변수를 불러옵니다.
    const env = loadEnv(mode, process.cwd(), '')

    // ⭐️ 백엔드 프록시 타겟을 8081(API)에서 8080(Gateway)으로 변경하거나
    // 환경변수(VITE_API_BASE_URL)를 읽어오도록 합니다.
    const bypassHtml = (req) => {
        if (req.headers.accept?.includes('text/html')) return '/index.html'
    }

    // 인증 서버 프록시 - 포트 9000
    const authProxy = {
        target: env.VITE_AUTH_BASE_URL || 'http://localhost:9000',
        changeOrigin: true,
        bypass: bypassHtml,
    }

    // API 서버 프록시 - 포트 8081
    const apiProxy = {
        target: env.VITE_API_BASE_URL || 'http://localhost:8081',
        changeOrigin: true,
        bypass: bypassHtml,
    }

    return {
        plugins: [react()],
        server: {
            port: 3030,
            proxy: {
                // [Auth 서버 전용 경로]
                '/auth': authProxy,

                // [API & 대기열 서버 전용 경로]
                '/admin': apiProxy,
                '/users': apiProxy,
                '/events': apiProxy,
                '/queue': apiProxy,
                '/reservations': apiProxy,
                '/api': apiProxy,
            },
        },
    }
})
