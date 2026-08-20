import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { isUnauthorized } from '@/api/client.jsx'
import { buildInviteUrl } from '@/api/gift.jsx'
import { getSentLetters } from '@/api/letters.jsx'
import BottomTab from '@/components/layout/BottomTab'

function SentLettersPage() {
  const navigate = useNavigate()
  const [items, setItems] = useState(null)
  const [error, setError] = useState('')
  const [copiedId, setCopiedId] = useState(null)

  useEffect(() => {
    let alive = true

    getSentLetters()
      .then((result) => {
        if (alive) setItems(result?.sent ?? [])
      })
      .catch((cause) => {
        if (!alive) return
        if (isUnauthorized(cause)) {
          navigate('/login', { replace: true })
          return
        }
        setError(cause.message ?? '보낸 선물을 불러오지 못했어요')
      })

    return () => {
      alive = false
    }
  }, [navigate])

  const handleCopy = async (item) => {
    await navigator.clipboard.writeText(buildInviteUrl(item.token))
    setCopiedId(item.id)
  }

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col overflow-hidden bg-background">
      <div className="no-scrollbar min-h-0 flex-1 overflow-y-auto px-4 pt-[30px] pb-6">
        <p className="text-[13px] leading-[1.4] font-medium text-primary-active">
          보낸 MCMORY의
          <br />
          초대 링크를 다시 보낼 수 있어요
        </p>

        <h1 className="mt-[35px] text-h1 text-primary-dark-active">SENT</h1>

        {error ? (
          <p className="mt-5 text-[12px] font-normal text-[#9E2A2B]">{error}</p>
        ) : null}

        {items === null && !error ? (
          <p className="mt-5 text-body-1 text-primary-dark">불러오는 중이에요</p>
        ) : null}

        {items?.length === 0 ? (
          <p className="mt-5 text-body-1 text-primary-dark">아직 보낸 선물이 없어요</p>
        ) : null}

        <ul className="mt-[25px] flex flex-col gap-[15px]">
          {items?.map((item) => (
            <li
              key={item.id}
              className="flex w-full flex-col gap-2.5 rounded-[20px] bg-[#FAF9F6] px-[15px] py-[13px] shadow-[2px_4px_10px_rgba(138,90,60,0.25)]"
            >
              <div className="flex items-center justify-between gap-2.5">
                <p className="text-[16px] font-normal text-[#3E281B]">
                  TO. {item.friendName ?? '친구'}
                </p>
                <span className="shrink-0 text-[12px] font-medium text-[#947C50]">
                  {item.status === 'OPENED' ? '열어봤어요' : '아직 안 열었어요'}
                </span>
              </div>

              <p className="break-keep text-[13px] font-medium text-[#947C50]">
                {item.productName ?? '이름 없는 제품'}
              </p>

              <button
                type="button"
                onClick={() => handleCopy(item)}
                className="self-start rounded-[8px] bg-primary px-3 py-1.5 text-[12px] font-medium text-background"
              >
                {copiedId === item.id ? '복사했어요' : '초대 링크 복사'}
              </button>
            </li>
          ))}
        </ul>
      </div>

      <BottomTab activeTab="letter" />
    </main>
  )
}

export default SentLettersPage
