import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { clearStoredUser, getStoredUser } from '../utils/userSession'
import './AuthStatus.css'

function getDisplayName(user, fallbackName) {
  return fallbackName || user?.firstName || user?.email || 'User'
}

function AuthStatus({
  user,
  displayName,
  variant = 'dashboard',
  loggedOutPath = '/home',
}) {
  const navigate = useNavigate()
  const [loggedOut, setLoggedOut] = useState(false)
  const currentUser = loggedOut
    ? null
    : user === undefined
      ? getStoredUser()
      : user
  const isNavbar = variant === 'navbar'

  function handleLogout() {
    clearStoredUser()
    setLoggedOut(true)
    navigate(loggedOutPath, { replace: true })
  }

  if (!currentUser) {
    if (isNavbar) {
      return (
        <div className="navbar-user">
          <Link to="/login" className="auth-status__link auth-status__link--dark">
            Sign In
          </Link>
        </div>
      )
    }

    return (
      <div className="dashboard-user">
        <div className="dashboard-user__icon" aria-hidden="true"></div>
        <Link to="/login" className="dashboard-user__link">
          Sign In
        </Link>
      </div>
    )
  }

  if (isNavbar) {
    return (
      <div className="navbar-user auth-status auth-status--navbar">
        <div className="user-icon" aria-hidden="true">
          <UserIcon />
        </div>
        <span className="username">{getDisplayName(currentUser, displayName)}</span>
        <button
          type="button"
          className="auth-status__logout auth-status__logout--light"
          onClick={handleLogout}
        >
          Log Out
        </button>
      </div>
    )
  }

  return (
    <div className="dashboard-user auth-status">
      <div className="dashboard-user__icon" aria-hidden="true"></div>
      <span>{getDisplayName(currentUser, displayName)}</span>
      <button
        type="button"
        className="auth-status__logout"
        onClick={handleLogout}
      >
        Log Out
      </button>
    </div>
  )
}

function UserIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
      <circle cx="12" cy="8" r="4" stroke="#0f0f0f" strokeWidth="1.6" />
      <path
        d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"
        stroke="#0f0f0f"
        strokeWidth="1.6"
        strokeLinecap="round"
      />
    </svg>
  )
}

export default AuthStatus
