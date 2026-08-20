import { API_BASE_URL, USE_FALLBACK } from '@/api/config.js'

export class ApiError extends Error {
  constructor({ message, code = 'UNKNOWN', status = 0, cause }) {
    super(message, { cause })
    this.name = 'ApiError'
    this.code = code
    this.status = status
  }
}

function isApiEnvelope(data) {
  return (
    data !== null &&
    typeof data === 'object' &&
    typeof data.isSuccess === 'boolean' &&
    typeof data.code === 'string' &&
    typeof data.message === 'string' &&
    Object.hasOwn(data, 'result')
  )
}

export async function apiRequest(path, options = {}) {
  let response

  try {
    response = await fetch(`${API_BASE_URL}${path}`, {
      ...options,
      credentials: 'include',
      headers: {
        Accept: 'application/json',
        // FormData는 브라우저가 boundary를 붙여야 해서 Content-Type을 직접 넣지 않음
        ...(options.body && !(options.body instanceof FormData)
          ? { 'Content-Type': 'application/json' }
          : {}),
        ...options.headers,
      },
    })
  } catch (cause) {
    throw new ApiError({
      code: 'NETWORK_ERROR',
      message: '서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.',
      cause,
    })
  }

  let data
  try {
    data = await response.json()
  } catch (cause) {
    console.error('API returned a non-JSON response.', { path, status: response.status })
    throw new ApiError({
      code: 'INVALID_SERVER_RESPONSE',
      status: response.status,
      message: '서버 응답을 처리할 수 없습니다.',
      cause,
    })
  }

  if (!isApiEnvelope(data)) {
    console.error('API returned an invalid response envelope.', { path, status: response.status, data })
    throw new ApiError({
      code: 'INVALID_SERVER_RESPONSE',
      status: response.status,
      message: '서버 응답 형식이 올바르지 않습니다.',
    })
  }

  if (!response.ok || !data.isSuccess) {
    throw new ApiError({ code: data.code, status: response.status, message: data.message })
  }

  return data.result
}

export function isUnauthorized(error) {
  return error instanceof ApiError && error.code === 'AUTH401_1'
}

export function isServerUnavailable(error) {
  if (!(error instanceof ApiError)) return true
  if (isUnauthorized(error)) return false

  return (
    error.code === 'NETWORK_ERROR' ||
    error.code === 'INVALID_SERVER_RESPONSE' ||
    error.status === 0 ||
    error.status >= 500
  )
}

function isEmptyCollection(result) {
  if (result == null) return true
  if (Array.isArray(result)) return result.length === 0

  const collectionKeys = ['list', 'received', 'results', 'items']
  const present = collectionKeys.filter((key) => Array.isArray(result[key]))
  if (present.length === 0) return false
  return present.every((key) => result[key].length === 0)
}

export async function withFallback(
  label,
  request,
  fallback,
  { allowUnauthorized = false, useIfEmpty = false, allowNotFound = false } = {},
) {
  if (!USE_FALLBACK) return request()

  try {
    const result = await request()
    if (useIfEmpty && isEmptyCollection(result)) {
      console.warn(`[API] ${label} 빈 응답, 더미 데이터로 표시합니다.`)
      return typeof fallback === 'function' ? fallback() : fallback
    }
    return result
  } catch (error) {
    const canFallback =
      isServerUnavailable(error) ||
      (allowUnauthorized && isUnauthorized(error)) ||
      (allowNotFound && (error.status === 404 || String(error.code ?? '').includes('404')))
    if (!canFallback) throw error
    console.warn(`[API] ${label} 실패, 더미 데이터로 표시합니다.`, error)
    return typeof fallback === 'function' ? fallback() : fallback
  }
}
