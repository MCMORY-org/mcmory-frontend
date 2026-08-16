import { useState } from 'react'
import { Navigate, useParams } from 'react-router-dom'

import chevronIcon from '@/assets/icons/common-components/Chevron.svg'
import BottomTab from '@/components/layout/BottomTab'

import { MEMORIES } from './MemoriesPage.jsx'

function MemoryDetailPage() {
  const { memoryId } = useParams()
  const memory = MEMORIES.find((item) => item.id === memoryId)
  const [isLetterOpen, setIsLetterOpen] = useState(false)

  if (!memory) {
    return <Navigate to="/memories" replace />
  }

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col overflow-hidden bg-background">
      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
        <div className="no-scrollbar absolute inset-0 overflow-y-auto px-4 pt-8 pb-8">
          <p className="h-8 w-[261px] text-[13px] leading-4 font-semibold text-primary-active">
            {memory.senderName}님과 {memory.recipientName}님만의
            <br />
            추억이 도착했어요!
          </p>

          <div className="mt-[35px] flex flex-col gap-5">
            <section className="flex w-full flex-col overflow-hidden rounded-[20px] bg-[#FAF9F6] px-[15px] py-[13px] shadow-[2px_4px_10px_rgba(138,90,60,0.25)]">
              <div className="flex items-center gap-[25px]">
                <span className="size-[74px] shrink-0 rounded-[10px] bg-[#EDE3D1] shadow-[2px_2px_4px_rgba(110,72,48,0.25)]" />

                <div className="flex min-w-0 flex-1 flex-col items-start gap-[5px]">
                  <p className="text-[13px] font-medium text-[#947C50]">
                    받은 선물
                  </p>
                  <p className="w-full text-[18px] font-semibold break-keep text-[#3E281B]">
                    {memory.gift.name}
                  </p>
                  <p className="text-[13px] font-medium text-[#947C50]">
                    KRW {memory.gift.price.toLocaleString('ko-KR')}
                  </p>
                </div>
              </div>
            </section>

            <section className="flex w-full flex-col overflow-hidden rounded-[20px] bg-[#FAF9F6] px-[15px] py-[13px] shadow-[2px_4px_10px_rgba(138,90,60,0.25)]">
              <div className="flex w-full flex-col items-start gap-[15px]">
                <h2 className="w-full text-[18px] font-semibold text-[#3E281B]">
                  제품 상세정보
                </h2>
                <p className="w-full text-[12px] leading-[1.5] font-normal break-keep whitespace-pre-line text-[#947C50]">
                  {memory.gift.details}
                </p>
              </div>
            </section>

            {memory.hasLetter ? (
              <button
                type="button"
                onClick={() => setIsLetterOpen(true)}
                className="flex w-full flex-col items-start gap-2.5 overflow-hidden rounded-[20px] bg-[#FFEAEC] px-[15px] py-[13px] text-left shadow-[2px_4px_10px_rgba(138,90,60,0.25)]"
              >
                <span className="flex w-full items-end justify-between">
                  <span className="text-[13px] font-medium text-[#3E281B]">
                    편지도 함께 왔어요!
                  </span>
                  <span className="flex h-[14px] items-center gap-[3px]">
                    <span className="text-[13px] leading-none font-medium text-[#947C50]">
                      보러가기
                    </span>
                    <img
                      src={chevronIcon}
                      alt=""
                      className="h-2.5 w-3"
                    />
                  </span>
                </span>
              </button>
            ) : null}
          </div>
        </div>
      </div>

      <BottomTab activeTab="memory" />

      {isLetterOpen && memory.letter ? (
        <LetterOverlay memory={memory} onClose={() => setIsLetterOpen(false)} />
      ) : null}
    </main>
  )
}

function LetterOverlay({ memory, onClose }) {
  return (
    <div className="absolute inset-0 z-20 bg-[rgba(69,58,37,0.25)]">
      <p className="absolute top-8 left-4 h-8 w-[261px] text-[13px] leading-4 font-semibold text-primary-active">
        {memory.senderName}님과 {memory.recipientName}님만의
        <br />
        추억이 도착했어요!
      </p>

      <div className="absolute top-[229px] right-4 left-4 flex flex-col items-center gap-[23px]">
        <article className="flex h-[354px] w-full flex-col items-center overflow-hidden rounded-[20px] bg-[#FFEAEC] pt-5">
          <div className="flex w-[258px] flex-col items-center gap-[15px]">
            <h2 className="h-6 w-full text-center text-[20px] font-semibold text-primary-active">
              OUR MCMORY
            </h2>

            <span className="h-[163px] w-[255px] bg-[#EDE3D1]" />

            <p className="h-[34px] w-full text-center text-[14px] leading-[17px] font-normal break-keep whitespace-pre-line text-[#3E281B]">
              {memory.letter.message}
            </p>

            <p className="h-[21px] w-full text-right text-[13px] font-medium text-primary-active">
              FROM. {memory.senderName}
            </p>

            <p className="h-3 w-full text-center text-[10px] font-medium text-[#947C50]">
              {memory.letter.date} · {memory.letter.withProduct}
            </p>
          </div>
        </article>

        <button
          type="button"
          aria-label="편지 닫기"
          onClick={onClose}
          className="flex size-[49px] items-center justify-center rounded-full bg-[#FFEAEC]"
        >
          <CloseIcon />
        </button>
      </div>
    </div>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden>
      <path
        d="M2.5 2.5 13.5 13.5M13.5 2.5 2.5 13.5"
        stroke="#3E281B"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default MemoryDetailPage
