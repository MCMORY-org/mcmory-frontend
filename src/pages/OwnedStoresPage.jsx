import { useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

import BottomTab from '@/components/layout/BottomTab'

import { INITIAL_PRODUCTS } from './OwnedPage.jsx'

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
    pin: { left: 153, top: 34 },
  },
  {
    id: 2,
    name: 'MCM 갤러리아 명품관',
    detail: '서울 강남구 압구정로 · 2.8km · ~20:30 영업',
    repairable: true,
    open: true,
    reservable: true,
    pin: { left: 203, top: 62 },
  },
  {
    id: 3,
    name: 'MCM 서초 서비스센터',
    detail: '서울 서초구 서초대로 · 4.1km · ~19:00 영업',
    repairable: true,
    open: true,
    reservable: true,
    pin: { left: 119, top: 95 },
  },
]

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
            <div className="relative h-[186px] w-full overflow-hidden bg-secondary-light-active">
              {visibleStores.map((store) => (
                <MapPin
                  key={store.id}
                  number={store.id}
                  left={store.pin.left}
                  top={store.pin.top}
                />
              ))}
            </div>

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

function MapPin({ number, left, top }) {
  return (
    <div
      className="absolute flex h-[33px] w-[25px] items-start justify-center"
      style={{ left, top }}
    >
      <svg viewBox="0 0 25 33" className="absolute inset-0" aria-hidden>
        <path
          d="M12.5 0C5.596 0 0 5.477 0 12.23C0 21.12 12.5 33 12.5 33S25 21.12 25 12.23C25 5.477 19.404 0 12.5 0Z"
          fill="#6E4830"
        />
      </svg>
      <span className="relative mt-1 text-[16px] font-semibold text-white">
        {number}
      </span>
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
