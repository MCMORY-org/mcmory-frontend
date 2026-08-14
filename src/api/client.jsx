const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'https://api.cartlab.store'

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
        ...(options.body ? { 'Content-Type': 'application/json' } : {}),
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
