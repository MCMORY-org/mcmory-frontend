import BottomTab from '@/components/layout/BottomTab/index.jsx'
import AddButton from '@/components/ui/AddButton/index.jsx'
import EditButton from '@/components/ui/EditButton/index.jsx'
import LoginButton from '@/components/ui/LoginButton/index.jsx'
import PasswordInput from '@/components/ui/PasswordInput/index.jsx'
import StatusBadge from '@/components/ui/StatusBadge/index.jsx'
import TextInput from '@/components/ui/TextInput/index.jsx'
import ToggleSwitch from '@/components/ui/ToggleSwitch/index.jsx'

function ComponentTestPage() {
  return (
    <div className="mx-auto flex min-h-dvh w-full max-w-[412px] flex-col bg-background">
      <main className="flex flex-1 flex-col justify-center gap-8 px-10 py-8">
        <section className="flex flex-col items-center gap-3">
          <TextInput aria-label="일반 입력" />
          <PasswordInput aria-label="비밀번호" />
          <LoginButton />
        </section>

        <section className="flex items-center justify-center gap-4">
          <EditButton />
          <AddButton />
          <ToggleSwitch label="알림 설정" />
        </section>

        <section className="flex items-center justify-between">
          <StatusBadge status="repairable" />
          <StatusBadge status="open" />
          <StatusBadge status="reservable" />
          <StatusBadge status="required" />
        </section>
      </main>

      <BottomTab />
    </div>
  )
}

export default ComponentTestPage
