/**
 * 더미 데이터 — 폴백이 켜져 있을 때 이 파일의 값으로 화면을 채웁니다.
 * 목록·문구·매장 정보는 아래 상수만 수정하면 됩니다.
 */
import { ApiError } from '@/api/client.jsx'

export const DUMMY_SERIAL_PRODUCTS = {
  MX2024A031: 'Tracy 비세토스 크로스바디',
  MX2024B102: '비세토스 숄더백',
  MX2024C203: '비세토스 오리지널 카드 반지갑',
}

export const DUMMY_OWNED = [
  {
    id: 1,
    createdAt: '2026-08-06T00:00:00',
    serialMemo: 'MX2024A031',
    source: 'SERIAL',
    product: {
      name: 'Tracy 비세토스 크로스바디',
      imageUrl: null,
      productId: 101,
    },
  },
  {
    id: 2,
    createdAt: '2026-08-06T00:00:00',
    serialMemo: 'MX2024B102',
    source: 'SERIAL',
    product: {
      name: '비세토스 숄더백',
      imageUrl: null,
      productId: 102,
    },
  },
]

export const DUMMY_LETTERS = {
  receivedUnopened: 2,
  received: [
    {
      id: 1,
      nickname: '아기호저들',
      productName: 'Tracy 비세토스 크로스바디',
      productId: 101,
      status: 'SENT',
      sentAt: '2026-08-06T00:00:00',
      openedAt: null,
    },
    {
      id: 2,
      nickname: '아기호저들',
      productName: '비세토스 오리지널 카드 반지갑',
      productId: 103,
      status: 'SENT',
      sentAt: '2025-08-06T00:00:00',
      openedAt: null,
    },
    {
      id: 3,
      nickname: '멋쟁이사자처럼',
      productName: 'Tracy 비세토스 크로스바디',
      productId: 101,
      status: 'OPENED',
      sentAt: '2026-08-06T00:00:00',
      openedAt: '2026-08-07T00:00:00',
    },
  ],
}

export const DUMMY_STYLING = {
  reasonSource: 'LLM',
  product: {
    name: 'Tracy 비세토스 크로스바디',
    imageUrl: null,
  },
  results: [
    {
      productId: 201,
      reason: '평소 ‘미니멀’ 스타일을 즐기시네요!',
      category: '가죽 소품',
      name: '미니 Aren 비세토스 카드 케이스',
      price: 290000,
      imageUrl: null,
      officialUrl: null,
    },
    {
      productId: 202,
      reason: '모델이 함께 매치한 제품이에요!',
      category: 'WOMAN OUTER',
      name: '워싱 데님 재킷',
      price: 1250000,
      imageUrl: null,
      officialUrl: null,
    },
    {
      productId: 203,
      reason: '모델이 함께 매치한 제품이에요!',
      category: 'WOMAN BOTTOM',
      name: '루렉스 데님 플레어 팬츠',
      price: 830000,
      imageUrl: null,
      officialUrl: null,
    },
  ],
}

export const DUMMY_CARE_GUIDE = {
  items: [
    '가죽 제품은 물에 취약합니다. 물에 닿지 않도록 노력해주세요.',
    '혹시 제품에 물이 닿았다면 부드러운 천으로 닦아내시고 가까운 매장으로 방문해주세요.',
    '제품에 이상이 생길 경우, 선물 이후 1년 이내의 제품은 무상 서비스 대상입니다. 그 이외는 추가 요금이 발생될 수 있습니다.',
  ],
}

export const DUMMY_STORES = [
  {
    id: 1,
    name: 'MCM 강남 본점',
    address: '서울 강남구 압구정로',
    distanceKm: 1.2,
    closeTime: '20:00',
    repairAvailable: true,
    openNow: true,
    reservable: true,
  },
  {
    id: 2,
    name: 'MCM 갤러리아 명품관',
    address: '서울 강남구 압구정로',
    distanceKm: 2.8,
    closeTime: '20:30',
    repairAvailable: true,
    openNow: true,
    reservable: true,
  },
  {
    id: 3,
    name: 'MCM 서초 서비스센터',
    address: '서울 서초구 서초대로',
    distanceKm: 4.1,
    closeTime: '19:00',
    repairAvailable: true,
    openNow: true,
    reservable: true,
  },
]

export const DUMMY_USER = {
  name: '아기호저들',
  phone: '',
}

export const DUMMY_FRIENDS = [
  {
    id: 1,
    name: '친구 2',
    phone: '01012345678',
    tasteSummary: '',
  },
]

function cloneOwnedList(list) {
  return list.map((item) => ({
    ...item,
    product: item.product ? { ...item.product } : null,
  }))
}

let fallbackOwned = cloneOwnedList(DUMMY_OWNED)

export function getFallbackOwned() {
  return { list: cloneOwnedList(fallbackOwned) }
}

