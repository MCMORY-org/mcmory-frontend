import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import BottomTab from '@/components/layout/BottomTab'

const DEFAULT_GIFT = {
  id: 'tracy-crossbody',
  name: 'Tracy 비세토스 크로스바디',
  price: 1490000,
}

const BACKGROUND_COLORS = [
  { id: 'gold', label: '골드', color: '#C5A56A' },
  { id: 'black', label: '블랙', color: '#000000' },
  { id: 'beige', label: '베이지', color: '#F6F0E6' },
  { id: 'pink', label: '핑크', color: '#FFEAEC' },
]

const MAX_MESSAGE_LENGTH = 200
const MAX_FILE_SIZE = 10 * 1024 * 1024

function MemoryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const fileInputRef = useRef(null)

  const gift = location.state?.gift ?? DEFAULT_GIFT
  const recipientName = location.state?.recipientName || '김민지'
  const senderName = location.state?.senderName || '아기호저들'

  const [message, setMessage] = useState('')
  const [backgroundColor, setBackgroundColor] = useState('pink')
  const [imageUrl, setImageUrl] = useState('')
  const [imageError, setImageError] = useState('')

  useEffect(() => {
    return () => {
      if (imageUrl) URL.revokeObjectURL(imageUrl)
    }
  }, [imageUrl])

  const handleChangeGift = () => {
    navigate('/gift', {
      state: {
        recipientName,
        selectedGiftId: gift.id,
      },
    })
  }

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]
    event.target.value = ''

    if (!file) return

    if (file.size > MAX_FILE_SIZE) {
      setImageError('10MB 이하의 이미지만 업로드할 수 있어요')
      return
    }

    setImageError('')
    setImageUrl((current) => {
      if (current) URL.revokeObjectURL(current)
      return URL.createObjectURL(file)
    })
  }

  const handleSubmit = (event) => {
    event.preventDefault()
    navigate('/memory/sent', {
      state: { recipientName },
    })
  }

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col overflow-hidden bg-background">
      <form
        onSubmit={handleSubmit}
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
      >
        <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
          <div className="no-scrollbar absolute inset-0 flex flex-col overflow-y-auto px-4 pt-[30px]">
            <p className="w-[261px] text-[13px] leading-[1.4] font-semibold text-primary-active">
              {senderName}님과 {recipientName}님만의
              <br />
              추억을 만들어 보세요
            </p>

            <div className="mt-[35px] flex flex-col gap-[35px]">
              <section className="flex w-full flex-col items-start gap-2.5 overflow-hidden rounded-[20px] bg-[#FAF9F6] px-[15px] py-[13px] shadow-[2px_4px_10px_rgba(138,90,60,0.25)]">
                <div className="flex w-full items-center gap-[25px]">
                  <span className="size-[55px] shrink-0 rounded-[10px] bg-[#EDE3D1] shadow-[2px_2px_4px_rgba(110,72,48,0.25)]" />

                  <div className="flex min-w-0 w-[217px] flex-1 flex-col items-start gap-[3px]">
                    <p className="text-[13px] font-medium text-[#947C50]">
                      선택한 선물
                    </p>
                    <p className="w-full text-[16px] font-normal break-keep text-[#3E281B]">
                      {gift.name}
                    </p>
                    <p className="text-[13px] font-medium text-[#3E281B]">
                      KRW {gift.price.toLocaleString('ko-KR')}
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleChangeGift}
                    className="shrink-0 border-b border-primary-active text-[14px] leading-none font-normal text-primary-active"
                  >
                    변경
                  </button>
                </div>
              </section>

              <section className="flex w-full flex-col items-center rounded-[20px] bg-[#FAF9F6] px-[50px] pt-[21px] pb-5 shadow-[2px_4px_10px_rgba(138,90,60,0.25)]">
                <h1 className="text-center text-h1 text-primary-dark-active">
                  MCMORY
                </h1>

                <div className="mt-[17px] flex w-full flex-col gap-[17px]">
                  <div className="flex w-full flex-col gap-1.5">
                    <p className="text-[13px] font-medium text-[#3E281B]">
                      마음과 사진을 함께 전해드려요
                    </p>

                    <button
                      type="button"
                      onClick={() => fileInputRef.current?.click()}
                      className="relative flex h-[120px] w-full overflow-hidden rounded-[10px] bg-background outline outline-[0.5px] -outline-offset-[0.5px] outline-primary"
                    >
                      {imageUrl ? (
                        <img
                          src={imageUrl}
                          alt="선택한 사진"
                          className="size-full object-cover"
                        />
                      ) : (
                        <span className="flex flex-1 flex-col items-center justify-center gap-2">
                          <CameraIcon />
                          <span className="text-[12px] font-normal text-primary-light-active">
                            ADD IMAGES
                          </span>
                        </span>
                      )}
                    </button>

                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />

                    <p
                      className={`text-right text-[10px] font-medium ${
                        imageError ? 'text-error' : 'text-[#947C50]'
                      }`}
                    >
                      {imageError || '(5MB~10MB 제한)'}
                    </p>
                  </div>

                  <div className="flex w-full flex-col gap-1.5">
                    <p className="text-[13px] font-medium text-[#3E281B]">
                      전하고 싶은 마음을 함께 전해드려요
                    </p>

                    <textarea
                      value={message}
                      maxLength={MAX_MESSAGE_LENGTH}
                      placeholder="보내고 싶은 문구를 입력해주세요"
                      onChange={(event) => setMessage(event.target.value)}
                      className="h-[120px] w-full resize-none rounded-[10px] bg-background px-3 py-[13px] text-[12px] leading-[1.5] font-normal text-[#3E281B] outline outline-[0.5px] -outline-offset-[0.5px] outline-[#DBCCC3] placeholder:text-primary-light-active"
                    />

                    <p className="text-right text-[10px] font-medium text-[#947C50]">
                      {message.length}/{MAX_MESSAGE_LENGTH}자
                    </p>
                  </div>

                  <div className="flex w-full flex-col gap-1.5">
                    <p className="text-[13px] font-medium text-[#3E281B]">
                      배경 컬러
                    </p>

                    <div className="flex items-center gap-[17px]">
                      {BACKGROUND_COLORS.map((item) => {
                        const selected = item.id === backgroundColor

                        return (
                          <button
                            key={item.id}
                            type="button"
                            onClick={() => setBackgroundColor(item.id)}
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
                                style={{ backgroundColor: item.color }}
                              />
                              {selected ? (
                                <CheckIcon dark={item.id === 'black'} />
                              ) : null}
                            </span>
                            <span className="text-center text-[13px] font-medium text-[#947C50]">
                              {item.label}
                            </span>
                          </button>
                        )
                      })}
                    </div>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>

        <div className="shrink-0 px-4 pb-3">
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-[10px] bg-primary px-5 py-2.5 text-button text-background"
          >
            SEND
          </button>
        </div>
      </form>

      <BottomTab activeTab="memory" />
    </main>
  )
}

