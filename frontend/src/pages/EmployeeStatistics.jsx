import { useState, useMemo, useRef, useEffect } from 'react'
import logo from '../assets/Wheelio_logo.png'
import { Link } from 'react-router-dom'
import './EmployeeStatistics.css'

// ─── Raw data ─────────────────────────────────────────────────────
// Mirrors the "rentals" and "vehicles" tables in the database. Only
// the columns this page actually needs are kept. Swap RAW_RENTALS /
// RAW_VEHICLES for a real API call (e.g. getStatistics() from
// '../api/statistics') once that endpoint returns the same shape —
// see computeStatistics() below for exactly what shape is expected.
const RAW_RENTALS = [
  { rental_id: 1, vehicle_id: 1, pickup_date: '2026-07-01', status: 'COMPLETED', total_cost: 165.0 },
  { rental_id: 2, vehicle_id: 2, pickup_date: '2026-07-05', status: 'COMPLETED', total_cost: 120.0 },
  { rental_id: 3, vehicle_id: 3, pickup_date: '2026-07-15', status: 'COMPLETED', total_cost: 255.0 },
  { rental_id: 4, vehicle_id: 8, pickup_date: '2026-07-20', status: 'COMPLETED', total_cost: 270.0 },
  { rental_id: 5, vehicle_id: 6, pickup_date: '2026-07-22', status: 'COMPLETED', total_cost: 310.0 },
  { rental_id: 6, vehicle_id: 7, pickup_date: '2026-08-01', status: 'COMPLETED', total_cost: 204.0 },
  { rental_id: 7, vehicle_id: 8, pickup_date: '2026-08-05', status: 'COMPLETED', total_cost: 450.0 },
  { rental_id: 8, vehicle_id: 9, pickup_date: '2026-08-12', status: 'COMPLETED', total_cost: 380.0 },
  { rental_id: 9, vehicle_id: 10, pickup_date: '2026-08-18', status: 'COMPLETED', total_cost: 171.0 },
  { rental_id: 10, vehicle_id: 11, pickup_date: '2026-09-02', status: 'COMPLETED', total_cost: 352.0 },
]

const RAW_VEHICLES = [
  { vehicle_id: 1, make: 'Toyota', model: 'Corolla', status: 'AVAILABLE' },
  { vehicle_id: 2, make: 'Honda', model: 'Civic', status: 'AVAILABLE' },
  { vehicle_id: 3, make: 'Ford', model: 'Escape', status: 'AVAILABLE' },
  { vehicle_id: 4, make: 'Tesla', model: 'Model 3', status: 'AVAILABLE' },
  { vehicle_id: 5, make: 'Hyundai', model: 'Elantra', status: 'AVAILABLE' },
  { vehicle_id: 6, make: 'Chevrolet', model: 'Malibu', status: 'AVAILABLE' },
  { vehicle_id: 7, make: 'Nissan', model: 'Altima', status: 'AVAILABLE' },
  { vehicle_id: 8, make: 'Mazda', model: 'CX-5', status: 'AVAILABLE' },
  { vehicle_id: 9, make: 'Subaru', model: 'Outback', status: 'AVAILABLE' },
  { vehicle_id: 10, make: 'Volkswagen', model: 'Jetta', status: 'AVAILABLE' },
  { vehicle_id: 11, make: 'Kia', model: 'Sportage', status: 'AVAILABLE' },
  { vehicle_id: 12, make: 'Jeep', model: 'Wrangler', status: 'AVAILABLE' },
  { vehicle_id: 13, make: 'BMW', model: '330i', status: 'MAINTENANCE' },
  { vehicle_id: 14, make: 'Audi', model: 'A4', status: 'AVAILABLE' },
]

const FLEET_STATUS_COLORS = {
  AVAILABLE: '#17652b',
  MAINTENANCE: '#c0000a',
  RENTED: '#93690a',
}

