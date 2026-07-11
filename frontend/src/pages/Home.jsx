import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import carPlaceholder from '../assets/placeholder_image.jpg'
import wheelioLogo from '../assets/Wheelio_logo.png'
import { getActiveRentalsForUser, cancelRental } from '../api/rentals'
import './Home.css'

const featuredVehicles = [
  {
    vehicle_id: 1,
    make: "Toyota",
    model: "Corolla",
    year: 2022,
    daily_rate: 45,
    status: "Available",
  },
  {
    vehicle_id: 2,
    make: "Honda",
    model: "Civic",
    year: 2021,
    daily_rate: 50,
    status: "Available",
  },
]

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

    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('wheelioUser') || 'null')
        if (!storedUser) {
            setRentalsLoading(false)
            return
        }

        setCurrentUser(storedUser)
        loadRentals(storedUser.userId)
    }, [])
    return (
        <div className="dashboard-page">
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
                    <span>{currentUser ? currentUser.firstName : 'Guest'}</span>
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
                        <div className="booking-card" key={rental.rentalId}>
                            <PlaceholderImage />
                            <h3>{rental.vehicleName}</h3>

                            <div className="booking-info-box">
                            <p>Pickup: {formatDate(rental.pickupDate)}</p>
                            <p>Return: {formatDate(rental.returnDate)}</p>
                            <p>Status: {rental.status}</p>
                            <p>Total: ${rental.totalCost}</p>
                            </div>

                            <Link className="outline-button" to="/modify-booking">
                            Modify Booking
                            <span className="button-arrow">›</span>
                            </Link>

                            <button
                            className="outline-button"
                            type="button"
                            onClick={() => handleCancelRental(rental.rentalId)}
                            >
                            Cancel Booking
                            <span className="button-arrow">›</span>
                            </button>
                        </div>
                        ))
                    )}
                </section>

                <section className="dashboard-panel dashboard-panel--right">
                    <h2>Featured Available Inventory</h2>
                    <p className="panel-subtitle">
                        Inventory for "Location" <span><Link to="/change-location">Change Location</Link></span>
                    </p>

                    <div className="inventory-grid">
                        {featuredVehicles.map((vehicle) => (
                            <article className="inventory-card" key={vehicle.vehicle_id}>
                                <PlaceholderImage />

                                <h3>
                                    {vehicle.year} {vehicle.make} {vehicle.model}
                                </h3>

                                <div className="inventory-details">
                                    <p>Vehicle ID: {vehicle.vehicle_id}</p>
                                    <p>Daily Rate: ${vehicle.daily_rate}</p>
                                    <p>Status: {vehicle.status}</p>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Home
