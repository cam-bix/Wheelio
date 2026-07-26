const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

async function parseResponse(response, fallbackMessage) {
  const data = await response.json().catch(() => ({}))

  if (!response.ok) {
    throw new Error(data.message || data.error || fallbackMessage)
  }

  return data
}

export async function getActiveRentalsForUser(userId) {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/rentals/active`)
  return parseResponse(response, 'Failed to load rentals.')
}

export async function createRental(payload) {
  const response = await fetch(`${API_BASE_URL}/api/rentals`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return parseResponse(response, 'Failed to create rental.')
}

export async function cancelRental(rentalId) {
  const response = await fetch(`${API_BASE_URL}/api/rentals/${rentalId}/cancel`, {
    method: 'PATCH',
  })

  return parseResponse(response, 'Failed to cancel rental.')
}

export async function updateRentalDates(rentalId, payload) {
  const response = await fetch(`${API_BASE_URL}/api/rentals/${rentalId}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(payload),
  })

  return parseResponse(response, 'Failed to update rental.')
}