// The earliest/latest pickup dates in the dataset, used as sensible
// defaults for the date range picker below.
const ALL_PICKUP_DATES = RAW_RENTALS.map((r) => r.pickup_date).sort()
const DEFAULT_START = ALL_PICKUP_DATES[0]
const DEFAULT_END = ALL_PICKUP_DATES[ALL_PICKUP_DATES.length - 1]

// Quick-pick shortcuts shown above the calendars, relative to the
// most recent date on record.
const RANGE_PRESETS = [
  { key: '7d', label: '7D', days: 7 },
  { key: '30d', label: '30D', days: 30 },
  { key: '90d', label: '90D', days: 90 },
  { key: 'all', label: 'All', days: null },
]

const WEEKDAY_LABELS = ['S', 'M', 'T', 'W', 'T', 'F', 'S']

// Formats a number as USD currency, e.g. 2677 -> "$2,677"
const formatCurrency = (value) => `$${Math.round(value).toLocaleString('en-US')}`
const formatCount = (value) => `${Math.round(value)}`

// Short, friendly date label for badges/subtitles, e.g. "Jul 1, 2026"
const formatDateLabel = (dateStr) =>
  toDate(dateStr).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' })

const toDate = (dateStr) => new Date(`${dateStr}T00:00:00Z`)
const dateToStr = (date) => date.toISOString().slice(0, 10)
const addDays = (date, days) => {
  const next = new Date(date)
  next.setUTCDate(next.getUTCDate() + days)
  return next
}
const daysBetween = (start, end) => Math.round((end.getTime() - start.getTime()) / 86400000) + 1
const inRange = (dateStr, start, end) => {
  const t = toDate(dateStr).getTime()
  return t >= start.getTime() && t <= end.getTime()
}

// Picks a chart-bucket granularity that keeps the axis readable no
// matter how wide a range the person selects.
const pickGranularity = (spanDays) => {
  if (spanDays <= 14) return 'day'
  if (spanDays <= 120) return 'week'
  if (spanDays <= 730) return 'month'
  return 'quarter'
}

const getBucketKey = (dateStr, granularity) => {
  const d = toDate(dateStr)
  if (granularity === 'day') return dateStr
  if (granularity === 'week') {
    const day = d.getUTCDay() || 7
    const monday = addDays(d, -(day - 1))
    return monday.toISOString().slice(0, 10)
  }
  if (granularity === 'month') return `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, '0')}`
  const quarter = Math.floor(d.getUTCMonth() / 3) + 1
  return `${d.getUTCFullYear()}-Q${quarter}`
}

const formatBucketLabel = (key, granularity) => {
  if (granularity === 'day' || granularity === 'week') {
    return toDate(key).toLocaleDateString('en-US', { month: 'short', day: 'numeric', timeZone: 'UTC' })
  }
  if (granularity === 'month') {
    const [y, m] = key.split('-')
    return new Date(Date.UTC(Number(y), Number(m) - 1, 1)).toLocaleDateString('en-US', { month: 'short', timeZone: 'UTC' })
  }
  const [y, q] = key.split('-')
  return `${q} '${y.slice(2)}`
}

// Rounds a max value up to a "nice" number that divides evenly into
// 4 axis ticks (4, 8, 12, 20, 40, 100, 200, ...) so y-axis labels are
// always clean round numbers instead of awkward decimals.
const computeNiceMax = (max) => {
  if (max <= 4) return 4
  if (max <= 8) return 8
  if (max <= 12) return 12
  if (max <= 20) return 20
  if (max <= 40) return 40
  if (max <= 100) return 100
  const magnitude = Math.pow(10, Math.floor(Math.log10(max)))
  return Math.ceil(max / magnitude) * magnitude
}

