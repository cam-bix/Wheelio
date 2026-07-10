import { useState } from 'react'
import wheelioLogo from '../assets/Wheelio_logo.png'
import './Home.css'
import './Settings.css'
import './ChangeLocation.css'
import { Link } from 'react-router-dom'

const locations = [
    {
        id: 1,
        name: 'Region of Waterloo International Airport',
        address: '1-4881 Fountain Street North, Breslau, Ontario, N0B 1M0',
        icon: '✈️'
    },
    {
        id: 2,
        name: 'Toronto Pearson Airport',
        address: '6301 Silver Dart Dr, Mississauga, Ontario, L5P 1B2',
        icon: '✈️'
    },
    {
        id: 3,
        name: 'Kitchener City Hall',
        address: '200 King St W, Kitchener, Ontario, N2G 4V6',
        icon: '🏛️'
    },
    {
        id: 4,
        name: 'Waterloo Town Square',
        address: '75 King St S, Waterloo, Ontario, N2J 1P2',
        icon: '🏙️'
    },
]

function ChangeLocation() {
    const [selectedLocation, setSelectedLocation] = useState(null)
    const [locationSaved, setLocationSaved] = useState(false)

    const handleSaveLocation = () => {
        if (!selectedLocation) return
        setLocationSaved(true)
        setTimeout(() => setLocationSaved(false), 3000)
    }

    return (
        <div className="dashboard-page">
            {/* ── Top Bar ── */}
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
                    <span>Username</span>
                </div>
            </header>



            {/* ── Page Content ── */}
            <main className="settings-main">
            {/* ── Current Selection ── */}
                {selectedLocation && (
                    <section className="settings-section">
                        <h2 className="settings-section-title">📌 Your Selected Location</h2>
                        <div className="location-selected-display">
                            <p className="location-selected-name">
                                {locations.find(l => l.id === selectedLocation)?.icon}{' '}
                                {locations.find(l => l.id === selectedLocation)?.name}
                            </p>
                            <p className="location-selected-address">
                                {locations.find(l => l.id === selectedLocation)?.address}
                            </p>
                        </div>
                    </section>
                )}

                <section className="settings-section">
                    <h2 className="settings-section-title">Available Pickup Locations</h2>
                    <p className="settings-section-desc">
                        Click on a location below to select it, then press <strong>Save Location</strong>.
                    </p>

                    <div className="location-list">
                        {locations.map((loc) => (
                            <div
                                key={loc.id}
                                className={`location-card ${selectedLocation === loc.id ? 'location-card--selected' : ''}`}
                                onClick={() => setSelectedLocation(loc.id)}
                            >
                                <div className="location-card__icon">{loc.icon}</div>
                                <div className="location-card__info">
                                    <p className="location-card__name">{loc.name}</p>
                                    <p className="location-card__address">{loc.address}</p>
                                </div>
                                <div className="location-card__check">
                                    {selectedLocation === loc.id ? '✅' : ''}
                                </div>
                            </div>
                        ))}
                    </div>

                    {locationSaved && (
                        <p className="settings-success">✅ Your pickup location has been saved!</p>
                    )}

                    <button
                        className="settings-btn"
                        onClick={handleSaveLocation}
                        disabled={!selectedLocation}
                        style={{ opacity: selectedLocation ? 1 : 0.4, marginTop: '8px' }}
                    >
                        Save Location
                    </button>
                </section>

                
            </main>
        </div>
    )
}

export default ChangeLocation
