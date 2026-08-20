import { apiRequest } from '@/api/client.jsx'
import { API_BASE_URL } from '@/api/config.js'

/** 선물 발송. 응답 토큰으로 초대 주소를 만듦. 되돌릴 수 없음. */
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
 * 편지 사진 업로드임. 파트 이름은 `files`이고 장당 10MB 이하, 최대 5장,
 * jpeg·png·webp·gif만 받음. 여기서 받은 URL만 `sendGift`의 `letterImageUrls`에 실을 수 있음.
 */
export function uploadLetterImages(files) {
  const form = new FormData()
  files.forEach((file) => form.append('files', file))

  return apiRequest('/api/v1/gift/letter-images', { method: 'POST', body: form })
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

/** 사진은 서버가 서빙함. `/letter-images/...`는 프론트 오리진이 아니라 API 주소 기준임 */
export function resolveLetterImageUrl(url) {
  if (!url) return url
  return url.startsWith('/') ? `${API_BASE_URL}${url}` : url
}

/** 초대 링크 전체 주소. 문자로 보낼 값임. 웹 링크 경로는 `/g/{token}`이 계약임(명세서 0장) */
export function buildInviteUrl(token) {
  return `${window.location.origin}/g/${token}`
}

export function buildSurveyUrl(path) {
  return `${window.location.origin}${path}`
}
