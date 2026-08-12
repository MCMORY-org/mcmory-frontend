function EditButton({ className = '', disabled = false, onClick, type = 'button' }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-[35px] w-[60px] items-center justify-center rounded-[20px] border border-primary-light-active bg-background text-button text-secondary-dark transition-opacity disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      EDIT
    </button>
  )
}

export default EditButton
