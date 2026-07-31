import carPlaceholder from '../assets/placeholder_image.jpg'
import logo from '../assets/Wheelio_logo.png'
import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import './EmployeeHome.css'
import { getBookings } from '../api/bookings'
import { getStatistics } from '../api/statistics'
import { getTickets, updateTicketStatus } from '../api/tickets'


const extractTickets = (response) => {
  const possibleArrays = [
    response,
    response?.data,
    response?.tickets,
    response?.content,
    response?.data?.tickets,
    response?.data?.content,
  ]

  return possibleArrays.find(Array.isArray) || []
}

const formatStatusLabel = (status = '') =>
  String(status)
    .toLowerCase()
    .split('_')
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')

const toClassSuffix = (value = '') =>
  String(value).toLowerCase().replace(/[\s_]+/g, '-')

const formatCurrency = (value) =>
  `$${Math.round(Number(value) || 0).toLocaleString('en-US')}`

const sumNumbers = (values = []) =>
  values.reduce((total, value) => total + (Number(value) || 0), 0)

const getTotalBookings = (stats) => {
  if (!stats) return 0
  if (stats.totalBookings != null) return Number(stats.totalBookings) || 0
  if (Array.isArray(stats.bookingsOverTime)) {
    return sumNumbers(stats.bookingsOverTime)
  }
  return 0
}

const getVehiclesRented = (stats) => {
  if (!stats) return 0

  const value =
    stats.uniqueVehiclesRented ??
    stats.vehiclesRented?.value ??
    stats.vehiclesRented

  return Number(value) || 0
}

const getTotalRevenue = (stats) => {
  if (!stats) return 0
  if (stats.totalRevenue != null) return Number(stats.totalRevenue) || 0
  if (Array.isArray(stats.revenueOverview)) {
    return sumNumbers(stats.revenueOverview)
  }
  return 0
}

const getMaintenanceCount = (stats) => {
  if (!stats) return 0

  const directValue =
    stats.maintenanceCount ??
    stats.vehiclesInMaintenance?.value ??
    stats.vehiclesInMaintenance

  if (directValue != null) return Number(directValue) || 0

  const fleetData = stats.fleetStatus || stats.fleetUsage || []
  const maintenance = fleetData.find((item) =>
    String(item.label || item.status || '')
      .toLowerCase()
      .includes('maintenance')
  )

  return Number(maintenance?.value) || 0
}

const getTotalVehicles = (stats) => {
  if (!stats) return 0
  if (stats.totalVehicles != null) return Number(stats.totalVehicles) || 0

  const fleetData = stats.fleetStatus || stats.fleetUsage || []
  return fleetData.reduce(
    (total, item) => total + (Number(item.value) || 0),
    0
  )
}

