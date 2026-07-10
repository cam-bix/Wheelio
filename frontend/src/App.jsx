
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Signup from './pages/Signup'
import EmployeeBookings from './pages/EmployeeBookings'
import EmployeeStatistics from './pages/EmployeeStatistics'

// -v--Employee pages that are not yet implemented--v-
//import EmployeeHome from './pages/EmployeeHome'
//import EmployeeInventory from './pages/EmployeeInventory'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/employee-bookings" element={<EmployeeBookings />} />
        <Route path="/employee-stats" element={<EmployeeStatistics />} />
        {/* -v--Employee pages that are not yet implemented--v-
        <Route path="/employee-inventory" element={<EmployeeInventory />} />
        <Route path="/employee-home" element={<EmployeeHome />} />
        <Route path="/Home" element={<Home />} /> 
      </Routes>
    </BrowserRouter>
  )
}

export default App
