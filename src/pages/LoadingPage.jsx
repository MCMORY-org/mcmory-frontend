import mcmLogo from '@/assets/icons/main/MCM.svg'

function LoadingSpinner() {
  return (
    <div
      role="status"
      aria-label="애플리케이션 준비 중"
      className="relative h-[46px] w-[46px]"
    >
      <span className="absolute top-[5.75px] left-[5.75px] size-[34.5px] rounded-full border-2 border-primary opacity-10" />
      <span className="absolute top-[5.75px] left-[5.75px] size-[34.5px] animate-spin rounded-full border-2 border-transparent border-t-secondary" />
    </div>
  )
}

function LoadingPage() {
  return (
    <main className="relative mx-auto min-h-dvh w-full max-w-[412px] overflow-hidden bg-background">
      <div className="flex flex-col items-center pt-[96px]">
        <div className="flex flex-col items-center gap-2.5 whitespace-nowrap">
          <h1 className="text-main text-primary-dark-active">MCMORY</h1>
          <p className="text-caption text-primary">
            물건이 아닌 순간을 선물하다
          </p>
        </div>

        <section className="mt-[50px] flex h-[309px] w-[calc(100%-32px)] max-w-[380px] flex-col items-center rounded-[20px] bg-[#FAF9F6] pt-6 shadow-[2px_4px_10px_0px_#8A5A3C40]">
          <LoadingSpinner />

          <div className="mt-[30px] flex flex-col items-center gap-[25px] text-center text-body-1 text-primary-dark-active">
            <p>
              원활한 서비스 이용을 위해
              <br />
              어플리케이션을 준비해주세요
            </p>

            <p className="px-5">
              아직 설치하지 않으셨다면 아래 버튼을 눌러
              <br />
              설치를 진행한 뒤 URL에 재접속해주세요.
            </p>

            <button
              type="button"
              className="flex h-[39px] w-[280px] items-center justify-center rounded-[10px] bg-primary px-5 py-2.5 text-button text-background"
            >
              앱 설치하기
            </button>
          </div>
        </section>
      </div>

      <img
        src={mcmLogo}
        alt="MCM"
        className="absolute bottom-[50px] left-1/2 h-10 w-[39px] -translate-x-1/2 object-contain"
      />
    </main>
  )
}

export default LoadingPage