function EmployeeHome() {
  const [tickets, setTickets] = useState([])
  const [stats, setStats] = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    const fetchHomeData = async () => {
      setLoading(true)
      setError('')

      try {
        const [statisticsData, bookingsData, ticketsData] =
          await Promise.all([
            getStatistics(),
            getBookings(),
            getTickets(),
          ])

        setStats(statisticsData)
        setBookings(Array.isArray(bookingsData) ? bookingsData : [])
        setTickets(extractTickets(ticketsData))
      } catch (err) {
        setError(err.message || 'Unable to load your dashboard.')
      } finally {
        setLoading(false)
      }
    }

    fetchHomeData()
  }, [])

  const outstandingTickets = useMemo(
    () =>
      tickets
        .filter((ticket) => {
          const status = String(ticket.status || '').toUpperCase()
          return status !== 'CLOSED' && status !== 'RESOLVED'
        })
        .sort((a, b) => {
          const priorityOrder = {
            URGENT: 0,
            HIGH: 1,
            NORMAL: 2,
            MEDIUM: 2,
            LOW: 3,
          }

          const priorityDifference =
            (priorityOrder[String(a.priority || '').toUpperCase()] ?? 4) -
            (priorityOrder[String(b.priority || '').toUpperCase()] ?? 4)

          if (priorityDifference !== 0) return priorityDifference

          return (
            new Date(b.created_at || b.createdAt || 0).getTime() -
            new Date(a.created_at || a.createdAt || 0).getTime()
          )
        })
        .slice(0, 3),
    [tickets]
  )

  const handleResolve = async (ticketId) => {
    setError('')

    try {
      const updatedTicket = await updateTicketStatus(ticketId, 'RESOLVED')

      setTickets((currentTickets) =>
        currentTickets.map((ticket) =>
          ticket.ticket_id === ticketId
            ? updatedTicket || { ...ticket, status: 'RESOLVED' }
            : ticket
        )
      )
    } catch (err) {
      setError(err.message || 'Unable to resolve the support ticket.')
    }
  }

  const summaryCards = useMemo(() => {
    if (!stats) return []

    const totalBookings = getTotalBookings(stats)
    const vehiclesRented = getVehiclesRented(stats)
    const totalRevenue = getTotalRevenue(stats)
    const maintenanceCount = getMaintenanceCount(stats)
    const totalVehicles = getTotalVehicles(stats)

    return [
      {
        label: 'Total Bookings',
        value: totalBookings,
        sublabel:
          totalBookings === 1
            ? '1 completed rental on record'
            : `${totalBookings} completed rentals on record`,
        icon: <IconCalendar />,
        iconClass: 'summary-icon-bookings',
      },
      {
        label: 'Vehicles Rented',
        value: vehiclesRented,
        sublabel: totalVehicles
          ? `of ${totalVehicles} vehicles in the fleet`
          : 'vehicles rented during the reporting period',
        icon: <IconCar />,
        iconClass: 'summary-icon-vehicles',
      },
      {
        label: 'Total Revenue',
        value: formatCurrency(totalRevenue),
        sublabel:
          totalBookings > 0
            ? `${formatCurrency(totalRevenue / totalBookings)} average per rental`
            : 'no completed-rental revenue',
        icon: <IconDollar />,
        iconClass: 'summary-icon-revenue',
      },
      {
        label: 'Vehicles In Maintenance',
        value: maintenanceCount,
        sublabel:
          maintenanceCount === 1
            ? '1 vehicle currently needs service'
            : `${maintenanceCount} vehicles currently need service`,
        icon: <IconWarning />,
        iconClass: 'summary-icon-maintenance',
      },
    ]
  }, [stats])

  // Show the newest/upcoming bookings first and keep the homepage compact.
  const previewBookings = useMemo(() => {
    const statusOrder = {
      ACTIVE: 0,
      BOOKED: 1,
      CONFIRMED: 1,
      PENDING: 2,
      COMPLETED: 3,
      CANCELLED: 4,
      CANCELED: 4,
    }

    return [...bookings]
      .sort((a, b) => {
        const aStatus = String(a.status || '').toUpperCase()
        const bStatus = String(b.status || '').toUpperCase()
        const statusDifference =
          (statusOrder[aStatus] ?? 5) - (statusOrder[bStatus] ?? 5)

        if (statusDifference !== 0) return statusDifference

        const aDate = new Date(a.pickupDate || 0).getTime()
        const bDate = new Date(b.pickupDate || 0).getTime()
        return bDate - aDate
      })
      .slice(0, 3)
  }, [bookings])

  return (
    <div className="employee-home-page">
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
              <circle
                cx="12"
                cy="8"
                r="4"
                stroke="#0f0f0f"
                strokeWidth="1.6"
              />
              <path
                d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6"
                stroke="#0f0f0f"
                strokeWidth="1.6"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <span className="username">Username</span>
        </div>
      </nav>

      {loading ? (
        <p className="home-loading">Loading your dashboard...</p>
      ) : (
        <div className="home-content">
          {error && (
            <p className="home-error" role="alert">
              {error}
            </p>
          )}

          <aside className="tickets-column">
            <h2 className="tickets-title">
              <Link to="/customer-support">Support Tickets Outstanding</Link>
            </h2>

            {outstandingTickets.map((ticket) => (
              <div className="ticket-card" key={ticket.ticket_id}>
                <div className="ticket-card-top">
                  <h3 className="ticket-number">
                    Ticket #{ticket.ticket_id}
                  </h3>
                  <span
                    className={`ticket-priority-badge ticket-priority-${toClassSuffix(
                      ticket.priority
                    )}`}
                  >
                    {ticket.priority}
                  </span>
                </div>

                <p className="ticket-subject">{ticket.subject}</p>

                <div className="ticket-box">{ticket.description}</div>

                <div className="ticket-card-meta">
                  <span
                    className={`ticket-status-badge ticket-status-${toClassSuffix(
                      ticket.status
                    )}`}
                  >
                    {formatStatusLabel(ticket.status)}
                  </span>
                  <span className="ticket-meta-text">
                    Customer #{ticket.customer_id}
                  </span>
                </div>

                <button
                  type="button"
                  className="resolve-btn"
                  onClick={() => handleResolve(ticket.ticket_id)}
                >
                  Resolve
                  <IconArrowUpRight />
                </button>
              </div>
            ))}

            {outstandingTickets.length === 0 && (
              <p className="tickets-empty">No More Support Tickets</p>
            )}
          </aside>

          <div className="main-column">
            <Link to="/locate-vehicles" className="locate-vehicles-btn">
              <span>Locate Vehicles</span>
              <IconPin />
            </Link>

            <section className="home-section">
              <h2 className="home-section-title">
                <Link to="/employee-stats">Statistics</Link>
              </h2>

              <div className="home-stats-row">
                {summaryCards.map((card) => (
                  <Link
                    to="/employee-stats"
                    className="home-stat-card"
                    key={card.label}
                  >
                    <div className="home-stat-card-top">
                      <span
                        className={`home-stat-icon ${card.iconClass}`}
                      >
                        {card.icon}
                      </span>
                    </div>

                    <span className="home-stat-value">{card.value}</span>
                    <span className="home-stat-label">{card.label}</span>
                    <span className="home-stat-sublabel">
                      {card.sublabel}
                    </span>
                  </Link>
                ))}
              </div>
            </section>

            <section className="home-section">
              <h2 className="home-section-title">
                <Link to="/employee-bookings">Bookings</Link>
              </h2>

              {previewBookings.length === 0 ? (
                <p className="home-bookings-empty">No bookings found.</p>
              ) : (
                <div className="home-bookings-list">
                  {previewBookings.map((booking) => (
                    <Link
                      to="/employee-bookings"
                      className="home-booking-card"
                      key={booking.id}
                    >
                      <div className="booking-image col-image">
                        <img
                          src={booking.image || carPlaceholder}
                          alt={booking.vehicle || 'Rental vehicle'}
                        />
                      </div>

                      <div className="home-booking-fields">
                        <div className="home-booking-field">
                          <span className="field-label">Customer</span>
                          <span className="field-value">
                            {booking.customer}
                          </span>
                        </div>

                        <div className="home-booking-field">
                          <span className="field-label">Vehicle</span>
                          <span className="field-value">
                            {booking.vehicle}
                          </span>
                        </div>

                        <div className="home-booking-field">
                          <span className="field-label">Pick up Date</span>
                          <span className="field-value">
                            {booking.pickupDate}
                          </span>
                        </div>

                        <div className="home-booking-field">
                          <span className="field-label">Return Date</span>
                          <span className="field-value">
                            {booking.returnDate}
                          </span>
                        </div>

                        <div className="home-booking-field status-field">
                          <span className="field-label">Status</span>
                          <span
                            className={`booking-status-badge booking-status-${toClassSuffix(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </div>
                    </Link>
                  ))}
                </div>
              )}
            </section>
          </div>
        </div>
      )}
    </div>
  )
}

function IconArrowUpRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="10.2" stroke="#0f0f0f" strokeWidth="1.6" />
      <path
        d="M9.5 14.5 14.5 9.5M10 9.5h4.5V14"
        stroke="#0f0f0f"
        strokeWidth="1.6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function IconPin() {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 21s7-6.2 7-11.5A7 7 0 0 0 5 9.5C5 14.8 12 21 12 21Z"
        stroke="#0f0f0f"
        strokeWidth="1.8"
        strokeLinejoin="round"
      />
      <circle cx="12" cy="9.5" r="2.4" stroke="#0f0f0f" strokeWidth="1.8" />
    </svg>
  )
}

function IconCalendar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect
        x="3.5"
        y="5"
        width="17"
        height="15"
        rx="2.5"
        stroke="currentColor"
        strokeWidth="1.6"
      />
      <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" stroke="currentColor" strokeWidth="1.6" />
      <line x1="8" y1="3" x2="8" y2="7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <line x1="16" y1="3" x2="16" y2="7" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
      <path d="M8 14l2.5 2.5L16 11" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconCar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M4 16l1.5-5.5C6 9 7 8.2 8.6 8.2h6.8c1.6 0 2.6.8 3.1 2.3L20 16"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <rect x="2.8" y="16" width="18.4" height="4" rx="1.4" stroke="currentColor" strokeWidth="1.6" />
      <circle cx="7" cy="20" r="1.6" fill="currentColor" />
      <circle cx="17" cy="20" r="1.6" fill="currentColor" />
    </svg>
  )
}

function IconDollar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
      <path
        d="M12 6.5v11M14.5 8.8c0-1.1-1-1.8-2.5-1.8s-2.5.7-2.5 1.8c0 2.4 5 1.2 5 3.6 0 1.1-1 1.8-2.5 1.8s-2.5-.7-2.5-1.8"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  )
}

function IconWarning() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path
        d="M12 3.5 21.5 20h-19Z"
        stroke="currentColor"
        strokeWidth="1.6"
        strokeLinejoin="round"
      />
      <line x1="12" y1="10" x2="12" y2="14.5" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <circle cx="12" cy="17.2" r="1" fill="currentColor" />
    </svg>
  )
}

export default EmployeeHome