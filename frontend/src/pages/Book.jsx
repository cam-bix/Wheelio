import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getVehicleById } from '../api/vehicles'
import { createRental } from '../api/rentals'
import './Book.css'
import carPlaceholder from '../assets/placeholder_image.jpg'
import wheelioLogo from '../assets/Wheelio_logo.png'
import { getStoredUser } from '../utils/userSession'

function formatDateInputValue(date) {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function parseSelectedDate(dateString) {
  return new Date(`${dateString}T12:00:00`)
}

function toNoonIsoString(dateString) {
  return parseSelectedDate(dateString).toISOString()
}

function Book() {
  const { vehicleId } = useParams()
  const navigate = useNavigate()
  const currentUser = getStoredUser()

  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')
  const today = formatDateInputValue(new Date())

  useEffect(() => {
    async function loadVehicle() {
      try {
        setLoading(true)
        setError('')
        const result = await getVehicleById(vehicleId)
        setVehicle(result)
      } catch (err) {
        setError(err.message || 'Unable to load vehicle details.')
      } finally {
        setLoading(false)
      }
    }

    loadVehicle()
  }, [vehicleId])

  function calculateEstimatedTotal() {
    if (!vehicle || !pickupDate || !returnDate) return null

    const start = parseSelectedDate(pickupDate)
    const end = parseSelectedDate(returnDate)

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      return null
    }

    const msPerDay = 1000 * 60 * 60 * 24
    const days = Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickupDate)) / msPerDay))

    return Number(vehicle.dailyRate) * days
  }

  async function handleBook(event) {
    event.preventDefault()

    if (!currentUser) {
      setBookingError('You must be logged in to complete this booking.')
      return
    }

    if (!pickupDate || !returnDate) {
      setBookingError('Please choose pickup and return dates.')
      return
    }

    if (parseSelectedDate(returnDate) <= parseSelectedDate(pickupDate)) {
      setBookingError('Return date must be after pickup date.')
      return
    }

    if (!vehicle.locationId) {
      setBookingError('This vehicle does not have a rental location assigned yet.')
      return
    }

    try {
      setBookingLoading(true)
      setBookingError('')

      await createRental({
        userId: currentUser.userId,
        vehicleId: vehicle.vehicleId,
        pickupLocationId: vehicle.locationId,
        returnLocationId: vehicle.locationId,
        pickupDate: toNoonIsoString(pickupDate),
        returnDate: toNoonIsoString(returnDate),
      })
      const msPerDay = 1000 * 60 * 60 * 24
      const days = Math.max(1, Math.ceil((new Date(returnDate) - new Date(pickupDate)) / msPerDay))

      const session = await createCheckoutSession(vehicle.vehicleId, days)
      window.location.href = session.url

    } catch (err) {
      setBookingError(err.message || 'Could not complete booking.')
    } finally {
      setBookingLoading(false)
    }
  }

  if (loading) {
    return <p>Loading vehicle details...</p>
  }

  if (error) {
    return <p>{error}</p>
  }

  if (!vehicle) {
    return <p>Vehicle not found.</p>
  }

  const estimatedTotal = calculateEstimatedTotal()

  return (
    <div className="dashboard-page">
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

      <main className="dashboard-layout">
        <section className="dashboard-panel dashboard-panel--left">
          <img className="vehicle-image" src={carPlaceholder} alt="Vehicle" />
          <h1 className="vehicle-title">
            {vehicle.year} {vehicle.make} {vehicle.model}
          </h1>
        </section>

        <section className="dashboard-panel dashboard-panel--right">
          <div className="inventory-details">
              <h2>Car Details</h2>
              <p><span>Daily Rate</span>${vehicle.dailyRate}</p>
              <p><span>Status</span>{vehicle.status}</p>
              <p><span>Plate</span>{vehicle.licensePlate}</p>
              <p>
                  <span>Pickup Location</span>
                  {(() => {
                      const savedId = localStorage.getItem('wheelioLocation')
                      const locations = [
                          { id: 1, name: 'Waterloo Airport' },
                          { id: 2, name: 'Toronto Pearson Airport' },
                          { id: 3, name: 'Kitchener City Hall' },
                          { id: 4, name: 'Waterloo Town Square' },
                      ]
                      const found = locations.find(l => l.id === Number(savedId))
                      return found ? found.name : 'No Location Selected'
                  })()}
              </p>
              {!localStorage.getItem('wheelioLocation') && (
                  <p className="booking-error">
                      ⚠️ Please <Link to="/change-location">select a pickup location</Link> before booking.
                  </p>
              )}
          </div>

          <form className="booking-form" onSubmit={handleBook}>
            <label>
              Pickup Date
              <input
                type="date"
                min={today}
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
              />
            </label>

            <label>
              Return Date
              <input
                type="date"
                min={pickupDate || today}
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </label>

            <p className="booking-note">
              See location hours for pickup and drop off times
            </p>

            {estimatedTotal !== null && (
              <p className="booking-estimate">
                Estimated Total: ${estimatedTotal.toFixed(2)}
              </p>
            )}

            {bookingError && <p className="booking-error">{bookingError}</p>}

            <button className="outline-button" type="submit" disabled={bookingLoading}>
              {bookingLoading ? 'Booking...' : 'Book Vehicle'}
            </button>
          </form>
        </section>
      </main>
    </div>
  )
}

export default Book
