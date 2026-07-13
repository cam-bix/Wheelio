import { useEffect, useState } from 'react'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { getVehicleById } from '../api/vehicles'
import { createRental } from '../api/rentals'
import './Book.css'
import carPlaceholder from '../assets/placeholder_image.jpg'
import wheelioLogo from '../assets/Wheelio_logo.png'
import { createCheckoutSession } from '../api/checkout'

function Book() {
  const { vehicleId } = useParams()
  const navigate = useNavigate()
  const currentUser = JSON.parse(localStorage.getItem('wheelioUser') || 'null')

  const [vehicle, setVehicle] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [pickupDate, setPickupDate] = useState('')
  const [returnDate, setReturnDate] = useState('')
  const [bookingLoading, setBookingLoading] = useState(false)
  const [bookingError, setBookingError] = useState('')

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

    const start = new Date(pickupDate)
    const end = new Date(returnDate)

    if (Number.isNaN(start.getTime()) || Number.isNaN(end.getTime()) || end <= start) {
      return null
    }

    const msPerDay = 1000 * 60 * 60 * 24
    const days = Math.max(1, Math.ceil((end - start) / msPerDay))

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

    if (new Date(returnDate) <= new Date(pickupDate)) {
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
        pickupDate: new Date(pickupDate).toISOString(),
        returnDate: new Date(returnDate).toISOString(),
      })

      navigate('/')
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
          </div>

          <form className="booking-form" onSubmit={handleBook}>
            <label>
              Pickup Date
              <input
                type="datetime-local"
                value={pickupDate}
                onChange={(e) => setPickupDate(e.target.value)}
              />
            </label>

            <label>
              Return Date
              <input
                type="datetime-local"
                value={returnDate}
                onChange={(e) => setReturnDate(e.target.value)}
              />
            </label>

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
