import { useState } from 'react'

import mcmLogo from '@/assets/icons/main/MCM.svg'
import checkIcon from '@/assets/icons/sign-up/Check.svg?raw'
import listIcon from '@/assets/icons/sign-up/List.svg'
import DatePicker from '@/components/ui/DatePicker/index.jsx'
import LoginButton from '@/components/ui/LoginButton/index.jsx'
import PasswordInput from '@/components/ui/PasswordInput/index.jsx'
import TextInput from '@/components/ui/TextInput/index.jsx'

function BrandDivider() {
  return (
    <div className="flex w-[280px] items-center gap-[22px]">
      <span className="h-px flex-1 bg-secondary" />
      <img src={mcmLogo} alt="MCM" className="h-[23px] w-[22px] object-contain" />
      <span className="h-px flex-1 bg-secondary" />
    </div>
  )
}

const GENDER_OPTIONS = ['Male', 'Female', 'None']

function GenderSelect({ onChange, value }) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSelect = (option) => {
    onChange(option)
    setIsOpen(false)
  }

  return (
    <div className="relative h-[45px] w-[320px]">
      <button
        type="button"
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-label="성별 선택"
        onClick={() => setIsOpen((current) => !current)}
        className={`flex h-[45px] w-[320px] items-center justify-between border border-primary bg-background px-[12px] ${
          isOpen ? 'rounded-t-[10px]' : 'rounded-[10px]'
        }`}
      >
        <span className="text-label text-primary">{value}</span>
        <img
          src={listIcon}
          alt=""
          aria-hidden="true"
          className={`ml-auto h-[10px] w-5 shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>

      {isOpen && (
        <div
          role="listbox"
          aria-label="성별 목록"
          className="absolute top-[45px] left-0 z-20 h-[135px] w-[320px] overflow-hidden rounded-b-[10px] border-x border-b border-primary bg-background"
        >
          {GENDER_OPTIONS.map((option, index) => (
            <button
              key={option}
              type="button"
              role="option"
              aria-selected={value === option}
              onClick={() => handleSelect(option)}
              className={`flex h-[45px] w-full items-center px-[12px] text-left text-label text-primary ${
                index < GENDER_OPTIONS.length - 1
                  ? 'border-b border-primary-light-active'
                  : ''
              }`}
            >
              {option}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}

function SignupDetails({
  birth,
  gender,
  isSmsAccepted,
  onBirthChange,
  onGenderChange,
  onSmsChange,
}) {
  return (
    <>
      <div>
        <label
          htmlFor="birth"
          className="mb-[7px] block text-h3 text-primary-dark-active"
        >
          Birth
        </label>
        <DatePicker value={birth} onChange={onBirthChange} />
      </div>

      <div className="mt-[15px]">
        <span className="mb-[7px] block text-h3 text-primary-dark-active">
          Gender
        </span>
        <GenderSelect value={gender} onChange={onGenderChange} />
      </div>

      <div className="mt-[15px]">
        <span className="mb-[7px] block text-h3 text-primary-dark-active">
          Receive SMS (opt)
        </span>
        <button
          type="button"
          role="checkbox"
          aria-checked={isSmsAccepted}
          onClick={() => onSmsChange(!isSmsAccepted)}
          className="flex h-[45px] w-[320px] items-center justify-between rounded-[10px] border border-primary bg-background pr-[12px] pl-[12px] text-left"
        >
          <span className="text-label text-primary">
            Get present recommendation and events.
          </span>
          <span
            aria-hidden="true"
            className={`block h-5 w-[19px] shrink-0 [&_svg]:h-5 [&_svg]:w-[19px] ${
              isSmsAccepted ? 'text-primary' : 'text-[#E2D6CE]'
            }`}
            dangerouslySetInnerHTML={{ __html: checkIcon }}
          />
        </button>
      </div>
    </>
  )
}

function SignupPage() {
  const [step, setStep] = useState(1)
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [hasPasswordMismatch, setHasPasswordMismatch] = useState(false)
  const [birth, setBirth] = useState('')
  const [gender, setGender] = useState('')
  const [isSmsAccepted, setIsSmsAccepted] = useState(false)

  const handleSubmit = (event) => {
    event.preventDefault()

    if (step === 1) {
      const isMismatch = password !== confirmPassword
      setHasPasswordMismatch(isMismatch)

      if (!isMismatch) setStep(2)
    }
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[412px] overflow-x-hidden bg-background px-4 pb-10">
      <div className="flex flex-col items-center pt-[50px]">
        <BrandDivider />

        <h1 className="mt-[68px] text-display text-primary-dark-active">
          Sign up
        </h1>

        <form
          onSubmit={handleSubmit}
          className="mt-[35px] flex min-h-[481px] w-full max-w-[380px] flex-col items-center rounded-[20px] bg-[#FAF9F6] px-5 pt-[37px] pb-[30px] shadow-[2px_4px_10px_0px_#8A5A3C40]"
        >
          {step === 1 ? (
            <>
              <div>
                <label htmlFor="name" className="mb-[7px] block text-h3 text-primary-dark-active">
                  Name
                </label>
                <TextInput id="name" name="name" autoComplete="name" required />
              </div>

              <div className="mt-[15px]">
                <label htmlFor="signup-phone-number" className="mb-[7px] block text-h3 text-primary-dark-active">
                  Phone Number
                </label>
                <TextInput id="signup-phone-number" name="phoneNumber" type="tel" autoComplete="tel" required />
              </div>

              <div className="mt-[15px]">
                <label htmlFor="signup-password" className="mb-[7px] block text-h3 text-primary-dark-active">
                  Password
                </label>
                <PasswordInput id="signup-password" name="password" value={password} onChange={(event) => setPassword(event.target.value)} autoComplete="new-password" required />
              </div>

              <div className="mt-[15px]">
                <label htmlFor="confirm-password" className="mb-[7px] block text-h3 text-primary-dark-active">
                  Confirm Password
                </label>
                <PasswordInput
                  id="confirm-password"
                  name="confirmPassword"
                  value={confirmPassword}
                  onChange={(event) => setConfirmPassword(event.target.value)}
                  autoComplete="new-password"
                  required
                  aria-invalid={hasPasswordMismatch}
                  aria-describedby={hasPasswordMismatch ? 'confirm-password-error' : undefined}
                  className={hasPasswordMismatch ? 'border-required-text' : ''}
                />
                {hasPasswordMismatch && (
                  <p id="confirm-password-error" className="mt-[7px] text-caption text-required-text">
                    일치하지 않습니다.
                  </p>
                )}
              </div>

              <LoginButton type="submit" size="compact" className={hasPasswordMismatch ? 'mt-4' : 'mt-[35px]'}>
                Next
              </LoginButton>
            </>
          ) : (
            <>
              <SignupDetails
                birth={birth}
                gender={gender}
                isSmsAccepted={isSmsAccepted}
                onBirthChange={setBirth}
                onGenderChange={setGender}
                onSmsChange={setIsSmsAccepted}
              />
              <LoginButton type="submit" size="compact" className="mt-auto">
                Sign up
              </LoginButton>
            </>
          )}
        </form>
      </div>
    </main>
  )
}

export default SignupPage
