import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { updateMe } from '@/api/auth.jsx'
import { isUnauthorized } from '@/api/client.jsx'
import { createFriend, getFriendInitial, updateFriend } from '@/api/friends.jsx'
import BottomTab from '@/components/layout/BottomTab'

const PHONE_PATTERN = /^01[016789]-\d{3,4}-\d{4}$/

function formatKoreanPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  if (digits.length <= 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

function AddPersonPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const friend = location.state?.friend
  const isMe = Boolean(location.state?.isMe)
  const member = location.state?.member
  const slotName = location.state?.slotName || friend?.name || (isMe ? '나' : '친구')
  const isFriendEdit = Boolean(friend?.id)
  const isEdit = isFriendEdit || isMe

  const [name, setName] = useState(
    isMe ? member?.name ?? '' : isFriendEdit ? friend.name ?? '' : '',
  )
  const [phone, setPhone] = useState(
    formatKoreanPhone(isMe ? member?.phone ?? '' : isFriendEdit ? friend.phone ?? '' : ''),
  )
  const [agreed, setAgreed] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [errors, setErrors] = useState({ name: '', phone: '', agreed: '', submit: '' })

  const displayName = name.trim() || slotName

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (isSubmitting) return

    const trimmedName = name.trim()
    const formattedPhone = formatKoreanPhone(phone)
    const nextErrors = {
      name: trimmedName ? '' : '이름을 입력해주세요',
      phone: !formattedPhone
        ? '휴대폰 번호를 입력해주세요'
        : PHONE_PATTERN.test(formattedPhone)
          ? ''
          : '전화번호 형식을 확인해주세요 (예: 010-1234-5678)',
      agreed: agreed ? '' : '개인정보 이용에 동의해주세요',
      submit: '',
    }

    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    setIsSubmitting(true)
    try {
      if (isMe) {
        await updateMe({ name: trimmedName, phone: formattedPhone })
      } else if (isFriendEdit) {
        await updateFriend(friend.id, { name: trimmedName, phone: formattedPhone })
      } else {
        await createFriend({ name: trimmedName, phone: formattedPhone })
      }
      navigate('/my', { replace: true })
    } catch (error) {
      if (isUnauthorized(error)) {
        navigate('/login', { replace: true })
        return
      }
      setErrors((current) => ({
        ...current,
        submit:
          error.message ??
          (isMe
            ? '내 정보를 수정하지 못했습니다.'
            : isFriendEdit
              ? '친구 정보를 수정하지 못했습니다.'
              : '친구를 등록하지 못했습니다.'),
      }))
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col overflow-hidden bg-background">
      <form
        onSubmit={handleSubmit}
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
      >
        <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
          <div className="no-scrollbar absolute inset-0 overflow-y-auto px-4 pt-[30px] pb-6">
            <button
              type="button"
              aria-label="뒤로 가기"
              onClick={() => navigate('/my')}
              className="flex h-[18px] w-[10px] items-center justify-center bg-transparent"
            >
              <BackIcon />
            </button>

            <p className="mt-[13px] text-[13px] font-semibold text-primary-active">
              {isMe
                ? '내 개인정보를 수정해주세요'
                : `${displayName}의 연락처를 ${isEdit ? '수정' : '등록'}해주세요`}
            </p>

            <h1 className="mt-[36px] text-h1 text-primary-dark-active">
              {isMe ? 'PROFILE' : 'PEOPLE'}
            </h1>

            <div className="mt-[37px] flex w-full items-center gap-[15px]">
              <span
                className={`flex size-[47px] shrink-0 items-center justify-center rounded-full text-[18px] font-semibold text-[#3E281B] ${
                  isMe
                    ? 'bg-[#C5A56A]'
                    : 'border-[0.5px] border-[#C5A56A] bg-[#FAF9F6]'
                }`}
              >
                {isMe ? '나' : getFriendInitial(displayName)}
              </span>
              <p className="text-[18px] font-semibold text-[#3E281B]">
                {isMe ? `나 (${displayName})` : displayName}
              </p>
            </div>

            <div className="mt-[22px] flex w-full flex-col gap-1.5">
              <p className="text-[13px] font-medium text-primary-active">NAME</p>
              <input
                type="text"
                value={name}
                maxLength={20}
                placeholder="이름을 입력해주세요"
                onChange={(event) => {
                  setName(event.target.value)
                  setErrors((current) =>
                    current.name ? { ...current, name: '' } : current,
                  )
                }}
                className={`w-full border-0 border-b-[0.5px] bg-transparent pb-2 text-[13px] font-medium text-[#3E281B] outline-none placeholder:text-[#DBCCC3] ${
                  errors.name ? 'border-[#9E2A2B]' : 'border-[#947C50]'
                }`}
              />
              {errors.name ? (
                <p role="alert" className="text-[12px] font-medium text-[#9E2A2B]">
                  {errors.name}
                </p>
              ) : null}
            </div>

            <div className="mt-[22px] flex w-full flex-col gap-1.5">
              <p className="text-[13px] font-medium text-primary-active">PHONE NUMBER</p>
              <input
                type="tel"
                inputMode="numeric"
                value={phone}
                placeholder="휴대폰 번호를 입력해주세요"
                onChange={(event) => {
                  setPhone(formatKoreanPhone(event.target.value))
                  setErrors((current) =>
                    current.phone ? { ...current, phone: '' } : current,
                  )
                }}
                className={`w-full border-0 border-b-[0.5px] bg-transparent pb-2 text-[13px] font-medium text-[#3E281B] outline-none placeholder:text-[#DBCCC3] ${
                  errors.phone ? 'border-[#9E2A2B]' : 'border-[#947C50]'
                }`}
              />
              {errors.phone ? (
                <p role="alert" className="text-[12px] font-medium text-[#9E2A2B]">
                  {errors.phone}
                </p>
              ) : null}
            </div>

            <div className="mt-[15px] flex w-full items-center gap-2.5 rounded-[5px] bg-[#FFEAEC] px-2.5 py-[7px]">
              <BannerIcon />
              <p className="text-[14px] font-normal text-[#9E2A2B]">
                {isMe ? (
                  <>
                    본명과 전화번호가 잘 입력되었는지
                    <br />
                    다시 한 번 확인해주세요.
                  </>
                ) : (
                  <>
                    선물 전달의 오류를 방지하기 위해 등록하시려는 분의
                    <br />
                    성함과 전화번호를 다시 한 번 확인해주세요.
                  </>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="shrink-0 px-4 pb-3">
          <div className="flex items-start gap-2.5 p-2.5">
            <button
              type="button"
              aria-pressed={agreed}
              aria-label="개인정보 이용 동의"
              onClick={() => {
                setAgreed((current) => !current)
                setErrors((current) =>
                  current.agreed ? { ...current, agreed: '' } : current,
                )
              }}
              className={`flex h-[22px] w-[21px] shrink-0 items-center justify-center overflow-hidden rounded-[5px] ${
                agreed ? 'bg-primary' : 'bg-[#E2D6CE]'
              }`}
            >
              {agreed ? <CheckIcon /> : null}
            </button>
            <div className="flex min-w-0 flex-col items-start">
              <p className="text-[12px] font-normal text-[#3E281B]">
                등록하신 연락처는 취향 저장 및 선물 추천 목적으로만 사용돼요.
              </p>
              <button
                type="button"
                className="mt-1 border-b border-primary pb-px text-[10px] font-medium text-primary"
              >
                개인정보 처리방침 보기
              </button>
            </div>
          </div>
          {errors.agreed ? (
            <p role="alert" className="px-2.5 pb-2 text-[12px] font-medium text-[#9E2A2B]">
              {errors.agreed}
            </p>
          ) : null}
          {errors.submit ? (
            <p role="alert" className="px-2.5 pb-2 text-[12px] font-medium text-[#9E2A2B]">
              {errors.submit}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center rounded-[10px] bg-primary px-5 py-2.5 text-button text-background disabled:opacity-40"
          >
            SAVE
          </button>
        </div>
      </form>

      <BottomTab activeTab="my" />
    </main>
  )
}

function BackIcon() {
  return (
    <svg viewBox="0 0 10 18" className="h-[18px] w-[10px]" fill="none" aria-hidden>
      <path
        d="M8.5 1.5 1.5 9l7 7.5"
        stroke="#8A5A3C"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function BannerIcon() {
  return (
    <svg viewBox="0 0 14 12" className="h-3 w-3.5 shrink-0" fill="none" aria-hidden>
      <path
        d="M6.13 1.2 1.2 9.4c-.38.66.1 1.5.87 1.5h9.86c.77 0 1.25-.84.87-1.5L7.87 1.2c-.38-.66-1.36-.66-1.74 0Z"
        fill="#9E2A2B"
      />
      <path
        d="M7 4.1v3.1M7 8.7v.1"
        stroke="#FFEAEC"
        strokeWidth="1.2"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CheckIcon() {
  return (
    <svg viewBox="0 0 14 11" className="h-[11px] w-3.5" fill="none" aria-hidden>
      <path
        d="M1.5 5.5 5.2 9 12.5 1.5"
        stroke="#F9F6F0"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default AddPersonPage
