import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import L from 'leaflet'

import BottomTab from '@/components/layout/BottomTab'

import { INITIAL_PRODUCTS } from './OwnedPage.jsx'

const SEOUL_CENTER = [37.517, 127.028]

const FILTERS = [
  { id: 'repairable', label: '이 제품 수리 가능' },
  { id: 'open', label: '지금 영업중' },
  { id: 'reservable', label: '예약 가능' },
]

const STORES = [
  {
    id: 1,
    name: 'MCM 강남 본점',
    detail: '서울 강남구 압구정로 · 1.2km · ~20:00 영업',
    repairable: true,
    open: true,
    reservable: true,
    latitude: 37.5269,
    longitude: 127.0408,
  },
  {
    id: 2,
    name: 'MCM 갤러리아 명품관',
    detail: '서울 강남구 압구정로 · 2.8km · ~20:30 영업',
    repairable: true,
    open: true,
    reservable: true,
    latitude: 37.5284,
    longitude: 127.0402,
  },
  {
    id: 3,
    name: 'MCM 서초 서비스센터',
    detail: '서울 서초구 서초대로 · 4.1km · ~19:00 영업',
    repairable: true,
    open: true,
    reservable: true,
    latitude: 37.4919,
    longitude: 127.0079,
  },
]

function getStoreLatLng(store) {
  if (Number.isFinite(store?.latitude) && Number.isFinite(store?.longitude)) {
    return [store.latitude, store.longitude]
  }
  return null
}

function getMapCenter(stores = []) {
  const points = stores.map(getStoreLatLng).filter(Boolean)
  if (points.length === 0) return SEOUL_CENTER

  const lat = points.reduce((sum, [value]) => sum + value, 0) / points.length
  const lng = points.reduce((sum, [, value]) => sum + value, 0) / points.length
  return [lat, lng]
}

