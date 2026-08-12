import { Navigate, Route, Routes } from 'react-router-dom'

import ComponentTestPage from '@/pages/ComponentTestPage.jsx'
import LoadingPage from '@/pages/LoadingPage.jsx'
import MainPage from '@/pages/MainPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/main" replace />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/loading" element={<LoadingPage />} />
      <Route path="/test" element={<ComponentTestPage />} />
    </Routes>
  )
}

export default App