import carPlaceholder from '../assets/placeholder_image.jpg'
import wheelioLogo from '../assets/Wheelio_logo.png'
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

function Home() {
    return (
        <div className="dashboard-page">
            <header className="dashboard-topbar">
                <div className="brand">
                    <img className="brand-logo" src={wheelioLogo} alt="Wheelio logo" />
                </div>

                <nav className="dashboard-nav">
                    <Link to="/" className="nav-active">Home</Link>
                    <Link to="/book">Book a Vehicle</Link>
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
                    <h2>Your Current Bookings</h2>

                    <div className="booking-card">
                        <PlaceholderImage />
                        <h3>Car Make &amp; Model</h3>

                        <div className="booking-info-box">Booking Information</div>

                        <button className="outline-button" type="button">
                            Modify Booking 
                            <span className="button-arrow">›</span>
                        </button>

                        <p className="empty-text">No More Bookings</p>
                    </div>
                </section>

                <section className="dashboard-panel dashboard-panel--right">
                    <h2>Featured Available Inventory</h2>
                    <p className="panel-subtitle">
                        Inventory for "Location" <span>Change Location</span>
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