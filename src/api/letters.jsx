import { apiRequest, withFallback } from '@/api/client.jsx'
import { getFallbackLetters, markFallbackLetterOpened } from '@/api/dummyData.js'

const openedLetterIds = new Set()

export function getLetters() {
  // useIfEmpty를 켜지 않음 — 정상적으로 빈 편지함까지 더미로 덮으면 새 계정에 가짜 편지가 뜸
  return withFallback('GET /api/v1/letters', () => apiRequest('/api/v1/letters'), getFallbackLetters, {
    allowUnauthorized: true,
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

/** 인증 실패를 빈 목록으로 오인하지 않도록 이 요청에는 더미 폴백을 쓰지 않음. */
export function getSentLetters() {
  return apiRequest('/api/v1/letters')
}

/**
 * 목록 응답에는 편지 본문과 초대 토큰이 없어 상세 요청으로 가져옴.
 * 동의 전 응답에는 `needConsent: true`와 닉네임만 있고 `letterBody` 키가 없음.
 */
export function getReceivedLetter(id) {
  return apiRequest(`/api/v1/letters/${id}`)
}

export function mapReceivedMemory(item) {
  const locallyOpened = openedLetterIds.has(String(item.id))
  const unread =
    !locallyOpened && (item.status === 'SENT' || item.openedAt == null)
  // 목록 응답에 없는 본문·사진·가격은 상세 조회로 채움. 더미로 채우면 다른 편지의 정보가 보임

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
    letterImages: item.letterImages ?? [],
    price: null,
    productDetail: '',
    status: item.status,
    sentAt: item.sentAt,
    openedAt: item.openedAt,
  }
}
