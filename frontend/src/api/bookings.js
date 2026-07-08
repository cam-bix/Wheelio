const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

export async function getBookings() {
    const response = await fetch(`${API_BASE_URL}/api/rentals`)

    const data = await response.json().catch(() => [])

    if (!response.ok) {
        throw new Error(data.message || data.error || 'Unable to load bookings.')
    }

    return data.map((rental) => ({
        id: String(rental.rentalId),
        customer: rental.customerName,
        vehicle: rental.vehicleName,
        pickupDate: new Date(rental.pickupDate).toLocaleDateString(),
        returnDate: new Date(rental.returnDate).toLocaleDateString(),
        status: rental.status,
        image: '',
    }))
}
