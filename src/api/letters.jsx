import { apiRequest, withFallback } from '@/api/client.jsx'
import {
  getFallbackLetters,
  getProductDetails,
  LETTER_DUMMY_IMAGES,
  markFallbackLetterOpened,
} from '@/api/dummyData.js'

const openedLetterIds = new Set()

export function getLetters() {
  return withFallback('GET /api/v1/letters', () => apiRequest('/api/v1/letters'), getFallbackLetters, {
    allowUnauthorized: true,
    useIfEmpty: true,
  })
}

export function openLetter(id) {
  openedLetterIds.add(String(id))
  return withFallback(
    `PATCH /api/v1/letters/${id}`,
    () =>
      apiRequest(`/api/v1/letters/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ opened: true }),
      }),
    () => markFallbackLetterOpened(id),
    { allowUnauthorized: true, allowNotFound: true },
  )
}

export function mapReceivedMemory(item) {
  const locallyOpened = openedLetterIds.has(String(item.id))
  const unread =
    !locallyOpened && (item.status === 'SENT' || item.openedAt == null)
  const details = getProductDetails({
    productId: item.productId,
    productName: item.productName,
  })
  const letterImages =
    item.letterImages?.length > 0 ? item.letterImages : LETTER_DUMMY_IMAGES

  return {
    id: String(item.id),
    type: 'letter',
    title: `FROM. ${item.nickname}`,
    description: unread
      ? '도착한 OUR MCMORY가 있어요!\n잊기 전에 확인해보세요!'
      : '확인한 추억이에요',
    unread,
    senderName: item.nickname,
    productName: item.productName,
    productId: item.productId,
    imageUrl: item.imageUrl ?? null,
    letterBody: item.letterBody ?? '',
    letterImages,
    price: details?.price ?? null,
    productDetail: details?.detail ?? '',
    status: item.status,
    sentAt: item.sentAt,
    openedAt: item.openedAt,
  }
}
