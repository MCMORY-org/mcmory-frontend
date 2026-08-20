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

/**
 * 보낸 선물 목록임. **폴백을 쓰지 않음** — 401을 더미로 덮으면 로그인이 필요한 상태가
 * "보낸 선물이 없음"으로 보여 거짓이 됨.
 */
export function getSentLetters() {
  return apiRequest('/api/v1/letters')
}

/**
 * 받은 편지 상세임(API 명세서 5.4의 #37). 목록에는 본문도 초대 토큰도 없어 여기서만 가져올 수 있음.
 * 동의 전에는 `needConsent: true`와 닉네임만 오고 `letterBody` 키 자체가 없음.
 */
export function getReceivedLetter(id) {
  return apiRequest(`/api/v1/letters/${id}`)
}

export function mapReceivedMemory(item) {
  const locallyOpened = openedLetterIds.has(String(item.id))
  const unread =
    !locallyOpened && (item.status === 'SENT' || item.openedAt == null)
  // 본문·사진·가격은 목록에 없음. 상세(#37)에서 채움 — 더미로 메우면 남의 사진과 틀린 가격이 나감

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
