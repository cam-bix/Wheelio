import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser } from '../api/auth'
import { getRoleHomePath, storeUser } from '../auth/session'
import './Login.css'
import wheelioLogo from '../assets/Wheelio_logo.png'


//The following is the login in page, the first thing the user sees wheen going on to Wheelio.
function Login() {
  const navigate = useNavigate()
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
      if (user.twoFactorRequired) {
        navigate('/verify-2fa', {
          state: { email: user.email || email },
        })
        return
      }

      storeUser(user)
      setSuccess('Logged in successfully.')
      navigate(getRoleHomePath(user))
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
          <img src={wheelioLogo} alt="Wheelio logo" className="login-logo-img" />
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
