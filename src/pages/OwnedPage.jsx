import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import { isUnauthorized } from '@/api/client.jsx'
import { deleteOwned, listOwned, mapOwnedProduct, registerOwned } from '@/api/owned.jsx'
import trashIcon from '@/assets/icons/common-components/Trash.svg'
import BottomTab from '@/components/layout/BottomTab'

function OwnedPage() {
  const navigate = useNavigate()
  const [serialNumber, setSerialNumber] = useState('')
  const [products, setProducts] = useState([])
  const [productToDelete, setProductToDelete] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const loadProducts = async () => {
    const result = await listOwned()
    setProducts((result?.list ?? []).map(mapOwnedProduct))
  }

  useEffect(() => {
    let cancelled = false

    async function load() {
      setErrorMessage('')
      setIsLoading(true)
      try {
        const result = await listOwned()
        if (cancelled) return
        setProducts((result?.list ?? []).map(mapOwnedProduct))
      } catch (error) {
        if (cancelled) return
        if (isUnauthorized(error)) {
          navigate('/login', { replace: true })
          return
        }
        setErrorMessage(error.message ?? '보유 제품을 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setIsLoading(false)
      }
    }

    load()
    return () => {
      cancelled = true
    }
  }, [navigate])

  const handleRegister = async (event) => {
    event.preventDefault()
    const serial = serialNumber.trim()
    if (!serial || isSubmitting) return

    setErrorMessage('')
    setIsSubmitting(true)
    try {
      await registerOwned(serial)
      setSerialNumber('')
      await loadProducts()
    } catch (error) {
      if (isUnauthorized(error)) {
        navigate('/login', { replace: true })
        return
      }
      setErrorMessage(error.message ?? '제품 등록에 실패했습니다.')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleConfirmDelete = async () => {
    if (!productToDelete || isDeleting) return

    setIsDeleting(true)
    setErrorMessage('')
    try {
      await deleteOwned(productToDelete.id)
      setProducts((current) =>
        current.filter((item) => item.id !== productToDelete.id),
      )
      setProductToDelete(null)
    } catch (error) {
      if (isUnauthorized(error)) {
        navigate('/login', { replace: true })
        return
      }
      setErrorMessage(error.message ?? '제품 삭제에 실패했습니다.')
      setProductToDelete(null)
    } finally {
      setIsDeleting(false)
    }
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
            {errorMessage ? (
              <p role="alert" className="text-[12px] font-medium text-[#9E2A2B]">
                {errorMessage}
              </p>
            ) : null}
            <button
              type="submit"
              disabled={!serialNumber.trim() || isSubmitting}
              className="flex w-full items-center justify-center rounded-[10px] bg-primary px-5 py-2.5 text-button text-background disabled:opacity-40"
            >
              {isSubmitting ? 'REGISTERING...' : 'REGISTER'}
            </button>
          </form>

          <h2 className="mt-7 text-center text-h1 text-primary-dark-active">
            MY MCM LIST
          </h2>

          {isLoading ? (
            <p className="mt-7 text-center text-[13px] font-medium text-[#947C50]">
              불러오는 중...
            </p>
          ) : products.length === 0 ? (
            <p className="mt-7 text-center text-[13px] font-medium text-[#947C50]">
              아직 등록한 제품이 없어요
            </p>
          ) : (
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
          )}
        </div>
      </div>

      <BottomTab activeTab="manage" />

      {productToDelete ? (
        <DeleteConfirmDialog
          productName={productToDelete.name}
          isDeleting={isDeleting}
          onConfirm={handleConfirmDelete}
          onCancel={() => {
            if (!isDeleting) setProductToDelete(null)
          }}
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
            {product.imageUrl ? (
              <img
                src={product.imageUrl}
                alt=""
                className="absolute top-0 left-0 h-[104px] w-[100px] rounded-[10px] object-cover shadow-[2px_2px_4px_rgba(110,72,48,0.25)]"
              />
            ) : (
              <span className="absolute top-0 left-0 h-[104px] w-[100px] rounded-[10px] bg-secondary-light-active shadow-[2px_2px_4px_rgba(110,72,48,0.25)]" />
            )}
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

function DeleteConfirmDialog({ productName, isDeleting, onConfirm, onCancel }) {
  return (
    <div
      className="fixed inset-0 z-50 flex justify-center bg-[rgba(69,58,37,0.25)]"
      onClick={onCancel}
    >
      <div className="flex h-full w-full max-w-[412px] items-center justify-center px-[30px]">
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
              disabled={isDeleting}
              onClick={onConfirm}
              className="flex h-[22px] w-[33px] items-center justify-center rounded-[5px] bg-[#9E2A2B] px-2.5 text-[13px] font-medium text-[#F9F6F0] disabled:opacity-40"
            >
              예
            </button>
            <button
              type="button"
              disabled={isDeleting}
              onClick={onCancel}
              className="flex h-[22px] w-[59px] items-center justify-center rounded-[5px] bg-white px-2.5 text-[13px] font-medium text-[#3E281B] outline outline-[0.5px] -outline-offset-[0.5px] outline-[#C5A56A] disabled:opacity-40"
            >
              아니요
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default OwnedPage
