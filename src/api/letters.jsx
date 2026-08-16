import { apiRequest } from '@/api/client.jsx'

export function getLetters() {
  return apiRequest('/api/v1/letters')
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
    status: item.status,
    sentAt: item.sentAt,
    openedAt: item.openedAt,
  }
}
