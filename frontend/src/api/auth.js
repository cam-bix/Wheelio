const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

async function postAuth(path, payload) {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || data.error || 'Authentication request failed.')
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
