import { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { verifyTwoFactorLogin } from '../api/auth'
import './Login.css'

function VerifyTwoFactor() {
  const location = useLocation()
  const navigate = useNavigate()
  const [email, setEmail] = useState(location.state?.email || '')
  const [code, setCode] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleCodeChange = (event) => {
    setCode(event.target.value.replace(/\D/g, '').slice(0, 6))
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError('')

    if (!email || code.length !== 6) {
      setError('Enter your email and 6-digit code.')
      return
    }

    setLoading(true)

    try {
      const user = await verifyTwoFactorLogin({ email, code })
      localStorage.setItem('wheelioUser', JSON.stringify(user))
      navigate(user.role === 'EMPLOYEE' || user.role === 'ADMIN' ? '/employee-home' : '/home')
    } catch (err) {
      setError(err.message || 'Invalid or expired verification code.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-logo">
          <div className="logo-badge">
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
            <svg className="speed-lines" width="20" height="14" viewBox="0 0 20 14" fill="none" aria-hidden="true">
              <path d="M0 3 H14" stroke="#e5212a" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M0 7 H18" stroke="#e5212a" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M0 11 H12" stroke="#e5212a" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            <span className="logo-text">
              Wheel<span className="logo-accent">io</span>
            </span>
          </div>
        </div>

        <h1 className="login-title">Verify code</h1>

        {error && <p className="login-error" role="alert">{error}</p>}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-group">
            <label htmlFor="two-factor-email">Email</label>
            <input
              id="two-factor-email"
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="two-factor-code">Verification code</label>
            <input
              id="two-factor-code"
              type="text"
              inputMode="numeric"
              value={code}
              onChange={handleCodeChange}
              autoComplete="one-time-code"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Verifying...' : 'Verify'}
          </button>
        </form>

        <p className="login-signup">
          <Link to="/login">Back to login</Link>
        </p>
      </div>
    </div>
  )
}

export default VerifyTwoFactor