// Transforms the raw rentals/vehicles rows into everything this page
// renders, scoped to the selected [startDate, endDate] window, plus a
// same-length comparison period immediately before startDate so every
// stat can say "down 25% since {startDate}". This is the shape a real
// getStatistics(startDate, endDate) endpoint should return.
const computeStatistics = (rentals, vehicles, startDate, endDate) => {
  const start = toDate(startDate)
  const end = toDate(endDate)
  const spanDays = daysBetween(start, end)
  const granularity = pickGranularity(spanDays)

  const prevEnd = addDays(start, -1)
  const prevStart = addDays(prevEnd, -(spanDays - 1))

  const currentRentals = rentals.filter((r) => inRange(r.pickup_date, start, end))
  const prevRentals = rentals.filter((r) => inRange(r.pickup_date, prevStart, prevEnd))

  const buckets = {}
  currentRentals.forEach((r) => {
    const key = getBucketKey(r.pickup_date, granularity)
    if (!buckets[key]) buckets[key] = { count: 0, revenue: 0 }
    buckets[key].count += 1
    buckets[key].revenue += r.total_cost
  })
  const sortedKeys = Object.keys(buckets).sort()
  const labels = sortedKeys.map((k) => formatBucketLabel(k, granularity))
  const bookingsOverTime = sortedKeys.map((k) => buckets[k].count)
  const revenueOverview = sortedKeys.map((k) => buckets[k].revenue)

  const vehicleById = Object.fromEntries(vehicles.map((v) => [v.vehicle_id, v]))
  const rentalCounts = {}
  const rentalRevenue = {}
  currentRentals.forEach((r) => {
    rentalCounts[r.vehicle_id] = (rentalCounts[r.vehicle_id] || 0) + 1
    rentalRevenue[r.vehicle_id] = (rentalRevenue[r.vehicle_id] || 0) + r.total_cost
  })
  const mostRentedVehicles = Object.keys(rentalCounts)
    .map((id) => {
      const vehicle = vehicleById[id]
      return {
        label: vehicle ? `${vehicle.make} ${vehicle.model}` : `Vehicle #${id}`,
        value: rentalCounts[id],
        revenue: rentalRevenue[id],
      }
    })
    .sort((a, b) => b.value - a.value || b.revenue - a.revenue)
    .slice(0, 5)

  const statusCounts = {}
  vehicles.forEach((v) => {
    statusCounts[v.status] = (statusCounts[v.status] || 0) + 1
  })
  const fleetStatus = Object.keys(statusCounts).map((status) => ({
    label: status.charAt(0) + status.slice(1).toLowerCase(),
    value: statusCounts[status],
    color: FLEET_STATUS_COLORS[status] || '#909090',
  }))

  const totalBookings = currentRentals.length
  const totalRevenue = currentRentals.reduce((sum, r) => sum + r.total_cost, 0)
  const uniqueVehiclesRented = new Set(currentRentals.map((r) => r.vehicle_id)).size

  const prevTotalBookings = prevRentals.length
  const prevTotalRevenue = prevRentals.reduce((sum, r) => sum + r.total_cost, 0)
  const prevUniqueVehiclesRented = new Set(prevRentals.map((r) => r.vehicle_id)).size

  const isFullHistory = start.getTime() <= toDate(DEFAULT_START).getTime() && end.getTime() >= toDate(DEFAULT_END).getTime()

  return {
    labels,
    bookingsOverTime,
    revenueOverview,
    mostRentedVehicles,
    fleetStatus,
    totalBookings,
    totalRevenue,
    uniqueVehiclesRented,
    totalVehicles: vehicles.length,
    maintenanceCount: statusCounts.MAINTENANCE || 0,
    isFullHistory,
    pctChange: {
      bookings: computePctChange(totalBookings, prevTotalBookings),
      revenue: computePctChange(totalRevenue, prevTotalRevenue),
      vehicles: computePctChange(uniqueVehiclesRented, prevUniqueVehiclesRented),
    },
  }
}