export function addFallbackOwned(serial) {
  const normalized = serial.trim().toUpperCase()
  const alreadyOwned = fallbackOwned.some(
    (item) => (item.serialMemo ?? '').toUpperCase() === normalized,
  )

  if (alreadyOwned) {
    throw new ApiError({
      code: 'OWNED409_1',
      status: 409,
      message: '이미 등록된 제품입니다.',
    })
  }

  const nextId = Math.max(0, ...fallbackOwned.map((item) => Number(item.id) || 0)) + 1
  const item = {
    id: nextId,
    createdAt: new Date().toISOString(),
    serialMemo: serial.trim(),
    source: 'SERIAL',
    product: {
      name: DUMMY_SERIAL_PRODUCTS[normalized] ?? serial.trim(),
      imageUrl: null,
      productId: nextId,
    },
  }

  fallbackOwned = [item, ...fallbackOwned]
  return item
}

export function removeFallbackOwned(id) {
  fallbackOwned = fallbackOwned.filter((item) => item.id !== id)
  return { id }
}

export function getFallbackLetters() {
  return {
    receivedUnopened: DUMMY_LETTERS.receivedUnopened,
    received: DUMMY_LETTERS.received.map((item) => ({ ...item })),
  }
}

export function getFallbackStyling() {
  return {
    ...DUMMY_STYLING,
    product: { ...DUMMY_STYLING.product },
    results: DUMMY_STYLING.results.map((item) => ({ ...item })),
  }
}

export function getFallbackCareGuide() {
  return { items: [...DUMMY_CARE_GUIDE.items] }
}

export function getFallbackStores({ repair = false, openNow = false, reservable = false } = {}) {
  let list = DUMMY_STORES

  if (repair) list = list.filter((store) => store.repairAvailable)
  if (openNow) list = list.filter((store) => store.openNow)
  if (reservable) list = list.filter((store) => store.reservable)

  return { list: list.map((store) => ({ ...store })) }
}

export function getFallbackAuthResult(payload = {}) {
  return {
    user: {
      name: payload.name ?? DUMMY_USER.name,
      phone: payload.phone ?? DUMMY_USER.phone,
    },
  }
}

export function getFallbackMe() {
  return {
    member: {
      id: 1,
      name: DUMMY_USER.name,
    },
  }
}

function cloneFriends(list) {
  return list.map((item) => ({ ...item }))
}

function normalizePhoneDigits(phone) {
  return String(phone ?? '').replace(/\D/g, '')
}

let fallbackFriends = cloneFriends(DUMMY_FRIENDS)

export function getFallbackFriends() {
  return { list: cloneFriends(fallbackFriends) }
}

export function addFallbackFriend({ name, phone }) {
  const trimmedName = String(name ?? '').trim()
  const digits = normalizePhoneDigits(phone)

  if (!trimmedName || trimmedName.length > 20) {
    throw new ApiError({
      code: 'FRIEND400_1',
      status: 400,
      message: '이름은 1자에서 20자까지 입력해주세요',
    })
  }

  if (!/^010\d{7,8}$/.test(digits)) {
    throw new ApiError({
      code: 'FRIEND400_2',
      status: 400,
      message: '전화번호 형식을 확인해주세요',
    })
  }

  if (fallbackFriends.some((item) => item.phone === digits)) {
    throw new ApiError({
      code: 'FRIEND409_1',
      status: 409,
      message: '이미 등록한 친구의 전화번호입니다',
    })
  }

  const nextId = Math.max(0, ...fallbackFriends.map((item) => Number(item.id) || 0)) + 1
  const friend = {
    id: nextId,
    name: trimmedName,
    phone: digits,
    tasteSummary: '',
  }

  fallbackFriends = [...fallbackFriends, friend]
  return { ok: true, friend: { ...friend } }
}

export function updateFallbackFriend(id, { name, phone }) {
  const trimmedName = String(name ?? '').trim()
  const digits = normalizePhoneDigits(phone)
  const target = fallbackFriends.find((item) => item.id === id)

  if (!target) {
    throw new ApiError({
      code: 'FRIEND404_1',
      status: 404,
      message: '친구 정보를 찾을 수 없습니다',
    })
  }

  if (!trimmedName || trimmedName.length > 20) {
    throw new ApiError({
      code: 'FRIEND400_1',
      status: 400,
      message: '이름은 1자에서 20자까지 입력해주세요',
    })
  }

  if (!digits) {
    throw new ApiError({
      code: 'FRIEND400_2',
      status: 400,
      message: '전화번호 형식을 확인해주세요',
    })
  }

  if (target.phone !== digits) {
    throw new ApiError({
      code: 'FRIEND409_2',
      status: 409,
      message: '전화번호가 다른 친구는 새로 등록해주세요',
    })
  }

  fallbackFriends = fallbackFriends.map((item) =>
    item.id === id ? { ...item, name: trimmedName } : item,
  )

  return {
    ok: true,
    friend: {
      id,
      name: trimmedName,
      phone: target.phone,
    },
  }
}

export function removeFallbackFriend(id) {
  const target = fallbackFriends.find((item) => item.id === id)

  if (!target) {
    throw new ApiError({
      code: 'FRIEND404_1',
      status: 404,
      message: '친구 정보를 찾을 수 없습니다',
    })
  }

  fallbackFriends = fallbackFriends.filter((item) => item.id !== id)
  return { ok: true }
}
