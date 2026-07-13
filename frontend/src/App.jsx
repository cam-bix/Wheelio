
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import EmployeeBookings from './pages/EmployeeBookings'
import EmployeeStatistics from './pages/EmployeeStatistics'
import EmployeeHome from './pages/EmployeeHome'
import EmployeeInventory from './pages/EmployeeInventory'
import Settings from './pages/Settings'
import ReserveVehicles from './pages/ReserveVehicles'
import Book from './pages/Book'
import ChangeLocation from './pages/Changelocation'
import ModifyBooking from './pages/ModifyBooking'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/home" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/book" element={<ReserveVehicles />} />
        <Route path="/book/:vehicleId" element={<Book />} />
        <Route path="/change-location" element={<ChangeLocation />} />
        <Route path="/modify-booking" element={<ModifyBooking />} />
        <Route path="/employee-bookings" element={<EmployeeBookings />} />
        <Route path="/employee-stats" element={<EmployeeStatistics />} />
        <Route path="/employee-inventory" element={<EmployeeInventory />} />
        <Route path="/employee-home" element={<EmployeeHome />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
