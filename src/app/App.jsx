import { Navigate, Route, Routes } from 'react-router-dom'

import AddPersonPage from '@/pages/AddPersonPage.jsx'
import ComponentTestPage from '@/pages/ComponentTestPage.jsx'
import GiftPage from '@/pages/GiftPage.jsx'
import InviteSentPage from '@/pages/InviteSentPage.jsx'
import LoadingPage from '@/pages/LoadingPage.jsx'
import LoginPage from '@/pages/LoginPage.jsx'
import MainPage from '@/pages/MainPage.jsx'
import MemoriesPage from '@/pages/MemoriesPage.jsx'
import MemoryDetailPage from '@/pages/MemoryDetailPage.jsx'
import MemoryPage from '@/pages/MemoryPage.jsx'
import MyPage from '@/pages/MyPage.jsx'
import OwnedPage from '@/pages/OwnedPage.jsx'
import OwnedDetailPage from '@/pages/OwnedDetailPage.jsx'
import OwnedStoresPage from '@/pages/OwnedStoresPage.jsx'
import RecommendPage from '@/pages/RecommendPage.jsx'
import RecommendQuestionsPage from '@/pages/RecommendQuestionsPage.jsx'
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
      <Route path="/recommend" element={<RecommendPage />} />
      <Route path="/recommend/questions" element={<RecommendQuestionsPage />} />
      <Route path="/recommend/list" element={<Navigate to="/gift" replace />} />
      <Route path="/gift" element={<GiftPage />} />
      <Route path="/memories" element={<MemoriesPage />} />
      <Route path="/memories/:memoryId" element={<MemoryDetailPage />} />
      <Route path="/owned" element={<OwnedPage />} />
      <Route path="/owned/:productId" element={<OwnedDetailPage />} />
      <Route path="/owned/:productId/stores" element={<OwnedStoresPage />} />
      <Route path="/memory" element={<MemoryPage />} />
      <Route path="/memory/sent" element={<InviteSentPage />} />
      <Route path="/my" element={<MyPage />} />
      <Route path="/my/add" element={<AddPersonPage />} />
      <Route path="/my/edit" element={<AddPersonPage />} />
      <Route path="/recommend/people" element={<Navigate to="/my" replace />} />
    </Routes>
  )
}

export default App
