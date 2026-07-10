const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export async function getActiveRentalsForUser(userId) {
  const response = await fetch(`${API_BASE_URL}/api/users/${userId}/rentals/active`)
  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.message || 'Failed to load rentals.')
  }

  return data
}