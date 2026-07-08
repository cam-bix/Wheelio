import { useState, useEffect, useMemo } from 'react'
import logo from '../assets/Wheelio_logo.png'
import { Link } from 'react-router-dom'
import './EmployeeStatistics.css'
import { getStatistics } from '../api/statistics'

// How many trailing months each range toggle shows
const RANGE_OPTIONS = [
  { key: '6M', months: 6 },
  { key: '12M', months: 12 },
]

// Formats a number as USD currency, e.g. 42300 -> "$42,300"
const formatCurrency = (value) => `$${value.toLocaleString('en-US')}`

// Percent change of the last value vs. the one before it, e.g. "+3.7%"
const trendFromSeries = (series) => {
  const curr = series[series.length - 1]
  const prev = series[series.length - 2]
  if (!prev) return 0
  return Math.round(((curr - prev) / prev) * 1000) / 10
}

// Builds {x, y, label, value} points for a line chart from a values
// array, scaled to fit the given dimensions.
const buildLinePoints = (values, labels, width, height, padding) => {
  const max = Math.max(...values)
  const step = (width - padding * 2) / (values.length - 1)

  return values.map((value, i) => ({
    x: padding + step * i,
    y: height - padding - (value / max) * (height - padding * 2),
    label: labels[i],
    value,
  }))
}


//The following is the employee statistics page, giving staff an overview
//of booking, rental, and revenue performance.
function EmployeeStatistics() {
  const [stats, setStats] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [range, setRange] = useState('6M')

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true)
      setError('')
      try {
        const data = await getStatistics()
        setStats(data)
      } catch (err) {
        setError(err.message || 'Unable to load statistics.')
      } finally {
        setLoading(false)
      }
    }

    fetchStats()
  }, [])

  // Slice the trailing N months out of the full year of mock data
  // based on the selected range toggle.
  const rangeData = useMemo(() => {
    if (!stats) return null

    const monthCount = RANGE_OPTIONS.find((r) => r.key === range).months
    const months = stats.months.slice(-monthCount)
    const bookings = stats.bookingsOverTime.slice(-monthCount)
    const revenue = stats.revenueOverview.slice(-monthCount)

    return {
      months,
      bookings,
      revenue,
      totalBookings: bookings.reduce((sum, v) => sum + v, 0),
      totalRevenue: revenue.reduce((sum, v) => sum + v, 0),
      bookingsTrend: trendFromSeries(bookings),
      revenueTrend: trendFromSeries(revenue),
    }
  }, [stats, range])

  // KPI summary cards shown along the top of the page
  const summaryCards = stats && rangeData
    ? [
        {
          label: 'Total Bookings',
          value: rangeData.totalBookings,
          trendPct: rangeData.bookingsTrend,
          goodDirection: 'up',
          icon: <IconCalendar />,
        },
        {
          label: 'Vehicles Rented',
          value: stats.vehiclesRented.value,
          trendPct: stats.vehiclesRented.trendPct,
          goodDirection: 'up',
          icon: <IconCar />,
        },
        {
          label: 'Total Revenue',
          value: formatCurrency(rangeData.totalRevenue),
          trendPct: rangeData.revenueTrend,
          goodDirection: 'up',
          icon: <IconDollar />,
        },
        {
          label: 'Vehicle Incidents',
          value: stats.vehicleIncidents.value,
          trendPct: stats.vehicleIncidents.trendPct,
          goodDirection: 'down',
          icon: <IconWarning />,
        },
      ]
    : []

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
          <Link to="/employee-stats"className="nav-active">Statistics</Link>
          <Link to="/support">Customer Support</Link>
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

        {/* Header row: title on the left, range toggle on the right */}
        <div className="statistics-page-header">
          <h1 className="statistics-title">Statistics</h1>

          <div className="range-toggle" role="tablist" aria-label="Date range">
            {RANGE_OPTIONS.map((option) => (
              <button
                key={option.key}
                type="button"
                role="tab"
                aria-selected={range === option.key}
                className={`range-btn ${range === option.key ? 'range-btn-active' : ''}`}
                onClick={() => setRange(option.key)}
              >
                {option.key}
              </button>
            ))}
          </div>
        </div>

        {error && <p className="statistics-error" role="alert">{error}</p>}

        {loading ? (
          <p className="statistics-loading">Loading statistics...</p>
        ) : (
          <>
            {/* Summary / KPI cards */}
            <div className="summary-cards">
              {summaryCards.map((card) => {
                const isGood = card.goodDirection === 'up' ? card.trendPct >= 0 : card.trendPct <= 0
                return (
                  <div className="summary-card" key={card.label}>
                    <div className="summary-card-top">
                      <span className="summary-icon">{card.icon}</span>
                      <span className={`trend-badge ${isGood ? 'trend-good' : 'trend-bad'}`}>
                        {card.trendPct >= 0 ? '▲' : '▼'} {Math.abs(card.trendPct)}%
                      </span>
                    </div>
                    <span className="summary-value">{card.value}</span>
                    <span className="summary-label">{card.label}</span>
                  </div>
                )
              })}
            </div>

            {/* Chart panels */}
            <div className="chart-grid">

              {/* Bookings Over Time — line chart */}
              <div className="chart-panel">
                <h2 className="chart-title">Bookings Over Time</h2>
                <LineChart labels={rangeData.months} values={rangeData.bookings} color="#e5212a" />
              </div>

              {/* Most Rented Vehicles — horizontal bar chart */}
              <div className="chart-panel">
                <h2 className="chart-title">Most Rented Vehicles</h2>
                <HorizontalBarChart data={stats.mostRentedVehicles} />
              </div>

              {/* Bookings by Status — donut chart */}
              <div className="chart-panel">
                <h2 className="chart-title">Bookings by Status</h2>
                <DonutChart data={stats.bookingsByStatus} />
              </div>

              {/* Revenue Overview — vertical bar chart */}
              <div className="chart-panel">
                <h2 className="chart-title">Revenue Overview</h2>
                <VerticalBarChart labels={rangeData.months} values={rangeData.revenue} />
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  )
}


