import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

import { getMe } from '@/api/auth.jsx'
import { isUnauthorized } from '@/api/client.jsx'
import { DUMMY_USER } from '@/api/dummyData.js'
import {
  getLetters,
  getReceivedLetter,
  mapReceivedMemory,
  openLetter,
} from '@/api/letters.jsx'
import { listOwned } from '@/api/owned.jsx'
import chevronIcon from '@/assets/icons/common-components/Chevron.svg'
import BottomTab from '@/components/layout/BottomTab'

function MemoryDetailPage() {
  const navigate = useNavigate()
  const { memoryId } = useParams()
  const location = useLocation()
  const [memory, setMemory] = useState(location.state?.memory ?? null)
  const [imageUrl, setImageUrl] = useState(location.state?.memory?.imageUrl ?? null)
  const [recipientName, setRecipientName] = useState(DUMMY_USER.name)
  const [isLoading, setIsLoading] = useState(!location.state?.memory)
  const [showLetter, setShowLetter] = useState(
    () => Boolean(location.state?.letterOpen),
  )
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!location.state?.memory) setIsLoading(true)
      try {
        const [letters, owned, me, detail] = await Promise.all([
          getLetters(),
          listOwned().catch(() => ({ list: [] })),
          getMe().catch(() => null),
          // 본문·사진·가격은 목록에 없고 상세(#37)에만 있음. 동의 전이면 본문 키가 없음
          getReceivedLetter(memoryId).catch(() => null),
        ])
        if (cancelled) return

        const found = (letters?.received ?? [])
          .map(mapReceivedMemory)
          .find((item) => item.id === String(memoryId))

        if (!found) {
          setNotFound(true)
          return
        }

        setMemory({
          ...found,
          letterBody: detail?.letterBody ?? '',
          letterImages: detail?.letterImageUrls ?? [],
          letterColor: detail?.letterColor ?? null,
          price: detail?.product?.price ?? null,
          // 상세를 못 받았으면 동의 여부를 모름. 모르는 것을 "동의 끝남"으로 읽으면 빈 편지를 진짜처럼 염
          needConsent: detail == null ? true : detail.needConsent,
        })
        setRecipientName(me?.member?.name || DUMMY_USER.name)

        const matched = (owned?.list ?? []).find(
          (item) => item.product?.productId === found.productId,
        )
        setImageUrl(
          detail?.product?.imageUrl ?? found.imageUrl ?? matched?.product?.imageUrl ?? null,
        )
      } catch (error) {
        if (cancelled) return
        if (isUnauthorized(error)) {
          navigate('/login', { replace: true })
          return
        }
        if (!location.state?.memory) setNotFound(true)
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [memoryId, location.state?.memory, navigate])

  if (notFound) {
    return <Navigate to="/memories" replace />
  }

  const priceLabel =
    typeof memory?.price === 'number'
      ? `KRW ${memory.price.toLocaleString('ko-KR')}`
      : null

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col overflow-hidden bg-background">
      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
        <div className="no-scrollbar absolute inset-0 overflow-y-auto px-4 pt-8 pb-8">
          <p className="h-8 w-[261px] text-[13px] leading-4 font-semibold text-primary-active">
            {memory?.senderName ?? ''}님과 {recipientName}님만의
            <br />
            추억이 도착했어요!
          </p>

          {isLoading && !memory ? (
            <p className="mt-[35px] text-center text-[13px] font-medium text-[#947C50]">
              불러오는 중...
            </p>
          ) : (
            <div className="mt-[35px] flex flex-col gap-5">
              <section className="flex w-full flex-col overflow-hidden rounded-[20px] bg-[#FAF9F6] px-[15px] py-[13px] shadow-[2px_4px_10px_rgba(138,90,60,0.25)]">
                <div className="flex items-center gap-[25px]">
                  {imageUrl ? (
                    <img
                      src={imageUrl}
                      alt=""
                      className="size-[74px] shrink-0 rounded-[10px] object-cover shadow-[2px_2px_4px_rgba(110,72,48,0.25)]"
                    />
                  ) : (
                    <span className="size-[74px] shrink-0 rounded-[10px] bg-[#EDE3D1] shadow-[2px_2px_4px_rgba(110,72,48,0.25)]" />
                  )}

                  <div className="flex min-w-0 flex-1 flex-col items-start gap-[5px]">
                    <p className="text-[13px] font-medium text-[#947C50]">
                      받은 선물
                    </p>
                    <p className="w-full text-[18px] font-semibold break-keep text-[#3E281B]">
                      {memory?.productName}
                    </p>
                    {priceLabel ? (
                      <p className="text-[13px] font-medium text-[#947C50]">
                        {priceLabel}
                      </p>
                    ) : null}
                  </div>
                </div>
              </section>

              {memory?.productDetail ? (
                <section className="flex w-full flex-col overflow-hidden rounded-[20px] bg-[#FAF9F6] px-[15px] py-[13px] shadow-[2px_4px_10px_rgba(138,90,60,0.25)]">
                  <div className="flex w-full flex-col items-start gap-[15px]">
                    <h2 className="w-full text-[18px] font-semibold text-[#3E281B]">
                      제품 상세정보
                    </h2>
                    <p className="w-full text-[12px] leading-[1.5] font-normal break-keep whitespace-pre-line text-[#947C50]">
                      {memory.productDetail}
                    </p>
                  </div>
                </section>
              ) : null}

              <button
                type="button"
                disabled={memory.needConsent}
                onClick={() => {
                  setShowLetter(true)
                  if (memory.unread) {
                    setMemory((current) =>
                      current
                        ? {
                            ...current,
                            unread: false,
                            status: 'OPENED',
                            openedAt: current.openedAt ?? new Date().toISOString(),
                            description: '확인한 추억이에요',
                          }
                        : current,
                    )
                    openLetter(memory.id).catch(() => {})
                  }
                }}
                className={`flex w-full items-end justify-between overflow-hidden rounded-[20px] bg-[#FFEAEC] px-[15px] py-[13px] text-left shadow-[2px_4px_10px_rgba(138,90,60,0.25)] ${
                  memory.unread ? '' : 'opacity-30'
                }`}
              >
                <p className="text-[13px] font-medium text-[#3E281B]">
                  {memory.needConsent
                    ? '초대 링크에서 동의하면 편지를 볼 수 있어요'
                    : '편지도 함께 왔어요!'}
                </p>
                {memory.needConsent ? null : (
                  <span className="flex h-[14px] items-center gap-[3px]">
                    <span className="text-[13px] leading-none font-medium text-[#947C50]">
                      보러가기
                    </span>
                    <img src={chevronIcon} alt="" className="h-2.5 w-3" />
                  </span>
                )}
              </button>
            </div>
          )}
        </div>
      </div>

      <BottomTab activeTab="memory" />

      {showLetter && memory ? (
        <LetterOverlay
          memory={memory}
          recipientName={recipientName}
          onClose={() => setShowLetter(false)}
        />
      ) : null}
    </main>
  )
}

