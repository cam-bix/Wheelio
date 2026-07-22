import { useEffect, useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import carPlaceholder from '../assets/placeholder_image.jpg'
import logo from '../assets/Wheelio_logo.png'
import { getBookings } from '../api/bookings'
import './EmployeeCalendar.css'

const WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

// Converts backend date values into YYYY-MM-DD.
const normalizeDate = (value) => {
  if (!value) return null

  const isoDate = /^\d{4}-\d{2}-\d{2}/.exec(value)
  if (isoDate) return isoDate[0]

  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return null

  return [
    date.getFullYear(),
    String(date.getMonth() + 1).padStart(2, '0'),
    String(date.getDate()).padStart(2, '0'),
  ].join('-')
}

const toDate = (dateString) =>
  new Date(`${dateString}T00:00:00Z`)

const toDateString = (date) =>
  date.toISOString().slice(0, 10)

const addDays = (date, amount) => {
  const result = new Date(date)
  result.setUTCDate(result.getUTCDate() + amount)
  return result
}

const formatDate = (dateString, includeWeekday = false) =>
  toDate(dateString).toLocaleDateString('en-US', {
    ...(includeWeekday && { weekday: 'long' }),
    month: includeWeekday ? 'long' : 'short',
    day: 'numeric',
    ...(includeWeekday && { year: 'numeric' }),
    timeZone: 'UTC',
  })

const statusClass = (status) =>
  status?.toLowerCase().replace(/\s+/g, '-') || 'unknown'

const isCancelled = (booking) =>
  booking.status?.toUpperCase() === 'CANCELLED'

const getDaySummary = (activeCount, cancelledCount) => {
  if (!activeCount && !cancelledCount) {
    return 'No bookings on this date'
  }

  const summary = []

  if (activeCount) {
    summary.push(
      `${activeCount} vehicle${activeCount === 1 ? '' : 's'} booked`
    )
  } else {
    summary.push('No active bookings')
  }

  if (cancelledCount) {
    summary.push(`${cancelledCount} cancelled`)
  }

  return summary.join(' · ')
}

function EmployeeCalendar() {
  const now = new Date()

  const todayString = [
    now.getFullYear(),
    String(now.getMonth() + 1).padStart(2, '0'),
    String(now.getDate()).padStart(2, '0'),
  ].join('-')

  const [bookings, setBookings] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [viewYear, setViewYear] = useState(now.getFullYear())
  const [viewMonth, setViewMonth] = useState(now.getMonth())
  const [selectedDate, setSelectedDate] = useState(todayString)

  useEffect(() => {
    const loadBookings = async () => {
      setLoading(true)
      setError('')

      try {
        setBookings(await getBookings())
      } catch (err) {
        setError(err.message || 'Unable to load bookings.')
      } finally {
        setLoading(false)
      }
    }

    loadBookings()
  }, [])

  // Normalizes booking dates and places each booking on every rental day.
  const { bookingsByDate, normalizedBookings } = useMemo(() => {
    const normalized = bookings
      .map((booking) => ({
        ...booking,
        pickupKey: normalizeDate(booking.pickupDate),
        returnKey: normalizeDate(booking.returnDate),
      }))
      .filter((booking) => booking.pickupKey && booking.returnKey)

    const byDate = {}

    normalized.forEach((booking) => {
      let current = toDate(booking.pickupKey)
      const finalDate = toDate(booking.returnKey)

      while (current <= finalDate) {
        const key = toDateString(current)

        if (!byDate[key]) byDate[key] = []
        byDate[key].push(booking)

        current = addDays(current, 1)
      }
    })

    return {
      bookingsByDate: byDate,
      normalizedBookings: normalized,
    }
  }, [bookings])

  // Creates the six-week grid displayed by the calendar.
  const calendarDays = useMemo(() => {
    const firstDay = new Date(Date.UTC(viewYear, viewMonth, 1))
    const gridStart = addDays(firstDay, -firstDay.getUTCDay())

    return Array.from(
      { length: 42 },
      (_, index) => addDays(gridStart, index)
    )
  }, [viewYear, viewMonth])

  // Counts active reservations only. Cancelled bookings do not occupy
  // a vehicle and are excluded from the month total.
  const monthBookingCount = useMemo(() => {
    const monthStart = toDateString(
      new Date(Date.UTC(viewYear, viewMonth, 1))
    )

    const monthEnd = toDateString(
      new Date(Date.UTC(viewYear, viewMonth + 1, 0))
    )

    return normalizedBookings.filter(
      (booking) =>
        !isCancelled(booking) &&
        booking.pickupKey <= monthEnd &&
        booking.returnKey >= monthStart
    ).length
  }, [normalizedBookings, viewYear, viewMonth])

  const selectedBookings = bookingsByDate[selectedDate] || []

  const selectedActiveBookings = selectedBookings.filter(
    (booking) => !isCancelled(booking)
  )

  const selectedCancelledBookings = selectedBookings.filter(isCancelled)

  const monthLabel = new Date(
    Date.UTC(viewYear, viewMonth, 1)
  ).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
    timeZone: 'UTC',
  })

  const changeMonth = (amount) => {
    const newDate = new Date(
      Date.UTC(viewYear, viewMonth + amount, 1)
    )

    setViewYear(newDate.getUTCFullYear())
    setViewMonth(newDate.getUTCMonth())
  }

  const goToday = () => {
    setViewYear(now.getFullYear())
    setViewMonth(now.getMonth())
    setSelectedDate(todayString)
  }

  return (
    <div className="employee-calendar-page">

      {/* ─── Top Navigation Bar ─────────────────────────────── */}
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/employee-home">
            <img
              src={logo}
              alt="Wheelio Logo"
              className="navbar-logo-image"
            />
          </Link>
        </div>

        <div className="navbar-links">
          <Link to="/employee-home">Home</Link>
          <Link to="/employee-inventory">Check Inventory</Link>

          <Link
            to="/employee-bookings"
            className="nav-active"
          >
            Bookings
          </Link>

          <Link to="/employee-stats">Statistics</Link>
          <Link to="/customer-support">Customer Support</Link>
        </div>

        <div className="navbar-user">
          <span className="user-icon" aria-hidden="true">
            <UserIcon />
          </span>

          <span className="username">Username</span>
        </div>
      </nav>

      {/* ─── Page Content ───────────────────────────────────── */}
      <main className="calendar-content">

        {/* Back button and page heading */}
        <div className="calendar-page-header">
          <Link
            to="/employee-bookings"
            className="calendar-back-btn"
          >
            <ArrowIcon direction="left" />
            Back to Bookings
          </Link>

          <div className="calendar-heading">
            <h1 className="calendar-title">Rental Calendar</h1>

            {!loading && (
              <p className="calendar-subtitle">
                {monthBookingCount === 0
                  ? `No active bookings during ${monthLabel}`
                  : `${monthBookingCount} active booking${
                      monthBookingCount === 1 ? '' : 's'
                    } during ${monthLabel}`}
              </p>
            )}
          </div>
        </div>

        {error && (
          <p className="calendar-error" role="alert">
            {error}
          </p>
        )}

        {loading ? (
          <p className="calendar-loading">
            Loading calendar...
          </p>
        ) : (
          <div className="calendar-layout">

            {/* ─── Main Calendar ────────────────────────────── */}
            <section className="calendar-card">
              <div className="calendar-toolbar">
                <div className="calendar-month-nav">
                  <button
                    type="button"
                    className="calendar-nav-btn"
                    onClick={() => changeMonth(-1)}
                    aria-label="Previous month"
                  >
                    <ArrowIcon direction="left" />
                  </button>

                  <span className="calendar-month-label">
                    {monthLabel}
                  </span>

                  <button
                    type="button"
                    className="calendar-nav-btn"
                    onClick={() => changeMonth(1)}
                    aria-label="Next month"
                  >
                    <ArrowIcon direction="right" />
                  </button>
                </div>

                <button
                  type="button"
                  className="calendar-today-btn"
                  onClick={goToday}
                >
                  Today
                </button>
              </div>

              <div className="calendar-weekdays">
                {WEEKDAYS.map((weekday) => (
                  <span key={weekday}>{weekday}</span>
                ))}
              </div>

              <div className="calendar-grid">
                {calendarDays.map((date) => {
                  const dateString = toDateString(date)
                  const dayBookings = bookingsByDate[dateString] || []

                  const activeBookings = dayBookings.filter(
                    (booking) => !isCancelled(booking)
                  )

                  const cancelledBookings = dayBookings.filter(isCancelled)

                  const hasActiveBookings = activeBookings.length > 0
                  const hasOnlyCancelled =
                    !hasActiveBookings && cancelledBookings.length > 0

                  const inCurrentMonth =
                    date.getUTCMonth() === viewMonth

                  const classes = [
                    'calendar-cell',
                    !inCurrentMonth && 'calendar-cell-muted',
                    hasActiveBookings &&
                      inCurrentMonth &&
                      'calendar-cell-booked',
                    hasOnlyCancelled &&
                      inCurrentMonth &&
                      'calendar-cell-cancelled-only',
                    dateString === selectedDate &&
                      'calendar-cell-selected',
                    dateString === todayString &&
                      dateString !== selectedDate &&
                      'calendar-cell-today',
                  ]
                    .filter(Boolean)
                    .join(' ')

                  return (
                    <button
                      type="button"
                      key={dateString}
                      className={classes}
                      onClick={() => setSelectedDate(dateString)}
                      aria-label={`${formatDate(
                        dateString,
                        true
                      )}, ${activeBookings.length} active, ${
                        cancelledBookings.length
                      } cancelled`}
                    >
                      <span className="calendar-cell-top">
                        <span className="calendar-cell-date">
                          {date.getUTCDate()}
                        </span>

                        {/* Cancelled bookings are excluded from this count. */}
                        {hasActiveBookings && (
                          <span className="calendar-booking-count">
                            {activeBookings.length}
                          </span>
                        )}
                      </span>

                      {dayBookings.length > 0 && (
                        <span className="calendar-cell-dots">
                          {dayBookings.slice(0, 3).map((booking) => (
                            <span
                              key={booking.id}
                              className={`booking-dot booking-dot-${statusClass(
                                booking.status
                              )}`}
                            />
                          ))}

                          {dayBookings.length > 3 && (
                            <span className="booking-dot-more">
                              +{dayBookings.length - 3}
                            </span>
                          )}
                        </span>
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Cancelled is gray because the vehicle remains available. */}
              <div className="calendar-legend">
                <Legend status="active" label="Active" />
                <Legend status="pending" label="Pending" />
                <Legend status="booked" label="Booked" />
                <Legend status="cancelled" label="Cancelled" />
              </div>
            </section>

            {/* ─── Selected Date Details ────────────────────── */}
            <aside className="day-panel">
              <div className="day-panel-heading">
                <span className="day-panel-icon">
                  <CalendarIcon />
                </span>

                <div>
                  <h2 className="day-panel-title">
                    {formatDate(selectedDate, true)}
                  </h2>

                  <p className="day-panel-count">
                    {getDaySummary(
                      selectedActiveBookings.length,
                      selectedCancelledBookings.length
                    )}
                  </p>
                </div>
              </div>

              {selectedBookings.length === 0 ? (
                <div className="day-panel-empty">
                  <CalendarIcon size={34} />

                  <p>No rental activity scheduled.</p>

                  <Link to="/employee-bookings">
                    View all bookings
                  </Link>
                </div>
              ) : (
                <div className="day-bookings-list">
                  {selectedBookings.map((booking) => (
                    <article
                      className={`day-booking-card ${
                        isCancelled(booking)
                          ? 'day-booking-card-cancelled'
                          : ''
                      }`}
                      key={booking.id}
                    >
                      <div className="day-booking-image">
                        <img
                          src={booking.image || carPlaceholder}
                          alt={booking.vehicle}
                        />
                      </div>

                      <div className="day-booking-body">
                        <div className="day-booking-header">
                          <span className="day-booking-number">
                            Booking #{booking.id}
                          </span>

                          <span
                            className={`calendar-status-badge calendar-status-${statusClass(
                              booking.status
                            )}`}
                          >
                            {booking.status}
                          </span>
                        </div>

                        <p className="day-booking-vehicle">
                          {booking.vehicle}
                        </p>

                        <p className="day-booking-customer">
                          {booking.customer}
                        </p>

                        <div className="day-booking-date-row">
                          <span>
                            <strong>Pickup</strong>
                            {formatDate(booking.pickupKey)}
                          </span>

                          <span className="date-arrow">→</span>

                          <span>
                            <strong>Return</strong>
                            {formatDate(booking.returnKey)}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))}
                </div>
              )}
            </aside>
          </div>
        )}
      </main>
    </div>
  )
}

function Legend({ status, label }) {
  return (
    <span className="legend-item">
      <span className={`booking-dot booking-dot-${status}`} />
      {label}
    </span>
  )
}

function ArrowIcon({ direction }) {
  const path =
    direction === 'left'
      ? 'M15 6l-6 6 6 6'
      : 'M9 6l6 6-6 6'

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={path}
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

function CalendarIcon({ size = 20 }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <rect
        x="3"
        y="5"
        width="18"
        height="16"
        rx="3"
        stroke="currentColor"
        strokeWidth="1.7"
      />

      <path
        d="M8 3v4M16 3v4M3 10h18"
        stroke="currentColor"
        strokeWidth="1.7"
        strokeLinecap="round"
      />
    </svg>
  )
}

function UserIcon() {
  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
    >
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
  )
}

export default EmployeeCalendar