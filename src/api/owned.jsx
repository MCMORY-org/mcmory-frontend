import { apiRequest, withFallback } from '@/api/client.jsx'
import {
  addFallbackOwned,
  getFallbackCareGuide,
  getFallbackOwned,
  getFallbackStyling,
  removeFallbackOwned,
} from '@/api/dummyData.js'

export function formatOwnedDate(value) {
  if (!value) return ''
  const [year, month, day] = String(value).slice(0, 10).split('-')
  if (!year || !month || !day) return value
  return `${year} . ${month} . ${day}`
}

export function mapOwnedProduct(item) {
  return {
    id: item.id,
    name: item.product?.name ?? '이름 없는 제품',
    addedAt: formatOwnedDate(item.createdAt),
    serial: item.serialMemo ?? '',
    imageUrl: item.product?.imageUrl ?? null,
    source: item.source,
    productId: item.product?.productId ?? null,
  }
}

export function listOwned() {
  return withFallback('GET /api/v1/owned', () => apiRequest('/api/v1/owned'), getFallbackOwned)
}

export function registerOwned(serial) {
  return withFallback(
    'POST /api/v1/owned',
    () =>
      apiRequest('/api/v1/owned', {
        method: 'POST',
        body: JSON.stringify({ serial }),
      }),
    () => addFallbackOwned(serial),
  )
}

export function deleteOwned(id) {
  return withFallback(
    'DELETE /api/v1/owned',
    () =>
      apiRequest('/api/v1/owned', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      }),
    () => removeFallbackOwned(id),
  )
}

export function getOwnedStyling(id, { aiReason = false } = {}) {
  const query = aiReason ? '?aiReason=true' : ''
  return withFallback(
    `GET /api/v1/owned/${id}/styling`,
    () => apiRequest(`/api/v1/owned/${id}/styling${query}`),
    getFallbackStyling,
  )
}

export function getOwnedCareGuide(id) {
  return withFallback(
    `GET /api/v1/owned/${id}/care-guide`,
    () => apiRequest(`/api/v1/owned/${id}/care-guide`),
    getFallbackCareGuide,
  )
}