function formatLetterDate(value) {
  if (!value) return ''
  const [year, month, day] = String(value).slice(0, 10).split('-')
  if (!year || !month || !day) return value
  return `${year}.${month}.${day}`
}

function LetterOverlay({ memory, recipientName, onClose }) {
  // 사진이 없으면 자리를 비움. 더미로 메우면 무관한 사진이 남의 편지에 뜸
  const photos = memory.letterImages ?? []
  const [photoIndex, setPhotoIndex] = useState(0)
  const currentPhoto = photos[photoIndex] ?? photos[0]
  const dateLabel = formatLetterDate(memory.sentAt)

  return (
    <div className="fixed inset-0 z-50 flex justify-center bg-[rgba(69,58,37,0.25)]">
      <div className="relative flex h-dvh w-full max-w-[412px] flex-col overflow-hidden">
        <p className="shrink-0 px-4 pt-8 h-[64px] w-[261px] text-[13px] leading-4 font-semibold text-primary-active">
          {memory.senderName ?? ''}님과 {recipientName}님만의
          <br />
          추억이 도착했어요!
        </p>

        <div className="flex min-h-0 flex-1 flex-col items-center justify-center gap-[23px] px-4 pb-8">
          <article className="relative flex w-full flex-col items-center overflow-hidden rounded-[20px] bg-[#FFEAEC] px-4 py-5">
            <div className="flex w-[258px] flex-col items-center gap-[15px]">
              <h2 className="w-full text-center text-[20px] font-semibold text-primary-active">
                OUR MCMORY
              </h2>

              {currentPhoto ? (
                <button
                  type="button"
                  onClick={() => {
                    if (photos.length < 2) return
                    setPhotoIndex((current) => (current + 1) % photos.length)
                  }}
                  className="relative h-[163px] w-[255px] overflow-hidden bg-[#FAF9F6]"
                >
                  <img
                    src={currentPhoto}
                    alt=""
                    className="size-full object-cover"
                  />
                  {photos.length > 1 ? (
                    <span className="absolute bottom-2 left-1/2 flex -translate-x-1/2 gap-1">
                      {photos.map((_, index) => (
                        <span
                          key={index}
                          className={`size-1.5 rounded-full ${
                            index === photoIndex ? 'bg-[#6E4830]' : 'bg-[#DBCCC3]'
                          }`}
                        />
                      ))}
                    </span>
                  ) : null}
                </button>
              ) : null}

              <p className="w-full text-center text-[14px] leading-[1.2] font-normal break-keep whitespace-pre-line text-[#3E281B]">
                “{memory.letterBody}”
              </p>
              <p className="w-full text-right text-[13px] font-medium text-primary-active">
                FROM. {memory.senderName}
              </p>
              <p className="w-full text-center text-[10px] font-medium text-[#947C50]">
                {dateLabel}
                {memory.productName
                  ? ` · MCM ${memory.productName}와 함께`
                  : ''}
              </p>
            </div>
          </article>

          <button
            type="button"
            aria-label="편지 닫기"
            onClick={onClose}
            className="flex size-[49px] shrink-0 items-center justify-center rounded-full bg-[#FFEAEC]"
          >
            <CloseIcon />
          </button>
        </div>
      </div>
    </div>
  )
}

function CloseIcon() {
  return (
    <svg viewBox="0 0 16 16" className="size-4" fill="none" aria-hidden>
      <path
        d="M2 2l12 12M14 2 2 14"
        stroke="#3E281B"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default MemoryDetailPage
