import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

import { login } from '@/api/auth.jsx'
import mcmLogo from '@/assets/icons/main/MCM.svg'
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

function LoginPage() {
  const navigate = useNavigate()
  const [phone, setPhone] = useState('')
  const [password, setPassword] = useState('')
  const [errorMessage, setErrorMessage] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (event) => {
    event.preventDefault()
    setErrorMessage('')
    setIsSubmitting(true)

    try {
      await login({ phone, password })
      navigate('/home', { replace: true })
    } catch (error) {
      setErrorMessage(error.message ?? '로그인 중 오류가 발생했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <main className="mx-auto min-h-dvh w-full max-w-[412px] overflow-x-hidden bg-background px-4 pb-10">
      <div className="flex flex-col items-center pt-[50px]">
        <BrandDivider />

        <h1 className="mt-[138px] text-display text-primary-dark-active">Login</h1>

        <form
          onSubmit={handleSubmit}
          className="mt-[35px] flex min-h-[311px] w-full max-w-[380px] flex-col items-center rounded-[20px] bg-[#FAF9F6] px-5 pt-[37px] pb-[30px] shadow-[2px_4px_10px_0px_#8A5A3C40]"
        >
          <div>
            <label htmlFor="phone-number" className="mb-[7px] block text-h3 text-primary-dark-active">
              Phone Number
            </label>
            <TextInput
              id="phone-number"
              name="phoneNumber"
              type="tel"
              inputMode="numeric"
              autoComplete="tel"
              value={phone}
              onChange={(event) => setPhone(event.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          <div className="mt-[15px]">
            <label htmlFor="password" className="mb-[7px] block text-h3 text-primary-dark-active">
              Password
            </label>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="current-password"
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              disabled={isSubmitting}
              required
            />
          </div>

          {errorMessage && (
            <p role="alert" className="mt-3 w-[320px] text-caption text-required-text">
              {errorMessage}
            </p>
          )}

          <LoginButton
            type="submit"
            disabled={isSubmitting}
            className={errorMessage ? 'mt-4' : 'mt-[35px]'}
          >
            {isSubmitting ? 'Logging in...' : 'Login'}
          </LoginButton>
        </form>

        <div className="mt-[35px] flex items-center gap-1.5">
          <span className="text-body-1 text-[#8E8E93]">Not a member yet?</span>
          <Link to="/signup" className="text-button text-secondary underline underline-offset-2">
            Sign up
          </Link>
        </div>
      </div>
    </main>
  )
}

export default LoginPage
