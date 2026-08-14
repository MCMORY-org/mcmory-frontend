import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'

import mcmLogo from '@/assets/icons/main/MCM.svg'

function MainPage() {
  const navigate = useNavigate()

  useEffect(() => {
    const timerId = window.setTimeout(() => {
      navigate('/login', { replace: true })
    }, 3000)

    return () => window.clearTimeout(timerId)
  }, [navigate])

  return (
    <main className="relative mx-auto min-h-dvh w-full max-w-[412px] overflow-hidden bg-background">
      <div className="absolute top-1/2 left-1/2 flex -translate-x-1/2 -translate-y-[calc(50%+40px)] flex-col items-center gap-2.5 whitespace-nowrap">
        <h1 className="text-main text-primary-dark-active">MCMORY</h1>
        <p className="text-caption text-primary">물건이 아닌 순간을 선물하다</p>
      </div>

      <img
        src={mcmLogo}
        alt="MCM"
        className="absolute bottom-[50px] left-1/2 h-10 w-[39px] -translate-x-1/2 object-contain"
      />
    </main>
  )
}

export default MainPage
