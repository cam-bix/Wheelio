import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { getVehicleById } from '../api/vehicles'
import './Book.css'
import carPlaceholder from '../assets/placeholder_image.jpg'
import wheelioLogo from '../assets/Wheelio_logo.png'
import { createCheckoutSession } from '../api/checkout'

function Book() {
    const { vehicleId } = useParams()
    const [vehicle, setVehicle] = useState(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [days, setDays] = useState('')
    useEffect(() => {
        getVehicleById(vehicleId)
            .then(result => {
                setVehicle(result)
                setLoading(false)
            })
            .catch(err => {
                setError(err.message)
                setLoading(false)
            })
    }, [vehicleId])
    function handleBook() {
        createCheckoutSession(vehicleId, Number(days))
            .then(result => {
                window.location.href = result.url
            })
            .catch(err => {
                setError(err.message)
            })
    }
    if (loading) {
        return <p>Loading...</p>
    }
    if (error) {
        return <p>{error}</p>
    }
    return (
        <div className='dashboard-page'>
            <header className="dashboard-topbar">
                <div className="brand">
                    <img className="brand-logo" src={wheelioLogo} alt="Wheelio logo" />
                </div>

                <nav className="dashboard-nav">
                    <a href="/">Home</a>
                    <a href="/">Book a Vehicle</a>
                    <a href="/">Modify Booking</a>
                    <a href="/">Change Location</a>
                    <a href="/">Settings</a>
                </nav>

                <div className="dashboard-user">
                    <div className="dashboard-user__icon"></div>
                    <span>Username</span>
                </div>
            </header>
            <main className="dashboard-layout">
                <section className="dashboard-panel dashboard-panel--left">
                    <img className="vehicle-image" src={carPlaceholder} alt="Vehicle" />
                    <h1 className="vehicle-title"> {vehicle.year} {vehicle.make} {vehicle.model}</h1>
                </section>
                <section className="dashboard-panel dashboard-panel--right">
                    <div className="inventory-details">
                        <h2>Car Details</h2>
                        <p>Daily Rate: ${vehicle.dailyRate}</p>
                        <p>Status: {vehicle.status}</p>
                    </div>
                    <input
                        type="number"
                        min="1"
                        placeholder="Number of days"
                        value={days}
                        onChange={(e) => setDays(e.target.value)}
                    />
                    <button className="outline-button" onClick={handleBook} disabled={!days || Number(days) < 1}>Book Vehicle</button>
                </section>
            </main>
        </div>
    )
}

export default Book