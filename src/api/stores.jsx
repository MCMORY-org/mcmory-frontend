import { apiRequest, withFallback } from '@/api/client.jsx'
import { USE_FALLBACK } from '@/api/config.js'
import { DUMMY_STORES, getFallbackSlots, getFallbackStores, TIME_SLOTS } from '@/api/dummyData.js'

export { TIME_SLOTS }

function toCoord(value) {
  const number = Number(value)
  return Number.isFinite(number) ? number : null
}

export function withStoreCoordinates(stores = []) {
  return stores.map((store, index) => {
    const latitude = toCoord(store?.latitude)
    const longitude = toCoord(store?.longitude)
    if (latitude != null && longitude != null) {
      return { ...store, latitude, longitude }
    }

    const dummy =
      DUMMY_STORES.find((item) => item.id === store?.id) ||
      DUMMY_STORES.find((item) => item.name === store?.name) ||
      DUMMY_STORES[index % DUMMY_STORES.length]

    return {
      ...store,
      latitude: dummy?.latitude ?? 37.517,
      longitude: dummy?.longitude ?? 127.028,
    }
  })
}

export function getStores({
  repair = false,
  openNow = false,
  reservable = false,
  storeId,
  date,
} = {}) {
  const params = new URLSearchParams()
  if (repair) params.set('repair', '1')
  if (openNow) params.set('openNow', '1')
  if (reservable) params.set('reservable', '1')
  if (storeId != null && date) {
    params.set('storeId', String(storeId))
    params.set('date', date)
  }

  const query = params.toString()
  return withFallback(
    'GET /api/v1/stores',
    async () => {
      const result = await apiRequest(`/api/v1/stores${query ? `?${query}` : ''}`)
      return {
        ...result,
        list: withStoreCoordinates(result?.list ?? []),
      }
    },
    () =>
      storeId != null && date
        ? getFallbackSlots({ date })
        : getFallbackStores({ repair, openNow, reservable }),
    { allowUnauthorized: true, useIfEmpty: true },
  )
}

export function getStoreSlots({ storeId, date }) {
  const params = new URLSearchParams({
    storeId: String(storeId),
    date,
  })

  return withFallback(
    `GET /api/v1/stores?storeId=${storeId}&date=${date}`,
    async () => {
      const result = await apiRequest(`/api/v1/stores?${params.toString()}`)
      if (USE_FALLBACK && !result?.slots?.length) {
        return getFallbackSlots({ date })
      }
      return result
    },
    () => getFallbackSlots({ date }),
    { allowUnauthorized: true },
  )
}
