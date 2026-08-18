import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

import { isUnauthorized } from '@/api/client.jsx'
import { getLetters, mapReceivedMemory } from '@/api/letters.jsx'
import { listOwned } from '@/api/owned.jsx'
import BottomTab from '@/components/layout/BottomTab'

function formatMemoryDate(value) {
  if (!value) return ''
  const [year, month, day] = String(value).slice(0, 10).split('-')
  if (!year || !month || !day) return value
  return `${year}.${month}.${day}`
}

function MemoryDetailPage() {
  const navigate = useNavigate()
  const { memoryId } = useParams()
  const location = useLocation()
  const [memory, setMemory] = useState(location.state?.memory ?? null)
  const [imageUrl, setImageUrl] = useState(location.state?.memory?.imageUrl ?? null)
  const [isLoading, setIsLoading] = useState(!location.state?.memory)
  const [notFound, setNotFound] = useState(false)

  useEffect(() => {
    let cancelled = false

    async function load() {
      if (!location.state?.memory) setIsLoading(true)
      try {
        const [letters, owned] = await Promise.all([
          getLetters(),
          listOwned().catch(() => ({ list: [] })),
        ])
        if (cancelled) return

        const found = (letters?.received ?? [])
          .map(mapReceivedMemory)
          .find((item) => item.id === String(memoryId))

        if (!found) {
          setNotFound(true)
          return
        }

        setMemory(found)

        const matched = (owned?.list ?? []).find(
          (item) => item.product?.productId === found.productId,
        )
        setImageUrl(found.imageUrl ?? matched?.product?.imageUrl ?? null)
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

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col overflow-hidden bg-background">
      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
        <div className="no-scrollbar absolute inset-0 overflow-y-auto px-4 pt-8 pb-8">
          <p className="h-8 w-[261px] text-[13px] leading-4 font-semibold text-primary-active">
            {memory?.senderName ?? ''}님이 보낸
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
                    {memory?.sentAt ? (
                      <p className="text-[13px] font-medium text-[#947C50]">
                        {formatMemoryDate(memory.sentAt)}
                      </p>
                    ) : null}
                  </div>
                </div>
              </section>

              <section className="flex w-full flex-col overflow-hidden rounded-[20px] bg-[#FAF9F6] px-[15px] py-[13px] shadow-[2px_4px_10px_rgba(138,90,60,0.25)]">
                <div className="flex w-full flex-col items-start gap-[15px]">
                  <h2 className="w-full text-[18px] font-semibold text-[#3E281B]">
                    제품 정보
                  </h2>
                  <p className="w-full text-[12px] leading-[1.5] font-normal break-keep whitespace-pre-line text-[#947C50]">
                    {memory?.letterBody
                      ? memory.letterBody
                      : '편지 본문은 초대장 링크에서만 확인할 수 있어요. 발송자가 보낸 링크로 추억을 열어주세요.'}
                  </p>
                </div>
              </section>
            </div>
          )}
        </div>
      </div>

      <BottomTab activeTab="memory" />
    </main>
  )
}

export default MemoryDetailPage
