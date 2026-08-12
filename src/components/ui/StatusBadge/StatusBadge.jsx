const STATUS_CONFIG = {
  repairable: {
    label: '수리가능',
    className: 'h-[17px] w-[58px] bg-repairable text-primary-dark-active',
  },
  open: {
    label: '영업중',
    className: 'h-[17px] w-[46px] bg-open text-primary-dark-active',
  },
  reservable: {
    label: '예약 가능',
    className: 'h-[17px] w-[58px] bg-reservable text-primary-dark-active',
  },
  required: {
    label: '필수',
    className: 'h-[15px] w-9 bg-pink-background text-required-text',
  },
}

function StatusBadge({ className = '', status = 'repairable' }) {
  const config = STATUS_CONFIG[status] ?? STATUS_CONFIG.repairable

  return (
    <span
      className={`inline-flex shrink-0 items-center justify-center rounded-[20px] px-2.5 text-tab whitespace-nowrap ${config.className} ${className}`}
    >
      {config.label}
    </span>
  )
}

export default StatusBadge
