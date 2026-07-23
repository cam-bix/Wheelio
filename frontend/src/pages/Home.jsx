import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import carPlaceholder from '../assets/placeholder_image.jpg'
import wheelioLogo from '../assets/Wheelio_logo.png'
import { getActiveRentalsForUser, cancelRental } from '../api/rentals'
import { getVehicles } from '../api/vehicles'
import './Home.css'

function PlaceholderImage() {
  return (
    <img
      className="vehicle-image"
      src={carPlaceholder}
      alt="Vehicle"
    />
  )
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString()
}

function Home() {
  const [currentUser, setCurrentUser] = useState(null)
  const [rentals, setRentals] = useState([])
  const [rentalsLoading, setRentalsLoading] = useState(true)
  const [rentalsError, setRentalsError] = useState('')
  const [inventory, setInventory] = useState([])
  const [inventoryLoading, setInventoryLoading] = useState(true)
  const [inventoryError, setInventoryError] = useState('')

  async function loadRentals(userId) {
    try {
      setRentalsLoading(true)
      setRentalsError('')
      const data = await getActiveRentalsForUser(userId)
      setRentals(data)
    } catch (err) {
      setRentalsError(err.message || 'Could not load rentals.')
    } finally {
      setRentalsLoading(false)
    }
  }

  async function handleCancelRental(rentalId) {
    if (!currentUser) return

    try {
      await cancelRental(rentalId)
      await loadRentals(currentUser.userId)
    } catch (err) {
      setRentalsError(err.message || 'Could not cancel rental.')
    }
  }

  async function loadInventory() {
    try {
      setInventoryLoading(true)
      setInventoryError('')
      const vehicles = await getVehicles()
      const featuredInventory = vehicles
        .filter((vehicle) => vehicle.status === 'AVAILABLE')
        .slice(0, 8)

      setInventory(featuredInventory)
    } catch (err) {
      setInventoryError(err.message || 'Could not load available inventory.')
    } finally {
      setInventoryLoading(false)
    }
  }

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('wheelioUser') || 'null')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    loadInventory()

    if (!storedUser) {
      setRentalsLoading(false)
      return
    }

    setCurrentUser(storedUser)
    loadRentals(storedUser.userId)
  }, [])

  return (
    <div className="dashboard-page home-page">
      <header className="dashboard-topbar">
        <div className="brand">
          <img className="brand-logo" src={wheelioLogo} alt="Wheelio logo" />
        </div>

        <nav className="dashboard-nav">
          <Link to="/">Home</Link>
          <Link to="/book">Book a Vehicle</Link>
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
          <h2>Your Current Bookings</h2>

          {rentalsLoading && <p className="empty-text">Loading your rentals...</p>}

          {!rentalsLoading && rentalsError && (
            <p className="empty-text">{rentalsError}</p>
          )}

          {!rentalsLoading && !rentalsError && rentals.length === 0 && (
            <p className="empty-text">You have no active rentals.</p>
          )}

          {!rentalsLoading && !rentalsError && rentals.length > 0 && (
            rentals.map((rental) => (
              <article className="booking-card" key={rental.rentalId}>
                <PlaceholderImage />

                <div className="card-copy">
                  <span className="card-eyebrow">Current Rental</span>
                  <h3>{rental.vehicleName}</h3>
                </div>

                <div className="booking-info-box">
                  <p><span>Pickup</span>{formatDate(rental.pickupDate)}</p>
                  <p><span>Return</span>{formatDate(rental.returnDate)}</p>
                  <p><span>Status</span>{rental.status}</p>
                  <p><span>Total</span>${rental.totalCost}</p>
                </div>

                <div className="card-actions">
                  <Link className="outline-button" to="/modify-booking">
                    Modify Booking
                    <span className="button-arrow">›</span>
                  </Link>

                  <button
                    className="outline-button outline-button--danger"
                    type="button"
                    onClick={() => handleCancelRental(rental.rentalId)}
                  >
                    Cancel Booking
                    <span className="button-arrow">›</span>
                  </button>
                </div>
              </article>
            ))
          )}
        </section>

        <section className="dashboard-panel dashboard-panel--right">
          <h2>Featured Available Inventory</h2>
          <p className="panel-subtitle">
            Inventory for "Location" <span><Link to="/change-location">Change Location</Link></span>
          </p>

          {inventoryLoading && <p className="empty-text">Loading available inventory...</p>}

          {!inventoryLoading && inventoryError && (
            <p className="empty-text">{inventoryError}</p>
          )}

          {!inventoryLoading && !inventoryError && inventory.length === 0 && (
            <p className="empty-text">No available vehicles are showing right now.</p>
          )}

          {!inventoryLoading && !inventoryError && inventory.length > 0 && (
            <div className="inventory-grid">
              {inventory.map((vehicle) => (
                <article className="inventory-card" key={vehicle.vehicleId}>
                  <PlaceholderImage />

                  <div className="card-copy">
                    <span className="card-eyebrow">Available Now</span>
                    <h3>
                      {vehicle.year} {vehicle.make} {vehicle.model}
                    </h3>
                  </div>

                  <div className="inventory-details">
                    <p><span>Daily Rate</span>${vehicle.dailyRate}</p>
                    <p><span>Status</span>{vehicle.status}</p>
                  </div>

                  <Link className="outline-button outline-button--dark" to={`/book/${vehicle.vehicleId}`}>
                    View Details
                    <span className="button-arrow">›</span>
                  </Link>
                </article>
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  )
}

export default Home
