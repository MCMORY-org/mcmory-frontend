function LoginButton({
  children = 'Login',
  className = '',
  disabled = false,
  onClick,
  size = 'default',
  type = 'button',
}) {
  const sizeClass =
    size === 'compact' ? 'h-10 w-[320px]' : 'h-[45px] w-[320px]'

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`flex items-center justify-center rounded-[10px] bg-primary px-5 text-button text-background hover:bg-primary-light-active active:bg-primary disabled:cursor-not-allowed disabled:opacity-50 ${sizeClass} ${className}`}
    >
      {children}
    </button>
  )
}

export default LoginButton
