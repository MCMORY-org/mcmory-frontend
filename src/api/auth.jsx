import { apiRequest, withFallback } from '@/api/client.jsx'
import { USE_FALLBACK } from '@/api/config.js'
import { getFallbackAuthResult, getFallbackMe } from '@/api/dummyData.js'

export function login({ phone, password }) {
  return withFallback(
    'POST /api/v1/auth/login',
    () =>
      apiRequest('/api/v1/auth/login', {
        method: 'POST',
        body: JSON.stringify({ phone, password }),
      }),
    () => getFallbackAuthResult({ phone }),
  )
}

export function signup(payload) {
  return withFallback(
    'POST /api/v1/auth/signup',
    () =>
      apiRequest('/api/v1/auth/signup', {
        method: 'POST',
        body: JSON.stringify(payload),
      }),
    () => getFallbackAuthResult(payload),
  )
}

export function getMe() {
  return withFallback(
    'GET /api/v1/auth/me',
    async () => {
      const result = await apiRequest('/api/v1/auth/me')
      // 미인증도 401이 아니라 200 + member: null 이라, 폴백이 켜져 있으면 더미 회원으로 화면을 채웁니다.
      if (!result?.member && USE_FALLBACK) return getFallbackMe()
      return result
    },
    getFallbackMe,
  )
}
