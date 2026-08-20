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
 * 같은 친구에게 다시 요청해도 기존 설문 토큰은 유지됨.
 * `colors`와 `styles`를 둘 다 끄면 `FRIEND400_4`임.
 */
export function issueSurvey(friendId, axes) {
  return apiRequest(`/api/v1/friends/${friendId}/survey`, {
    method: 'POST',
    body: JSON.stringify({ axes }),
  })
}

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
