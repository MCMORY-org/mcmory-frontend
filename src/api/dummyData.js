/**
 * 더미 데이터 — 폴백이 켜져 있을 때 이 파일의 값으로 화면을 채웁니다.
 * 목록·문구·매장 정보는 아래 상수만 수정하면 됩니다.
 */
import { ApiError } from '@/api/client.jsx'
import tracyVisetos from '@/assets/images/tracy-visetos.png'

const IMG = {
  tracy: tracyVisetos,
  shoulder: tracyVisetos,
  wallet: tracyVisetos,
  card: tracyVisetos,
  jacket: tracyVisetos,
  pants: tracyVisetos,
}

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
      imageUrl: IMG.tracy,
      productId: 101,
    },
  },
  {
    id: 2,
    createdAt: '2026-07-18T00:00:00',
    serialMemo: 'MX2024B102',
    source: 'SERIAL',
    product: {
      name: '비세토스 숄더백',
      imageUrl: IMG.shoulder,
      productId: 102,
    },
  },
  {
    id: 3,
    createdAt: '2026-06-02T00:00:00',
    serialMemo: 'MX2024C203',
    source: 'SERIAL',
    product: {
      name: '비세토스 오리지널 카드 반지갑',
      imageUrl: IMG.wallet,
      productId: 103,
    },
  },
]

export const DUMMY_LETTERS = {
  receivedUnopened: 2,
  received: [
    {
      id: 1,
      nickname: '민지',
      productName: 'Tracy 비세토스 크로스바디',
      productId: 101,
      imageUrl: IMG.tracy,
      letterBody:
        '생일 축하해! 네가 오래 쓸 수 있는 가방으로 골랐어. 함께한 순간들이 더 특별해지길 바라.',
      status: 'SENT',
      sentAt: '2026-08-12T00:00:00',
      openedAt: null,
    },
    {
      id: 2,
      nickname: '준호',
      productName: '비세토스 오리지널 카드 반지갑',
      productId: 103,
      imageUrl: IMG.wallet,
      letterBody: '승진 정말 축하해. 작은 선물이지만 매일 들고 다니며 응원하고 싶어.',
      status: 'SENT',
      sentAt: '2026-08-08T00:00:00',
      openedAt: null,
    },
    {
      id: 3,
      nickname: '서연',
      productName: '비세토스 숄더백',
      productId: 102,
      imageUrl: IMG.shoulder,
      letterBody: '졸업 축하해! 새로운 시작에 잘 어울릴 것 같아서 골랐어. 늘 응원할게.',
      status: 'OPENED',
      sentAt: '2026-07-21T00:00:00',
      openedAt: '2026-07-22T00:00:00',
    },
    {
      id: 4,
      nickname: '멋쟁이사자처럼',
      productName: 'Tracy 비세토스 크로스바디',
      productId: 101,
      imageUrl: IMG.tracy,
      letterBody: '프로젝트 끝까지 고생했어. 우리의 추억을 이 선물에 담아 보낼게.',
      status: 'OPENED',
      sentAt: '2026-06-30T00:00:00',
      openedAt: '2026-07-01T00:00:00',
    },
  ],
}

