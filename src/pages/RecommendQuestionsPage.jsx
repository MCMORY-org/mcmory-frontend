import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import { ensureFriend, issueSurvey } from '@/api/friends.jsx'
import { createRecommendation, mapRecommendedProduct } from '@/api/recommend.jsx'

import BottomTab from '@/components/layout/BottomTab'
import ToggleSwitch from '@/components/ui/ToggleSwitch'
import BackpackIcon from '@/assets/icons/home/Backpack.svg'
import CrossbodyIcon from '@/assets/icons/home/Crossbody.svg'
import ShoulderIcon from '@/assets/icons/home/Shoulderbag.svg'
import ToteIcon from '@/assets/icons/home/Totebag.svg'

const COLORS = [
  { id: 'cognac', label: '코냑', color: '#8A5A3C' },
  { id: 'black', label: '블랙', color: '#000000' },
  { id: 'beige', label: '베이지', color: '#F6F0E6' },
  { id: 'pink', label: '핑크', color: '#E8B4B8' },
  { id: 'gold', label: '골드', color: '#C5A56A' },
  { id: 'gray', label: '그레이', color: '#B7B7B7' },
]

const BAGS = [
  {
    id: 'shoulder',
    label: '숄더백',
    description: '어깨에 메는 가방',
    icon: ShoulderIcon,
  },
  {
    id: 'tote',
    label: '토트백',
    description: '손잡이가 있는 큰 가방',
    icon: ToteIcon,
  },
  {
    id: 'crossbody',
    label: '크로스바디',
    description: '몸에 대각선으로 메는 가방',
    icon: CrossbodyIcon,
  },
  {
    id: 'backpack',
    label: '백팩',
    description: '등에 메는 가방',
    icon: BackpackIcon,
  },
]

const STYLES = ['캐주얼', '미니멀', '스트릿', '클래식', '러블리', '포멀']
const PHONE_PATTERN = /^01[016789]-\d{3,4}-\d{4}$/
const QUESTION_REQUIRED = '이 질문을 보내려면 최소 1개 이상 선택해주세요'

function formatKoreanPhone(value) {
  const digits = value.replace(/\D/g, '').slice(0, 11)

  if (digits.length <= 3) return digits
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`
  if (digits.length <= 10) {
    return `${digits.slice(0, 3)}-${digits.slice(3, 6)}-${digits.slice(6)}`
  }

  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`
}

function getPhoneError(phone) {
  if (!phone.trim()) return '받는 분의 전화번호를 입력해주세요'
  if (!PHONE_PATTERN.test(phone.trim())) {
    return '전화번호 형식을 확인해주세요 (예: 010-1234-5678)'
  }
  return ''
}

function RecommendQuestionsPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState('')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [colorEnabled, setColorEnabled] = useState(false)
  const [bagEnabled, setBagEnabled] = useState(true)
  const [styleEnabled, setStyleEnabled] = useState(true)
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedBags, setSelectedBags] = useState([])
  const [selectedStyles, setSelectedStyles] = useState([])
  const [agreed, setAgreed] = useState(true)
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    color: '',
    bag: '',
    style: '',
    agreed: '',
  })

  const clearError = (key) => {
    setErrors((current) =>
      current[key] ? { ...current, [key]: '' } : current,
    )
  }

  const toggleColor = (id) => {
    setSelectedColors((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
    clearError('color')
  }

  const toggleBag = (id) => {
    setSelectedBags((current) =>
      current.includes(id)
        ? current.filter((item) => item !== id)
        : [...current, id],
    )
    clearError('bag')
  }

  const toggleStyle = (style) => {
    setSelectedStyles((current) =>
      current.includes(style)
        ? current.filter((item) => item !== style)
        : [...current, style],
    )
    clearError('style')
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    if (submitting) return

    const nextErrors = {
      name: name.trim() ? '' : '받는 분의 이름을 입력해주세요',
      phone: getPhoneError(phone),
      color:
        colorEnabled && selectedColors.length === 0 ? QUESTION_REQUIRED : '',
      bag: bagEnabled && selectedBags.length === 0 ? QUESTION_REQUIRED : '',
      style:
        styleEnabled && selectedStyles.length === 0 ? QUESTION_REQUIRED : '',
      agreed: agreed ? '' : '개인정보 이용에 동의해주세요',
    }

    setErrors(nextErrors)

    if (Object.values(nextErrors).some(Boolean)) return

    // 선택값은 질문 활성화에만 쓰고 추천 점수에 반영하지 않음. 서버에는 켠 축만 보냄
    const axes = [
      colorEnabled ? 'colors' : null,
      styleEnabled ? 'styles' : null,
      bagEnabled ? 'bags' : null,
    ].filter(Boolean)

    if (!colorEnabled && !styleEnabled) {
      setSubmitError('색상과 스타일 중 하나는 켜야 질문을 보낼 수 있어요')
      return
    }

    setSubmitError('')
    setSubmitting(true)

    try {
      const friend = await ensureFriend({ name: name.trim(), phone })
      const survey = await issueSurvey(friend.id, axes)
      const recommendation = await createRecommendation({
        relation: location.state?.relation ?? '친구',
        minBudget: location.state?.minBudget ?? 0,
        maxBudget: location.state?.maxBudget ?? 200,
        friendId: friend.id,
        aiReason: true,
      })

      navigate('/gift', {
        state: {
          recipientName: friend.name,
          friendId: friend.id,
          surveyPath: survey.path,
          recommendationId: recommendation.recommendationId,
          reasonSource: recommendation.reasonSource,
          products: recommendation.results.map(mapRecommendedProduct),
        },
      })
    } catch (error) {
      console.error('[RecommendQuestions] 제출 실패', error)
      setSubmitError(error.message ?? '잠시 후 다시 시도해주세요')
    } finally {
      setSubmitting(false)
    }
  }

  const errorCount = Object.values(errors).filter(Boolean).length

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col overflow-hidden bg-background">
      <form
        onSubmit={handleSubmit}
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
      >
        <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
          <div className="no-scrollbar absolute inset-0 overflow-y-auto px-4 pt-[30px] pb-6">
          <p className="w-[261px] text-[13px] leading-[1.4] font-medium text-primary-active">
            받는 분의 정보와 전송될
            <br />
            몇 가지 질문을 선택해주세요
          </p>

          <section className="mt-[35px] flex flex-col gap-[30px]">
            <h1 className="text-h1 text-primary-dark-active">
              {errorCount > 0 ? 'CHECK LIST' : 'FIND MCMORY'}
            </h1>

            {errorCount > 0 ? (
              <div className="flex w-full items-center gap-2.5 rounded-[5px] bg-[#FFEAEC] px-2.5 py-[7px]">
                <BannerIcon />
                <p className="text-[12px] font-normal text-[#9E2A2B]">
                  입력하신 내용을 다시 확인해주세요. 아래 {errorCount}곳에
                  문제가 있어요.
                </p>
              </div>
            ) : null}

            <div className="flex flex-col gap-[30px]">
              <RequiredField label="받는 분의 성함" error={errors.name}>
                <UnderlineInput
                  value={name}
                  onChange={(value) => {
                    setName(value)
                    clearError('name')
                  }}
                  placeholder="받는 분의 이름을 입력해주세요"
                  error={Boolean(errors.name)}
                />
              </RequiredField>

              <RequiredField label="받는 분의 전화번호" error={errors.phone}>
                <UnderlineInput
                  value={phone}
                  onChange={(value) => {
                    setPhone(formatKoreanPhone(value))
                    clearError('phone')
                  }}
                  type="tel"
                  placeholder="받는 분의 전화번호를 입력해주세요"
                  error={Boolean(errors.phone)}
                />
              </RequiredField>

              <QuestionCard
                title="평소 어떤 계열의 색상을 선호하시나요?"
                enabled={colorEnabled}
                error={Boolean(errors.color)}
                onToggle={(next) => {
                  setColorEnabled(next)
                  clearError('color')
                }}
              >
                <div
                  className={`flex flex-col gap-[15px] ${
                    colorEnabled ? '' : 'pointer-events-none opacity-30'
                  }`}
                >
                  <div className="flex items-center gap-[17px]">
                    {COLORS.map((item) => {
                      const selected =
                        colorEnabled && selectedColors.includes(item.id)

                      return (
                        <button
                          key={item.id}
                          type="button"
                          onClick={() => toggleColor(item.id)}
                          className="flex w-[42px] flex-col items-center gap-[5px]"
                        >
                          <span
                            className={`relative flex size-[42px] items-center justify-center rounded-full outline outline-1 ${
                              selected
                                ? 'outline-[#3E281B]'
                                : 'outline-[#DBCCC3]'
                            }`}
                          >
                            <span
                              className="size-[38px] rounded-full"
                              style={{ background: item.color }}
                            />
                            {selected ? (
                              <ColorCheckIcon className="absolute" />
                            ) : null}
                          </span>
                          <span className="text-center text-[13px] font-medium text-[#947C50]">
                            {item.label}
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  {errors.color ? (
                    <FieldError>{errors.color}</FieldError>
                  ) : colorEnabled ? (
                    <p className="text-[13px] font-medium text-[#947C50]">
                      {selectedColors.length}개 선택됨 · 여러 개 고를 수 있어요
                    </p>
                  ) : null}
                </div>
              </QuestionCard>

              <QuestionCard
                title="평소 잘 드는 가방 디자인은 무엇인가요?"
                enabled={bagEnabled}
                error={Boolean(errors.bag)}
                onToggle={(next) => {
                  setBagEnabled(next)
                  clearError('bag')
                }}
              >
                <div
                  className={`flex flex-col gap-[9px] ${
                    bagEnabled ? '' : 'pointer-events-none opacity-30'
                  }`}
                >
                  <div className="grid grid-cols-2 gap-x-[18px] gap-y-[9px]">
                    {BAGS.map((bag) => {
                      const selected = selectedBags.includes(bag.id)
                      return (
                        <button
                          key={bag.id}
                          type="button"
                          onClick={() => toggleBag(bag.id)}
                          className={`flex h-[99px] w-full items-center justify-center rounded-[10px] p-2.5 ${
                            selected
                              ? 'outline outline-1 -outline-offset-1 outline-[#8A5A3C]'
                              : 'outline outline-[0.5px] -outline-offset-[0.5px] outline-[#DBCCC3]'
                          }`}
                        >
                          <span className="flex flex-col items-center gap-2">
                            <img src={bag.icon} alt="" aria-hidden="true" />
                            <span className="text-[13px] font-medium text-[#3E281B]">
                              {bag.label}
                            </span>
                            <span className="text-center text-[12px] font-normal text-[#947C50]">
                              {bag.description}
                            </span>
                          </span>
                        </button>
                      )
                    })}
                  </div>
                  {errors.bag ? (
                    <FieldError>{errors.bag}</FieldError>
                  ) : (
                    <p className="text-[13px] font-medium text-[#947C50]">
                      {selectedBags.length}개 선택됨 · 여러 개 고를 수 있어요
                    </p>
                  )}
                </div>
              </QuestionCard>

              <QuestionCard
                title="평소 어떤 스타일로 옷을 입으시나요?"
                enabled={styleEnabled}
                error={Boolean(errors.style)}
                onToggle={(next) => {
                  setStyleEnabled(next)
                  clearError('style')
                }}
              >
                <div
                  className={`flex flex-col gap-[15px] ${
                    styleEnabled ? '' : 'pointer-events-none opacity-30'
                  }`}
                >
                  <div className="flex flex-wrap gap-[11px]">
                    {STYLES.map((style) => {
                      const selected = selectedStyles.includes(style)

                      return (
                        <button
                          key={style}
                          type="button"
                          onClick={() => toggleStyle(style)}
                          style={{ padding: '7px 10px' }}
                          className={`inline-flex items-center gap-2.5 rounded-[20px] text-[13px] font-medium ${
                            selected
                              ? 'bg-primary-active text-[#FAF9F6]'
                              : 'bg-[#FAF9F6] text-[#8A5A3C] outline outline-[0.5px] -outline-offset-[0.5px] outline-[#DBCCC3]'
                          }`}
                        >
                          {style}
                          {selected ? <CloseIcon /> : null}
                        </button>
                      )
                    })}
                  </div>
                  {errors.style ? (
                    <FieldError>{errors.style}</FieldError>
                  ) : (
                    <p className="text-[13px] font-medium text-[#947C50]">
                      {selectedStyles.length}개 선택됨 · 여러 개 고를 수 있어요
                    </p>
                  )}
                </div>
              </QuestionCard>
            </div>
          </section>

          <div className="mt-[35px] flex flex-col gap-1">
            <div className="flex items-center gap-2.5 p-2.5">
              <button
                type="button"
                aria-pressed={agreed}
                aria-label="개인정보 이용 동의"
                onClick={() => {
                  setAgreed((current) => !current)
                  clearError('agreed')
                }}
                className={`flex h-[22px] w-[21px] shrink-0 items-center justify-center overflow-hidden rounded-[5px] ${
                  agreed ? 'bg-[#8A5A3C]' : 'bg-[#E2D6CE]'
                }`}
              >
                {agreed ? <CheckIcon /> : null}
              </button>
              <p className="font-['Pretendard'] text-[12px] font-normal text-[#3E281B]">
                받는 분의 이름·전화번호는 초대장 발송 목적으로만 사용돼요.
                <br />
                받는 분께도 도착 시 별도 동의를 안내드려요.{' '}
                <button
                  type="button"
                  className="inline border-b border-[#8A5A3C] pb-px text-[10px] font-medium text-[#8A5A3C]"
                >
                  개인정보 처리방침 보기
                </button>
              </p>
            </div>
            {errors.agreed ? (
              <div className="px-2.5">
                <FieldError>{errors.agreed}</FieldError>
              </div>
            ) : null}
          </div>
          </div>
        </div>

        <div className="shrink-0 px-4 pb-3">
          {submitError ? (
            <p className="mb-2 text-[12px] font-normal text-[#9E2A2B]">
              {submitError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={submitting}
            className="flex w-full items-center justify-center gap-2.5 rounded-[10px] bg-primary px-5 py-2.5 text-button text-background disabled:opacity-60"
          >
            <SearchIcon />
            {submitting ? '찾는 중...' : 'FIND MCMORY'}
          </button>
        </div>
      </form>

      <BottomTab activeTab="home" />
    </main>
  )
}

function RequiredField({ label, error, children }) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="inline-flex items-end gap-[5px]">
        <p className="text-[13px] font-medium text-primary-active">{label}</p>
        <span
          style={{ padding: '5px 10px' }}
          className="inline-flex items-center justify-center rounded-[20px] bg-pink-background text-[10px] font-medium text-[#9E2A2B]"
        >
          필수
        </span>
      </div>
      {children}
      {error ? <FieldError>{error}</FieldError> : null}
    </div>
  )
}

function UnderlineInput({
  value,
  onChange,
  type = 'text',
  placeholder,
  error = false,
}) {
  return (
    <input
      type={type}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className={`w-full border-0 border-b-[0.5px] bg-transparent pb-2 text-[13px] font-medium text-[#3E281B] outline-none placeholder:text-[#DBCCC3] ${
        error ? 'border-[#9E2A2B]' : 'border-[#947C50]'
      }`}
    />
  )
}

function QuestionCard({ title, enabled, error, onToggle, children }) {
  return (
    <section
      className={`flex w-full flex-col gap-[15px] rounded-[20px] bg-[#FAF9F6] px-[21px] py-[17px] shadow-[2px_4px_10px_rgba(138,90,60,0.25)] ${
        error ? 'outline outline-1 -outline-offset-1 outline-[#9E2A2B]' : ''
      }`}
    >
      <div className="flex items-start justify-between gap-3">
        <h2 className="max-w-[218px] text-[13px] font-medium text-primary-active">
          {title}
        </h2>
        <ToggleSwitch
          checked={enabled}
          onChange={onToggle}
          label={title}
        />
      </div>
      {children}
    </section>
  )
}

function FieldError({ children }) {
  return (
    <div className="flex items-center gap-[5px]">
      <WarningIcon className="h-[9px] w-2.5 shrink-0" />
      <p className="text-[10px] font-medium text-[#9E2A2B]">{children}</p>
    </div>
  )
}

function BannerIcon() {
  return (
    <svg
      viewBox="0 0 14 12"
      className="h-3 w-3.5 shrink-0"
      fill="none"
      aria-hidden
    >
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

function WarningIcon({ className }) {
  return (
    <svg viewBox="0 0 10 9" className={className} fill="none" aria-hidden>
      <path
        d="M4.4.9.7 7.3c-.27.47.07 1.07.62 1.07h7.36c.55 0 .89-.6.62-1.07L5.6.9c-.27-.48-.93-.48-1.2 0Z"
        fill="#9E2A2B"
      />
      <path
        d="M5 3.1v2.2M5 6.5v.15"
        stroke="#FFEAEC"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  )
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 8 8"
      className="size-[7px] shrink-0"
      fill="none"
      aria-hidden
    >
      <path
        d="M1 1l6 6M7 1L1 7"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function ColorCheckIcon({ className }) {
  return (
    <svg
      viewBox="0 0 17 12"
      className={`h-3 w-[17px] ${className ?? ''}`}
      fill="none"
      aria-hidden
    >
      <path
        d="M1.5 6.2 6.2 10.5 15.5 1.5"
        stroke="#F9F6F0"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
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

function SearchIcon() {
  return (
    <svg viewBox="0 0 12 12" className="size-3" fill="none" aria-hidden>
      <circle cx="5.2" cy="5.2" r="3.4" stroke="#F9F6F0" strokeWidth="1.4" />
      <path
        d="M7.7 7.7 10.4 10.4"
        stroke="#F9F6F0"
        strokeWidth="1.4"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default RecommendQuestionsPage
