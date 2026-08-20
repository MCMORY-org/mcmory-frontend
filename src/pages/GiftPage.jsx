import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { buildSurveyUrl } from '@/api/gift.jsx'

import BottomTab from '@/components/layout/BottomTab'
import tracyVisetos from '@/assets/images/tracy-visetos.png'
import visetosShoulder from '@/assets/images/visetos-shoulder.png'
import visetosWallet from '@/assets/images/visetos-wallet.png'

// 서버 추천이 없을 때만 쓰는 폴백 목록임(USE_FALLBACK 정책)
const FALLBACK_PRODUCTS = [
  {
    id: 'tracy-crossbody',
    name: 'Tracy 비세토스 크로스바디',
    description: '클래식한 취향의 연인에게 부담 없이 어울리는 라인',
    price: 1490000,
    imageUrl: tracyVisetos,
  },
  {
    id: 'visetos-shoulder',
    name: '비세토스 숄더백',
    description: '실용적인 선물을 선호할 때 추천드리는 데일리 아이템',
    price: 1090000,
    imageUrl: visetosShoulder,
  },
  {
    id: 'visetos-wallet',
    name: '비세토스 오리지널 카드 반지갑',
    description: '가벼운 선물이 필요할 때 좋은 합리적인 선택',
    price: 490000,
    imageUrl: visetosWallet,
  },
]

function GiftPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const recommended = location.state?.products
  const products =
    Array.isArray(recommended) && recommended.length > 0
      ? recommended
      : FALLBACK_PRODUCTS
  const fromServer = products !== FALLBACK_PRODUCTS
  // `reasonSource`가 LLM일 때만 AI가 골랐다고 표기할 수 있음(API 명세 5.3)
  const pickedByAi = fromServer && location.state?.reasonSource === 'LLM'

  const [selectedId, setSelectedId] = useState(
    () => location.state?.selectedGiftId ?? '',
  )
  const [copied, setCopied] = useState(false)

  // 발송자가 받은 설문 링크임. 이걸 안 보여주면 수신자에게 보낼 방법이 없음
  const surveyUrl = location.state?.surveyPath
    ? buildSurveyUrl(location.state.surveyPath)
    : ''

  const handleCopySurvey = async () => {
    await navigator.clipboard.writeText(surveyUrl)
    setCopied(true)
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    const gift = products.find((product) => product.id === selectedId)
    if (!gift) return

    navigate('/memory', {
      state: {
        ...location.state,
        recipientName: location.state?.recipientName,
        gift,
      },
    })
  }

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col overflow-hidden bg-background">
      <form
        onSubmit={handleSubmit}
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
      >
        <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
          <div className="no-scrollbar absolute inset-0 flex flex-col overflow-y-auto px-4 pt-[30px]">
          <p className="w-[261px] text-[13px] leading-[1.4] font-medium text-primary-active">
            선물을 받는 분의 취향을
            <br />
            MCMORY와 함께 찾아가요
          </p>

          <h1 className="mt-[35px] text-h1 text-primary-dark-active">
            MCM LIST
          </h1>
          <p className="mt-2.5 text-[13px] font-medium text-[#947C50]">
            {pickedByAi
              ? 'AI가 후보 안에서 3가지를 골라봤어요'
              : '입력하신 내용을 바탕으로 3가지를 골라봤어요'}
          </p>

          {surveyUrl ? (
            <div className="mt-[15px] flex w-full flex-col gap-2 rounded-[10px] bg-[#FAF9F6] px-3 py-2.5">
              <p className="text-[12px] font-medium text-[#3E281B]">
                받는 분께 취향 질문 링크를 보내주세요. 답이 오면 추천이 더 맞아져요
              </p>
              <p className="truncate text-[11px] font-medium text-[#947C50]">
                {surveyUrl}
              </p>
              <button
                type="button"
                onClick={handleCopySurvey}
                className="self-start rounded-[8px] bg-primary px-3 py-1.5 text-[12px] font-medium text-background"
              >
                {copied ? '복사했어요' : '질문 링크 복사'}
              </button>
            </div>
          ) : null}

          <div className="min-h-[15px] flex-1" />

          <ul className="flex flex-col gap-[15px]">
            {products.map((product) => {
              const selected = product.id === selectedId

              return (
                <li key={product.id}>
                  <button
                    type="button"
                    onClick={() => setSelectedId(product.id)}
                    className={`flex w-full items-center gap-[25px] rounded-[20px] bg-[#FAF9F6] px-[15px] py-[13px] text-left shadow-[2px_4px_10px_rgba(138,90,60,0.25)] ${
                      selected
                        ? 'outline outline-1 -outline-offset-1 outline-[#8A5A3C]'
                        : ''
                    }`}
                  >
                    {product.imageUrl ? (
                      <img
                        src={product.imageUrl}
                        alt=""
                        className="size-[74px] shrink-0 rounded-[10px] object-cover shadow-[2px_2px_4px_rgba(110,72,48,0.25)]"
                      />
                    ) : (
                      <span className="size-[74px] shrink-0 rounded-[10px] bg-[#EDE3D1] shadow-[2px_2px_4px_rgba(110,72,48,0.25)]" />
                    )}
                    <span className="flex min-w-0 flex-1 flex-col gap-[5px]">
                      <span className="text-[18px] font-semibold text-[#3E281B]">
                        {product.name}
                      </span>
                      <span className="break-keep text-[13px] font-medium text-[#947C50]">
                        {product.description}
                      </span>
                      <span className="text-[13px] font-medium text-[#947C50]">
                        KRW {product.price.toLocaleString('ko-KR')}
                      </span>
                    </span>
                  </button>
                </li>
              )
            })}
          </ul>

          <div className="min-h-[15px] flex-1" />
          </div>
        </div>

        <div className="shrink-0 px-4 pb-3">
          <button
            type="submit"
            disabled={!selectedId}
            className="flex w-full items-center justify-center rounded-[10px] bg-primary px-5 py-2.5 text-button text-background disabled:opacity-40"
          >
            SAVE STYLE
          </button>
        </div>
      </form>

      <BottomTab activeTab="home" />
    </main>
  )
}

export default GiftPage
