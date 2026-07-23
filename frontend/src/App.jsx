import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import VerifyTwoFactor from './pages/VerifyTwoFactor'
import EmployeeBookings from './pages/EmployeeBookings'
import EmployeeStatistics from './pages/EmployeeStatistics'
import EmployeeHome from './pages/EmployeeHome'
import EmployeeInventory from './pages/EmployeeInventory'
import Settings from './pages/Settings'
import ReserveVehicles from './pages/ReserveVehicles'
import Book from './pages/Book'
import ChangeLocation from './pages/Changelocation'
import ModifyBooking from './pages/ModifyBooking'
import RoleRoute, { RoleHomeRedirect } from './auth/RoleRoute'

function App() {
  const customerRoute = (element) => (
    <RoleRoute allow="customer">{element}</RoleRoute>
  )

  const employeeRoute = (element) => (
    <RoleRoute allow="employee">{element}</RoleRoute>
  )

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<RoleHomeRedirect />} />
        <Route path="/home" element={customerRoute(<Home />)} />
        <Route path="/login" element={<Login />} />
        <Route path="/verify-2fa" element={<VerifyTwoFactor />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/settings" element={customerRoute(<Settings />)} />
        <Route path="/book" element={customerRoute(<ReserveVehicles />)} />
        <Route path="/book/:vehicleId" element={customerRoute(<Book />)} />
        <Route path="/change-location" element={customerRoute(<ChangeLocation />)} />
        <Route path="/modify-booking" element={customerRoute(<ModifyBooking />)} />
        <Route path="/employee-bookings" element={employeeRoute(<EmployeeBookings />)} />
        <Route path="/employee-stats" element={employeeRoute(<EmployeeStatistics />)} />
        <Route path="/employee-inventory" element={employeeRoute(<EmployeeInventory />)} />
        <Route path="/employee-home" element={employeeRoute(<EmployeeHome />)} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
