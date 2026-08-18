import { apiRequest, isServerUnavailable, isUnauthorized, withFallback } from '@/api/client.jsx'
import { USE_FALLBACK } from '@/api/config.js'
import { addFallbackReservation } from '@/api/dummyData.js'

export async function createReservation(payload) {
  if (!USE_FALLBACK) {
    return apiRequest('/api/v1/reservations', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  }

  try {
    return await apiRequest('/api/v1/reservations', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  } catch (error) {
    const canFallback =
      isServerUnavailable(error) ||
      isUnauthorized(error) ||
      error.code === 'RESV400_2'
    if (!canFallback) throw error
    console.warn('[API] POST /api/v1/reservations 실패, 더미 예약으로 처리합니다.', error)
    return addFallbackReservation(payload)
  }
}

export function listReservations() {
  return withFallback(
    'GET /api/v1/reservations',
    () => apiRequest('/api/v1/reservations'),
    () => ({ list: [] }),
    { allowUnauthorized: true, useIfEmpty: true },
  )
}
