import BottomTab from '@/components/layout/BottomTab'

const PEOPLE = [
  {
    id: 'me',
    initial: '나',
    name: '나 (아기호저들)',
    subtitle: '내 취향',
    filled: true,
    action: 'edit',
  },
  {
    id: 'friend-2',
    initial: '친',
    name: '친구 2',
    subtitle: '',
    filled: true,
    action: 'edit',
  },
  {
    id: 'friend-3',
    initial: '친',
    name: '친구 3',
    subtitle: '',
    filled: false,
    action: 'add',
  },
  {
    id: 'friend-4',
    initial: '친',
    name: '친구 4',
    subtitle: '',
    filled: false,
    action: 'add',
  },
  {
    id: 'friend-5',
    initial: '친',
    name: '친구 5',
    subtitle: '',
    filled: false,
    action: 'add',
  },
]

function PeoplePage() {
  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col overflow-hidden bg-background">
      <form
        onSubmit={handleSubmit}
        className="flex min-h-0 min-w-0 flex-1 flex-col overflow-hidden"
      >
        <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
          <div className="no-scrollbar absolute inset-0 overflow-y-auto px-4 pt-[30px] pb-6">
          <p className="text-[13px] font-semibold text-primary-active">
            나와 소중한 사람들의 취향을 저장해 두세요
          </p>

          <h1 className="mt-[35px] text-h1 text-primary-dark-active">
            PEOPLE
          </h1>

          <ul className="mt-[75px] flex flex-col gap-[30px]">
            {PEOPLE.map((person) => (
              <li
                key={person.id}
                className="flex w-full items-center justify-between"
              >
                <div
                  className={`flex items-center gap-[15px] ${
                    person.filled ? '' : 'opacity-30'
                  }`}
                >
                  <span
                    className={`flex size-[47px] shrink-0 items-center justify-center rounded-full text-[18px] font-semibold text-[#3E281B] ${
                      person.id === 'me'
                        ? 'bg-[#C5A56A]'
                        : 'border-[0.5px] border-[#C5A56A] bg-[#FAF9F6]'
                    }`}
                  >
                    {person.initial}
                  </span>
                  <div className="flex flex-col items-start gap-[5px]">
                    <p className="text-[18px] font-semibold text-[#3E281B]">
                      {person.name}
                    </p>
                    {person.subtitle ? (
                      <p className="text-[12px] font-normal text-[#947C50]">
                        {person.subtitle}
                      </p>
                    ) : null}
                  </div>
                </div>

                {person.action === 'edit' ? (
                  <button
                    type="button"
                    className="flex w-[60px] items-center justify-center rounded-[20px] bg-background px-2.5 py-[7px] text-[16px] font-semibold text-[#947C50] outline outline-1 -outline-offset-1 outline-[#DBCCC3]"
                  >
                    EDIT
                  </button>
                ) : (
                  <button
                    type="button"
                    className="flex w-[72px] items-center justify-center gap-[7px] rounded-[20px] bg-primary-active px-2.5 py-[7px] text-[16px] font-semibold text-[#F9F6F0]"
                  >
                    <PlusIcon />
                    ADD
                  </button>
                )}
              </li>
            ))}
          </ul>
          </div>
        </div>

        <div className="shrink-0 px-4 pb-3">
          <button
            type="submit"
            className="flex w-full items-center justify-center rounded-[10px] bg-primary px-5 py-2.5 text-button text-background"
          >
            SAVE PEOPLE
          </button>
        </div>
      </form>

      <BottomTab activeTab="my" />
    </main>
  )
}

function PlusIcon() {
  return (
    <svg viewBox="0 0 9 9" className="size-[9px]" fill="none" aria-hidden>
      <path
        d="M4.5 1v7M1 4.5h7"
        stroke="#F9F6F0"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default PeoplePage
