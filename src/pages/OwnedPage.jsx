import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

import trashIcon from '@/assets/icons/common-components/Trash.svg'
import BottomTab from '@/components/layout/BottomTab'

export const INITIAL_PRODUCTS = [
  {
    id: 'tracy-crossbody',
    name: 'Tracy 비세토스 크로스바디',
    addedAt: '2026 . 08 . 06',
    serial: 'MX2024A031',
  },
  {
    id: 'visetos-shoulder',
    name: '비세토스 숄더백',
    addedAt: '2026 . 08 . 06',
    serial: 'MX2024B102',
  },
]

const SERIAL_PRODUCTS = {
  MX2024A031: 'Tracy 비세토스 크로스바디',
  MX2024B102: '비세토스 숄더백',
  MX2024C203: '비세토스 오리지널 카드 반지갑',
}

function formatAddedDate(date = new Date()) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year} . ${month} . ${day}`
}

function OwnedPage() {
  const navigate = useNavigate()
  const [serialNumber, setSerialNumber] = useState('')
  const [products, setProducts] = useState(INITIAL_PRODUCTS)
  const [productToDelete, setProductToDelete] = useState(null)

  const handleRegister = (event) => {
    event.preventDefault()
    const serial = serialNumber.trim().toUpperCase()
    if (!serial) return

    const alreadyOwned = products.some(
      (product) => product.serial.toUpperCase() === serial,
    )
    if (alreadyOwned) {
      setSerialNumber('')
      return
    }

    setProducts((current) => [
      {
        id: serial,
        name: SERIAL_PRODUCTS[serial] ?? serial,
        addedAt: formatAddedDate(),
        serial,
      },
      ...current,
    ])
    setSerialNumber('')
  }

  const handleConfirmDelete = () => {
    if (!productToDelete) return
    setProducts((current) =>
      current.filter((item) => item.id !== productToDelete.id),
    )
    setProductToDelete(null)
  }

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col overflow-hidden bg-background">
      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
        <div className="no-scrollbar absolute inset-0 overflow-y-auto px-4 pt-8 pb-8">
          <section className="flex w-[310px] flex-col gap-2">
            <h1 className="text-h2 leading-6 text-primary-active">
              먼저, 관리를 위해서는
              <br />
              제품 고유의 일련번호가 필요해요
            </h1>
            <p className="text-body-2 text-secondary-dark">
              일련번호는 제품 태그·보증서에서 확인하실 수 있어요
            </p>
          </section>

          <form
            onSubmit={handleRegister}
            className="mt-7 flex w-full flex-col gap-4"
          >
            <label
              htmlFor="serial-number"
              className="text-body-1 font-semibold text-primary-active"
            >
              SERIAL NUMBER
            </label>
            <input
              id="serial-number"
              name="serialNumber"
              type="text"
              autoComplete="off"
              value={serialNumber}
              onChange={(event) => setSerialNumber(event.target.value)}
              placeholder="직접 입력하기 (예: MX2024A031)"
              className="w-full border-0 border-b-[0.5px] border-secondary-dark bg-transparent pb-2 text-[13px] font-medium text-primary-dark-active outline-none placeholder:text-primary-light-active"
            />
            <button
              type="submit"
              disabled={!serialNumber.trim()}
              className="flex w-full items-center justify-center rounded-[10px] bg-primary px-5 py-2.5 text-button text-background disabled:opacity-40"
            >
              REGISTER
            </button>
          </form>

          <h2 className="mt-7 text-center text-h1 text-primary-dark-active">
            MY MCM LIST
          </h2>

          <ul className="mt-7 flex flex-col gap-7">
            {products.map((product) => (
              <li key={product.id}>
                <OwnedProductCard
                  product={product}
                  onSelect={() =>
                    navigate(`/owned/${product.id}`, { state: { product } })
                  }
                  onDelete={() => setProductToDelete(product)}
                />
              </li>
            ))}
          </ul>
        </div>
      </div>

      <BottomTab activeTab="manage" />

      {productToDelete ? (
        <DeleteConfirmDialog
          productName={productToDelete.name}
          onConfirm={handleConfirmDelete}
          onCancel={() => setProductToDelete(null)}
        />
      ) : null}
    </main>
  )
}

function OwnedProductCard({ product, onSelect, onDelete }) {
  return (
    <article className="flex w-full flex-col items-center justify-center rounded-[20px] bg-[#FAF9F6] p-[15px] shadow-[2px_4px_10px_rgba(138,90,60,0.25)]">
      <div className="flex w-full flex-col items-end">
        <button
          type="button"
          onClick={onSelect}
          className="flex w-full items-center bg-transparent text-left"
        >
          <div className="relative h-[104px] min-w-0 flex-1">
            <span className="absolute top-0 left-0 h-[104px] w-[100px] rounded-[10px] bg-secondary-light-active shadow-[2px_2px_4px_rgba(110,72,48,0.25)]" />
            <div className="absolute top-1 right-0 left-[119px] flex h-[97px] flex-col items-start gap-[19px]">
              <div className="flex w-full flex-col items-start">
                <p className="text-[13px] font-medium text-[#947C50]">NAME</p>
                <p className="w-full text-[16px] font-semibold break-keep text-[#3E281B]">
                  {product.name}
                </p>
              </div>
              <div className="flex w-full flex-col items-start">
                <p className="text-[13px] font-medium text-[#947C50]">ADDED</p>
                <p className="w-full text-[16px] font-semibold text-[#3E281B]">
                  {product.addedAt}
                </p>
              </div>
            </div>
          </div>

          <svg
            viewBox="0 0 8 14"
            className="ml-[15px] h-[15px] w-[5px] shrink-0"
            fill="none"
            aria-hidden
          >
            <path
              d="M1 1L7 7L1 13"
              stroke="#947C50"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>

        <button
          type="button"
          aria-label={`${product.name} 삭제`}
          onClick={onDelete}
          className="flex size-[21px] items-center justify-center bg-transparent"
        >
          <img src={trashIcon} alt="" className="size-[21px]" />
        </button>
      </div>
    </article>
  )
}

function DeleteConfirmDialog({ productName, onConfirm, onCancel }) {
  return (
    <div
      className="absolute inset-0 z-20 flex items-center justify-center bg-[rgba(69,58,37,0.25)] px-[30px]"
      onClick={onCancel}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="delete-confirm-title"
        onClick={(event) => event.stopPropagation()}
        className="flex w-full max-w-[351px] flex-col items-center rounded-[10px] bg-[#FAF9F6] px-6 py-[21px] shadow-[2px_4px_5px_rgba(138,90,60,0.25)]"
      >
        <p
          id="delete-confirm-title"
          className="w-[154px] text-center text-[16px] font-normal break-words text-[#3E281B]"
        >
          ‘{productName}’ 을
          <br />
          정말 삭제하시겠습니까?
        </p>

        <div className="mt-[11px] flex items-center gap-[9px]">
          <button
            type="button"
            onClick={onConfirm}
            className="flex h-[22px] w-[33px] items-center justify-center rounded-[5px] bg-[#9E2A2B] px-2.5 text-[13px] font-medium text-[#F9F6F0]"
          >
            예
          </button>
          <button
            type="button"
            onClick={onCancel}
            className="flex h-[22px] w-[59px] items-center justify-center rounded-[5px] bg-white px-2.5 text-[13px] font-medium text-[#3E281B] outline outline-[0.5px] -outline-offset-[0.5px] outline-[#C5A56A]"
          >
            아니요
          </button>
        </div>
      </div>
    </div>
  )
}

export default OwnedPage
