import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { isUnauthorized } from '@/api/client.jsx'
import { getLetters, mapReceivedMemory } from '@/api/letters.jsx'
import BottomTab from '@/components/layout/BottomTab'

function MemoriesPage() {
  const navigate = useNavigate()
  const [memories, setMemories] = useState([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [errorMessage, setErrorMessage] = useState('')

  useEffect(() => {
    let cancelled = false

    async function load() {
      setIsLoading(true)
      setErrorMessage('')
      try {
        const result = await getLetters()
        if (cancelled) return
        setMemories((result?.received ?? []).map(mapReceivedMemory))
        setUnreadCount(result?.receivedUnopened ?? 0)
      } catch (error) {
        if (cancelled) return
        if (isUnauthorized(error)) {
          navigate('/login', { replace: true })
          return
        }
        setErrorMessage(error.message ?? '추억을 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [navigate])

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col overflow-hidden bg-background">
      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
        <div className="no-scrollbar absolute inset-0 overflow-y-auto px-4 pt-8 pb-8">
          <p className="h-8 w-[261px] text-[13px] leading-4 font-semibold text-primary-active">
            도착한 MCMORY를
            <br />
            확인해보세요
          </p>

          {errorMessage ? (
            <p role="alert" className="mt-[35px] text-[12px] font-medium text-[#9E2A2B]">
              {errorMessage}
            </p>
          ) : isLoading ? (
            <p className="mt-[35px] text-center text-[13px] font-medium text-[#947C50]">
              불러오는 중...
            </p>
          ) : memories.length === 0 ? (
            <p className="mt-[35px] text-center text-[13px] font-medium text-[#947C50]">
              아직 도착한 추억이 없어요
            </p>
          ) : (
            <ul className="mt-[35px] flex flex-col gap-5">
              {memories.map((memory) => (
                <li key={memory.id}>
                  <MemoryCard
                    memory={memory}
                    onSelect={() =>
                      navigate(`/memories/${memory.id}`, { state: { memory } })
                    }
                  />
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>

      <BottomTab activeTab="memory" badges={{ memory: unreadCount }} />
    </main>
  )
}

function MemoryCard({ memory, onSelect }) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`relative flex h-[112px] w-full flex-col items-start justify-center rounded-[20px] bg-[#FAF9F6] px-5 text-left shadow-[2px_4px_10px_rgba(138,90,60,0.25)] ${
        memory.unread ? '' : 'opacity-30'
      }`}
    >
      <div className="flex w-full items-center gap-[13px] pr-4">
        <MemoryAvatar type={memory.type} />

        <div className="flex min-w-0 flex-1 flex-col items-start gap-[7px]">
          <h2 className="w-full text-h2 text-primary-dark-active">
            {memory.title}
          </h2>
          <p className="w-full text-body-2 leading-[1.4] break-keep whitespace-pre-line text-secondary-dark-hover">
            {memory.description}
          </p>
        </div>
      </div>

      {memory.unread ? (
        <span
          aria-label="읽지 않음"
          className="absolute top-1/2 right-[18px] size-3.5 -translate-y-1/2 rounded-full bg-[#DD3839]"
        />
      ) : null}
    </button>
  )
}

function MemoryAvatar({ type }) {
  if (type === 'product') {
    return (
      <span className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-secondary-light-active p-3">
        <ClockIcon />
      </span>
    )
  }

  return (
    <span className="flex size-[52px] shrink-0 items-center justify-center rounded-full bg-pink-background">
      <LetterIcon />
    </span>
  )
}

function LetterIcon() {
  return (
    <svg
      viewBox="0 0 21 22"
      className="h-[22px] w-[21px]"
      fill="none"
      aria-hidden
    >
      <rect
        x="1.5"
        y="4.5"
        width="18"
        height="13"
        rx="1.5"
        stroke="#9E2A2B"
        strokeWidth="2"
      />
      <path
        d="M2 6.5 10.5 13 19 6.5"
        stroke="#9E2A2B"
        strokeWidth="2"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function ClockIcon() {
  return (
    <svg viewBox="0 0 28 28" className="size-7" fill="none" aria-hidden>
      <circle cx="14" cy="14" r="10.5" stroke="#947C50" strokeWidth="2" />
      <path
        d="M14 8.2V14.5L17.5 16.5"
        stroke="#947C50"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default MemoriesPage
