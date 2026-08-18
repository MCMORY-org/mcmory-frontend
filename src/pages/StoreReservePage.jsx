import { useEffect, useMemo, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

import { isUnauthorized } from '@/api/client.jsx'
import { listOwned, mapOwnedProduct } from '@/api/owned.jsx'
import { createReservation } from '@/api/reservations.jsx'
import { getStores, getStoreSlots, TIME_SLOTS, withStoreCoordinates } from '@/api/stores.jsx'
import BottomTab from '@/components/layout/BottomTab'

const WEEKDAYS = ['SUN', 'MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT']
const WEEKDAY_SHORT = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function toDateValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function todayValue() {
  return toDateValue(new Date())
}

function startOfDay(date) {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate())
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
    return {
      date,
      isCurrentMonth: date.getMonth() === month,
      isSunday: date.getDay() === 0,
      value: toDateValue(date),
    }
  })
}

function formatSummaryDateTime(dateValue, timeSlot) {
  if (!dateValue || !timeSlot) return ''
  const date = new Date(`${dateValue}T00:00:00`)
  const [hour, minute] = timeSlot.split(':').map(Number)
  const ampm = hour < 12 ? 'AM' : 'PM'
  const hour12 = hour % 12 || 12
  return `${date.getMonth() + 1}월 ${date.getDate()}일 (${WEEKDAY_SHORT[date.getDay()]}) ${ampm} ${hour12}:${String(minute).padStart(2, '0')}`
}

function mergeSlots(apiSlots) {
  const bySlot = new Map((apiSlots ?? []).map((item) => [item.slot, item]))
  return TIME_SLOTS.map(
    (slot) => bySlot.get(slot) ?? { slot, state: 'AVAILABLE', reason: null },
  )
}

