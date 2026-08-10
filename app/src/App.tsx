// import { useState } from 'react'
import { Navbar } from './pages/Navbar'
import { Evaluate } from './pages/Evaluate'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Dashboard } from './pages/Dashboard'
import BatchEvaluate from './pages/BatchEvaluate'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Evaluate />} />
        <Route path="/evaluate" element={<Dashboard />} />
        <Route path='/batchevaluate' element={<BatchEvaluate />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
