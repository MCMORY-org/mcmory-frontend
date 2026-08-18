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
  return withFallback(
    'DELETE /api/v1/friends',
    () =>
      apiRequest('/api/v1/friends', {
        method: 'DELETE',
        body: JSON.stringify({ id }),
      }),
    () => removeFallbackFriend(id),
    { allowUnauthorized: true },
  )
}

export function getFriendInitial(name) {
  const trimmed = String(name ?? '').trim()
  return trimmed ? trimmed[0] : '친'
}
