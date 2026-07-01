import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Checkout from './pages/Checkout'
import Signup from './pages/Signup'
import EmployeeBookings from './pages/EmployeeBookings'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/employee-bookings" element={<EmployeeBookings />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App