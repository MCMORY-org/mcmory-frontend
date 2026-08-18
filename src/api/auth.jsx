import { apiRequest, withFallback } from '@/api/client.jsx'
import { getFallbackAuthResult } from '@/api/dummyData.js'

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
