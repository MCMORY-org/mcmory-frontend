import { apiRequest } from '@/api/client.jsx'

export function getStores({ repair = false, openNow = false, reservable = false } = {}) {
  const params = new URLSearchParams()
  if (repair) params.set('repair', '1')
  if (openNow) params.set('openNow', '1')
  if (reservable) params.set('reservable', '1')

  const query = params.toString()
  return apiRequest(`/api/v1/stores${query ? `?${query}` : ''}`)
}
