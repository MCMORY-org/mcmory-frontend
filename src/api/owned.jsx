import { apiRequest } from '@/api/client.jsx'

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
  return apiRequest('/api/v1/owned')
}

export function registerOwned(serial) {
  return apiRequest('/api/v1/owned', {
    method: 'POST',
    body: JSON.stringify({ serial }),
  })
}

export function deleteOwned(id) {
  return apiRequest('/api/v1/owned', {
    method: 'DELETE',
    body: JSON.stringify({ id }),
  })
}

export function getOwnedStyling(id, { aiReason = false } = {}) {
  const query = aiReason ? '?aiReason=true' : ''
  return apiRequest(`/api/v1/owned/${id}/styling${query}`)
}

export function getOwnedCareGuide(id) {
  return apiRequest(`/api/v1/owned/${id}/care-guide`)
}
