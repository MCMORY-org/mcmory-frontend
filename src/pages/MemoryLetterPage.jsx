import { Navigate, useLocation, useParams } from 'react-router-dom'

function MemoryLetterPage() {
  const { memoryId } = useParams()
  const location = useLocation()

  return (
    <Navigate
      to={`/memories/${memoryId}`}
      replace
      state={{ ...location.state, letterOpen: true }}
    />
  )
}

export default MemoryLetterPage
