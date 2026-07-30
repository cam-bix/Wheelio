import './ReserveVehicles.css'
import carPlaceholder from '../assets/placeholder_image.jpg'
import wheelioLogo from '../assets/Wheelio_logo.png'
import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { getVehicles } from '../api/vehicles'

function ReserveVehicles() {
  const navigate = useNavigate()
  const [vehicles, setVehicles] = useState([])
  const [currentUser, setCurrentUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('wheelioUser') || 'null')
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentUser(storedUser)

    async function loadVehicles() {
      try {
        setLoading(true)
        setError('')

        const data = await getVehicles()
        const availableVehicles = data.filter(
          (vehicle) => vehicle.status === 'AVAILABLE'
        )

        setVehicles(availableVehicles)
      } catch (err) {
        setError(err.message || 'Could not load available vehicles.')
      } finally {
        setLoading(false)
      }
    }

    loadVehicles()
  }, [])

  function handleSelectVehicle(vehicleId) {
    navigate(`/book/${vehicleId}`)
  }

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
            <h1>Top Vehicles Near <span>"User Location"</span></h1>
          </div>

          <div className="reserve-tools">
            <button type="button" className="tool-button">Filters</button>
            <button type="button" className="tool-button">Search</button>
          </div>
        </section>

        {loading && <p className="reserve-message">Loading vehicles...</p>}
        {error && <p className="reserve-message reserve-message--error">{error}</p>}
        {!loading && !error && vehicles.length === 0 && (
          <p className="reserve-message">No available vehicles found.</p>
        )}

        {!loading && !error && vehicles.length > 0 && (
          <section className="reserve-grid">
            {vehicles.map((vehicle) => (
              <article className="reserve-card" key={vehicle.vehicleId}>
                <img
                  className="reserve-image"
                  src={carPlaceholder}
                  alt={`${vehicle.make} ${vehicle.model}`}
                />

                <div className="reserve-card__copy">
                  <span className="reserve-card__badge">Available Now</span>
                  <h2>
                    {vehicle.year} {vehicle.make} {vehicle.model}
                  </h2>
                </div>

                <div className="details-button">
                  <p><span>Plate</span>{vehicle.licensePlate}</p>
                  <p><span>Daily Rate</span>${vehicle.dailyRate}/day</p>
                  <p><span>Status</span>{vehicle.status}</p>
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
