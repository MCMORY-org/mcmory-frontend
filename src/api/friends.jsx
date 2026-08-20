import { apiRequest, withFallback } from '@/api/client.jsx'
import {
  addFallbackFriend,
  getFallbackFriends,
  removeFallbackFriend,
  updateFallbackFriend,
} from '@/api/dummyData.js'

export function listFriends() {
  return withFallback(
    'GET /api/v1/friends',
    () => apiRequest('/api/v1/friends'),
    getFallbackFriends,
    { allowUnauthorized: true, useIfEmpty: true },
  )
}

export function createFriend({ name, phone }) {
  return withFallback(
    'POST /api/v1/friends',
    () =>
      apiRequest('/api/v1/friends', {
        method: 'POST',
        body: JSON.stringify({ name, phone }),
      }),
    () => addFallbackFriend({ name, phone }),
    { allowUnauthorized: true },
  )
}

export function updateFriend(id, { name, phone }) {
  return withFallback(
    `PATCH /api/v1/friends/${id}`,
    () =>
      apiRequest(`/api/v1/friends/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({ name, phone }),
      }),
    () => updateFallbackFriend(id, { name, phone }),
    { allowUnauthorized: true },
  )
}

export function deleteFriend(id) {
  const friendId = Number(id)

  return withFallback(
    'DELETE /api/v1/friends',
    () =>
      apiRequest('/api/v1/friends', {
        method: 'DELETE',
        body: JSON.stringify({ id: Number.isFinite(friendId) ? friendId : id }),
      }),
    () => removeFallbackFriend(id),
    { allowUnauthorized: true, allowNotFound: true },
  )
}

export function getFriendInitial(name) {
  const trimmed = String(name ?? '').trim()
  return trimmed ? trimmed[0] : '친'
}

/**
 * `HOME-02` 질문 선별 저장과 `Start-02` 설문 링크 발급. 한 번의 호출임.
 * 토큰은 멱등이라 축을 고쳐 다시 저장해도 이미 보낸 링크는 살아 있음.
 * `colors`와 `styles`를 둘 다 끄면 `FRIEND400_4`임.
 */
export function issueSurvey(friendId, axes) {
  return apiRequest(`/api/v1/friends/${friendId}/survey`, {
    method: 'POST',
    body: JSON.stringify({ axes }),
  })
}

/**
 * 친구를 등록하되 이미 있으면 그 친구를 돌려줌.
 * 전화번호 중복은 `FRIEND409_1`이고, 그때 목록에서 같은 번호를 찾음.
 */
export async function ensureFriend({ name, phone }) {
  const digits = String(phone).replace(/\D/g, '')

  try {
    const result = await apiRequest('/api/v1/friends', {
      method: 'POST',
      body: JSON.stringify({ name, phone: digits }),
    })
    return result.friend
  } catch (error) {
    if (error.code !== 'FRIEND409_1') throw error

    const { list } = await apiRequest('/api/v1/friends')
    const found = list.find(
      (friend) => String(friend.phone).replace(/\D/g, '') === digits,
    )
    if (!found) throw error
    return found
  }
}
