const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export async function getVehicles() {
  const response = await fetch(`${API_BASE_URL}/api/vehicles`)

  const data = await response.json().catch(() => [])

  if (!response.ok) {
    throw new Error(
      data.message || data.error || 'Unable to load vehicles.'
    )
  }

  return data
}

export async function getVehicleById(id) {
  const response = await fetch(`${API_BASE_URL}/api/vehicles/${id}`)

  if (!response.ok) {
    throw new Error('Unable to load vehicle details.')
  }

  return response.json()
}
