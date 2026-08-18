import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import homeIcon from '@/assets/icons/common-components/Home.svg?raw'
import letterIcon from '@/assets/icons/common-components/Letter.svg?raw'
import manageIcon from '@/assets/icons/common-components/Manage.svg?raw'
import memoryIcon from '@/assets/icons/common-components/Memory.svg?raw'
import myIcon from '@/assets/icons/common-components/My.svg?raw'

const TAB_ITEMS = [
  { id: 'home', label: '홈', icon: homeIcon, width: 18, path: '/home' },
  { id: 'letter', label: '편지지', icon: letterIcon, width: 20 },
  { id: 'memory', label: '추억', icon: memoryIcon, width: 18, path: '/memories' },
  { id: 'manage', label: '관리', icon: manageIcon, width: 20, path: '/owned' },
  { id: 'my', label: '마이', icon: myIcon, width: 20, path: '/my' },
]

function TabIcon({ icon, width }) {
  return (
    <span
      aria-hidden="true"
      className="block h-5 shrink-0 [&_svg]:h-5 [&_svg]:w-full"
      dangerouslySetInnerHTML={{ __html: icon }}
      style={{ width }}
    />
  )
}

function BottomTab({
  activeTab,
  defaultActiveTab = 'home',
  onTabChange,
  badges = {},
}) {
  const navigate = useNavigate()
  const [internalActiveTab, setInternalActiveTab] = useState(defaultActiveTab)
  const isControlled = typeof activeTab === 'string'
  const currentTab = isControlled ? activeTab : internalActiveTab

  const handleTabClick = (item) => {
    if (!isControlled) {
      setInternalActiveTab(item.id)
    }

    if (item.path) {
      navigate(item.path)
    }

    onTabChange?.(item.id)
  }

  return (
    <nav
      aria-label="하단 메뉴"
      className="h-20 w-full shrink-0 border-t-[0.3px] border-secondary-dark bg-background px-10 pt-[17px] pb-[18px]"
    >
      <ul className="flex h-[45px] w-full items-center justify-between">
        {TAB_ITEMS.map((item) => {
          const isActive = currentTab === item.id
          const badgeCount = badges[item.id]

          return (
            <li key={item.id}>
              <button
                type="button"
                aria-current={isActive ? 'page' : undefined}
                aria-label={
                  badgeCount
                    ? `${item.label} 탭, 새 알림 ${badgeCount}개`
                    : `${item.label} 탭`
                }
                onClick={() => handleTabClick(item)}
                className={`flex h-[45px] flex-col items-center gap-2.5 ${
                  isActive
                    ? 'text-primary-dark-hover'
                    : 'text-primary-light-active'
                }`}
              >
                <span className="relative">
                  <TabIcon {...item} />
                  {badgeCount ? (
                    <span className="absolute -top-2 left-[11px] flex size-[18px] items-center justify-center rounded-full bg-[#DD3839] text-[10px] font-medium text-background">
                      {badgeCount}
                    </span>
                  ) : null}
                </span>
                <span className="text-tab whitespace-nowrap">{item.label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </nav>
  )
}

export default BottomTab
