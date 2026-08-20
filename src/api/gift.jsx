import { apiRequest } from '@/api/client.jsx'
import { API_BASE_URL } from '@/api/config.js'

/** 발송은 되돌릴 수 없음. */
export function sendGift({
  productId,
  recommendationId,
  letterBody,
  letterColor,
  letterImageUrls,
  friendId,
  friendName,
}) {
  const body = { productId: Number(productId), letterBody }
  if (letterImageUrls?.length > 0) body.letterImageUrls = letterImageUrls
  if (Number.isFinite(Number(recommendationId))) {
    body.recommendationId = Number(recommendationId)
  }
  if (letterColor) body.letterColor = String(letterColor).toUpperCase()
  if (Number.isFinite(Number(friendId))) body.friendId = Number(friendId)
  else if (friendName) body.friendName = friendName

  return apiRequest('/api/v1/gift', { method: 'POST', body: JSON.stringify(body) })
}

/**
 * 파일당 10MB 이하, 최대 5개의 JPEG·PNG·WebP·GIF만 허용함.
 * 반환된 URL만 `sendGift`의 `letterImageUrls`에 쓸 수 있음.
 */
export function uploadLetterImages(files) {
  const form = new FormData()
  files.forEach((file) => form.append('files', file))

  return apiRequest('/api/v1/gift/letter-images', { method: 'POST', body: form })
}

/** 로그인 없이 호출하며, 동의 전 응답에는 `letterBody` 키가 없음. */
export function getInvitation(token) {
  return apiRequest(`/api/v1/invitations/${token}`)
}

/** 로그인 없이 호출하며, 개인정보 동의와 최초 열람을 함께 기록함. */
export function openInvitation(token) {
  return apiRequest(`/api/v1/invitations/${token}`, {
    method: 'POST',
    body: JSON.stringify({ privacyAgreed: true }),
  })
}

/** 초대 관련 요청 중 이 요청만 로그인이 필요함. */
export function registerInvitationOwned(token) {
  return apiRequest(`/api/v1/invitations/${token}/owned`, { method: 'POST' })
}

export function resolveLetterImageUrl(url) {
  if (!url) return url
  return url.startsWith('/') ? `${API_BASE_URL}${url}` : url
}

export function buildInviteUrl(token) {
  return `${window.location.origin}/g/${token}`
}

export function buildSurveyUrl(path) {
  return `${window.location.origin}${path}`
}
