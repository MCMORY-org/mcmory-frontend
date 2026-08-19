import { useEffect, useState } from 'react'
import { Navigate, useLocation, useNavigate, useParams } from 'react-router-dom'

import { isUnauthorized } from '@/api/client.jsx'
import { getOwnedCareGuide, getOwnedStyling, listOwned, mapOwnedProduct } from '@/api/owned.jsx'
import chevronIcon from '@/assets/icons/common-components/Chevron.svg'
import BottomTab from '@/components/layout/BottomTab'

function OwnedDetailPage() {
  const navigate = useNavigate()
  const { productId } = useParams()
  const location = useLocation()
  const ownedId = Number(productId)
  const [activeTab, setActiveTab] = useState('styling')
  const [product, setProduct] = useState(location.state?.product ?? null)
  const [styling, setStyling] = useState(null)
  const [careGuide, setCareGuide] = useState(null)
  const [errorMessage, setErrorMessage] = useState('')
  const [isLoadingProduct, setIsLoadingProduct] = useState(!location.state?.product)
  const [isLoadingStyling, setIsLoadingStyling] = useState(true)
  const [isLoadingCare, setIsLoadingCare] = useState(false)
  const [notFound, setNotFound] = useState(Number.isNaN(ownedId))

  useEffect(() => {
    if (Number.isNaN(ownedId)) return undefined

    let cancelled = false

    async function loadProduct() {
      if (location.state?.product) return
      setIsLoadingProduct(true)
      try {
        const result = await listOwned()
        if (cancelled) return
        const found = (result?.list ?? [])
          .map(mapOwnedProduct)
          .find((item) => String(item.id) === String(ownedId))
        if (!found) {
          setNotFound(true)
          return
        }
        setProduct(found)
      } catch (error) {
        if (cancelled) return
        if (isUnauthorized(error)) {
          navigate('/login', { replace: true })
          return
        }
        if (error.code === 'OWNED404_2') {
          setNotFound(true)
          return
        }
        setErrorMessage(error.message ?? '제품 정보를 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setIsLoadingProduct(false)
      }
    }

    loadProduct()
    return () => {
      cancelled = true
    }
  }, [ownedId, location.state?.product, navigate])

  useEffect(() => {
    if (Number.isNaN(ownedId)) return undefined

    let cancelled = false

    async function loadStyling() {
      setIsLoadingStyling(true)
      try {
        const result = await getOwnedStyling(ownedId, { aiReason: true })
        if (!cancelled) setStyling(result)
      } catch (error) {
        if (cancelled) return
        if (isUnauthorized(error)) {
          navigate('/login', { replace: true })
          return
        }
        setErrorMessage(error.message ?? '스타일링 추천을 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setIsLoadingStyling(false)
      }
    }

    loadStyling()
    return () => {
      cancelled = true
    }
  }, [ownedId, navigate])

  useEffect(() => {
    if (activeTab !== 'management' || careGuide || Number.isNaN(ownedId)) {
      return undefined
    }

    let cancelled = false

    async function loadCareGuide() {
      setIsLoadingCare(true)
      try {
        const result = await getOwnedCareGuide(ownedId)
        if (!cancelled) setCareGuide(result)
      } catch (error) {
        if (cancelled) return
        if (isUnauthorized(error)) {
          navigate('/login', { replace: true })
          return
        }
        setErrorMessage(error.message ?? '관리 방법을 불러오지 못했습니다.')
      } finally {
        if (!cancelled) setIsLoadingCare(false)
      }
    }

    loadCareGuide()
    return () => {
      cancelled = true
    }
  }, [activeTab, careGuide, ownedId, navigate])

  if (notFound) {
    return <Navigate to="/owned" replace />
  }

  const displayName = product?.name ?? styling?.product?.name ?? '제품'
  const displayImage = product?.imageUrl ?? styling?.product?.imageUrl ?? null
  const isAiStyling = styling?.reasonSource === 'LLM'

  return (
    <main className="relative mx-auto flex h-dvh w-full max-w-[412px] flex-col overflow-hidden bg-background">
      <div className="relative min-h-0 min-w-0 flex-1 overflow-hidden">
        <div className="no-scrollbar absolute inset-0 overflow-y-auto px-4 pt-[30px] pb-8">
          <p className="h-8 w-[261px] text-[13px] leading-4 font-medium text-primary-active">
            {isAiStyling ? (
              <>
                함께 스타일링 하면 좋은 제품을
                <br />
                AI가 추천해 드려요
              </>
            ) : (
              <>
                함께 스타일링 하면 좋은 제품을
                <br />
                추천해 드려요
              </>
            )}
          </p>

          <section className="mt-[35px] flex h-[148px] items-center overflow-hidden rounded-[20px] bg-[#FAF9F6] px-[25px] shadow-[2px_4px_10px_rgba(138,90,60,0.25)]">
            <div className="flex items-center gap-5">
              {displayImage ? (
                <img
                  src={displayImage}
                  alt=""
                  className="size-[104px] shrink-0 rounded-[10px] object-cover shadow-[2px_2px_4px_rgba(110,72,48,0.25)]"
                />
              ) : (
                <span className="size-[104px] shrink-0 rounded-[10px] bg-secondary-light-active shadow-[2px_2px_4px_rgba(110,72,48,0.25)]" />
              )}
              <div className="flex w-[182px] flex-col items-start gap-[19px]">
                <div className="flex w-full flex-col items-start">
                  <p className="text-[13px] font-medium text-[#947C50]">NAME</p>
                  <p className="w-full text-[16px] font-semibold break-keep text-[#3E281B]">
                    {isLoadingProduct && !product ? '불러오는 중...' : displayName}
                  </p>
                </div>
                <div className="flex w-full flex-col items-start">
                  <p className="text-[13px] font-medium text-[#947C50]">ADDED</p>
                  <p className="w-full text-[16px] font-semibold text-[#3E281B]">
                    {product?.addedAt ?? ''}
                  </p>
                </div>
              </div>
            </div>
          </section>

          <div className="mt-[30px]">
            <div className="grid grid-cols-2">
              <button
                type="button"
                onClick={() => setActiveTab('styling')}
                className={`text-center text-[16px] font-semibold ${
                  activeTab === 'styling' ? 'text-[#3E281B]' : 'text-[#DBCCC3]'
                }`}
              >
                AI STYLING
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('management')}
                className={`text-center text-[16px] font-semibold ${
                  activeTab === 'management'
                    ? 'text-[#3E281B]'
                    : 'text-[#DBCCC3]'
                }`}
              >
                MANAGEMENT
              </button>
            </div>
            <div className="relative mt-3 h-[2px] bg-[#DBCCC3]">
              <span
                className={`absolute top-0 h-[2px] w-[199px] bg-[#C5A56A] ${
                  activeTab === 'management' ? 'right-0' : 'left-0'
                }`}
              />
            </div>
          </div>

          {errorMessage ? (
            <p role="alert" className="mt-5 text-[12px] font-medium text-[#9E2A2B]">
              {errorMessage}
            </p>
          ) : null}

          {activeTab === 'styling' ? (
            isLoadingStyling ? (
              <p className="mt-5 text-center text-[13px] font-medium text-[#947C50]">
                불러오는 중...
              </p>
            ) : (styling?.results ?? []).length === 0 ? (
              <p className="mt-5 text-center text-[13px] font-medium text-[#947C50]">
                추천할 스타일링이 없어요
              </p>
            ) : (
              <ul className="mt-5 flex flex-col gap-5">
                {(styling?.results ?? []).map((item) => (
                  <li key={item.productId}>
                    <StylingCard item={item} />
                  </li>
                ))}
              </ul>
            )
          ) : isLoadingCare ? (
            <p className="mt-5 text-center text-[13px] font-medium text-[#947C50]">
              불러오는 중...
            </p>
          ) : (
            <div className="mt-5 flex flex-col gap-5">
              <p className="text-[11px] leading-[1.4] font-medium text-[#947C50]">
                이 안내는 시연용 일반 관리 팁이며, MCM 공식 관리 지침이 아닙니다.
              </p>
              <ul className="flex flex-col gap-5">
                {(careGuide?.items ?? []).map((text, index) => (
                  <li key={`${index}-${text}`}>
                    <ManagementCard
                      index={index + 1}
                      text={text}
                      showStoreButton={index === 1}
                      onFindStore={() =>
                        navigate(`/owned/${ownedId}/stores`, {
                          state: { product },
                        })
                      }
                    />
                  </li>
                ))}
              </ul>
              {(careGuide?.items ?? []).length === 1 ||
              (careGuide?.items ?? []).length === 0 ? (
                <button
                  type="button"
                  onClick={() =>
                    navigate(`/owned/${ownedId}/stores`, {
                      state: { product },
                    })
                  }
                  className="flex h-[29px] w-fit items-center justify-center gap-[9px] rounded-[15px] bg-[#EDE3D1] px-3 text-[10px] font-medium text-[#594A30]"
                >
                  가까운 매장 찾기
                  <img src={chevronIcon} alt="" className="h-2.5 w-3" />
                </button>
              ) : null}
            </div>
          )}
        </div>
      </div>

      <BottomTab activeTab="manage" />
    </main>
  )
}

function StylingCard({ item }) {
  const priceLabel =
    typeof item.price === 'number'
      ? `KRW ${item.price.toLocaleString('ko-KR')}`
      : null

  return (
    <article className="relative min-h-[99px] w-full overflow-hidden rounded-[20px] bg-[#FAF9F6] shadow-[2px_4px_10px_rgba(138,90,60,0.25)]">
      <div className="flex items-center gap-[22px] px-3 py-[11px]">
        {item.imageUrl ? (
          <img
            src={item.imageUrl}
            alt=""
            className="size-[74px] shrink-0 rounded-[10px] object-cover shadow-[2px_2px_4px_rgba(110,72,48,0.25)]"
          />
        ) : (
          <span className="size-[74px] shrink-0 rounded-[10px] bg-secondary-light-active shadow-[2px_2px_4px_rgba(110,72,48,0.25)]" />
        )}
        <div className="relative min-h-[77px] min-w-0 flex-1">
          <p className="text-[12px] font-normal text-[#9E2A2B]">{item.reason}</p>
          <p className="text-[12px] font-normal text-[#8A5A3C]">{item.category}</p>
          <p className="text-[18px] font-semibold break-keep text-[#3E281B]">
            {item.name}
          </p>
          <div className="mt-1 flex items-end justify-between gap-2">
            {priceLabel ? (
              <p className="text-[13px] font-medium text-[#947C50]">{priceLabel}</p>
            ) : (
              <span />
            )}
            {item.officialUrl ? (
              <a
                href={item.officialUrl}
                target="_blank"
                rel="noreferrer"
                className="flex h-[14px] items-center gap-[3px]"
              >
                <span className="text-[13px] leading-none font-medium text-[#947C50]">
                  보러가기
                </span>
                <img src={chevronIcon} alt="" className="h-2.5 w-3" />
              </a>
            ) : null}
          </div>
        </div>
      </div>
    </article>
  )
}

function ManagementCard({ index, text, showStoreButton, onFindStore }) {
  return (
    <article className="flex w-full flex-col items-start justify-center rounded-[20px] bg-[#FAF9F6] p-[15px] shadow-[2px_4px_10px_rgba(138,90,60,0.25)]">
      <div className="flex items-start gap-[21px]">
        <span className="flex size-[26px] shrink-0 items-center justify-center rounded-full bg-[#C5A56A] text-[16px] font-semibold text-[#68442D] outline outline-1 -outline-offset-1 outline-[#C5A56A]">
          {index}
        </span>
        <div className="flex min-w-0 flex-1 flex-col items-start">
          <p className="text-[13px] leading-[1.4] font-medium break-keep text-[#68442D]">
            {text}
          </p>
          {showStoreButton ? (
            <button
              type="button"
              onClick={onFindStore}
              className="mt-2.5 flex h-[29px] items-center justify-center gap-[9px] rounded-[15px] bg-[#EDE3D1] px-3 text-[10px] font-medium text-[#594A30]"
            >
              가까운 매장 찾기
              <img src={chevronIcon} alt="" className="h-2.5 w-3" />
            </button>
          ) : null}
        </div>
      </div>
    </article>
  )
}

export default OwnedDetailPage
