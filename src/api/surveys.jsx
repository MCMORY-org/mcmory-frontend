import { apiRequest } from '@/api/client.jsx'

/** 로그인 없이 설문 표시 정보를 조회함. */
export function getSurvey(token) {
  return apiRequest(`/api/v1/surveys/${token}`)
}

/** 발송자가 끈 축을 보내면 `FRIEND400_4`이므로 켠 축만 제출함. */
export function submitSurvey(token, { colors = [], styles = [], bags = [] }) {
  return apiRequest(`/api/v1/surveys/${token}`, {
    method: 'POST',
    body: JSON.stringify({ privacyAgreed: true, colors, styles, bags }),
  })
}
