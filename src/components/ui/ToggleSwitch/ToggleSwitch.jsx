import { useState } from 'react'

const ACTIVE_BACKGROUND =
  'linear-gradient(118.29deg, #E9D8B9 0%, #D9C195 19.18%, #D1B684 27.8%, #CEB27E 31.16%, #CBAD76 35.16%, #C5A56A 41.55%)'

function ToggleSwitch({
  checked,
  defaultChecked = false,
  disabled = false,
  label = '토글',
  onChange,
}) {
  const [internalChecked, setInternalChecked] = useState(defaultChecked)
  const isControlled = typeof checked === 'boolean'
  const isChecked = isControlled ? checked : internalChecked

  const handleClick = () => {
    if (disabled) return

    const nextChecked = !isChecked

    if (!isControlled) {
      setInternalChecked(nextChecked)
    }

    onChange?.(nextChecked)
  }

  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      aria-label={label}
      disabled={disabled}
      onClick={handleClick}
      className="relative h-4 w-[30px] shrink-0 rounded-[100px] transition-[background,opacity] duration-200 disabled:cursor-not-allowed disabled:opacity-50"
      style={{
        background: isChecked
          ? ACTIVE_BACKGROUND
          : 'var(--color-secondary-light-active)',
      }}
    >
      <span
        aria-hidden="true"
        className="absolute top-[1.075px] left-0 size-[13.85px] rounded-full bg-surface transition-transform duration-200 ease-out"
        style={{
          transform: `translateX(${isChecked ? '15.15px' : '1px'})`,
        }}
      />
    </button>
  )
}

export default ToggleSwitch