const computePctChange = (current, previous) => {
  if (previous === 0 && current === 0) return { kind: 'none' }
  if (previous === 0) return { kind: 'new' }
  return { kind: 'value', pct: Math.round(((current - previous) / previous) * 100) }
}

// Builds a shared y-axis scale (nice max + 4 ticks + a toY converter)
// for the line and bar charts, so both draw a real, readable axis
// instead of relying on x-axis category labels alone.
const buildYScale = (values, height, paddingTop, paddingBottom) => {
  const rawMax = Math.max(...values, 0)
  const niceMax = computeNiceMax(rawMax || 1)
  const usableHeight = height - paddingTop - paddingBottom
  const toY = (value) => height - paddingBottom - (value / niceMax) * usableHeight
  const ticks = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(niceMax * f))
  return { niceMax, ticks, toY }
}


//The following is the employee statistics page, giving staff an overview
//of booking, rental, and fleet performance built from the rentals and
//vehicles tables, compared between a start and end date they choose.
function EmployeeStatistics() {
  const [startDate, setStartDate] = useState(DEFAULT_START)
  const [endDate, setEndDate] = useState(DEFAULT_END)

  const handleStartChange = (value) => {
    setStartDate(value)
    if (value > endDate) setEndDate(value)
  }

  const handleEndChange = (value) => {
    setEndDate(value)
    if (value < startDate) setStartDate(value)
  }

  const applyPreset = (preset) => {
    if (preset.days === null) {
      setStartDate(DEFAULT_START)
      setEndDate(DEFAULT_END)
      return
    }
    const end = DEFAULT_END
    let start = dateToStr(addDays(toDate(end), -(preset.days - 1)))
    if (toDate(start).getTime() < toDate(DEFAULT_START).getTime()) start = DEFAULT_START
    setStartDate(start)
    setEndDate(end)
  }

  // Recompute every derived stat whenever the selected dates change.
  // TODO: once a real getStatistics(startDate, endDate) endpoint
  // exists, replace this with a fetch and keep the same returned shape.
  const stats = useMemo(
    () => computeStatistics(RAW_RENTALS, RAW_VEHICLES, startDate, endDate),
    [startDate, endDate]
  )

  const sinceLabel = formatDateLabel(startDate)

  const summaryCards = [
    {
      label: 'Total Bookings',
      value: stats.totalBookings,
      sublabel: 'completed rentals in range',
      change: stats.pctChange.bookings,
      goodDirection: 'up',
      icon: <IconCalendar />,
      iconClass: 'summary-icon-bookings',
    },
    {
      label: 'Vehicles Rented',
      value: stats.uniqueVehiclesRented,
      sublabel: `of ${stats.totalVehicles} vehicles in the fleet`,
      change: stats.pctChange.vehicles,
      goodDirection: 'up',
      icon: <IconCar />,
      iconClass: 'summary-icon-vehicles',
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      sublabel: stats.totalBookings > 0
        ? `${formatCurrency(stats.totalRevenue / stats.totalBookings)} avg per rental`
        : 'no rentals in this range',
      change: stats.pctChange.revenue,
      goodDirection: 'up',
      icon: <IconDollar />,
      iconClass: 'summary-icon-revenue',
    },
    {
      label: 'Vehicles In Maintenance',
      value: stats.maintenanceCount,
      sublabel: stats.maintenanceCount === 1 ? '1 vehicle needs service' : `${stats.maintenanceCount} vehicles need service`,
      change: { kind: 'none' },
      goodDirection: 'down',
      icon: <IconWarning />,
      iconClass: 'summary-icon-maintenance',
    },
  ]

  return (
    <div className="employee-statistics-page">

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
          <Link to="/employee-bookings">Bookings</Link>
          <Link to="/employee-stats" className="nav-active">Statistics</Link>
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
      <main className="statistics-content">

        {/* Header row: title + subtitle on the left, date controls on the right */}
        <div className="statistics-page-header">
          <div>
            <h1 className="statistics-title">Statistics</h1>
            <p className="statistics-subtitle">
              {stats.isFullHistory
                ? `Showing all ${stats.totalBookings} rentals on record`
                : `${stats.totalBookings} rentals from ${formatDateLabel(startDate)} to ${formatDateLabel(endDate)}`}
            </p>
          </div>

          <div className="date-controls">
            <div className="range-presets">
              {RANGE_PRESETS.map((preset) => (
                <button
                  type="button"
                  key={preset.key}
                  className="preset-btn"
                  onClick={() => applyPreset(preset)}
                >
                  {preset.label}
                </button>
              ))}
            </div>

            <div className="date-range-calendars">
              <CalendarDropdown label="From" value={startDate} onChange={handleStartChange} max={endDate} />
              <IconArrowRight className="date-range-arrow" />
              <CalendarDropdown label="To" value={endDate} onChange={handleEndChange} min={startDate} />
            </div>
          </div>
        </div>

        {/* Summary / KPI cards */}
        <div className="summary-cards">
          {summaryCards.map((card) => (
            <div className="summary-card" key={card.label}>
              <div className="summary-card-top">
                <span className={`summary-icon ${card.iconClass}`}>{card.icon}</span>
                <TrendBadge change={card.change} goodDirection={card.goodDirection} sinceLabel={sinceLabel} />
              </div>
              <span className="summary-value">{card.value}</span>
              <span className="summary-label">{card.label}</span>
              <span className="summary-sublabel">{card.sublabel}</span>
            </div>
          ))}
        </div>

        {/* Chart panels */}
        <div className="chart-grid">

          {/* Bookings Over Time — line chart */}
          <div className="chart-panel">
            <h2 className="chart-title">Bookings Over Time</h2>
            {stats.bookingsOverTime.length > 0 ? (
              <LineChart labels={stats.labels} values={stats.bookingsOverTime} color="#e5212a" valueFormatter={formatCount} />
            ) : (
              <EmptyChartState message="No bookings in this range." />
            )}
          </div>

          {/* Most Rented Vehicles — horizontal bar chart */}
          <div className="chart-panel">
            <h2 className="chart-title">Most Rented Vehicles</h2>
            {stats.mostRentedVehicles.length > 0 ? (
              <HorizontalBarChart data={stats.mostRentedVehicles} />
            ) : (
              <EmptyChartState message="No rentals in this range." />
            )}
          </div>

          {/* Fleet Status — donut chart */}
          <div className="chart-panel">
            <h2 className="chart-title">Fleet Status</h2>
            <DonutChart data={stats.fleetStatus} centerLabel="Vehicles" />
          </div>

          {/* Revenue Overview — vertical bar chart */}
          <div className="chart-panel">
            <h2 className="chart-title">Revenue Overview</h2>
            {stats.revenueOverview.length > 0 ? (
              <VerticalBarChart labels={stats.labels} values={stats.revenueOverview} valueFormatter={formatCurrency} />
            ) : (
              <EmptyChartState message="No revenue in this range." />
            )}
          </div>
        </div>
      </main>
    </div>
  )
}


