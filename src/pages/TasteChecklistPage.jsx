import { useEffect, useState } from 'react'
import { useLocation, useParams } from 'react-router-dom'

import { DUMMY_USER } from '@/api/dummyData.js'
import { getSurvey, submitSurvey } from '@/api/surveys.jsx'
import BottomTab from '@/components/layout/BottomTab'

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
const QUESTION_REQUIRED = '이 질문에 최소 1개 이상 선택해주세요'

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
  if (!phone.trim()) return '전화번호를 입력해주세요'
  if (!PHONE_PATTERN.test(phone.trim())) {
    return '전화번호 형식을 확인해주세요 (예: 010-1234-5678)'
  }
  return ''
}

function TasteChecklistPage() {
  const location = useLocation()
  const { token } = useParams()

  const [survey, setSurvey] = useState(null)
  const [loadError, setLoadError] = useState('')
  const [submitError, setSubmitError] = useState('')
  const [saving, setSaving] = useState(false)

  const senderName =
    survey?.senderName || location.state?.senderName || DUMMY_USER.name

  // 발송자가 켠 축만 그림. 여기 없는 축에 답을 담아 보내면 FRIEND400_4임
  const axes = survey?.axes ?? ['colors', 'styles', 'bags']
  const askColors = axes.includes('colors')
  const askStyles = axes.includes('styles')
  const askBags = axes.includes('bags')

  const [step, setStep] = useState('identity')
  const [name, setName] = useState('')
  const [phone, setPhone] = useState('')
  const [agreed, setAgreed] = useState(true)
  const [selectedColors, setSelectedColors] = useState([])
  const [selectedBags, setSelectedBags] = useState([])
  const [selectedStyles, setSelectedStyles] = useState([])
  const [errors, setErrors] = useState({
    name: '',
    phone: '',
    agreed: '',
    color: '',
    bag: '',
    style: '',
  })

  useEffect(() => {
    if (!token || token === 'demo') return
    let alive = true

    getSurvey(token)
      .then((result) => {
        if (alive) setSurvey(result)
      })
      .catch((cause) => {
        console.error('[Survey] 조회 실패', cause)
        if (alive) setLoadError(cause.message ?? '설문 정보를 찾을 수 없습니다')
      })

    return () => {
      alive = false
    }
  }, [token])

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

  const handleIdentitySubmit = (event) => {
    event.preventDefault()

    const nextErrors = {
      name: name.trim() ? '' : '이름을 입력해주세요',
      phone: getPhoneError(phone),
      agreed: agreed ? '' : '개인정보 이용에 동의해주세요',
      color: '',
      bag: '',
      style: '',
    }

    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    setStep('questions')
  }

  const handleQuestionsSubmit = async (event) => {
    event.preventDefault()
    if (saving) return

    const nextErrors = {
      name: '',
      phone: '',
      agreed: '',
      color: askColors && selectedColors.length === 0 ? QUESTION_REQUIRED : '',
      bag: askBags && selectedBags.length === 0 ? QUESTION_REQUIRED : '',
      style: askStyles && selectedStyles.length === 0 ? QUESTION_REQUIRED : '',
    }

    setErrors(nextErrors)
    if (Object.values(nextErrors).some(Boolean)) return

    // 서버가 받는 값은 한국어 라벨임. 화면 id를 그대로 보내면 FRIEND400_4임
    const toLabels = (items, ids) =>
      items.filter((item) => ids.includes(item.id)).map((item) => item.label)

    if (!token || token === 'demo') {
      setStep('done')
      return
    }

    setSubmitError('')
    setSaving(true)

    try {
      await submitSurvey(token, {
        colors: askColors ? toLabels(COLORS, selectedColors) : [],
        styles: askStyles ? selectedStyles : [],
        bags: askBags ? toLabels(BAGS, selectedBags) : [],
      })
      setStep('done')
    } catch (error) {
      console.error('[Survey] 제출 실패', error)
      setSubmitError(error.message ?? '잠시 후 다시 시도해주세요')
    } finally {
      setSaving(false)
    }
  }

  const identityErrorCount = [errors.name, errors.phone, errors.agreed].filter(
    Boolean,
  ).length
  const questionErrorCount = [errors.color, errors.bag, errors.style].filter(
    Boolean,
  ).length

  if (loadError) {
    return (
      <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col items-center justify-center bg-background px-4">
        <p className="text-center text-body-1 text-primary-dark">{loadError}</p>
      </main>
    )
  }

  if (step === 'done') {
    return (
      <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col overflow-hidden bg-background">
        <div className="flex min-h-0 flex-1 flex-col items-center justify-center">
          <div className="flex w-[209px] flex-col items-center justify-center gap-[15px]">
            <span className="flex size-[66px] items-center justify-center overflow-hidden rounded-full bg-primary-darker">
              <CheckIcon large />
            </span>
            <h1 className="w-[200px] text-h1 text-primary-dark-active">
              취향을 저장했어요
            </h1>
            <p className="w-[200px] text-center text-body-1 text-primary-dark">
              {senderName}님이 더 잘 맞는
              <br />
              선물을 고를 수 있어요
            </p>
          </div>
        </div>
        <BottomTab activeTab="letter" />
      </main>
    )
  }

  const isIdentity = step === 'identity'

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col overflow-hidden bg-background">
      <form
        onSubmit={isIdentity ? handleIdentitySubmit : handleQuestionsSubmit}
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
      >
        <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
          <div className="no-scrollbar absolute inset-0 overflow-y-auto px-4 pt-[30px] pb-6">
            <p className="w-[261px] text-[13px] leading-[1.4] font-medium text-primary-active">
              당신의 취향을 찾아드려요
              <br />
              모든 질문에 답해주세요
            </p>

            <section className="mt-[35px] flex flex-col gap-[30px]">
              <h1 className="text-h1 text-primary-dark-active">CHECK LIST</h1>

              {isIdentity && identityErrorCount > 0 ? (
                <ErrorBanner count={identityErrorCount} />
              ) : null}

              {!isIdentity && questionErrorCount > 0 ? (
                <ErrorBanner count={questionErrorCount} />
              ) : null}

              {isIdentity ? (
                <div className="flex flex-col gap-[29px]">
                  <RequiredField label="당신의 성함" error={errors.name}>
                    <UnderlineInput
                      value={name}
                      onChange={(value) => {
                        setName(value)
                        clearError('name')
                      }}
                      placeholder="이름을 입력해주세요"
                      error={Boolean(errors.name)}
                    />
                  </RequiredField>

                  <RequiredField label="당신의 전화번호" error={errors.phone}>
                    <UnderlineInput
                      value={phone}
                      onChange={(value) => {
                        setPhone(formatKoreanPhone(value))
                        clearError('phone')
                      }}
                      type="tel"
                      placeholder="010-0000-0000"
                      error={Boolean(errors.phone)}
                    />
                  </RequiredField>

                  <div className="flex w-full items-center gap-2.5 rounded-[5px] bg-[#FFEAEC] px-2.5 py-[7px]">
                    <BannerIcon />
                    <p className="text-[14px] leading-[1.4] font-normal text-[#9E2A2B]">
                      {senderName}님께서 입력하신 정보와
                      <br />
                      동일함을 확인하기 위해 요구되는 정보에요.
                      <br />
                      본명과 전화번호가 잘 입력되었는지 다시 한 번 확인해주세요.
                    </p>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col gap-[30px]">
                  {askColors ? (
                  <QuestionCard
                    title="평소 어떤 계열의 색상을 선호하시나요?"
                    error={Boolean(errors.color)}
                  >
                    <div className="flex flex-col gap-[15px]">
                      <div className="flex items-center gap-[17px]">
                        {COLORS.map((item) => {
                          const selected = selectedColors.includes(item.id)

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
                      ) : (
                        <p className="text-[13px] font-medium text-[#947C50]">
                          {selectedColors.length}개 선택됨 · 여러 개 고를 수
                          있어요
                        </p>
                      )}
                    </div>
                  </QuestionCard>
                  ) : null}

                  {askBags ? (
                  <QuestionCard
                    title="평소 잘 드는 가방 디자인은 무엇인가요?"
                    error={Boolean(errors.bag)}
                  >
                    <div className="flex flex-col gap-[9px]">
                      <div className="grid grid-cols-2 gap-x-[18px] gap-y-[9px]">
                        {BAGS.map((bag) => {
                          const selected = selectedBags.includes(bag.id)
                          const Icon = bag.icon

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
                                <Icon />
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
                  ) : null}

                  {askStyles ? (
                  <QuestionCard
                    title="평소 어떤 스타일로 옷을 입으시나요?"
                    error={Boolean(errors.style)}
                  >
                    <div className="flex flex-col gap-[15px]">
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
                          {selectedStyles.length}개 선택됨 · 여러 개 고를 수
                          있어요
                        </p>
                      )}
                    </div>
                  </QuestionCard>
                  ) : null}
                </div>
              )}
            </section>
          </div>
        </div>

        <div className="shrink-0 px-4 pb-3">
          {isIdentity ? (
            <>
              <div className="flex items-start gap-2.5 p-2.5">
                <button
                  type="button"
                  aria-pressed={agreed}
                  aria-label="개인정보 이용 동의"
                  onClick={() => {
                    setAgreed((current) => !current)
                    clearError('agreed')
                  }}
                  className={`flex h-[22px] w-[21px] shrink-0 items-center justify-center overflow-hidden rounded-[5px] ${
                    agreed ? 'bg-primary' : 'bg-[#E2D6CE]'
                  }`}
                >
                  {agreed ? <CheckIcon /> : null}
                </button>
                <div className="flex min-w-0 flex-col items-start">
                  <p className="text-[12px] font-normal text-[#3E281B]">
                    입력하신 정보는 취향 추천 서비스 제공 목적으로만 사용돼요.
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
                <div className="px-2.5 pb-2">
                  <FieldError>{errors.agreed}</FieldError>
                </div>
              ) : null}
            </>
          ) : null}

          {submitError ? (
            <p className="mb-2 text-[12px] font-normal text-[#9E2A2B]">
              {submitError}
            </p>
          ) : null}

          <button
            type="submit"
            disabled={saving}
            className="flex w-full items-center justify-center rounded-[10px] bg-primary px-5 py-2.5 text-button text-background disabled:opacity-60"
          >
            {isIdentity ? 'NEXT' : saving ? '저장 중...' : 'SAVE'}
          </button>
        </div>
      </form>

      <BottomTab activeTab="letter" />
    </main>
  )
}

