/**
 * API 설정 — 이 파일만 고치면 됩니다.
 *
 * USE_FALLBACK
 *   true  : 서버가 꺼져 있거나, 응답이 깨지거나, 목록이 비어 있으면 더미 데이터로 화면을 채웁니다
 *   false : 서버만 사용합니다. 실패하면 에러가 그대로 보입니다
 *
 * API_BASE_URL
 *   연결할 서버 주소입니다. 끝 슬래시는 넣지 마세요.
 *   예) 'https://api.cartlab.store'
 *       'http://localhost:8080'
 */
export const USE_FALLBACK = true

export const API_BASE_URL = 'https://api.cartlab.store'
