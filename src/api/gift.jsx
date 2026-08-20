import { apiRequest } from '@/api/client.jsx'

/** 선물 발송. 응답 토큰으로 초대 주소를 만듦. 되돌릴 수 없음. */
export function sendGift({
  productId,
  recommendationId,
  letterBody,
  letterColor,
  friendId,
  friendName,
}) {
  const body = { productId: Number(productId), letterBody }
  if (Number.isFinite(Number(recommendationId))) {
    body.recommendationId = Number(recommendationId)
  }
  if (letterColor) body.letterColor = String(letterColor).toUpperCase()
  if (Number.isFinite(Number(friendId))) body.friendId = Number(friendId)
  else if (friendName) body.friendName = friendName

  return apiRequest('/api/v1/gift', { method: 'POST', body: JSON.stringify(body) })
}

/** 초대 열람. 동의 전에는 `letterBody` 키 자체가 없음. 비회원 경로임. */
export function getInvitation(token) {
  return apiRequest(`/api/v1/invitations/${token}`)
}

/** 동의와 최초 열람 기록. 비회원 경로임. */
export function openInvitation(token) {
  return apiRequest(`/api/v1/invitations/${token}`, {
    method: 'POST',
    body: JSON.stringify({ privacyAgreed: true }),
  })
}

/** 받은 선물을 내 제품으로 등록함. 이 경로만 로그인이 필요함. */
export function registerInvitationOwned(token) {
  return apiRequest(`/api/v1/invitations/${token}/owned`, { method: 'POST' })
}

/** 초대 링크 전체 주소. 문자로 보낼 값임. */
export function buildInviteUrl(token) {
  return `${window.location.origin}/i/${token}`
}

export function buildSurveyUrl(path) {
  return `${window.location.origin}${path}`
}