export const DUMMY_STYLING = {
  reasonSource: 'LLM',
  product: {
    name: 'Tracy 비세토스 크로스바디',
    imageUrl: IMG.tracy,
  },
  results: [
    {
      productId: 201,
      reason: '평소 ‘미니멀’ 스타일을 즐기시네요!',
      category: '가죽 소품',
      name: '미니 Aren 비세토스 카드 케이스',
      price: 290000,
      imageUrl: IMG.card,
      officialUrl: 'https://www.mcmworldwide.com/',
    },
    {
      productId: 202,
      reason: '모델이 함께 매치한 제품이에요!',
      category: 'WOMAN OUTER',
      name: '워싱 데님 재킷',
      price: 1250000,
      imageUrl: IMG.jacket,
      officialUrl: 'https://www.mcmworldwide.com/',
    },
    {
      productId: 203,
      reason: '모델이 함께 매치한 제품이에요!',
      category: 'WOMAN BOTTOM',
      name: '루렉스 데님 플레어 팬츠',
      price: 830000,
      imageUrl: IMG.pants,
      officialUrl: 'https://www.mcmworldwide.com/',
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
    address: '서울 강남구 압구정로 165',
    distanceKm: 1.2,
    closeTime: '20:00',
    repairAvailable: true,
    openNow: true,
    reservable: true,
    latitude: 37.5269,
    longitude: 127.0408,
  },
  {
    id: 2,
    name: 'MCM 갤러리아 명품관',
    address: '서울 강남구 압구정로 343',
    distanceKm: 2.8,
    closeTime: '20:30',
    repairAvailable: true,
    openNow: true,
    reservable: true,
    latitude: 37.5284,
    longitude: 127.0402,
  },
  {
    id: 3,
    name: 'MCM 신세계 강남',
    address: '서울 서초구 신반포로 176',
    distanceKm: 3.4,
    closeTime: '21:00',
    repairAvailable: false,
    openNow: true,
    reservable: true,
    latitude: 37.5046,
    longitude: 127.0042,
  },
  {
    id: 4,
    name: 'MCM 서초 서비스센터',
    address: '서울 서초구 서초대로 396',
    distanceKm: 4.1,
    closeTime: '19:00',
    repairAvailable: true,
    openNow: false,
    reservable: false,
    latitude: 37.4919,
    longitude: 127.0079,
  },
  {
    id: 5,
    name: 'MCM 롯데본점',
    address: '서울 중구 남대문로 81',
    distanceKm: 6.5,
    closeTime: '20:00',
    repairAvailable: true,
    openNow: true,
    reservable: true,
    latitude: 37.5647,
    longitude: 126.9816,
  },
]

export const DUMMY_USER = {
  name: '아기호저들',
  phone: '01011112222',
}

export const DUMMY_FRIENDS = [
  {
    id: 1,
    name: '민지',
    phone: '01012345678',
    tasteSummary: '미니멀 · 데일리',
  },
  {
    id: 2,
    name: '준호',
    phone: '01087654321',
    tasteSummary: '클래식 · 가죽',
  },
  {
    id: 3,
    name: '서연',
    phone: '01055556666',
    tasteSummary: '캐주얼 · 데님',
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
  const imageBySerial = {
    MX2024A031: IMG.tracy,
    MX2024B102: IMG.shoulder,
    MX2024C203: IMG.wallet,
  }
  const item = {
    id: nextId,
    createdAt: new Date().toISOString(),
    serialMemo: serial.trim(),
    source: 'SERIAL',
    product: {
      name: DUMMY_SERIAL_PRODUCTS[normalized] ?? serial.trim(),
      imageUrl: imageBySerial[normalized] ?? null,
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

export const TIME_SLOTS = [
  '10:00',
  '11:00',
  '13:00',
  '14:00',
  '15:00',
  '16:00',
  '17:00',
  '18:00',
  '19:00',
  '20:00',
]

const DEMO_BOOKED_SLOTS = new Set(['14:00', '16:00', '20:00'])

export function getFallbackStores({ repair = false, openNow = false, reservable = false } = {}) {
  let list = DUMMY_STORES

  if (repair) list = list.filter((store) => store.repairAvailable)
  if (openNow) list = list.filter((store) => store.openNow)
  if (reservable) list = list.filter((store) => store.reservable)

  return { list: list.map((store) => ({ ...store })), slots: null }
}

export function getFallbackSlots({ date } = {}) {
  const now = Date.now()
  const slots = TIME_SLOTS.map((slot) => {
    const [hour, minute] = slot.split(':').map(Number)
    const slotTime = new Date(`${date}T00:00:00`)
    if (Number.isNaN(slotTime.getTime())) {
      return { slot, state: 'AVAILABLE', reason: null }
    }
    slotTime.setHours(hour, minute, 0, 0)

    if (slotTime.getTime() <= now + 60 * 60 * 1000) {
      return { slot, state: 'DISABLED', reason: 'PAST' }
    }
    if (DEMO_BOOKED_SLOTS.has(slot)) {
      return { slot, state: 'DISABLED', reason: 'BOOKED' }
    }
    return { slot, state: 'AVAILABLE', reason: null }
  })

  return {
    list: DUMMY_STORES.map((store) => ({ ...store })),
    slots,
  }
}

export function addFallbackReservation() {
  return { ok: true, id: Date.now() }
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
