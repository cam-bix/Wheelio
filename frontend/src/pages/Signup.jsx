import { Link } from 'react-router-dom'
import { useState } from 'react'
import { registerUser } from '../api/auth'
import './Login.css'
import wheelioLogo from '../assets/Wheelio_logo.png'

function Signup() {
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
      await registerUser(form)
      localStorage.removeItem('wheelioUser')
      setSuccess('Account created. You can log in now.')
      setForm({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        password: '',
      })
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
          <img src={wheelioLogo} alt="Wheelio logo" className="login-logo-img" />
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