function CameraIcon() {
  return (
    <svg viewBox="0 0 27 27" className="size-[27px]" fill="none" aria-hidden>
      <path
        d="M9.4 6.4 8.55 7.85A1.8 1.8 0 0 1 7 8.7H5.7A2.2 2.2 0 0 0 3.5 10.9v8.4A2.2 2.2 0 0 0 5.7 21.5h15.6a2.2 2.2 0 0 0 2.2-2.2v-8.4a2.2 2.2 0 0 0-2.2-2.2H20a1.8 1.8 0 0 1-1.55-.85L17.6 6.4A1.8 1.8 0 0 0 16.05 5.5h-5.1A1.8 1.8 0 0 0 9.4 6.4Z"
        fill="#9E8455"
      />
      <circle cx="13.5" cy="14.8" r="4.1" fill="#F9F6F0" />
      <circle cx="13.5" cy="14.8" r="2.5" fill="#9E8455" />
      <rect x="18.2" y="10.6" width="1.8" height="1.8" rx="0.4" fill="#F9F6F0" />
    </svg>
  )
}

function CheckIcon({ dark }) {
  return (
    <svg
      viewBox="0 0 17 12"
      className="absolute h-3 w-[17px]"
      fill="none"
      aria-hidden
    >
      <path
        d="M1.5 6.2 6.2 10.5 15.5 1.5"
        stroke={dark ? '#FAF9F6' : '#3E281B'}
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default MemoryPage
