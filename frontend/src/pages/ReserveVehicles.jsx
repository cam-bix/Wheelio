import './ReserveVehicles.css'
import carPlaceholder from '../assets/placeholder_image.jpg'
import wheelioLogo from '../assets/Wheelio_logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getVehicles } from '../api/vehicles'
import { getAllRentals } from '../api/rentals'
import { getStoredUser, getUserLocation, getUserLocationLabel } from '../utils/userSession'

function formatDateInputValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function getCalendarDate(value) {
  const date = new Date(value)
  return formatDateInputValue(date)
}

function isVehicleBookedOnDate(rental, selectedDate) {
  if (!['BOOKED', 'ACTIVE'].includes(rental.status)) {
    return false
  }

  const pickupDate = getCalendarDate(rental.pickupDate)
  const returnDate = getCalendarDate(rental.returnDate)

  return selectedDate >= pickupDate && selectedDate <= returnDate
}

function ReserveVehicles() {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState([])
  const [rentals, setRentals] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [selectedDate, setSelectedDate] = useState('')
  const [priceSort, setPriceSort] = useState('')

  const today = formatDateInputValue(new Date())

  useEffect(() => {
    const storedUser = getStoredUser()
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentUser(storedUser)

    async function loadInventory() {
      try {
        setLoading(true)
        setError('')

        const [vehicleData, rentalData] = await Promise.all([
          getVehicles(),
          getAllRentals(),
        ])

        setVehicles(vehicleData)
        setRentals(rentalData)
      } catch (err) {
        setError(err.message || 'Could not load available vehicles.')
      } finally {
        setLoading(false)
      }
    }

    loadInventory()
  }, [])

  function handleSelectVehicle(vehicleId) {
    navigate(`/book/${vehicleId}`)
  }

  function clearFilters() {
    setSelectedDate('')
    setPriceSort('')
  }

  const userLocation = getUserLocation(currentUser)
  const locationLabel = getUserLocationLabel(currentUser)
  const filteredVehicles = vehicles
    .filter((vehicle) => !userLocation || vehicle.locationId === userLocation.id)
    .filter((vehicle) => {
      if (vehicle.status !== 'AVAILABLE') {
        return false
      }

      if (selectedDate) {
        const conflictingRental = rentals.some(
          (rental) =>
            rental.vehicleId === vehicle.vehicleId &&
            isVehicleBookedOnDate(rental, selectedDate)
        )

        return !conflictingRental
      }

      return vehicle.status === 'AVAILABLE'
    })
    .sort((firstVehicle, secondVehicle) => {
      if (priceSort === 'asc') {
        return Number(firstVehicle.dailyRate) - Number(secondVehicle.dailyRate)
      }

      if (priceSort === 'desc') {
        return Number(secondVehicle.dailyRate) - Number(firstVehicle.dailyRate)
      }

      return 0
    })

  const emptyMessage = selectedDate || priceSort
    ? 'No vehicles match those filters.'
    : 'No available vehicles found.'

  return (
    <div className="reserve-page">
      <header className="dashboard-topbar">
        <div className="brand">
          <img className="brand-logo" src={wheelioLogo} alt="Wheelio logo" />
        </div>
        <nav className="dashboard-nav">
          <Link to="/">Home</Link>
          <Link to="/book" className="nav-active">Book a Vehicle</Link>
          <Link to="/modify-booking">Modify Booking</Link>
          <Link to="/change-location">Change Location</Link>
          <Link to="/settings">Settings</Link>
        </nav>

        <div className="dashboard-user">
          <div className="dashboard-user__icon"></div>
          {currentUser ? (
            <span>{currentUser.firstName}</span>
          ) : (
            <Link to="/login" className="dashboard-user__link">Sign In</Link>
          )}
        </div>
      </header>
      <main className="reserve-main">
        <section className="reserve-toolbar">
          <div className="reserve-toolbar__copy">
            <span className="card-eyebrow">Inventory</span>
            <h1>Top Vehicles Near <span>"{locationLabel}"</span></h1>
          </div>

          <div className="reserve-tools reserve-tools--filters">
            <label className="reserve-filter">
              <span>Available on</span>
              <input
                type="date"
                min={today}
                value={selectedDate}
                onChange={(event) => setSelectedDate(event.target.value)}
              />
            </label>

            <label className="reserve-filter">
              <span>Price</span>
              <select
                value={priceSort}
                onChange={(event) => setPriceSort(event.target.value)}
              >
                <option value="">Featured order</option>
                <option value="asc">Price ascending</option>
                <option value="desc">Price descending</option>
              </select>
            </label>

            <button
              type="button"
              className="tool-button"
              onClick={clearFilters}
            >
              Clear
            </button>
          </div>
        </section>

        {loading && <p className="reserve-message">Loading vehicles...</p>}
        {error && <p className="reserve-message reserve-message--error">{error}</p>}
        {!loading && !error && filteredVehicles.length === 0 && (
          <p className="reserve-message">{emptyMessage}</p>
        )}

        {!loading && !error && filteredVehicles.length > 0 && (
          <section className="reserve-grid">
            {filteredVehicles.map((vehicle) => (
              <article className="reserve-card" key={vehicle.vehicleId}>
                <img
                  className="reserve-image"
                  src={carPlaceholder}
                  alt={`${vehicle.make} ${vehicle.model}`}
                />

                <div className="reserve-card__copy">
                  <span className="reserve-card__badge">
                    {selectedDate ? 'Available On Date' : 'Available Now'}
                  </span>
                  <h2>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h2>
                </div>

                <div className="details-button">
                  <p><span>Plate</span>{vehicle.licensePlate}</p>
                  <p><span>Daily Rate</span>${vehicle.dailyRate}/day</p>
                  <p><span>Status</span>{selectedDate ? 'AVAILABLE' : vehicle.status}</p>
                </div>

                <button
                  type="button"
                  className="tool-button tool-button--primary"
                  onClick={() => handleSelectVehicle(vehicle.vehicleId)}
                >
                  Car Details
                </button>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}

export default ReserveVehicles
