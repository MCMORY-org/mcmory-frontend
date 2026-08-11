import addIcon from '@/assets/icons/common-components/Add.svg?raw'

function AddButton({ className = '', disabled = false, onClick, type = 'button' }) {
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`flex h-[33px] w-[72px] items-center justify-center gap-[7px] rounded-[20px] bg-primary-active text-button text-background transition-opacity disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      <span
        aria-hidden="true"
        className="block size-[9px] shrink-0 [&_svg]:size-full"
        dangerouslySetInnerHTML={{ __html: addIcon }}
      />
      <span>ADD</span>
    </button>
  )
}

export default AddButton
