import { Navigate, Route, Routes } from 'react-router-dom'

import LoadingPage from '@/pages/LoadingPage.jsx'
import MainPage from '@/pages/MainPage.jsx'
import GiftPage from '@/pages/GiftPage.jsx'
import PeoplePage from '@/pages/PeoplePage.jsx'
import RecommendPage from '@/pages/RecommendPage.jsx'
import RecommendQuestionsPage from '@/pages/RecommendQuestionsPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/main" replace />} />
      <Route path="/main" element={<MainPage />} />
      <Route path="/loading" element={<LoadingPage />} />
      <Route path="/recommend" element={<RecommendPage />} />
      <Route path="/recommend/questions" element={<RecommendQuestionsPage />} />
      <Route path="/recommend/list" element={<Navigate to="/gift" replace />} />
      <Route path="/gift" element={<GiftPage />} />
      <Route path="/recommend/people" element={<PeoplePage />} />
    </Routes>
  )
}

export default App
