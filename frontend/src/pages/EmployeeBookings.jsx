import carPlaceholder from '../assets/placeholder_image.jpg'
import logo from '../assets/Wheelio_logo.png'
import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import './EmployeeBookings.css'
import { getBookings } from '../api/bookings'

// Column labels shown once in the header row, and reused as
// per-cell labels on mobile where the grid collapses to a stack.
const COLUMNS = [
  { key: 'customer', label: 'Customer' },
  { key: 'vehicle', label: 'Vehicle' },
  { key: 'pickupDate', label: 'Pick up Date' },
  { key: 'returnDate', label: 'Return Date' },
  { key: 'status', label: 'Status' },
]


//The following is the employee bookings page, where staff can review all active/upcoming bookings.
function EmployeeBookings() {
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getBookings()
        setBookings(data)
      } catch (err) {
        setError(err.message || 'Unable to load bookings.')
      } finally {
        setLoading(false)
      }
    }

    fetchBookings()
  }, [])

  // Filter by customer or vehicle so staff can quickly find a booking.
  const visibleBookings = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return bookings

    return bookings.filter((booking) =>
      booking.customer.toLowerCase().includes(query) ||
      booking.vehicle.toLowerCase().includes(query) ||
      booking.id.includes(query)
    )
  }, [bookings, search])

  return (
    <div className="employee-bookings-page">

      {/* ─── Top Navigation Bar ─────────────────────────────── */}
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/employee-home">
            <img src={logo} alt="Wheelio Logo" className="navbar-logo-image" />
          </Link>
        </div>


        {/*Links to other pages */}
        <div className="navbar-links">
          <Link to="/employee-home">Home</Link>
          <Link to="/employee-inventory">Check Inventory</Link>
          <Link to="/employee-bookings" className="nav-active">Bookings</Link>
          <Link to="/employee-stats">Statistics</Link>
          <Link to="/customer-support">Customer Support</Link>
        </div>

        <div className="navbar-user">
          <div className="user-icon" aria-hidden="true">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <circle cx="12" cy="8" r="4" stroke="#0f0f0f" strokeWidth="1.6" />
              <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" stroke="#0f0f0f" strokeWidth="1.6" strokeLinecap="round" />
            </svg>
          </div>
          <span className="username">Username</span>
        </div>
      </nav>

      {/* ─── Page Content ───────────────────────────────────── */}
      <main className="bookings-content">

        {/* Header row: title + count on the left, search on the right */}
        <div className="bookings-page-header">
          <div>
            <h1 className="bookings-title">Bookings</h1>
            {!loading && (
              <p className="bookings-count">
                {visibleBookings.length} {visibleBookings.length === 1 ? 'booking' : 'bookings'}
              </p>
            )}
          </div>

          <div className="bookings-header-actions">
            <input
              type="text"
              className="bookings-search"
              placeholder="Search by customer, vehicle, or booking #"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              aria-label="Search bookings"
            />

            <Link
              to="/employee-calendar"
              className="calendar-button"
              aria-label="Employee Calendar"
              title="Employee Calendar"
            >
              <svg
                width="22"
                height="22"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <rect x="3" y="4" width="18" height="18" rx="2" />
                <line x1="16" y1="2" x2="16" y2="6" />
                <line x1="8" y1="2" x2="8" y2="6" />
                <line x1="3" y1="10" x2="21" y2="10" />
                <rect x="7" y="13" width="3" height="3" fill="currentColor" stroke="none" />
              </svg>
            </Link>
          </div>
        </div>

        {error && <p className="bookings-error" role="alert">{error}</p>}

        {loading ? (
          <p className="bookings-loading">Loading bookings...</p>
        ) : visibleBookings.length === 0 ? (
          <p className="bookings-empty">
            {search ? `No bookings match "${search}".` : 'No bookings found.'}
          </p>
        ) : (
          <div className="bookings-table" role="table">

            {/* Column headings, aligned to the same grid as each row below */}
            <div className="bookings-table-header" role="row">
              <span className="col-image" aria-hidden="true" />
              <span className="col-number" role="columnheader">Booking #</span>
              {COLUMNS.map((column) => (
                <span className="col-cell" role="columnheader" key={column.key}>
                  {column.label}
                </span>
              ))}
            </div>

            <div className="bookings-list">
              {visibleBookings.map((booking) => (
                <div className="booking-row" role="row" key={booking.id}>

                  {/* Vehicle thumbnail placeholder */}
                  <div className="booking-image col-image">
                    <img src={booking.image || carPlaceholder} alt={booking.vehicle} />
                  </div>

                  {/* Booking number */}
                  <span className="booking-number col-number" role="cell">
                    #{booking.id}
                  </span>

                  {/* Booking fields — aligned as columns via CSS grid, with
                      data-label used to restore inline labels on mobile */}
                  <span className="col-cell" role="cell" data-label="Customer">
                    {booking.customer}
                  </span>
                  <span className="col-cell" role="cell" data-label="Vehicle">
                    {booking.vehicle}
                  </span>
                  <span className="col-cell" role="cell" data-label="Pick up Date">
                    {booking.pickupDate}
                  </span>
                  <span className="col-cell" role="cell" data-label="Return Date">
                    {booking.returnDate}
                  </span>
                  <span className="col-cell status-cell" role="cell" data-label="Status">
                    <span className={`booking-status-badge booking-status-${booking.status?.toLowerCase()}`}>
                      {booking.status}
                    </span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>
    </div>
  )
}

export default EmployeeBookings
