import { useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

import chevronIcon from '@/assets/icons/common-components/Chevron.svg'
import BottomTab from '@/components/layout/BottomTab'

import { INITIAL_PRODUCTS } from './OwnedPage.jsx'

const STYLING_ITEMS = [
  {
    id: 'aren-card',
    reason: '평소 ‘미니멀’ 스타일을 즐기시네요!',
    category: '가죽 소품',
    name: '미니 Aren 비세토스 카드 케이스',
    price: 290000,
  },
  {
    id: 'denim-jacket',
    reason: '모델이 함께 매치한 제품이에요!',
    category: 'WOMAN OUTER',
    name: '워싱 데님 재킷',
    price: 1250000,
  },
  {
    id: 'flare-pants',
    reason: '모델이 함께 매치한 제품이에요!',
    category: 'WOMAN BOTTOM',
    name: '루렉스 데님 플레어 팬츠',
    price: 830000,
  },
]

const MANAGEMENT_TIPS = [
  {
    id: 1,
    text: '가죽 제품은 물에 취약합니다. 물에 닿지 않도록 노력해주세요.',
  },
  {
    id: 2,
    text: '혹시 제품에 물이 닿았다면 부드러운 천으로 닦아내시고 가까운 매장으로 방문해주세요.',
    action: '가까운 매장 찾기',
  },
  {
    id: 3,
    text: '제품에 이상이 생길 경우, 선물 이후 1년 이내의 제품은 무상 서비스 대상입니다. 그 이외는 추가 요금이 발생될 수 있습니다.',
  },
]

function OwnedDetailPage() {
  const navigate = useNavigate()
  const { productId } = useParams()
  const location = useLocation()
  const [activeTab, setActiveTab] = useState('styling')
  const product =
    location.state?.product ??
    INITIAL_PRODUCTS.find((item) => item.id === productId)

  if (!product) {
    return <Navigate to="/owned" replace />
  }

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col overflow-hidden bg-background">
      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
        <div className="no-scrollbar absolute inset-0 overflow-y-auto px-4 pt-[30px] pb-8">
          <p className="h-8 w-[261px] text-[13px] leading-4 font-medium text-primary-active">
            함께 스타일링 하면 좋은 제품을
            <br />
            AI가 추천해 드려요
          </p>

          <section className="mt-[35px] flex h-[148px] items-center overflow-hidden rounded-[20px] bg-[#FAF9F6] px-[25px] shadow-[2px_4px_10px_rgba(138,90,60,0.25)]">
            <div className="flex items-center gap-5">
              <span className="size-[104px] shrink-0 rounded-[10px] bg-secondary-light-active shadow-[2px_2px_4px_rgba(110,72,48,0.25)]" />
              <div className="flex w-[182px] flex-col items-start gap-[19px]">
                <div className="flex w-full flex-col items-start">
                  <p className="text-[13px] font-medium text-[#947C50]">NAME</p>
                  <p className="w-full text-[16px] font-semibold break-keep text-[#3E281B]">
                    {product.name}
                  </p>
                </div>
                <div className="flex w-full flex-col items-start">
                  <p className="text-[13px] font-medium text-[#947C50]">ADDED</p>
                  <p className="w-full text-[16px] font-semibold text-[#3E281B]">
                    {product.addedAt}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-[30px]">
            <div className="grid grid-cols-2">
              <button
                type="button"
                onClick={() => setActiveTab('styling')}
                className={`text-center text-[16px] font-semibold ${
                  activeTab === 'styling' ? 'text-[#3E281B]' : 'text-[#DBCCC3]'
                }`}
              >
                AI STYLING
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('management')}
                className={`text-center text-[16px] font-semibold ${
                  activeTab === 'management'
                    ? 'text-[#3E281B]'
                    : 'text-[#DBCCC3]'
                }`}
              >
                MANAGEMENT
              </button>
            </div>
            <div className="relative mt-3 h-[2px] bg-[#DBCCC3]">
              <span
                className={`absolute top-0 h-[2px] w-[199px] bg-[#C5A56A] ${
                  activeTab === 'management' ? 'right-0' : 'left-0'
                }`}
              />
            </div>
          </div>

          {activeTab === 'styling' ? (
            <ul className="mt-5 flex flex-col gap-5">
              {STYLING_ITEMS.map((item) => (
                <li key={item.id}>
                  <StylingCard item={item} />
                </li>
              ))}
            </ul>
          ) : (
            <ul className="mt-5 flex flex-col gap-5">
              {MANAGEMENT_TIPS.map((tip) => (
                <li key={tip.id}>
                  <ManagementCard
                    tip={tip}
                    onFindStore={() =>
                      navigate(`/owned/${product.id}/stores`, {
                        state: { product },
                      })
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <BottomTab activeTab="manage" />
    </main>
  )
}

function StylingCard({ item }) {
  return (
    <article className="relative h-[99px] w-full overflow-hidden rounded-[20px] bg-[#FAF9F6] shadow-[2px_4px_10px_rgba(138,90,60,0.25)]">
      <div className="absolute top-[11px] left-3 flex items-center gap-[22px]">
        <span className="size-[74px] shrink-0 rounded-[10px] bg-secondary-light-active shadow-[2px_2px_4px_rgba(110,72,48,0.25)]" />
        <div className="relative h-[77px] w-[258px] max-w-[calc(100%-96px)]">
          <p className="absolute top-0 left-0 w-full text-[12px] font-normal text-[#9E2A2B]">
            {item.reason}
          </p>
          <p className="absolute top-[18px] left-0 w-full text-[12px] font-normal text-[#8A5A3C]">
            {item.category}
          </p>
          <p className="absolute top-9 left-0 w-full text-[18px] font-semibold break-keep text-[#3E281B]">
            {item.name}
          </p>
          <p className="absolute top-[61px] left-0 text-[13px] font-medium text-[#947C50]">
            KRW {item.price.toLocaleString('ko-KR')}
          </p>
          <span className="absolute top-[62px] right-0 flex h-[14px] items-center gap-[3px]">
            <span className="text-[13px] leading-none font-medium text-[#947C50]">
              보러가기
            </span>
            <img src={chevronIcon} alt="" className="h-2.5 w-3" />
          </span>
        </div>
      </div>
    </article>
  )
}

function ManagementCard({ tip, onFindStore }) {
  return (
    <article className="flex w-full flex-col items-start justify-center rounded-[20px] bg-[#FAF9F6] p-[15px] shadow-[2px_4px_10px_rgba(138,90,60,0.25)]">
      <div className="flex items-start gap-[21px]">
        <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#C5A56A] text-[16px] font-semibold text-[#68442D] outline outline-1 -outline-offset-1 outline-[#C5A56A]">
          {tip.id}
        </span>
        <div className="flex min-w-0 flex-1 flex-col items-start">
          <p className="text-[13px] leading-[1.4] font-medium break-keep text-[#68442D]">
            {tip.text}
          </p>
          {tip.action ? (
            <button
              type="button"
              onClick={onFindStore}
              className="mt-2.5 flex h-[29px] items-center justify-center gap-[9px] rounded-[15px] bg-[#EDE3D1] px-3 text-[10px] font-medium text-[#594A30]"
            >
              {tip.action}
              <img src={chevronIcon} alt="" className="h-2.5 w-3" />
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default OwnedDetailPage
