import { useEffect, useMemo, useRef, useState } from 'react'

import calendarIcon from '@/assets/icons/sign-up/Calendar.svg'
import listIcon from '@/assets/icons/sign-up/List.svg'

const MONTHS = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function toDateValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function buildCalendarDays(year, month) {
  const firstDay = new Date(year, month, 1)
  const gridStart = new Date(year, month, 1 - firstDay.getDay())

  return Array.from({ length: 42 }, (_, index) => {
    const date = new Date(
      gridStart.getFullYear(),
      gridStart.getMonth(),
      gridStart.getDate() + index,
    )
    return { date, isCurrentMonth: date.getMonth() === month, value: toDateValue(date) }
  })
}

function DatePicker({ id = 'birth', name = 'birth', onChange, value = '' }) {
  const initialDate = value ? new Date(`${value}T00:00:00`) : new Date()
  const [isOpen, setIsOpen] = useState(false)
  const [visibleMonth, setVisibleMonth] = useState(initialDate.getMonth())
  const [visibleYear, setVisibleYear] = useState(initialDate.getFullYear())
  const containerRef = useRef(null)
  const currentYear = new Date().getFullYear()
  const years = useMemo(() => Array.from({ length: 101 }, (_, index) => currentYear - index), [currentYear])
  const days = useMemo(() => buildCalendarDays(visibleYear, visibleMonth), [visibleMonth, visibleYear])
  const formattedValue = value ? value.replaceAll('-', ' . ') : ''

  useEffect(() => {
    const handlePointerDown = (event) => {
      if (!containerRef.current?.contains(event.target)) setIsOpen(false)
    }
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') setIsOpen(false)
    }
    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const handleDateSelect = (day) => {
    onChange?.(day.value)
    setVisibleMonth(day.date.getMonth())
    setVisibleYear(day.date.getFullYear())
    setIsOpen(false)
  }

  return (
    <div ref={containerRef} className="relative w-[320px]">
      <input id={id} name={name} type="hidden" value={value} readOnly />
      <button
        type="button"
        aria-haspopup="dialog"
        aria-expanded={isOpen}
        onClick={() => setIsOpen((current) => !current)}
        className="flex h-[45px] w-[320px] items-center justify-between rounded-[10px] border border-primary bg-background px-[12px] text-left"
      >
        <span className={`text-label ${value ? 'text-primary-dark-active' : 'text-primary-light-active'}`}>
          {formattedValue || 'YYYY . MM . DD'}
        </span>
        <img src={calendarIcon} alt="" aria-hidden="true" className="size-[25px]" />
      </button>

      {isOpen && (
        <div
          role="dialog"
          aria-label="생년월일 달력"
          className="absolute top-[46px] left-0 z-20 h-[280px] w-[320px] rounded-[20px] border-[1.14px] border-primary-light-active bg-[#FAF9F6] px-[17px] pt-[17px] shadow-[0px_4.24px_12.72px_0px_#00000014]"
        >
          <div className="flex h-[18px] items-center gap-[9px] text-label text-primary-dark-active">
            <label className="relative flex cursor-pointer items-center gap-[9px]">
              <span className="sr-only">월 선택</span>
              <span aria-hidden="true">{MONTHS[visibleMonth]}</span>
              <img src={listIcon} alt="" className="pointer-events-none h-[9px] w-[15px] shrink-0" />
              <select value={visibleMonth} onChange={(event) => setVisibleMonth(Number(event.target.value))} className="absolute inset-0 h-full w-full cursor-pointer opacity-0">
                {MONTHS.map((month, index) => <option key={month} value={index}>{month}</option>)}
              </select>
            </label>
            <label className="relative flex cursor-pointer items-center gap-[9px]">
              <span className="sr-only">연도 선택</span>
              <span aria-hidden="true">{visibleYear}</span>
              <img src={listIcon} alt="" className="pointer-events-none h-[9px] w-[15px] shrink-0" />
              <select value={visibleYear} onChange={(event) => setVisibleYear(Number(event.target.value))} className="absolute inset-0 h-full w-full cursor-pointer opacity-0">
                {years.map((year) => <option key={year} value={year}>{year}</option>)}
              </select>
            </label>
          </div>

          <div className="mt-[12px] grid grid-cols-7 gap-x-[2.1px]">
            {WEEKDAYS.map((weekday) => (
              <span key={weekday} className="flex h-[15px] w-[38.2px] items-center justify-center text-caption text-secondary-dark">{weekday}</span>
            ))}
          </div>

          <div className="mt-[12px] grid h-[190px] grid-cols-7 grid-rows-6 gap-x-[2.1px]">
            {days.map((day) => {
              const isSelected = value === day.value
              return (
                <button
                  key={day.value}
                  type="button"
                  aria-pressed={isSelected}
                  onClick={() => handleDateSelect(day)}
                  className={`flex w-[38.2px] items-center justify-center rounded-full text-caption ${isSelected ? 'bg-primary text-[#FAF9F6]' : day.isCurrentMonth ? 'text-primary-darker' : 'text-primary-light-active'}`}
                >
                  {day.date.getDate()}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default DatePicker
