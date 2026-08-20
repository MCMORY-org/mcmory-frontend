import { apiRequest } from '@/api/client.jsx'

/**
 * `friendId`가 있으면 그 친구의 설문 취향을 점수에 반영함.
 * `aiReason` 요청에서 모델이 실패해도 규칙 결과와 200을 반환하며,
 * `reasonSource`가 `LLM`인 응답만 AI 추천으로 표기할 수 있음.
 */
export function createRecommendation({
  relation,
  minBudget,
  maxBudget,
  friendId,
  aiReason = false,
}) {
  const body = { relation, minBudget, maxBudget }
  if (Number.isFinite(Number(friendId))) body.friendId = Number(friendId)

  return apiRequest(`/api/v1/recommend?aiReason=${aiReason ? 'true' : 'false'}`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export function mapRecommendedProduct(item) {
  return {
    id: item.product?.id,
    name: item.product?.name ?? '이름 없는 제품',
    description: item.reason ?? '',
    price: item.product?.price ?? 0,
    color: item.product?.color ?? '',
    imageUrl: item.product?.imageUrl ?? null,
    reasonType: item.reasonType,
  }
}
