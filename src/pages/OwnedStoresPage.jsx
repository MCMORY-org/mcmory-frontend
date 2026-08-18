import { useEffect, useRef, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'
import L from 'leaflet'

import { isUnauthorized } from '@/api/client.jsx'
import { listOwned, mapOwnedProduct } from '@/api/owned.jsx'
import { getStores } from '@/api/stores.jsx'
import BottomTab from '@/components/layout/BottomTab'

const SEOUL_CENTER = [37.517, 127.028]

const FILTERS = [
  { id: 'repair', label: '이 제품 수리 가능' },
  { id: 'openNow', label: '지금 영업중' },
  { id: 'reservable', label: '예약 가능' },
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
  const ownedId = Number(productId)
  const [selectedFilters, setSelectedFilters] = useState(['repair'])
  const [product, setProduct] = useState(location.state?.product ?? null)
  const [stores, setStores] = useState([])
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [notFound, setNotFound] = useState(Number.isNaN(ownedId))

  useEffect(() => {
    if (Number.isNaN(ownedId) || location.state?.product) return undefined

    let cancelled = false

    async function loadProduct() {
      try {
        const result = await listOwned()
        if (cancelled) return
        const found = (result?.list ?? [])
          .map(mapOwnedProduct)
          .find((item) => item.id === ownedId)
        if (!found) {
          setNotFound(true)
          return
        }
        setProduct(found)
      } catch (error) {
        if (cancelled) return
        if (isUnauthorized(error)) {
          navigate('/login', { replace: true })
          return
        }
        setErrorMessage(error.message ?? '제품 정보를 불러오지 못했습니다.')
      }
    }

    loadProduct()
    return () => {
      cancelled = true
    }
  }, [ownedId, location.state?.product, navigate])

  useEffect(() => {
    let cancelled = false

    async function loadStores() {
      setIsLoading(true)
      setErrorMessage('')
      try {
        const result = await getStores({
          repair: selectedFilters.includes('repair'),
          openNow: selectedFilters.includes('openNow'),
          reservable: selectedFilters.includes('reservable'),
        })
        if (!cancelled) setStores(result?.list ?? [])
      } catch (error) {
        if (cancelled) return
        setErrorMessage(error.message ?? '매장 정보를 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadStores()
    return () => {
      cancelled = true
    }
  }, [selectedFilters])

  if (notFound) {
    return <Navigate to="/owned" replace />
  }

  const toggleFilter = (id) => {
    setSelectedFilters((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
  }

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col overflow-hidden bg-background">
      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
        <div className="no-scrollbar absolute inset-0 overflow-y-auto px-4 pt-9 pb-8">
          <div className="flex h-[35px] items-center">
            <button
              type="button"
              aria-label="뒤로 가기"
              onClick={() =>
                navigate(`/owned/${ownedId}`, { state: { product } })
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
            <StoreMap stores={stores} />

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

            {errorMessage ? (
              <p role="alert" className="text-[12px] font-medium text-[#9E2A2B]">
                {errorMessage}
              </p>
            ) : null}

            {isLoading ? (
              <p className="text-center text-[13px] font-medium text-[#947C50]">
                불러오는 중...
              </p>
            ) : stores.length === 0 ? (
              <p className="text-center text-[13px] font-medium text-[#947C50]">
                조건에 맞는 매장이 없어요
              </p>
            ) : (
              <ul className="flex flex-col gap-5">
                {stores.map((store, index) => (
                  <li key={store.id}>
                    <StoreCard store={store} number={index + 1} />
                  </li>
                ))}
              </ul>
            )}

            <p className="text-[16px] leading-[1.4] font-semibold break-keep">
              <span className="text-[#3E281B]">{product?.name ?? '이 제품'}</span>
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

function StoreCard({ store, number }) {
  const detail = [store.address, store.distanceKm != null ? `${store.distanceKm}km` : null, store.closeTime ? `~${store.closeTime} 영업` : null]
    .filter(Boolean)
    .join(' · ')

  return (
    <article className="flex h-[75px] w-full items-center rounded-[20px] bg-[#FAF9F6] px-[15px] shadow-[2px_4px_10px_rgba(138,90,60,0.25)]">
      <div className="flex min-w-0 flex-1 items-center gap-[21px]">
        <span className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-primary text-[16px] font-semibold text-[#F9F6F0]">
          {number}
        </span>
        <div className="flex min-w-0 flex-1 flex-col items-start gap-[5px]">
          <div className="flex w-full items-center gap-[7px]">
            <p className="text-[16px] font-semibold text-[#3E281B]">
              {store.name}
            </p>
            {store.repairAvailable ? (
              <span className="flex h-[17px] shrink-0 items-center justify-center rounded-[20px] bg-[#DDEDD1] px-2.5 text-[10px] font-medium text-[#3E281B]">
                수리 가능
              </span>
            ) : null}
          </div>
          <p className="w-full text-[12px] font-normal text-[#947C50]">
            {detail}
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