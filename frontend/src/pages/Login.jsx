import { useState } from 'react'
import { Link } from 'react-router-dom'
import { loginUser } from '../api/auth'
import './Login.css'


//The following is the login in page, the first thing the user sees wheen going on to Wheelio.
function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!email || !password) {
      setError('Please fill in all fields.')
      return
    }

    setLoading(true)

    try {
      const user = await loginUser({ email, password })
      localStorage.setItem('wheelioUser', JSON.stringify(user))
      setSuccess('Logged in successfully.')
    } catch (err) {
      setError(err.message || 'Invalid email or password.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">

        {/* Logo */}
        <div className="login-logo">
          <div className="logo-badge">
            {/* Wheel icon (inline SVG) */}
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <circle cx="14" cy="14" r="13" stroke="white" strokeWidth="2" />
              <circle cx="14" cy="14" r="4" fill="white" />
              <line x1="14" y1="1" x2="14" y2="9" stroke="white" strokeWidth="2" />
              <line x1="14" y1="19" x2="14" y2="27" stroke="white" strokeWidth="2" />
              <line x1="1" y1="14" x2="9" y2="14" stroke="white" strokeWidth="2" />
              <line x1="19" y1="14" x2="27" y2="14" stroke="white" strokeWidth="2" />
              <line x1="4" y1="4" x2="9.9" y2="9.9" stroke="white" strokeWidth="2" />
              <line x1="18.1" y1="18.1" x2="24" y2="24" stroke="white" strokeWidth="2" />
              <line x1="24" y1="4" x2="18.1" y2="9.9" stroke="white" strokeWidth="2" />
              <line x1="9.9" y1="18.1" x2="4" y2="24" stroke="white" strokeWidth="2" />
            </svg>
            {/* Speed lines */}
            <svg className="speed-lines" width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
              <path d="M0 3 H14" stroke="#e5212a" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M0 7 H18" stroke="#e5212a" strokeWidth="2.5" strokeLinecap="round"/>
              <path d="M0 11 H12" stroke="#e5212a" strokeWidth="2.5" strokeLinecap="round"/>
            </svg>
            <span className="logo-text">
              Wheel<span className="logo-accent">io</span>
            </span>
          </div>
        </div>

        <h1 className="login-title">Log in</h1>

        {error && <p className="login-error" role="alert">{error}</p>}
        {success && <p className="login-success" role="status">{success}</p>}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder=""
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder=""
              autoComplete="current-password"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Log in'}
          </button>
        </form>

        <p className="login-signup">
          Don&apos;t have an account?{' '}
          <Link to="/signup">Sign Up</Link>
        </p>
      </div>
    </div>
  )
}

export default Login
