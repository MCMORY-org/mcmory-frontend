import { apiRequest, withFallback } from '@/api/client.jsx'
import { getFallbackLetters } from '@/api/dummyData.js'

export function getLetters() {
  return withFallback('GET /api/v1/letters', () => apiRequest('/api/v1/letters'), getFallbackLetters, {
    allowUnauthorized: true,
    useIfEmpty: true,
  })
}

export function mapReceivedMemory(item) {
  const unread = item.status === 'SENT' || item.openedAt == null

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
    status: item.status,
    sentAt: item.sentAt,
    openedAt: item.openedAt,
  }
}
