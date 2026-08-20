import { apiRequest } from '@/api/client.jsx'

/** `Start-01` 표시 정보. 비회원 경로임. */
export function getSurvey(token) {
  return apiRequest(`/api/v1/surveys/${token}`)
}

/**
 * `Start-02` 답변 제출. 비회원 경로임.
 * 발송자가 끈 축에 답을 담아 보내면 `FRIEND400_4`이므로 켠 축만 보낼 것.
 */
export function submitSurvey(token, { colors = [], styles = [], bags = [] }) {
  return apiRequest(`/api/v1/surveys/${token}`, {
    method: 'POST',
    body: JSON.stringify({ privacyAgreed: true, colors, styles, bags }),
  })
}