/* ─── Calendar Dropdown ─────────────────────────────────────────
   A click-to-pick calendar popup (not a native <input type="date">).
   Two instances are used above, one for "From" and one for "To". ── */
function CalendarDropdown({ label, value, onChange, min, max }) {
  const [open, setOpen] = useState(false)
  const [viewYear, setViewYear] = useState(toDate(value).getUTCFullYear())
  const [viewMonth, setViewMonth] = useState(toDate(value).getUTCMonth())
  const ref = useRef(null)
  const now = new Date()
  const todayStr = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false)
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const openCalendar = () => {
    const d = toDate(value)
    setViewYear(d.getUTCFullYear())
    setViewMonth(d.getUTCMonth())
    setOpen((o) => !o)
  }

  const goPrevMonth = () => {
    if (viewMonth === 0) { setViewMonth(11); setViewYear((y) => y - 1) } else setViewMonth((m) => m - 1)
  }
  const goNextMonth = () => {
    if (viewMonth === 11) { setViewMonth(0); setViewYear((y) => y + 1) } else setViewMonth((m) => m + 1)
  }

  const selectDay = (date, disabled) => {
    if (disabled) return
    onChange(dateToStr(date))
    setOpen(false)
  }

  // Build a full 6-row (42-cell) grid, including the tail end of the
  // previous month and the start of the next, like a standard calendar.
  const firstOfMonth = new Date(Date.UTC(viewYear, viewMonth, 1))
  const gridStart = addDays(firstOfMonth, -(firstOfMonth.getUTCDay()))
  const days = Array.from({ length: 42 }, (_, i) => addDays(gridStart, i))

  const minDate = min ? toDate(min) : null
  const maxDate = max ? toDate(max) : null

  return (
    <div className="calendar-dropdown" ref={ref}>
      <button type="button" className="calendar-trigger" onClick={openCalendar} aria-expanded={open}>
        <span className="calendar-trigger-label">{label}</span>
        <span className="calendar-trigger-value">
          <IconCalendarSmall />
          {formatDateLabel(value)}
        </span>
      </button>

      {open && (
        <div className="calendar-popup">
          <div className="calendar-popup-header">
            <button type="button" className="calendar-nav-btn" onClick={goPrevMonth} aria-label="Previous month">
              <IconChevronLeft />
            </button>
            <span className="calendar-popup-title">
              {new Date(Date.UTC(viewYear, viewMonth, 1)).toLocaleDateString('en-US', { month: 'long', year: 'numeric', timeZone: 'UTC' })}
            </span>
            <button type="button" className="calendar-nav-btn" onClick={goNextMonth} aria-label="Next month">
              <IconChevronRight />
            </button>
          </div>

          <div className="calendar-weekdays">
            {WEEKDAY_LABELS.map((w, i) => <span key={i}>{w}</span>)}
          </div>

          <div className="calendar-days">
            {days.map((date) => {
              const str = dateToStr(date)
              const inMonth = date.getUTCMonth() === viewMonth
              const isSelected = str === value
              const isToday = str === todayStr
              const disabled = (minDate && date < minDate) || (maxDate && date > maxDate)
              return (
                <button
                  type="button"
                  key={str}
                  className={[
                    'calendar-day',
                    !inMonth && 'calendar-day-muted',
                    isSelected && 'calendar-day-selected',
                    isToday && !isSelected && 'calendar-day-today',
                    disabled && 'calendar-day-disabled',
                  ].filter(Boolean).join(' ')}
                  disabled={disabled}
                  onClick={() => selectDay(date, disabled)}
                >
                  {date.getUTCDate()}
                </button>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}


/* ─── Trend Badge ─────────────────────────────────────────────── */
// Renders "▼ 25% since Jul 1, 2026" — an arrow instead of the word
// "up"/"down", a percentage, and the exact start date the person
// picked, so the comparison is always explicit and never mysterious.
function TrendBadge({ change, goodDirection, sinceLabel }) {
  if (change.kind === 'none') return null

  if (change.kind === 'new') {
    return <span className="trend-badge trend-new">New since {sinceLabel}</span>
  }

  const { pct } = change
  const isFlat = pct === 0
  const isPositive = pct > 0
  const isGood = isFlat ? null : goodDirection === 'up' ? isPositive : !isPositive

  return (
    <span className={`trend-badge ${isFlat ? 'trend-flat' : isGood ? 'trend-good' : 'trend-bad'}`}>
      {isFlat ? <IconFlat /> : isPositive ? <IconArrowUp /> : <IconArrowDown />}
      {Math.abs(pct)}%
      <span className="trend-badge-sub">since {sinceLabel}</span>
    </span>
  )
}

function EmptyChartState({ message }) {
  return (
    <div className="chart-empty">
      <span>{message}</span>
    </div>
  )
}


/* ─── Chart Sub-components ─────────────────────────────────────
   Small, dependency-free SVG charts, each with a real y-axis (tick
   values + gridlines) as well as the x-axis category labels, so the
   scale of the data is always readable at a glance. Swap these for a
   charting library (e.g. recharts) if the project already uses one. */

// Line chart with a gradient fill, used for "Bookings Over Time"
function LineChart({ labels, values, color = '#0f0f0f', valueFormatter = (v) => v }) {
  const width = 320
  const height = 180
  const paddingTop = 14
  const paddingBottom = 26
  const paddingLeft = 34
  const paddingRight = 12

  const { ticks, toY } = buildYScale(values, height, paddingTop, paddingBottom)
  const usableWidth = width - paddingLeft - paddingRight

  const points = values.length === 1
    ? [{ x: paddingLeft + usableWidth / 2, y: toY(values[0]), label: labels[0], value: values[0] }]
    : values.map((value, i) => ({
        x: paddingLeft + (usableWidth / (values.length - 1)) * i,
        y: toY(value),
        label: labels[i],
        value,
      }))

  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ')
  const areaPoints = `${paddingLeft},${toY(0)} ${polylinePoints} ${width - paddingRight},${toY(0)}`
  const gradientId = 'lineFill'

  return (
    <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Y-axis gridlines + value labels */}
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={paddingLeft} x2={width - paddingRight} y1={toY(tick)} y2={toY(tick)} className="chart-gridline" />
          <text x={paddingLeft - 8} y={toY(tick) + 3} textAnchor="end" className="chart-axis-label">
            {valueFormatter(tick)}
          </text>
        </g>
      ))}

      {points.length > 1 && (
        <>
          <polygon points={areaPoints} fill={`url(#${gradientId})`} />
          <polyline points={polylinePoints} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />
        </>
      )}

      {points.map((p) => (
        <circle key={p.label + p.x} cx={p.x} cy={p.y} r="3.5" fill={color}>
          <title>{p.label}: {valueFormatter(p.value)}</title>
        </circle>
      ))}

      {/* X-axis category labels */}
      {points.map((p) => (
        <text key={`${p.label}-${p.x}-x`} x={p.x} y={height - 6} textAnchor="middle" className="chart-axis-label">
          {p.label}
        </text>
      ))}
    </svg>
  )
}

// Vertical bar chart, used for "Revenue Overview"
function VerticalBarChart({ labels, values, valueFormatter = (v) => v }) {
  const width = 320
  const height = 180
  const paddingTop = 14
  const paddingBottom = 26
  const paddingLeft = 42
  const paddingRight = 12

  const { ticks, toY } = buildYScale(values, height, paddingTop, paddingBottom)
  const usableWidth = width - paddingLeft - paddingRight
  const step = usableWidth / values.length
  const barWidth = step * 0.55
  const baseline = toY(0)

  return (
    <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      {ticks.map((tick) => (
        <g key={tick}>
          <line x1={paddingLeft} x2={width - paddingRight} y1={toY(tick)} y2={toY(tick)} className="chart-gridline" />
          <text x={paddingLeft - 8} y={toY(tick) + 3} textAnchor="end" className="chart-axis-label">
            {valueFormatter(tick)}
          </text>
        </g>
      ))}

      {values.map((value, i) => {
        const x = paddingLeft + step * i + (step - barWidth) / 2
        const y = toY(value)
        return (
          <g key={labels[i] + i}>
            <rect x={x} y={y} width={barWidth} height={Math.max(baseline - y, 0)} rx="3" fill="#0f0f0f" className="vbar-rect">
              <title>{labels[i]}: {valueFormatter(value)}</title>
            </rect>
            <text x={x + barWidth / 2} y={height - 6} textAnchor="middle" className="chart-axis-label">
              {labels[i]}
            </text>
          </g>
        )
      })}
    </svg>
  )
}

// Horizontal bar chart used for "Most Rented Vehicles"
function HorizontalBarChart({ data }) {
  const max = Math.max(...data.map((d) => d.value), 1)

  return (
    <div className="hbar-chart">
      {data.map((d) => (
        <div className="hbar-row" key={d.label}>
          <span className="hbar-label">{d.label}</span>
          <div className="hbar-track">
            <div className="hbar-fill" style={{ width: `${(d.value / max) * 100}%` }} />
          </div>
          <span className="hbar-value">{d.value}</span>
        </div>
      ))}
    </div>
  )
}

// Donut chart with a percentage legend, used for "Fleet Status"
function DonutChart({ data, centerLabel }) {
  const size = 140
  const radius = 52
  const strokeWidth = 18
  const circumference = 2 * Math.PI * radius
  const total = data.reduce((sum, d) => sum + d.value, 0)
  const segments = data.map((d, index) => {
    const fraction = d.value / total
    const cumulative = data
      .slice(0, index)
      .reduce((sum, item) => sum + item.value / total, 0)

    return {
      ...d,
      dashArray: `${fraction * circumference} ${circumference}`,
      dashOffset: -cumulative * circumference,
      fraction,
    }
  })

  return (
    <div className="donut-chart">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {segments.map((d) => (
            <circle
              key={d.label}
              cx={size / 2}
              cy={size / 2}
              r={radius}
              fill="none"
              stroke={d.color}
              strokeWidth={strokeWidth}
              strokeDasharray={d.dashArray}
              strokeDashoffset={d.dashOffset}
              className="donut-segment"
            >
              <title>{d.label}: {d.value} ({Math.round(d.fraction * 100)}%)</title>
            </circle>
          ))}
        </g>
        <text x={size / 2} y={size / 2 - 6} textAnchor="middle" className="donut-total">
          {total}
        </text>
        <text x={size / 2} y={size / 2 + 12} textAnchor="middle" className="donut-total-label">
          {centerLabel}
        </text>
      </svg>

      <ul className="donut-legend">
        {data.map((d) => (
          <li key={d.label}>
            <span className="legend-dot" style={{ backgroundColor: d.color }} />
            <span className="legend-label">{d.label}</span>
            <span className="legend-value">{Math.round((d.value / total) * 100)}%</span>
          </li>
        ))}
      </ul>
    </div>
  )
}


/* ─── Icons ──────────────────────────────────────────────────────
   Small inline SVG icons, kept dependency-free like the rest of
   the page's illustrations. ─────────────────────────────────── */

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

function IconCalendarSmall() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <rect x="3.5" y="5" width="17" height="15" rx="2.5" stroke="currentColor" strokeWidth="1.8" />
      <line x1="3.5" y1="9.5" x2="20.5" y2="9.5" stroke="currentColor" strokeWidth="1.8" />
      <line x1="8" y1="3" x2="8" y2="7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="16" y1="3" x2="16" y2="7" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
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

function IconDollar() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="12" r="9" stroke="#0f0f0f" strokeWidth="1.6" />
      <path d="M12 7v10M14.5 9.3c0-1-1-1.8-2.5-1.8s-2.5.8-2.5 1.8c0 2.4 5 1.1 5 3.5 0 1-1 1.8-2.5 1.8s-2.5-.8-2.5-1.8" stroke="#e5212a" strokeWidth="1.5" strokeLinecap="round" />
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

function IconArrowUp() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 19V5M5 12l7-7 7 7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconArrowDown() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M12 5v14M5 12l7 7 7-7" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconFlat() {
  return (
    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M5 12h14" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  )
}

function IconArrowRight({ className }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M5 12h14M13 6l6 6-6 6" stroke="#909090" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconChevronLeft() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M15 6l-6 6 6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconChevronRight() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

export default EmployeeStatistics
