import { apiRequest } from '@/api/client.jsx'

/**
 * 추천 생성. `friendId`를 주면 그 친구가 설문에 답한 취향이 점수에 반영됨.
 * `aiReason`은 옵트인이고, 모델이 실패하면 서버가 규칙 결과로 폴백하며 그때도 200임.
 * 응답 `reasonSource`가 `LLM`일 때만 화면이 AI가 골랐다고 표기할 수 있음.
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

/** 추천 결과를 화면이 쓰는 상품 모양으로 변환함. */
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
