const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

function getErrorMessage(data) {
  if (data.message) return data.message
  if (data.error) return data.error
  if (data.detail) return data.detail
  if (data.title) return data.title

  if (Array.isArray(data.errors) && data.errors.length > 0) {
    return data.errors
      .map((error) => error.defaultMessage || error.message)
      .filter(Boolean)
      .join(' ')
  }

  return 'Authentication request failed.'
}

async function postAuth(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(getErrorMessage(data))
  }

  return data
}

export function loginUser(credentials) {
  return postAuth('/api/auth/login', credentials)
}

export function verifyTwoFactorLogin(payload) {
  return postAuth('/api/auth/verify-2fa', payload)
}

export function registerUser(user) {
  return postAuth('/api/auth/register', user)
}
