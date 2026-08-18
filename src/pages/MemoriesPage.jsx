import { useNavigate } from 'react-router-dom'

import BottomTab from '@/components/layout/BottomTab'

const TRACY_DETAILS =
  '로렐 좌물쇠 잠금장치와 송아지 가죽 트림이 더해진 비세토스 모노그램 크로스바디 백\n\nMCM을 대표하며 오랜 시간 사랑받아온 Tracy 크로스바디 백이 더욱 부드러운 소재와 가죽 핸들로 새롭게 선보입니다. 아이코닉한 라우렐 잠금장치와 세 개의 내외부 수납공간이 우아함과 실용성을 더합니다.'

export const MEMORIES = [
  {
    id: 'baby-hojers',
    type: 'letter',
    title: 'FROM. 아기호저들',
    description: '도착한 OUR MCMORY가 있어요!\n잊기 전에 확인해보세요!',
    unread: true,
    senderName: '아기호저들',
    recipientName: '김민지',
    hasLetter: true,
    gift: {
      name: 'Tracy 비세토스 크로스바디',
      price: 1490000,
      details: TRACY_DETAILS,
    },
    letter: {
      message:
        '“그동안 늘 곁에서 힘이 되어줘서 고마웠어.\n이 가방처럼 우리의 시간도 오래오래 함께하길!”',
      date: '2026.08.06',
      withProduct: 'MCM 트레이시 비세토스 크로스바디와 함께',
    },
  },
  {
    id: 'visetos-wallet',
    type: 'product',
    title: '비세토스 카드지갑',
    description:
      '해당 제품을 선물 받은 지 1년이 지났어요! 추억을 다시 한 번 확인해보세요!',
    unread: true,
    senderName: '아기호저들',
    recipientName: '김민지',
    hasLetter: false,
    gift: {
      name: '비세토스 오리지널 카드 반지갑',
      price: 490000,
      details:
        '가볍고 실용적인 카드 수납이 돋보이는 비세토스 오리지널 카드 반지갑\n\n매일 꺼내 쓰는 작은 물건에도 MCM의 아이코닉한 패턴과 마감이 담겨 있어, 선물받은 순간을 오래 기억하게 해줍니다.',
    },
  },
  {
    id: 'likelion',
    type: 'letter',
    title: 'FROM. 멋쟁이사자처럼',
    description: '확인한 추억이에요',
    unread: false,
    senderName: '멋쟁이사자처럼',
    recipientName: '김민지',
    hasLetter: true,
    gift: {
      name: 'Tracy 비세토스 크로스바디',
      price: 1490000,
      details: TRACY_DETAILS,
    },
    letter: {
      message:
        '“함께한 시간이 늘 특별했어.\n이 선물처럼 우리의 추억도 오래오래 간직할게!”',
      date: '2026.08.06',
      withProduct: 'MCM 트레이시 비세토스 크로스바디와 함께',
    },
  },
]

function MemoriesPage() {
  const navigate = useNavigate()
  const unreadCount = MEMORIES.filter((memory) => memory.unread).length

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col overflow-hidden bg-background">
      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
        <div className="no-scrollbar absolute inset-0 overflow-y-auto px-4 pt-8 pb-8">
          <p className="h-8 w-[261px] text-[13px] leading-4 font-semibold text-primary-active">
            도착한 MCMORY를
            <br />
            확인해보세요
          </p>

          <ul className="mt-[35px] flex flex-col gap-5">
            {MEMORIES.map((memory) => (
              <li key={memory.id}>
                <MemoryCard
                  memory={memory}
                  onSelect={() => navigate(`/memories/${memory.id}`)}
                />
              </li>
            ))}
          </ul>
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
