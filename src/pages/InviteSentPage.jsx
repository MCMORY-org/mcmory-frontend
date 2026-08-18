import { useLocation } from 'react-router-dom'

import BottomTab from '@/components/layout/BottomTab'

function InviteSentPage() {
  const location = useLocation()
  const recipientName = location.state?.recipientName || '김민지'

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col overflow-hidden bg-background">
      <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
        <div className="flex w-[209px] flex-col items-center justify-center gap-[15px]">
          <span className="flex size-[66px] items-center justify-center overflow-hidden rounded-full bg-primary-darker">
            <SendIcon />
          </span>

          <h1 className="w-[200px] text-h1 text-primary-dark-active">
            초대장을 보냈어요
          </h1>

          <p className="w-[200px] text-center text-body-1 text-primary-dark">
            {recipientName}님의 휴대폰으로
            <br />
            초대장 링크가 전송됐어요!
          </p>
        </div>
      </div>

      <BottomTab activeTab="memory" />
    </main>
  )
}

function SendIcon() {
  return (
    <svg viewBox="0 0 24 24" className="size-[29px]" fill="#FAF9F6" aria-hidden>
      <path
        transform="rotate(-42 12 12)"
        d="M3.15 20.25 20.9 12.4a.85.85 0 0 0 0-1.55L3.15 2.98a.8.8 0 0 0-1.12.76v4.85c0 .28.2.52.47.58L13.7 11.22 2.5 13.05a.6.6 0 0 0-.47.58v5.86c0 .6.64.98 1.12.76Z"
      />
    </svg>
  )
}

export default InviteSentPage
