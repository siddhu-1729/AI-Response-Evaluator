// import { useState } from 'react'
import { Navbar } from './components/Navbar'
import { Evaluate } from './components/Evaluate'
import './App.css'
import { Navigate, Route, Routes } from 'react-router-dom'
import { Dashboard } from './components/Dashboard'

function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Evaluate />} />
        <Route path="/evaluate" element={<Dashboard />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}

export default App
