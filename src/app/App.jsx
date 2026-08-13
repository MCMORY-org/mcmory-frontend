import { Navigate, Route, Routes } from 'react-router-dom'

import ComponentTestPage from '@/pages/ComponentTestPage.jsx'
import LoadingPage from '@/pages/LoadingPage.jsx'
import LoginPage from '@/pages/LoginPage.jsx'
import MainPage from '@/pages/MainPage.jsx'
import SignupPage from '@/pages/SignupPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/main" replace />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/loading" element={<LoadingPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/test" element={<ComponentTestPage />} />
    </Routes>
  )
}

export default App
