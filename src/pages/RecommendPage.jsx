import { useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import BottomTab from '@/components/layout/BottomTab'

const RELATIONSHIPS = ['연인', '친구', '부모님', '스승/제자']
const BUDGET_MIN = 0
const BUDGET_MAX = 200

function RecommendPage() {
  const navigate = useNavigate()
  const [purpose, setPurpose] = useState('')
  const [relationship, setRelationship] = useState('')
  const [situation, setSituation] = useState('')
  const [minBudget, setMinBudget] = useState(50)
  const [maxBudget, setMaxBudget] = useState(150)

  const handleMinBudgetChange = (value) => {
    setMinBudget(Math.min(value, maxBudget))
  }

  const handleMaxBudgetChange = (value) => {
    setMaxBudget(Math.max(value, minBudget))
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    // 추천 API는 관계와 예산만 받음. 목적과 상황은 넘기지 않음
    navigate('/recommend/questions', {
      state: {
        relation: relationship || '친구',  // 미선택 시 서버가 허용하는 중립값 '친구'를 씀
        minBudget,
        maxBudget,
      },
    })
  }

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col overflow-hidden bg-background">
      <form
        onSubmit={handleSubmit}
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
      >
        <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
          <div className="no-scrollbar absolute inset-0 overflow-y-auto px-4 pt-[30px] pb-8">
          <p className="w-[261px] text-label leading-[1.4] text-primary-active">
            선물을 받는 분의 취향을
            <br />
            <span className="font-bold">MCMORY AI</span>와 함께 찾아가요
          </p>

          <section className="mt-[35px] flex flex-col gap-[30px]">
            <h1 className="text-h1 text-primary-dark-active">FIND MCMORY</h1>

            <div className="flex flex-col gap-[30px]">
              <Field label="선물의 목적은 무엇인가요?">
                <UnderlineInput
                  value={purpose}
                  onChange={setPurpose}
                  placeholder="예: 생일, 승진 축하, 감사 인사"
                />
              </Field>

              <Field label="받으시는 분과의 관계">
                <div className="inline-flex items-start gap-[11px]">
                  {RELATIONSHIPS.map((item) => {
                    const selected = item === relationship

                    return (
                      <button
                        key={item}
                        type="button"
                        onClick={() => setRelationship(item)}
                        style={{ padding: '5px 10px' }}
                        className={`flex shrink-0 items-center justify-center rounded-[20px] leading-normal ${
                          selected
                            ? 'bg-[#8A5A3C]'
                            : 'bg-[#FAF9F6] outline outline-[0.5px] -outline-offset-[0.5px] outline-[#DBCCC3]'
                        }`}
                      >
                        <span
                          className={`whitespace-nowrap font-['Pretendard'] text-[13px] font-medium ${
                            selected ? 'text-white' : 'text-[#8A5A3C]'
                          }`}
                        >
                          {item}
                        </span>
                      </button>
                    )
                  })}
                </div>
              </Field>

              <Field label="현재 어떤 상황인가요?">
                <UnderlineInput
                  value={situation}
                  onChange={setSituation}
                  placeholder="선물을 하게 된 상황을 편하게 적어주세요"
                />
              </Field>

              <Field label="선물의 예산을 알려주세요">
                <div className="flex w-full flex-col items-start gap-[11px]">
                  <div className="flex items-center gap-[14px]">
                    <BudgetValue
                      value={minBudget}
                      onChange={handleMinBudgetChange}
                    />
                    <span className="text-center font-['Pretendard'] text-[16px] font-normal text-[#947C50]">
                      ~
                    </span>
                    <BudgetValue
                      value={maxBudget}
                      onChange={handleMaxBudgetChange}
                    />
                  </div>

                  <BudgetSlider
                    min={BUDGET_MIN}
                    max={BUDGET_MAX}
                    minValue={minBudget}
                    maxValue={maxBudget}
                    onMinChange={handleMinBudgetChange}
                    onMaxChange={handleMaxBudgetChange}
                  />
                </div>
              </Field>
            </div>
          </section>
          </div>
        </div>

        <div className="shrink-0 px-4 pb-3">
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-[10px] bg-primary px-5 py-2.5 text-button text-background"
          >
            SAVE
          </button>
        </div>
      </form>

      <BottomTab activeTab="home" />
    </main>
  )
}

