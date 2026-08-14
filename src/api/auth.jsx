import { apiRequest } from '@/api/client.jsx'

export function login({ phone, password }) {
  return apiRequest('/api/v1/auth/login', {
    method: 'POST',
    body: JSON.stringify({ phone, password }),
  })
}

export function signup(payload) {
  return apiRequest('/api/v1/auth/signup', {
    method: 'POST',
    body: JSON.stringify(payload),
  })
}