/* ─── Chart Sub-components ─────────────────────────────────────
   Small, dependency-free SVG charts. Swap these for a charting
   library (e.g. recharts) if the project already uses one. ───── */

// Simple line chart with a gradient fill and light grid lines,
// used for "Bookings Over Time"
function LineChart({ labels, values, color = '#0f0f0f' }) {
  const width = 320
  const height = 160
  const padding = 24
  const points = buildLinePoints(values, labels, width, height, padding)
  const polylinePoints = points.map((p) => `${p.x},${p.y}`).join(' ')
  const areaPoints = `${padding},${height - padding} ${polylinePoints} ${width - padding},${height - padding}`
  const gradientId = 'lineFill'

  return (
    <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor={color} stopOpacity="0.25" />
          <stop offset="100%" stopColor={color} stopOpacity="0" />
        </linearGradient>
      </defs>

      {/* Light horizontal grid lines */}
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={padding}
          x2={width - padding}
          y1={padding + f * (height - padding * 2)}
          y2={padding + f * (height - padding * 2)}
          className="chart-gridline"
        />
      ))}

      <polygon points={areaPoints} fill={`url(#${gradientId})`} />
      <polyline points={polylinePoints} fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" />

      {points.map((p) => (
        <circle key={p.label} cx={p.x} cy={p.y} r="3.5" fill={color}>
          <title>{p.label}: {p.value}</title>
        </circle>
      ))}

      {points.map((p) => (
        <text key={`${p.label}-label`} x={p.x} y={height - 4} textAnchor="middle" className="chart-axis-label">
          {p.label}
        </text>
      ))}
    </svg>
  )
}

// Vertical bar chart with value labels, used for "Revenue Overview"
function VerticalBarChart({ labels, values }) {
  const width = 320
  const height = 160
  const padding = 24
  const max = Math.max(...values)
  const step = (width - padding * 2) / values.length
  const barWidth = step * 0.55

  return (
    <svg className="chart-svg" viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="xMidYMid meet">
      {[0.25, 0.5, 0.75].map((f) => (
        <line
          key={f}
          x1={padding}
          x2={width - padding}
          y1={padding + f * (height - padding * 2)}
          y2={padding + f * (height - padding * 2)}
          className="chart-gridline"
        />
      ))}

      {values.map((value, i) => {
        const barHeight = (value / max) * (height - padding * 2)
        const x = padding + step * i + (step - barWidth) / 2
        const y = height - padding - barHeight
        return (
          <g key={labels[i]}>
            <rect x={x} y={y} width={barWidth} height={barHeight} rx="3" fill="#0f0f0f" className="vbar-rect">
              <title>{labels[i]}: {formatCurrency(value)}</title>
            </rect>
            <text x={x + barWidth / 2} y={height - 4} textAnchor="middle" className="chart-axis-label">
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
  const max = Math.max(...data.map((d) => d.value))

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

// Donut chart with a percentage legend, used for "Bookings by Status"
function DonutChart({ data }) {
  const size = 140
  const radius = 52
  const strokeWidth = 18
  const circumference = 2 * Math.PI * radius
  const total = data.reduce((sum, d) => sum + d.value, 0)

  let cumulative = 0

  return (
    <div className="donut-chart">
      <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`}>
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {data.map((d) => {
            const fraction = d.value / total
            const dashArray = `${fraction * circumference} ${circumference}`
            const dashOffset = -cumulative * circumference
            cumulative += fraction
            return (
              <circle
                key={d.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={d.color}
                strokeWidth={strokeWidth}
                strokeDasharray={dashArray}
                strokeDashoffset={dashOffset}
                className="donut-segment"
              >
                <title>{d.label}: {d.value} ({Math.round(fraction * 100)}%)</title>
              </circle>
            )
          })}
        </g>
        <text x={size / 2} y={size / 2 - 6} textAnchor="middle" className="donut-total">
          {total}
        </text>
        <text x={size / 2} y={size / 2 + 12} textAnchor="middle" className="donut-total-label">
          Bookings
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


/* ─── KPI Card Icons ────────────────────────────────────────────
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

export default EmployeeStatistics
