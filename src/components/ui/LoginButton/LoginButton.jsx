function LoginButton({
  className = '',
  disabled = false,
  onClick,
  type = 'button',
}) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-[39px] w-[280px] items-center justify-center rounded-[10px] bg-primary px-5 py-2.5 text-button text-background hover:bg-primary-light-active active:bg-primary disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      Login
    </button>
  )
}

export default LoginButton
