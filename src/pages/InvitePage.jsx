import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

import {
  getInvitation,
  openInvitation,
  registerInvitationOwned,
  resolveLetterImageUrl,
} from '@/api/gift.jsx'

// 서버는 실제 색상값 대신 아래 토큰을 저장함
const LETTER_COLORS = {
  GOLD: '#C5A56A',
  BLACK: '#1B1B1B',
  BEIGE: '#F6F0E6',
  PINK: '#FFEAEC',
}

function isDark(token) {
  return token === 'BLACK' || token === 'GOLD'
}

function InvitePage() {
  const { token } = useParams()
  const navigate = useNavigate()

  const [invitation, setInvitation] = useState(null)
  const [error, setError] = useState('')
  const [working, setWorking] = useState(false)
  const [registered, setRegistered] = useState(false)

  useEffect(() => {
    let alive = true

    getInvitation(token)
      .then((result) => {
        if (alive) setInvitation(result)
      })
      .catch((cause) => {
        console.error('[Invite] 조회 실패', cause)
        if (alive) setError(cause.message ?? '초대 정보를 찾을 수 없습니다')
      })

    return () => {
      alive = false
    }
  }, [token])

  // 동의해야 편지와 상품이 응답에 담김. 동의 전에는 letterBody 키 자체가 없음
  const handleConsent = async () => {
    if (working) return
    setWorking(true)

    try {
      await openInvitation(token)
      setInvitation(await getInvitation(token))
    } catch (cause) {
      console.error('[Invite] 열람 실패', cause)
      setError(cause.message ?? '잠시 후 다시 시도해주세요')
    } finally {
      setWorking(false)
    }
  }

  const handleRegisterOwned = async () => {
    if (working) return
    setWorking(true)

    try {
      await registerInvitationOwned(token)
      setRegistered(true)
    } catch (cause) {
      console.error('[Invite] 제품 등록 실패', cause)
      if (cause.code === 'AUTH401_1') {
        navigate('/login')
        return
      }
      setError(cause.message ?? '잠시 후 다시 시도해주세요')
    } finally {
      setWorking(false)
    }
  }

  if (error) {
    return (
      <Screen>
        <p className="text-center text-body-1 text-primary-dark">{error}</p>
      </Screen>
    )
  }

  if (!invitation) {
    return (
      <Screen>
        <p className="text-center text-body-1 text-primary-dark">
          초대장을 여는 중이에요
        </p>
      </Screen>
    )
  }

  if (invitation.needConsent) {
    return (
      <Screen>
        <h1 className="text-h1 text-primary-dark-active">MCMORY</h1>
        <p className="text-center text-body-1 text-primary-dark">
          {invitation.nickname}님이
          <br />
          선물과 편지를 보냈어요
        </p>
        <p className="text-center text-[13px] font-medium text-[#947C50]">
          열어보려면 개인정보 수집에 동의해주세요
        </p>

        <button
          type="button"
          onClick={handleConsent}
          disabled={working}
          className="mt-2.5 flex w-full items-center justify-center rounded-[10px] bg-primary px-5 py-2.5 text-button text-background disabled:opacity-60"
        >
          {working ? '여는 중...' : '동의하고 열어보기'}
        </button>
      </Screen>
    )
  }

  const background = LETTER_COLORS[invitation.letterColor] ?? '#FAF9F6'
  const textColor = isDark(invitation.letterColor) ? '#FAF9F6' : '#3E281B'

  return (
    <Screen>
      <h1 className="text-h1 text-primary-dark-active">MCMORY</h1>

      <section
        className="flex w-full flex-col gap-2.5 rounded-[20px] px-5 py-6 shadow-[2px_4px_10px_rgba(138,90,60,0.25)]"
        style={{ background, color: textColor }}
      >
        <p className="text-[13px] font-medium opacity-80">
          {invitation.nickname}님의 편지
        </p>
        <p className="break-keep text-[15px] leading-[1.6] whitespace-pre-wrap">
          {invitation.letterBody}
        </p>

        {invitation.letterImageUrls?.map((url) => (
          <img
            key={url}
            src={resolveLetterImageUrl(url)}
            alt=""
            className="w-full rounded-[10px] object-cover"
          />
        ))}
      </section>

      {invitation.product ? (
        <section className="flex w-full items-center gap-[25px] rounded-[20px] bg-[#FAF9F6] px-[15px] py-[13px] shadow-[2px_4px_10px_rgba(138,90,60,0.25)]">
          {invitation.product.imageUrl ? (
            <img
              src={invitation.product.imageUrl}
              alt=""
              className="size-[55px] shrink-0 rounded-[10px] object-cover"
            />
          ) : (
            <span className="size-[55px] shrink-0 rounded-[10px] bg-[#EDE3D1]" />
          )}

          <div className="flex min-w-0 flex-1 flex-col gap-[3px]">
            <p className="break-keep text-[16px] font-normal text-[#3E281B]">
              {invitation.product.name}
            </p>
            <p className="text-[13px] font-medium text-[#947C50]">
              KRW {invitation.product.price?.toLocaleString('ko-KR')}
            </p>
          </div>
        </section>
      ) : null}

      <button
        type="button"
        onClick={handleRegisterOwned}
        disabled={working || registered}
        className="flex w-full items-center justify-center rounded-[10px] bg-primary px-5 py-2.5 text-button text-background disabled:opacity-60"
      >
        {registered ? '내 제품에 담았어요' : '내 제품으로 등록하기'}
      </button>
    </Screen>
  )
}

function Screen({ children }) {
  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col items-center justify-center gap-[15px] overflow-y-auto bg-background px-4 py-8">
      {children}
    </main>
  )
}

export default InvitePage
