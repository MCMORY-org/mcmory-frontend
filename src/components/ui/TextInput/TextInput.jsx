function TextInput({ className = '', type = 'text', ...inputProps }) {
  return (
    <input
      type={type}
      className={`h-[38px] w-[280px] rounded-[10px] border border-primary bg-background px-3 text-body-1 text-foreground outline-none placeholder:text-primary-light-active disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...inputProps}
    />
  )
}

export default TextInput