function RequiredField({ label, error, children }) {
  return (
    <div className="flex w-full flex-col gap-1.5">
      <div className="inline-flex items-center gap-[5px]">
        <p className="text-[14px] font-normal text-primary-active">{label}</p>
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

function QuestionCard({ title, error, children }) {
  return (
    <section
      className={`flex w-full flex-col gap-[15px] rounded-[20px] bg-[#FAF9F6] px-[21px] py-[17px] shadow-[2px_4px_10px_rgba(138,90,60,0.25)] ${
        error ? 'outline outline-1 -outline-offset-1 outline-[#9E2A2B]' : ''
      }`}
    >
      <h2 className="max-w-[218px] text-[13px] font-medium text-primary-active">
        {title}
      </h2>
      {children}
    </section>
  )
}

function ErrorBanner({ count }) {
  return (
    <div className="flex w-full items-center gap-2.5 rounded-[5px] bg-[#FFEAEC] px-2.5 py-[7px]">
      <BannerIcon />
      <p className="text-[12px] font-normal text-[#9E2A2B]">
        입력하신 내용을 다시 확인해주세요. 아래 {count}곳에 문제가 있어요.
      </p>
    </div>
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

function CheckIcon({ large = false }) {
  if (large) {
    return (
      <svg viewBox="0 0 24 24" className="size-8" fill="none" aria-hidden>
        <path
          d="M4 12.5 9.2 18 20 6"
          stroke="#FAF9F6"
          strokeWidth="2.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    )
  }

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

function ShoulderIcon() {
  return (
    <svg viewBox="0 0 32 32" className="size-8" fill="none" aria-hidden>
      <path
        d="M11 4.5c0 4.2 1.6 8 5 10.5 3.4-2.5 5-6.3 5-10.5"
        stroke="#8A5A3C"
        strokeWidth="1.5"
      />
      <path d="M9.5 16.5h13v11.5H9.5z" stroke="#8A5A3C" strokeWidth="1.5" />
    </svg>
  )
}

function ToteIcon() {
  return (
    <svg viewBox="0 0 33 33" className="size-[33px]" fill="none" aria-hidden>
      <path
        d="M8 12h17l-1.8 16H9.8L8 12Z"
        stroke="#8A5A3C"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      <path
        d="M13 12V9.5a3.5 3.5 0 0 1 7 0V12"
        stroke="#8A5A3C"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function CrossbodyIcon() {
  return (
    <svg viewBox="0 0 32 32" className="size-8" fill="none" aria-hidden>
      <path
        d="M12 3.5c2.4 6.2 5.2 10.4 8 13"
        stroke="#8A5A3C"
        strokeWidth="1.5"
      />
      <rect
        x="9.5"
        y="13.5"
        width="13"
        height="15"
        rx="1.5"
        stroke="#8A5A3C"
        strokeWidth="1.5"
      />
    </svg>
  )
}

function BackpackIcon() {
  return (
    <svg viewBox="0 0 33 33" className="size-[33px]" fill="none" aria-hidden>
      <path d="M11 12.5h11v16H11z" stroke="#8A5A3C" strokeWidth="1.5" />
      <path
        d="M13.5 12.5v-2a3 3 0 0 1 6 0v2"
        stroke="#8A5A3C"
        strokeWidth="1.5"
      />
      <path
        d="M14 19h5"
        stroke="#8A5A3C"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default TasteChecklistPage