function Field({ label, children }) {
  return (
    <div className="flex w-full flex-col items-start gap-[11px]">
      <p className="text-body-2 text-primary-dark-active">{label}</p>
      {children}
    </div>
  )
}

function UnderlineInput({ value, onChange, placeholder }) {
  return (
    <input
      type="text"
      value={value}
      onChange={(event) => onChange(event.target.value)}
      placeholder={placeholder}
      className="w-full border-0 border-b-[0.5px] border-secondary-dark bg-transparent pb-2 text-label text-primary-dark-active outline-none placeholder:text-primary-light-active"
    />
  )
}

function BudgetValue({ value, onChange }) {
  return (
    <div className="flex items-center gap-2">
      <div className="flex w-[58px] flex-col items-center gap-[5px]">
        <input
          type="number"
          inputMode="numeric"
          min={BUDGET_MIN}
          max={BUDGET_MAX}
          value={value}
          onChange={(event) => {
            const next = Number(event.target.value)
            if (Number.isNaN(next)) return
            onChange(Math.min(BUDGET_MAX, Math.max(BUDGET_MIN, next)))
          }}
          className="w-full [appearance:textfield] border-0 bg-transparent text-center font-['Pretendard'] text-[14px] font-normal text-black outline-none [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        <div className="h-px w-full bg-[#947C50]" />
      </div>
      <span className="font-['Pretendard'] text-[13px] font-medium text-[#947C50]">
        만원
      </span>
    </div>
  )
}

function BudgetSlider({
  min,
  max,
  minValue,
  maxValue,
  onMinChange,
  onMaxChange,
}) {
  const trackRef = useRef(null)
  const activeThumbRef = useRef(null)

  const toPercent = (value) => ((value - min) / (max - min)) * 100

  const valueFromClientX = (clientX) => {
    const rect = trackRef.current.getBoundingClientRect()
    const ratio = (clientX - rect.left) / rect.width
    return Math.round(min + Math.min(1, Math.max(0, ratio)) * (max - min))
  }

  const applyValue = (thumb, clientX) => {
    const next = valueFromClientX(clientX)

    if (thumb === 'min') {
      onMinChange(Math.min(next, maxValue))
      return
    }

    onMaxChange(Math.max(next, minValue))
  }

  const handleTrackPointerDown = (event) => {
    if (!trackRef.current) return

    const next = valueFromClientX(event.clientX)
    const nearest =
      Math.abs(next - minValue) <= Math.abs(next - maxValue) ? 'min' : 'max'

    activeThumbRef.current = nearest
    event.currentTarget.setPointerCapture(event.pointerId)
    applyValue(nearest, event.clientX)
  }

  const handlePointerMove = (event) => {
    if (!activeThumbRef.current) return
    applyValue(activeThumbRef.current, event.clientX)
  }

  const handlePointerUp = () => {
    activeThumbRef.current = null
  }

  return (
    <div
      ref={trackRef}
      className="relative h-4 w-full max-w-[380px] touch-none self-stretch"
      onPointerDown={handleTrackPointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
    >
      <div className="absolute top-1/2 h-[3px] w-full -translate-y-1/2 rounded-full bg-[#EDE6E2]" />
      <div
        className="absolute top-1/2 h-[3px] -translate-y-1/2 rounded-full bg-[#8A5A3C]"
        style={{
          left: `${toPercent(minValue)}%`,
          width: `${toPercent(maxValue) - toPercent(minValue)}%`,
        }}
      />
      <Thumb
        label="최소 예산"
        percent={toPercent(minValue)}
        onPointerDown={() => {
          activeThumbRef.current = 'min'
        }}
      />
      <Thumb
        label="최대 예산"
        percent={toPercent(maxValue)}
        onPointerDown={() => {
          activeThumbRef.current = 'max'
        }}
      />
    </div>
  )
}

function Thumb({ label, percent, onPointerDown }) {
  return (
    <button
      type="button"
      aria-label={label}
      className="absolute top-1/2 flex size-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center"
      style={{ left: `${percent}%` }}
      onPointerDown={onPointerDown}
    >
      <span className="size-[9px] rounded-full border border-secondary bg-white shadow-[0_1px_3px_rgba(0,0,0,0.25)]" />
    </button>
  )
}

export default RecommendPage