function OwnedStoresPage() {
  const navigate = useNavigate()
  const { productId } = useParams()
  const location = useLocation()
  const [selectedFilters, setSelectedFilters] = useState(['repairable'])
  const product =
    location.state?.product ??
    INITIAL_PRODUCTS.find((item) => item.id === productId)

  if (!product) {
    return <Navigate to="/owned" replace />
  }

  const toggleFilter = (id) => {
    setSelectedFilters((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
  }

  const visibleStores = STORES.filter((store) =>
    selectedFilters.every((filterId) => store[filterId]),
  )

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col overflow-hidden bg-background">
      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
        <div className="no-scrollbar absolute inset-0 overflow-y-auto px-4 pt-9 pb-8">
          <div className="flex h-[35px] items-center">
            <button
              type="button"
              aria-label="뒤로 가기"
              onClick={() =>
                navigate(`/owned/${product.id}`, { state: { product } })
              }
              className="flex size-8 items-center justify-center bg-transparent"
            >
              <svg
                viewBox="0 0 10 18"
                className="h-[18px] w-[10px]"
                fill="none"
                aria-hidden
              >
                <path
                  d="M9 1L1 9L9 17"
                  stroke="#8A5A3C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>
          </div>

          <div className="flex flex-col gap-5">
            <StoreMap stores={visibleStores} />

            <div className="flex flex-wrap items-start gap-2.5">
              {FILTERS.map((filter) => {
                const selected = selectedFilters.includes(filter.id)

                return (
                  <button
                    key={filter.id}
                    type="button"
                    onClick={() => toggleFilter(filter.id)}
                    className={`flex h-[27px] items-center justify-center rounded-[20px] px-2.5 text-[13px] font-medium whitespace-nowrap ${
                      selected
                        ? 'bg-primary text-white'
                        : 'bg-background text-primary outline outline-[0.5px] -outline-offset-[0.5px] outline-primary-light-active'
                    }`}
                  >
                    {filter.label}
                  </button>
                )
              })}
            </div>

            <ul className="flex flex-col gap-5">
              {visibleStores.map((store) => (
                <li key={store.id}>
                  <StoreCard store={store} />
                </li>
              ))}
            </ul>

            <p className="text-[16px] leading-[1.4] font-semibold break-keep">
              <span className="text-[#3E281B]">{product.name}</span>
              <span className="text-[#947C50]">
                {' '}
                수리가 가능한
                <br />
                매장만 모아서 보여드려요
              </span>
            </p>
          </div>
        </div>
      </div>

      <BottomTab activeTab="manage" />
    </main>
  )
}

function StoreMap({ stores }) {
  const containerRef = useRef(null)
  const mapRef = useRef(null)
  const markersRef = useRef([])

  useEffect(() => {
    if (!containerRef.current || mapRef.current) return undefined

    const map = L.map(containerRef.current, {
      scrollWheelZoom: true,
      zoomControl: false,
      attributionControl: false,
    }).setView(getMapCenter([]), 13)

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; OpenStreetMap',
      maxZoom: 19,
    }).addTo(map)
    L.control.zoom({ position: 'topright' }).addTo(map)
    L.control.attribution({ prefix: false, position: 'bottomright' }).addTo(map)

    mapRef.current = map
    const frameId = window.requestAnimationFrame(() => map.invalidateSize())
    const timeoutId = window.setTimeout(() => map.invalidateSize(), 150)

    return () => {
      window.cancelAnimationFrame(frameId)
      window.clearTimeout(timeoutId)
      map.remove()
      mapRef.current = null
    }
  }, [])

  useEffect(() => {
    const map = mapRef.current
    if (!map) return

    markersRef.current.forEach((marker) => marker.remove())
    markersRef.current = []

    const points = []
    stores.forEach((store, index) => {
      const latLng = getStoreLatLng(store)
      if (!latLng) return
      points.push(latLng)

      const marker = L.marker(latLng, {
        icon: L.divIcon({
          className: 'store-map-pin',
          iconSize: [28, 36],
          iconAnchor: [14, 36],
          html: `<div class="store-map-pin-inner">
            <svg viewBox="0 0 28 36" width="28" height="36" aria-hidden="true">
              <path d="M14 0C6.268 0 0 6.13 0 13.68C0 23.63 14 36 14 36S28 23.63 28 13.68C28 6.13 21.732 0 14 0Z" fill="#6E4830"></path>
              <circle cx="14" cy="13.5" r="7.5" fill="#8A5A3C"></circle>
            </svg>
            <span>${index + 1}</span>
          </div>`,
        }),
        title: store.name,
      }).addTo(map)

      markersRef.current.push(marker)
    })

    if (points.length === 1) {
      map.setView(points[0], 15)
    } else if (points.length > 1) {
      map.fitBounds(points, { padding: [28, 28], maxZoom: 16 })
    } else {
      map.setView(getMapCenter([]), 13)
    }

    map.invalidateSize()
  }, [stores])

  return (
    <div className="store-map relative h-[260px] w-full overflow-hidden rounded-[10px] bg-[#e6e4e0]">
      <div ref={containerRef} className="h-full w-full" />
    </div>
  )
}

function StoreCard({ store }) {
  return (
    <article className="flex h-[75px] w-full items-center rounded-[20px] bg-[#FAF9F6] px-[15px] shadow-[2px_4px_10px_rgba(138,90,60,0.25)]">
      <div className="flex min-w-0 flex-1 items-center gap-[21px]">
        <span className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-primary text-[16px] font-semibold text-[#F9F6F0]">
          {store.id}
        </span>
        <div className="flex min-w-0 flex-1 flex-col items-start gap-[5px]">
          <div className="flex w-full items-center gap-[7px]">
            <p className="text-[16px] font-semibold text-[#3E281B]">
              {store.name}
            </p>
            {store.repairable ? (
              <span className="flex h-[17px] shrink-0 items-center justify-center rounded-[20px] bg-[#DDEDD1] px-2.5 text-[10px] font-medium text-[#3E281B]">
                수리 가능
              </span>
            ) : null}
          </div>
          <p className="w-full text-[12px] font-normal text-[#947C50]">
            {store.detail}
          </p>
        </div>
      </div>
      <svg
        viewBox="0 0 8 14"
        className="ml-2 h-[15px] w-[5px] shrink-0"
        fill="none"
        aria-hidden
      >
        <path
          d="M1 1L7 7L1 13"
          stroke="#947C50"
          strokeWidth="1.5"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </article>
  )
}

export default OwnedStoresPage
