import { Route, Routes } from 'react-router-dom'

import ComponentTestPage from '@/pages/ComponentTestPage.jsx'

function App() {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <main className="flex min-h-dvh items-center justify-center bg-background">
            <h1 className="text-main text-primary-dark-hover">MCMORY</h1>
          </main>
        }
      />
      <Route path="/test" element={<ComponentTestPage />} />
    </Routes>
  )
}

export default App
