import { Link, useNavigate } from 'react-router-dom'
import { useState } from 'react'
import { registerUser } from '../api/auth'
import { getRoleHomePath, storeUser } from '../auth/session'
import './Login.css'

function Signup() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
  })
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  const updateField = (field, value) => {
    setForm((current) => ({ ...current, [field]: value }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setSuccess('')

    if (!form.firstName || !form.lastName || !form.email || !form.password) {
      setError('Please fill in all required fields.')
      return
    }

    if (form.password.length < 8) {
      setError('Password must be at least 8 characters.')
      return
    }

    setLoading(true)

    try {
      const user = await registerUser(form)
      storeUser(user)
      setSuccess('Account created.')
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
      })
      navigate(getRoleHomePath(user))
    } catch (err) {
      setError(err.message || 'Signup failed. Please try again.')
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

        <h1 className="login-title">Sign up</h1>

        {error && <p className="login-error" role="alert">{error}</p>}
        {success && <p className="login-success" role="status">{success}</p>}

        <form onSubmit={handleSubmit} className="login-form" noValidate>
          <div className="form-row">
            <div className="form-group">
              <label htmlFor="firstName">First name</label>
              <input
                id="firstName"
                type="text"
                value={form.firstName}
                onChange={(e) => updateField('firstName', e.target.value)}
                autoComplete="given-name"
              />
            </div>

            <div className="form-group">
              <label htmlFor="lastName">Last name</label>
              <input
                id="lastName"
                type="text"
                value={form.lastName}
                onChange={(e) => updateField('lastName', e.target.value)}
                autoComplete="family-name"
              />
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              type="email"
              value={form.email}
              onChange={(e) => updateField('email', e.target.value)}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label htmlFor="phone">Phone</label>
            <input
              id="phone"
              type="tel"
              value={form.phone}
              onChange={(e) => updateField('phone', e.target.value)}
              autoComplete="tel"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={form.password}
              onChange={(e) => updateField('password', e.target.value)}
              autoComplete="new-password"
            />
          </div>

          <button type="submit" className="login-btn" disabled={loading}>
            {loading ? 'Creating account...' : 'Sign up'}
          </button>
        </form>

        <p className="login-signup">
          Already have an account? <Link to="/login">Log in</Link>
        </p>
      </div>
    </div>
  )
}

export default Signup
