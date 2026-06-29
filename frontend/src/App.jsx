import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Login from './pages/Login'
import Checkout from './pages/Checkout'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/login" element={<Login />} />
        <Route path="/checkout" element={<Checkout />} />

        {/* More routes in the future such as sign up and dashboard
        */}

      </Routes>
    </BrowserRouter>
  )
}

export default App
