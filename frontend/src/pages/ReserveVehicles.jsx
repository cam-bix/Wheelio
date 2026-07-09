import './ReserveVehicles.css'
import carPlaceholder from '../assets/placeholder_image.jpg'
import wheelioLogo from '../assets/Wheelio_logo.png'
import { Link } from 'react-router-dom'
import { useEffect, useState } from 'react'

function ReserveVehicles() {
    const [vehicles, setVehicles] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')

    useEffect(() => {
        async function loadVehicles() {
            try {
                setLoading(true)
                setError('')
                const response = await fetch('http://localhost:8080/api/vehicles')
                if (!response.ok) {
                    throw new Error('Failed to load vehicles')
                }

                const data = await response.json()

                const availableVehicles = data.filter(
                    (vehicle) => vehicle.status == 'AVAILABLE'
                )

                setVehicles(availableVehicles)
            } catch (err) {
                setError('Could not load available vehicles')
            } finally {
                setLoading(false)
            }
        }

        loadVehicles()
    }, [])

    return (
        <div className="reserve-page">
            <header className="dashboard-topbar">
                <div className="brand">
                    <img className="brand-logo" src={wheelioLogo} alt="Wheelio logo" />                
                </div>
                <nav className="dashboard-nav">
                    <Link to="/">Home</Link>
                    <Link to="/book" className="nav-active">Book a Vehicle</Link>
                    <a href="/">Modify Booking</a>
                    <a href="/">Change Location</a>
                    <a href="/">Settings</a>
                </nav>

                <div className="dashboard-user">
                    <div className="dashboard-user__icon"></div>
                        <span>Username</span>
                    </div>
            </header>
            <main className="reserve-main">
                <section className="reserve-toolbar">
                    <h1>Top Vehicles Near <span>"User Location"</span></h1>

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

                            <h2>
                                {vehicle.year} {vehicle.make} {vehicle.model}
                            </h2>

                            <div className="details-button">
                                <p>Plate: {vehicle.licensePlate}</p>
                                <p>${vehicle.dailyRate}/day</p>
                                <p>Status: {vehicle.status}</p>
                            </div>
                        </article>
                    ))}
                    </section>
                )}
            </main>
        </div>

    )
}

export default ReserveVehicles