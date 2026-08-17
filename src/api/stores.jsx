import { apiRequest, withFallback } from '@/api/client.jsx'
import { getFallbackStores } from '@/api/dummyData.js'

export function getStores({ repair = false, openNow = false, reservable = false } = {}) {
  const params = new URLSearchParams()
  if (repair) params.set('repair', '1')
  if (openNow) params.set('openNow', '1')
  if (reservable) params.set('reservable', '1')

  const query = params.toString()
  return withFallback(
    'GET /api/v1/stores',
    () => apiRequest(`/api/v1/stores${query ? `?${query}` : ''}`),
    () => getFallbackStores({ repair, openNow, reservable }),
  )
}
