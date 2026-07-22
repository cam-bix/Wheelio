import carPlaceholder from '../assets/placeholder_image.jpg'
import logo from '../assets/Wheelio_logo.png'
import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './EmployeeHome.css'
import { getBookings } from '../api/bookings'
import { getStatistics } from '../api/statistics'

const MOCK_TICKETS = [
  {
    id: '2041',
    summary: 'Customer reports a flat tire on their Honda CR-V rental, requesting roadside assistance.',
  },
  {
    id: '2042',
    summary: 'Billing dispute — customer was charged twice for a one-day rental in Waterloo.',
  },
]
/*
const MOCK_SUMMARY = [
  { label: 'Total Bookings', value: 128, trendPct: 8, goodDirection: 'up' },
  { label: 'Vehicles Rented', value: 84, trendPct: 8, goodDirection: 'up' },
  { label: 'Vehicle Incidents', value: 3, trendPct: -25, goodDirection: 'down' },
]
*/

const SUMMARY_ICONS = {
  'Total Bookings': <IconCalendar />,
  'Vehicles Rented': <IconCar />,
  'Vehicle Incidents': <IconWarning />,
}
/*
const MOCK_BOOKINGS = [
  {
    id: '1042',
    customer: 'Jordan Lee',
    vehicle: 'Toyota Corolla',
    pickupDate: 'Jul 3, 2026',
    returnDate: 'Jul 8, 2026',
    status: 'Confirmed',
    image: '',
  },
  {
    id: '1043',
    customer: 'Priya Nair',
    vehicle: 'Honda CR-V',
    pickupDate: 'Jul 5, 2026',
    returnDate: 'Jul 12, 2026',
    status: 'Pending',
    image: '',
  },
]
*/

//The following is the employee home page — the first thing staff see
//when logging in, giving a quick view of tickets, stats, and bookings.
function EmployeeHome() {
  const [tickets, setTickets] = useState([])
  const [summary, setSummary] = useState([])
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

useEffect(() => {
  const fetchHomeData = async () => {
    setLoading(true)
    setError('')

    try {
      const [bookingData, statisticsData] = await Promise.all([
        getBookings(),
        getStatistics(),
      ])

      setTickets(MOCK_TICKETS)

      setBookings(bookingData.slice(0, 2))

      setSummary([
        {
          label: 'Total Bookings',
          value: bookingData.length,
          trendPct: 0,
          goodDirection: 'up',
        },
        {
          label: 'Vehicles Rented',
          value: statisticsData.vehiclesRented.value,
          trendPct: statisticsData.vehiclesRented.trendPct,
          goodDirection: 'up',
        },
        {
          label: 'Vehicle Incidents',
          value: statisticsData.vehicleIncidents.value,
          trendPct: statisticsData.vehicleIncidents.trendPct,
          goodDirection: 'down',
        },
      ])
    } catch (err) {
      setError(err.message || 'Unable to load your dashboard.')
    } finally {
      setLoading(false)
    }
  }

  fetchHomeData()
}, [])

  // Removes a ticket from the outstanding list once resolved.
  // TODO: replace with a real API call, e.g. await resolveTicket(id)
  const handleResolve = (id) => {
    setTickets((prev) => prev.filter((ticket) => ticket.id !== id))
  }

  return (
    <div className="employee-home-page">

      {/* ─── Top Navigation Bar ─────────────────────────────── */}
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/employee-home">
            <img src={logo} alt="Wheelio Logo" className="navbar-logo-image" />
          </Link>
        </div>

        <div className="navbar-links">
        <Link to="/employee-home" className="nav-active">
          Home
        </Link>
        <Link to="/employee-inventory">Check Inventory</Link>
        <Link to="/employee-bookings">Bookings</Link>
        <Link to="/employee-calendar">Calendar</Link>
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
      {loading ? (
        <p className="home-loading">Loading your dashboard...</p>
      ) : (
        <div className="home-content">
          {error && <p className="home-error" role="alert">{error}</p>}

          {/* ─── Left Column: Support Tickets ────────────────── */}
          <aside className="tickets-column">
            <h2 className="tickets-title">Support Tickets Outstanding</h2>

            {tickets.map((ticket) => (
              <div className="ticket-card" key={ticket.id}>
                <h3 className="ticket-number">Ticket #{ticket.id}</h3>
                <div className="ticket-box">{ticket.summary}</div>

                <button
                  type="button"
                  className="resolve-btn"
                  onClick={() => handleResolve(ticket.id)}
                >
                  Resolve
                  <IconArrowUpRight />
                </button>
              </div>
            ))}

            {tickets.length === 0 && (
              <p className="tickets-empty">No More Support Tickets</p>
            )}
          </aside>

          {/* ─── Right Column: Locate / Stats / Bookings ─────── */}
          <div className="main-column">

            {/* Locate Vehicles */}
            <Link to="/locate-vehicles" className="locate-vehicles-btn">
              <span>Locate Vehicles</span>
              <IconPin />
            </Link>

            {/* Statistics preview — same summary-card style as the
                KPI cards on the Statistics page (icon + trend badge +
                value + label), just wrapped in a Link here so staff
                can click straight through to the full page. */}
            <section className="home-section">
              <h2 className="home-section-title">
                <Link to="/employee-stats">Statistics</Link>
              </h2>

              <div className="home-stats-row">
                {summary.map((card) => {
                  const isGood =
                    card.goodDirection === 'up' ? card.trendPct >= 0 : card.trendPct <= 0

                  return (
                    <Link to="/employee-stats" className="home-stat-card" key={card.label}>
                      <div className="home-stat-card-top">
                        <span className="home-stat-icon">{SUMMARY_ICONS[card.label]}</span>
                        <span className={`trend-badge ${isGood ? 'trend-good' : 'trend-bad'}`}>
                          {card.trendPct >= 0 ? '▲' : '▼'} {Math.abs(card.trendPct)}%
                        </span>
                      </div>
                      <span className="home-stat-value">{card.value}</span>
                      <span className="home-stat-label">{card.label}</span>
                    </Link>
                  )
                })}
              </div>
            </section>

            {/* Bookings preview */}
            <section className="home-section">
              <h2 className="home-section-title">
                <Link to="/employee-bookings">Bookings</Link>
              </h2>

              <div className="home-bookings-list">
                {bookings.map((booking) => (
                  <div className="home-booking-card" key={booking.id}>

                    {/* Vehicle thumbnail placeholder */}
                    <div className="booking-image col-image">
                      <img src={booking.image || carPlaceholder} alt={booking.vehicle}/>
                    </div>

                    {/* Booking details */}
                    <div className="home-booking-fields">
                      <div className="home-booking-field">
                        <span className="field-label">Customer</span>
                        <span className="field-value">{booking.customer}</span>
                    </div>

                    <div className="home-booking-field">
                      <span className="field-label">Vehicle</span>
                      <span className="field-value">{booking.vehicle}</span>
                    </div>

                    <div className="home-booking-field">
                      <span className="field-label">Pick up Date</span>
                      <span className="field-value">{booking.pickupDate}</span>
                    </div>

                    <div className="home-booking-field">
                      <span className="field-label">Return Date</span>
                      <span className="field-value">{booking.returnDate}</span>
                    </div>

                    <div className="home-booking-field status-field">
                      <span className="field-label">Status</span>
                      <span className={`booking-status-badge booking-status-${booking.status?.toLowerCase()}`}>
                        {booking.status}
                      </span>
                    </div>
                  </div>
                  </div>
                ))}
              </div>
            </section>
          </div>
        </div>
      )}
    </div>
  )
}


