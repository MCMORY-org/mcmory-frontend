import { useState } from 'react'

import eyeIcon from '@/assets/icons/common-components/Eye.svg'
import noEyeIcon from '@/assets/icons/common-components/No-Eye.svg'

function PasswordInput({ className = '', disabled = false, ...inputProps }) {
  const [isVisible, setIsVisible] = useState(false)

  return (
    <div className="relative h-[38px] w-[280px]">
      <input
        type={isVisible ? 'text' : 'password'}
        disabled={disabled}
        className={`h-full w-full rounded-[10px] border border-primary bg-background pr-12 pl-3 text-body-1 text-foreground outline-none placeholder:text-primary-light-active disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
        {...inputProps}
      />
      <button
        type="button"
        disabled={disabled}
        aria-label={isVisible ? '비밀번호 숨기기' : '비밀번호 보기'}
        onClick={() => setIsVisible((current) => !current)}
        className="absolute top-1/2 right-3 flex h-5 w-[22px] -translate-y-1/2 items-center justify-center disabled:cursor-not-allowed"
      >
        <img
          src={isVisible ? eyeIcon : noEyeIcon}
          alt=""
          aria-hidden="true"
          className={
            isVisible ? 'h-[15px] w-[22px]' : 'h-5 w-[20.22px]'
          }
        />
      </button>
    </div>
  )
}

export default PasswordInput
