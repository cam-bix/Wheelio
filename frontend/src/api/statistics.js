const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'

const getMonthLabel = (dateString) =>
new Date(dateString).toLocaleString('en-US', { month: 'short' })

const statusColor = (status) => {
    if (status === 'COMPLETED') return '#17652b'
        if (status === 'BOOKED') return '#b8860b'
            if (status === 'CANCELLED') return '#c0000a'
                return '#0f0f0f'
}

export async function getStatistics() {
    const [rentalsResponse, vehiclesResponse] = await Promise.all([
        fetch(`${API_BASE_URL}/api/rentals`),
                                                                  fetch(`${API_BASE_URL}/api/vehicles`),
    ])

    if (!rentalsResponse.ok) {
        throw new Error('Unable to load rentals.')
    }

    if (!vehiclesResponse.ok) {
        throw new Error('Unable to load vehicles.')
    }

    const rentals = await rentalsResponse.json()
    const vehicles = await vehiclesResponse.json()

    const completedRentals = rentals.filter((rental) => rental.status === 'COMPLETED')

    const months = [...new Set(completedRentals.map((rental) => getMonthLabel(rental.pickupDate)))]

    const bookingsOverTime = months.map((month) =>
    completedRentals.filter((rental) => getMonthLabel(rental.pickupDate) === month).length
    )

    const revenueOverview = months.map((month) =>
    completedRentals
    .filter((rental) => getMonthLabel(rental.pickupDate) === month)
    .reduce((sum, rental) => sum + Number(rental.totalCost || 0), 0)
    )

    const vehicleCounts = {}

    completedRentals.forEach((rental) => {
        vehicleCounts[rental.vehicleName] = (vehicleCounts[rental.vehicleName] || 0) + 1
    })

    const statusCounts = {}

    rentals.forEach((rental) => {
        statusCounts[rental.status] = (statusCounts[rental.status] || 0) + 1
    })

    return {
        vehiclesRented: {
            value: vehicles.filter((vehicle) => vehicle.status === 'RENTED').length,
            trendPct: 0,
        },
        vehicleIncidents: {
            value: vehicles.filter(
                (vehicle) =>
                vehicle.status === 'MAINTENANCE' ||
                vehicle.status === 'OUT_OF_SERVICE'
            ).length,
            trendPct: 0,
        },
        months,
        bookingsOverTime,
        revenueOverview,
        mostRentedVehicles: Object.entries(vehicleCounts).map(([label, value]) => ({
            label,
            value,
        })),
        bookingsByStatus: Object.entries(statusCounts).map(([label, value]) => ({
            label,
            value,
            color: statusColor(label),
        })),
    }
}