/* ─── Icons ──────────────────────────────────────────────────────
   Small inline SVG icons, kept dependency-free like the rest of
   the site's illustrations. The three KPI icons (Calendar, Car,
   Warning) are the same ones used on the Statistics page's summary
   cards, so the home preview and the full stats page look
   consistent — keep them in sync if either one changes. ────────── */

function IconArrowUpRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10.2" stroke="#0f0f0f" strokeWidth="1.6" />
      <path d="M9.5 14.5 14.5 9.5M10 9.5h4.5V14" stroke="#0f0f0f" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconPin() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z" stroke="#0f0f0f" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="12" cy="9.5" r="2.4" stroke="#0f0f0f" strokeWidth="1.8" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="#0f0f0f" strokeWidth="1.6" />
      <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" stroke="#0f0f0f" strokeWidth="1.6" />
      <line x1="8" y1="3" x2="8" y2="7" stroke="#0f0f0f" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="16" y1="3" x2="16" y2="7" stroke="#0f0f0f" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 14 L10.5 16.5 L16 11" stroke="#e5212a" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconCar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 16 L5.5 10.5 C6 9 7 8.2 8.6 8.2 H15.4 C17 8.2 18 9 18.5 10.5 L20 16" stroke="#0f0f0f" strokeWidth="1.6" strokeLinejoin="round" />
      <rect x="2.8" y="16" width="18.4" height="4" rx="1.4" stroke="#0f0f0f" strokeWidth="1.6" />
      <circle cx="7" cy="20" r="1.6" fill="#0f0f0f" />
      <circle cx="17" cy="20" r="1.6" fill="#0f0f0f" />
    </svg>
  )
}

function IconWarning() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 3.5 L21.5 20 H2.5 Z" stroke="#0f0f0f" strokeWidth="1.6" strokeLinejoin="round" />
      <line x1="12" y1="10" x2="12" y2="14.5" stroke="#e5212a" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="17.2" r="1" fill="#e5212a" />
    </svg>
  )
}

export default EmployeeHome
