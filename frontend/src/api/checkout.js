const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export async function createCheckoutSession(vehicleId, days) {
  const response = await fetch(`${API_BASE_URL}/api/checkout/session`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ vehicleId, days }),
  })

  if (!response.ok) {
    throw new Error('Unable to start checkout.')
  }

  return response.json()
}