function StoreReservePage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { productId, storeId } = useParams()
  const ownedId = Number(productId)
  const numericStoreId = Number(storeId)

  const [product, setProduct] = useState(location.state?.product ?? null)
  const [store, setStore] = useState(location.state?.store ?? null)
  const [storeNumber, setStoreNumber] = useState(location.state?.storeNumber ?? 1)
  const [selectedDate, setSelectedDate] = useState(todayValue)
  const [selectedTime, setSelectedTime] = useState('')
  const [requestNote, setRequestNote] = useState('')
  const [slots, setSlots] = useState(() => mergeSlots([]))
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [notFound, setNotFound] = useState(
    Number.isNaN(ownedId) || Number.isNaN(numericStoreId),
  )

  const calendarDays = useMemo(() => {
    const date = selectedDate ? new Date(`${selectedDate}T00:00:00`) : new Date()
    return buildCalendarDays(date.getFullYear(), date.getMonth())
  }, [selectedDate])

  useEffect(() => {
    if (Number.isNaN(ownedId) || Number.isNaN(numericStoreId)) return undefined

    let cancelled = false

    async function loadContext() {
      try {
        const [ownedResult, storesResult] = await Promise.all([
          location.state?.product ? Promise.resolve(null) : listOwned(),
          location.state?.store ? Promise.resolve(null) : getStores(),
        ])
        if (cancelled) return

        if (!location.state?.product) {
          const foundProduct = (ownedResult?.list ?? [])
            .map(mapOwnedProduct)
            .find((item) => item.id === ownedId)
          if (!foundProduct) {
            setNotFound(true)
            return
          }
          setProduct(foundProduct)
        }

        if (!location.state?.store) {
          const list = withStoreCoordinates(storesResult?.list ?? [])
          const foundStore = list.find((item) => Number(item.id) === numericStoreId)
          if (!foundStore) {
            setNotFound(true)
            return
          }
          setStore(foundStore)
          setStoreNumber(list.findIndex((item) => Number(item.id) === numericStoreId) + 1)
        }
      } catch (error) {
        if (cancelled) return
        if (isUnauthorized(error)) {
          navigate('/login', { replace: true })
          return
        }
        setErrorMessage(error.message ?? '예약 정보를 불러오지 못했습니다.')
      }
    }

    loadContext()
    return () => {
      cancelled = true
    }
  }, [ownedId, numericStoreId, location.state?.product, location.state?.store, navigate])

  useEffect(() => {
    if (Number.isNaN(numericStoreId) || !selectedDate) return undefined

    let cancelled = false

    async function loadSlots() {
      setIsLoading(true)
      setErrorMessage('')
      try {
        const result = await getStoreSlots({ storeId: numericStoreId, date: selectedDate })
        if (cancelled) return
        const nextSlots = mergeSlots(result?.slots)
        setSlots(nextSlots)
        setSelectedTime((current) => {
          const stillAvailable = nextSlots.some(
            (item) => item.slot === current && item.state === 'AVAILABLE',
          )
          if (stillAvailable) return current
          return nextSlots.find((item) => item.state === 'AVAILABLE')?.slot ?? ''
        })
      } catch (error) {
        if (cancelled) return
        setErrorMessage(error.message ?? '예약 시간을 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    loadSlots()
    return () => {
      cancelled = true
    }
  }, [numericStoreId, selectedDate])

  if (notFound) {
    return <Navigate to={`/owned/${productId}/stores`} replace />
  }

  const selectedSlot = slots.find((item) => item.slot === selectedTime)
  const canReserve = Boolean(selectedDate && selectedTime && selectedSlot?.state === 'AVAILABLE')
  const goBack = () =>
    navigate(`/owned/${ownedId}/stores`, { state: { product } })

  const handleReserve = async (event) => {
    event.preventDefault()
    if (!canReserve || isSubmitting) return

    setIsSubmitting(true)
    setErrorMessage('')
    try {
      await createReservation({
        storeId: numericStoreId,
        ownedProductId: ownedId,
        reserveDate: selectedDate,
        timeSlot: selectedTime,
        requestNote: requestNote.trim() || null,
      })
      goBack()
    } catch (error) {
      if (isUnauthorized(error)) {
        navigate('/login', { replace: true })
        return
      }
      setErrorMessage(error.message ?? '예약에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const today = todayValue()
  const todayStart = startOfDay(new Date())

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col overflow-hidden bg-background">
      <form
        onSubmit={handleReserve}
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
      >
        <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
          <div className="no-scrollbar absolute inset-0 overflow-y-auto px-[15px] pt-9 pb-8">
            <button
              type="button"
              aria-label="뒤로 가기"
              onClick={goBack}
              className="flex h-[21px] w-[29px] items-center justify-start bg-transparent"
            >
              <svg viewBox="0 0 10 18" className="h-[18px] w-[10px]" fill="none" aria-hidden>
                <path
                  d="M9 1L1 9L9 17"
                  stroke="#8A5A3C"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </button>

            <section className="mt-5 flex flex-col gap-3">
              <h1 className="text-[16px] font-semibold text-[#6E4830]">STORE</h1>
              <StoreCard store={store} number={storeNumber} />
            </section>

            <section className="mt-5 flex flex-col gap-3">
              <h2 className="text-[16px] font-semibold text-[#6E4830]">DATE</h2>
              <div className="grid grid-cols-7 gap-x-[2.89px]">
                {WEEKDAYS.map((weekday, index) => (
                  <span
                    key={weekday}
                    className={`flex h-5 items-center justify-center text-[14px] font-normal ${
                      index === 0 ? 'text-[#9E2A2B]' : 'text-[#808080]'
                    }`}
                  >
                    {weekday}
                  </span>
                ))}
              </div>
              <div className="grid grid-cols-7 gap-x-[2.89px]">
                {calendarDays.map((day) => {
                  const isToday = day.value === today
                  const isSelected = day.value === selectedDate
                  const isPast = startOfDay(day.date) < todayStart
                  const disabled = !day.isCurrentMonth || isPast

                  let colorClass = 'text-[#1A1A1A]'
                  if (!day.isCurrentMonth || isPast) colorClass = 'text-[#DBCCC3]'
                  else if (isSelected) colorClass = 'text-[#F9F6F0]'
                  else if (isToday) colorClass = 'text-primary'
                  else if (day.isSunday) colorClass = 'text-[#9E2A2B]'

                  return (
                    <button
                      key={day.value}
                      type="button"
                      disabled={disabled}
                      onClick={() => setSelectedDate(day.value)}
                      className={`relative flex size-[52px] flex-col items-center justify-center rounded-full text-[14px] font-normal ${
                        isSelected ? 'bg-primary' : 'bg-transparent'
                      } ${colorClass}`}
                    >
                      {day.date.getDate()}
                      {isToday && !isSelected ? (
                        <span className="absolute top-[34px] text-[10px] font-medium text-primary">
                          TODAY
                        </span>
                      ) : null}
                    </button>
                  )
                })}
              </div>
            </section>

            <section className="mt-5 flex flex-col gap-3">
              <h2 className="text-[16px] font-semibold text-[#6E4830]">TIME</h2>
              <div className="flex flex-col gap-3">
                <TimeRow slots={slots.slice(0, 3)} selectedTime={selectedTime} onSelect={setSelectedTime} />
                <TimeRow slots={slots.slice(3, 6)} selectedTime={selectedTime} onSelect={setSelectedTime} />
                <TimeRow slots={slots.slice(6, 9)} selectedTime={selectedTime} onSelect={setSelectedTime} />
                <div className="flex justify-center">
                  <TimeSlotButton
                    slot={slots[9]}
                    selected={selectedTime === slots[9]?.slot}
                    onSelect={setSelectedTime}
                  />
                </div>
              </div>
            </section>

            <section className="mt-5 flex flex-col gap-3">
              <h2 className="text-[16px] font-semibold text-[#6E4830]">REQUESTS (opt)</h2>
              <textarea
                value={requestNote}
                onChange={(event) => setRequestNote(event.target.value.slice(0, 500))}
                placeholder="Let us know what needs to be repaired"
                className="h-[58px] w-full resize-none rounded-[10px] bg-[#FAF9F6] px-2.5 py-2.5 text-[14px] font-normal text-[#3E281B] outline outline-[0.5px] -outline-offset-[0.5px] outline-[#C5A56A] placeholder:text-[#947C50]"
              />
            </section>

            <section className="mt-5 flex h-[99px] flex-col justify-center gap-[10px] rounded-[10px] bg-[#FAF9F6] px-[11px] py-2.5 outline outline-[0.5px] -outline-offset-[0.5px] outline-[#C5A56A]">
              <SummaryRow label="STORE" value={store?.name ?? ''} />
              <SummaryRow
                label="DATE"
                value={formatSummaryDateTime(selectedDate, selectedTime)}
              />
              <SummaryRow label="PRODUCT" value={product?.name ?? ''} />
            </section>

            {errorMessage ? (
              <p role="alert" className="mt-4 text-center text-[12px] font-medium text-[#9E2A2B]">
                {errorMessage}
              </p>
            ) : null}

            <div className="mt-5 flex flex-col items-center gap-1.5">
              <button
                type="submit"
                disabled={!canReserve || isSubmitting || isLoading}
                className="flex w-full items-center justify-center rounded-[10px] bg-primary px-5 py-2.5 text-[16px] font-semibold text-[#F9F6F0] disabled:opacity-40"
              >
                {isSubmitting ? 'RESERVING...' : 'RESERVE'}
              </button>
              <p className="text-center text-[10px] font-medium text-[#947C50]">
                방문 1시간 전까지 변경 · 취소할 수 있어요
              </p>
            </div>
          </div>
        </div>
      </form>

      <BottomTab activeTab="manage" />
    </main>
  )
}

function TimeRow({ slots, selectedTime, onSelect }) {
  return (
    <div className="flex items-center gap-[14px]">
      {slots.map((slot) => (
        <TimeSlotButton
          key={slot.slot}
          slot={slot}
          selected={selectedTime === slot.slot}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

function TimeSlotButton({ slot, selected, onSelect }) {
  if (!slot) return null
  const disabled = slot.state !== 'AVAILABLE'

  return (
    <button
      type="button"
      disabled={disabled}
      onClick={() => onSelect(slot.slot)}
      className={`flex h-10 w-[117px] items-center justify-center rounded-[10px] text-[16px] font-semibold ${
        selected
          ? 'bg-primary text-[#F9F6F0]'
          : disabled
            ? 'bg-[#EDE6E2] text-[#DBCCC3] outline outline-[0.5px] -outline-offset-[0.5px] outline-[#EDE6E2]'
            : 'bg-[#FAF9F6] text-[#3E281B] outline outline-[0.5px] -outline-offset-[0.5px] outline-[#C5A56A]'
      }`}
    >
      {slot.slot}
    </button>
  )
}

function StoreCard({ store, number }) {
  const detail = [
    store?.address,
    store?.distanceKm != null ? `${store.distanceKm}km` : null,
    store?.closeTime ? `~${store.closeTime} 영업` : null,
  ]
    .filter(Boolean)
    .join(' · ')

  return (
    <article className="flex h-[75px] w-full items-center rounded-[20px] bg-[#FAF9F6] px-[15px] outline outline-[0.5px] -outline-offset-[0.5px] outline-[#C5A56A]">
      <div className="flex min-w-0 flex-1 items-center gap-[21px]">
        <span className="flex size-[38px] shrink-0 items-center justify-center rounded-full bg-primary text-[16px] font-semibold text-[#F9F6F0]">
          {number}
        </span>
        <div className="flex min-w-0 flex-1 flex-col items-start gap-[5px]">
          <div className="flex w-full items-center gap-[7px]">
            <p className="text-[16px] font-semibold text-[#3E281B]">{store?.name ?? '매장'}</p>
            {store?.repairAvailable ? (
              <span className="flex h-[17px] shrink-0 items-center justify-center rounded-[20px] bg-[#DDEDD1] px-2.5 text-[10px] font-medium text-[#3E281B]">
                수리 가능
              </span>
            ) : null}
          </div>
          <p className="w-full text-[12px] font-normal text-[#947C50]">{detail}</p>
        </div>
      </div>
    </article>
  )
}

function SummaryRow({ label, value }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="shrink-0 text-[14px] font-normal text-[#947C50]">{label}</span>
      <span className="min-w-0 text-right text-[14px] font-normal break-keep text-[#3E281B]">
        {value}
      </span>
    </div>
  )
}

export default StoreReservePage
