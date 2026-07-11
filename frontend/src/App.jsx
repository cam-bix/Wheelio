import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Settings from './pages/Settings'
import Book from './pages/Book'
import ChangeLocation from './pages/Changelocation'
import ModifyBooking from './pages/ModifyBooking'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/home" element={<Home />} />
        <Route path="/book/:vehicleId" element={<Book />} />
        <Route path="/change-location" element={<ChangeLocation />} />
        <Route path="/modify-booking" element={<ModifyBooking />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App