import { Navigate, Route, Routes } from 'react-router-dom'

import LoadingPage from '@/pages/LoadingPage.jsx'
import MainPage from '@/pages/MainPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/main" replace />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/loading" element={<LoadingPage />} />
    </Routes>
  )
}

export default App
