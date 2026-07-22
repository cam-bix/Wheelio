import { useMemo, useState } from 'react'
import { Link } from 'react-router-dom'
import logo from '../assets/Wheelio_logo.png'
import './EmployeeStatistics.css'

// ─── Temporary Data ──────────────────────────────────────────────
// Replace these arrays with API data later.
const RAW_RENTALS = [
  { vehicle_id: 1, pickup_date: '2026-07-01', total_cost: 165 },
  { vehicle_id: 2, pickup_date: '2026-07-05', total_cost: 120 },
  { vehicle_id: 3, pickup_date: '2026-07-15', total_cost: 255 },
  { vehicle_id: 8, pickup_date: '2026-07-20', total_cost: 270 },
  { vehicle_id: 6, pickup_date: '2026-07-22', total_cost: 310 },
  { vehicle_id: 7, pickup_date: '2026-08-01', total_cost: 204 },
  { vehicle_id: 8, pickup_date: '2026-08-05', total_cost: 450 },
  { vehicle_id: 9, pickup_date: '2026-08-12', total_cost: 380 },
  { vehicle_id: 10, pickup_date: '2026-08-18', total_cost: 171 },
  { vehicle_id: 11, pickup_date: '2026-09-02', total_cost: 352 },
]

const RAW_VEHICLES = [
  { vehicle_id: 1, name: 'Toyota Corolla', status: 'AVAILABLE' },
  { vehicle_id: 2, name: 'Honda Civic', status: 'AVAILABLE' },
  { vehicle_id: 3, name: 'Ford Escape', status: 'AVAILABLE' },
  { vehicle_id: 4, name: 'Tesla Model 3', status: 'AVAILABLE' },
  { vehicle_id: 5, name: 'Hyundai Elantra', status: 'AVAILABLE' },
  { vehicle_id: 6, name: 'Chevrolet Malibu', status: 'AVAILABLE' },
  { vehicle_id: 7, name: 'Nissan Altima', status: 'AVAILABLE' },
  { vehicle_id: 8, name: 'Mazda CX-5', status: 'AVAILABLE' },
  { vehicle_id: 9, name: 'Subaru Outback', status: 'AVAILABLE' },
  { vehicle_id: 10, name: 'Volkswagen Jetta', status: 'AVAILABLE' },
  { vehicle_id: 11, name: 'Kia Sportage', status: 'AVAILABLE' },
  { vehicle_id: 12, name: 'Jeep Wrangler', status: 'AVAILABLE' },
  { vehicle_id: 13, name: 'BMW 330i', status: 'MAINTENANCE' },
  { vehicle_id: 14, name: 'Audi A4', status: 'AVAILABLE' },
]

// Every non-All range compares with the immediately preceding period.
const RANGE_OPTIONS = [
  {
    key: '7d',
    label: 'Last 7 Days',
    days: 7,
    comparisonLabel: 'prior week',
  },
  {
    key: '1m',
    label: 'Last Month',
    days: 30,
    comparisonLabel: 'prior month',
  },
  {
    key: 'all',
    label: 'All',
    days: null,
    comparisonLabel: null,
  },
]

const PICKUP_DATES = RAW_RENTALS
  .map((rental) => rental.pickup_date)
  .sort()

const DEFAULT_START = PICKUP_DATES[0]
const DEFAULT_END = PICKUP_DATES[PICKUP_DATES.length - 1]
const DAY_MS = 86400000

// ─── General Helpers ─────────────────────────────────────────────

const formatCurrency = (value) =>
  `$${Math.round(value).toLocaleString('en-US')}`

const toDate = (dateString) =>
  new Date(`${dateString}T00:00:00Z`)

const dateToString = (date) =>
  date.toISOString().slice(0, 10)

const addDays = (date, amount) => {
  const copy = new Date(date)
  copy.setUTCDate(copy.getUTCDate() + amount)
  return copy
}

const getTodayString = () => {
  const today = new Date()

  return [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, '0'),
    String(today.getDate()).padStart(2, '0'),
  ].join('-')
}

const formatDate = (dateString) =>
  toDate(dateString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    timeZone: 'UTC',
  })

const isWithinRange = (dateString, start, end) => {
  const time = toDate(dateString).getTime()
  return time >= start.getTime() && time <= end.getTime()
}

const calculateChange = (current, previous) => {
  if (current === 0 && previous === 0) {
    return { kind: 'none' }
  }

  if (previous === 0) {
    return { kind: 'new' }
  }

  return {
    kind: 'value',
    pct: Math.round(((current - previous) / previous) * 100),
  }
}

// ─── Chart Bucket Helpers ────────────────────────────────────────

const getGranularity = (days) => {
  if (days <= 14) return 'day'
  if (days <= 120) return 'week'
  return 'month'
}

const getBucketStart = (date, type) => {
  if (type === 'day') {
    return new Date(date)
  }

  if (type === 'week') {
    const weekday = date.getUTCDay() || 7
    return addDays(date, -(weekday - 1))
  }

  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1)
  )
}

const getNextBucket = (date, type) => {
  if (type === 'day') return addDays(date, 1)
  if (type === 'week') return addDays(date, 7)

  return new Date(
    Date.UTC(date.getUTCFullYear(), date.getUTCMonth() + 1, 1)
  )
}

const getBucketKey = (dateString, type) => {
  const start = getBucketStart(toDate(dateString), type)

  if (type === 'month') {
    return `${start.getUTCFullYear()}-${String(
      start.getUTCMonth() + 1
    ).padStart(2, '0')}`
  }

  return dateToString(start)
}

const getBucketKeys = (start, end, type) => {
  const keys = []
  let date = getBucketStart(start, type)
  const lastDate = getBucketStart(end, type)

  while (date <= lastDate) {
    if (type === 'month') {
      keys.push(
        `${date.getUTCFullYear()}-${String(
          date.getUTCMonth() + 1
        ).padStart(2, '0')}`
      )
    } else {
      keys.push(dateToString(date))
    }

    date = getNextBucket(date, type)
  }

  return keys
}

const formatBucket = (key, type) => {
  if (type !== 'month') {
    return toDate(key).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      timeZone: 'UTC',
    })
  }

  const [year, month] = key.split('-')

  return new Date(
    Date.UTC(Number(year), Number(month) - 1)
  ).toLocaleDateString('en-US', {
    month: 'short',
    timeZone: 'UTC',
  })
}

// ─── Statistics Calculation ─────────────────────────────────────

const computeStatistics = (
  rentals,
  vehicles,
  startDate,
  endDate,
  compare
) => {
  const start = toDate(startDate)
  const end = toDate(endDate)
  const days = Math.round((end - start) / DAY_MS) + 1
  const granularity = getGranularity(days)

  const previousEnd = addDays(start, -1)
  const previousStart = addDays(previousEnd, -(days - 1))

  const currentRentals = rentals.filter((rental) =>
    isWithinRange(rental.pickup_date, start, end)
  )

  const previousRentals = compare
    ? rentals.filter((rental) =>
      isWithinRange(
        rental.pickup_date,
        previousStart,
        previousEnd
      )
    )
    : []

  // Create every chart period, including periods with zero rentals.
  const bucketKeys = getBucketKeys(start, end, granularity)

  const buckets = Object.fromEntries(
    bucketKeys.map((key) => [
      key,
      {
        bookings: 0,
        revenue: 0,
      },
    ])
  )

  currentRentals.forEach((rental) => {
    const key = getBucketKey(rental.pickup_date, granularity)

    if (!buckets[key]) {
      buckets[key] = {
        bookings: 0,
        revenue: 0,
      }
    }

    buckets[key].bookings += 1
    buckets[key].revenue += rental.total_cost
  })

  const labels = bucketKeys.map((key) =>
    formatBucket(key, granularity)
  )

  const bookingValues = bucketKeys.map(
    (key) => buckets[key]?.bookings || 0
  )

  const revenueValues = bucketKeys.map(
    (key) => buckets[key]?.revenue || 0
  )

  // Calculate the most-rented vehicles.
  const vehicleMap = Object.fromEntries(
    vehicles.map((vehicle) => [vehicle.vehicle_id, vehicle])
  )

  const rentalCounts = {}

  currentRentals.forEach((rental) => {
    rentalCounts[rental.vehicle_id] =
      (rentalCounts[rental.vehicle_id] || 0) + 1
  })

  const mostRentedVehicles = Object.entries(rentalCounts)
    .map(([vehicleId, value]) => ({
      label:
        vehicleMap[vehicleId]?.name || `Vehicle #${vehicleId}`,
      value,
    }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5)

  const totalBookings = currentRentals.length

  const totalRevenue = currentRentals.reduce(
    (sum, rental) => sum + rental.total_cost,
    0
  )

  const rentedVehicleIds = new Set(
    currentRentals.map((rental) => rental.vehicle_id)
  )

  const maintenanceVehicleIds = new Set(
    vehicles
      .filter((vehicle) => vehicle.status === 'MAINTENANCE')
      .map((vehicle) => vehicle.vehicle_id)
  )

  // Maintenance takes priority so a maintenance vehicle cannot also be
  // counted as rented in the fleet-usage donut.
  const rentedCount = [...rentedVehicleIds].filter(
    (vehicleId) => !maintenanceVehicleIds.has(vehicleId)
  ).length

  const maintenanceCount = maintenanceVehicleIds.size

  const notRentedCount = Math.max(
    vehicles.length - rentedCount - maintenanceCount,
    0
  )

  const previousBookings = previousRentals.length

  const previousRevenue = previousRentals.reduce(
    (sum, rental) => sum + rental.total_cost,
    0
  )

  const previousVehiclesRented = new Set(
    previousRentals.map((rental) => rental.vehicle_id)
  ).size

  return {
    labels,
    bookingValues,
    revenueValues,
    mostRentedVehicles,
    totalBookings,
    totalRevenue,
    vehiclesRented: rentedVehicleIds.size,
    totalVehicles: vehicles.length,
    maintenanceCount,

    fleetUsage: [
      {
        label: 'Rented',
        value: rentedCount,
        color: '#17652b',
      },
      {
        label: 'Maintenance',
        value: maintenanceCount,
        color: '#c0000a',
      },
      {
        label: 'Not Rented',
        value: notRentedCount,
        color: '#e2e2e2',
      },
    ],

    changes: compare
      ? {
        bookings: calculateChange(totalBookings, previousBookings),

        vehicles: calculateChange(
          rentedVehicleIds.size,
          previousVehiclesRented
        ),

        revenue: calculateChange(totalRevenue, previousRevenue),
      }
      : {
        bookings: { kind: 'hidden' },
        vehicles: { kind: 'hidden' },
        revenue: { kind: 'hidden' },
      },
  }
}

// ─── Main Page ───────────────────────────────────────────────────

function EmployeeStatistics() {
  const [selectedRange, setSelectedRange] = useState('all')

  const activeRange =
    RANGE_OPTIONS.find((range) => range.key === selectedRange) ||
    RANGE_OPTIONS[RANGE_OPTIONS.length - 1]

  const rangeDates = useMemo(() => {
    if (activeRange.days === null) {
      return {
        startDate: DEFAULT_START,
        endDate: DEFAULT_END,
      }
    }

    const endDate = getTodayString()

    return {
      startDate: dateToString(
        addDays(toDate(endDate), -(activeRange.days - 1))
      ),
      endDate,
    }
  }, [activeRange])

  const stats = useMemo(
    () =>
      computeStatistics(
        RAW_RENTALS,
        RAW_VEHICLES,
        rangeDates.startDate,
        rangeDates.endDate,
        activeRange.days !== null
      ),
    [rangeDates, activeRange]
  )

  const summaryCards = [
    {
      label: 'Total Bookings',
      value: stats.totalBookings,
      sublabel:
        selectedRange === 'all'
          ? 'completed rentals on record'
          : 'completed rentals in this range',
      change: stats.changes.bookings,
      icon: 'calendar',
      iconClass: 'summary-icon-bookings',
    },
    {
      label: 'Vehicles Rented',
      value: stats.vehiclesRented,
      sublabel: `of ${stats.totalVehicles} vehicles in the fleet`,
      change: stats.changes.vehicles,
      icon: 'car',
      iconClass: 'summary-icon-vehicles',
    },
    {
      label: 'Total Revenue',
      value: formatCurrency(stats.totalRevenue),
      sublabel:
        stats.totalBookings > 0
          ? `${formatCurrency(
            stats.totalRevenue / stats.totalBookings
          )} average per rental`
          : 'no rentals in this range',
      change: stats.changes.revenue,
      icon: 'dollar',
      iconClass: 'summary-icon-revenue',
    },
    {
      label: 'Vehicles In Maintenance',
      value: stats.maintenanceCount,
      sublabel:
        stats.maintenanceCount === 1
          ? '1 vehicle currently needs service'
          : `${stats.maintenanceCount} vehicles currently need service`,
      change: { kind: 'hidden' },
      icon: 'warning',
      iconClass: 'summary-icon-maintenance',
    },
  ]

  const subtitle =
    selectedRange === 'all'
      ? `Showing all ${stats.totalBookings} rentals on record`
      : `${stats.totalBookings} rental${stats.totalBookings === 1 ? '' : 's'
      } from ${formatDate(rangeDates.startDate)} to ${formatDate(
        rangeDates.endDate
      )}`

  return (
    <div className="employee-statistics-page">
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
          <Link to="/employee-bookings">Bookings</Link>

          <Link to="/employee-stats" className="nav-active">
            Statistics
          </Link>

          <Link to="/customer-support">Customer Support</Link>
        </div>

        <div className="navbar-user">
          <div className="user-icon" aria-hidden="true">
            <UserIcon />
          </div>

          <span className="username">Username</span>
        </div>
      </nav>

      {/* ─── Page Content ───────────────────────────────────── */}
      <main className="statistics-content">
        <div className="statistics-page-header">
          <div>
            <h1 className="statistics-title">Statistics</h1>
            <p className="statistics-subtitle">{subtitle}</p>
          </div>

          <div
            className="range-controls"
            role="tablist"
            aria-label="Statistics date range"
          >
            {RANGE_OPTIONS.map((range) => (
              <button
                key={range.key}
                type="button"
                role="tab"
                aria-selected={selectedRange === range.key}
                className={`range-btn ${selectedRange === range.key
                    ? 'range-btn-active'
                    : ''
                  }`}
                onClick={() => setSelectedRange(range.key)}
              >
                {range.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── Summary Cards ────────────────────────────────── */}
        <div className="summary-cards">
          {summaryCards.map((card) => (
            <div className="summary-card" key={card.label}>
              <div className="summary-card-top">
                <span
                  className={`summary-icon ${card.iconClass}`}
                >
                  <SummaryIcon type={card.icon} />
                </span>

                <TrendBadge
                  change={card.change}
                  comparisonLabel={activeRange.comparisonLabel}
                />
              </div>

              <span className="summary-value">{card.value}</span>
              <span className="summary-label">{card.label}</span>
              <span className="summary-sublabel">{card.sublabel}</span>
            </div>
          ))}
        </div>

        {/* ─── Charts ───────────────────────────────────────── */}
        <div className="chart-grid">
          <ChartPanel title="Bookings Over Time">
            <LineChart
              labels={stats.labels}
              values={stats.bookingValues}
            />
          </ChartPanel>

          <ChartPanel title="Most Rented Vehicles">
            {stats.mostRentedVehicles.length > 0 ? (
              <HorizontalBarChart data={stats.mostRentedVehicles} />
            ) : (
              <EmptyChartState message="No rentals in this range." />
            )}
          </ChartPanel>

          <ChartPanel title="Fleet Usage">
            <DonutChart data={stats.fleetUsage} />
          </ChartPanel>

          <ChartPanel title="Revenue Overview">
            <VerticalBarChart
              labels={stats.labels}
              values={stats.revenueValues}
            />
          </ChartPanel>
        </div>
      </main>
    </div>
  )
}

// ─── Shared Components ───────────────────────────────────────────

function ChartPanel({ title, children }) {
  return (
    <div className="chart-panel">
      <h2 className="chart-title">{title}</h2>
      {children}
    </div>
  )
}

function TrendBadge({ change, comparisonLabel }) {
  if (change.kind === 'hidden' || !comparisonLabel) {
    return null
  }

  if (change.kind === 'none') {
    return (
      <span className="trend-badge trend-flat">
        <TrendIcon direction="flat" />
        No change

        <span className="trend-badge-sub">
          vs {comparisonLabel}
        </span>
      </span>
    )
  }

  if (change.kind === 'new') {
    return (
      <span className="trend-badge trend-new">
        <TrendIcon direction="up" />
        New

        <span className="trend-badge-sub">
          vs {comparisonLabel}
        </span>
      </span>
    )
  }

  const direction =
    change.pct > 0
      ? 'up'
      : change.pct < 0
        ? 'down'
        : 'flat'

  const className =
    change.pct > 0
      ? 'trend-good'
      : change.pct < 0
        ? 'trend-bad'
        : 'trend-flat'

  return (
    <span className={`trend-badge ${className}`}>
      <TrendIcon direction={direction} />
      {Math.abs(change.pct)}%

      <span className="trend-badge-sub">
        vs {comparisonLabel}
      </span>
    </span>
  )
}

function EmptyChartState({ message }) {
  return <div className="chart-empty">{message}</div>
}

// ─── Charts ──────────────────────────────────────────────────────

const getChartScale = (values, height, top, bottom) => {
  const maximum = Math.max(...values, 1)

  const niceMaximum =
    maximum <= 4
      ? 4
      : maximum <= 8
        ? 8
        : maximum <= 20
          ? 20
          : Math.ceil(maximum / 10) * 10

  const toY = (value) =>
    height -
    bottom -
    (value / niceMaximum) * (height - top - bottom)

  return {
    toY,

    ticks: [0, 0.25, 0.5, 0.75, 1].map((value) =>
      Math.round(niceMaximum * value)
    ),
  }
}

// Display every axis label when the chart has 12 or fewer periods.
// For longer datasets, preserve the first and last labels and show
// evenly spaced labels between them.
const showAxisLabel = (index, length) => {
  if (
    length <= 12 ||
    index === 0 ||
    index === length - 1
  ) {
    return true
  }

  const maximumLabels = 10
  const interval = Math.ceil((length - 1) / (maximumLabels - 1))

  return index % interval === 0
}

function ChartGrid({
  ticks,
  toY,
  left,
  right,
  width,
  formatter = (value) => value,
}) {
  return ticks.map((tick) => (
    <g key={tick}>
      <line
        x1={left}
        x2={width - right}
        y1={toY(tick)}
        y2={toY(tick)}
        className="chart-gridline"
      />

      <text
        x={left - 8}
        y={toY(tick) + 3}
        textAnchor="end"
        className="chart-axis-label"
      >
        {formatter(tick)}
      </text>
    </g>
  ))
}

function LineChart({ labels, values }) {
  const width = 320
  const height = 200
  const left = 34
  const right = 12
  const bottom = 52

  const { ticks, toY } = getChartScale(
    values,
    height,
    14,
    bottom
  )

  const usableWidth = width - left - right

  const points = values.map((value, index) => ({
    x:
      values.length === 1
        ? left + usableWidth / 2
        : left + (usableWidth / (values.length - 1)) * index,

    y: toY(value),
    value,
    label: labels[index],
  }))

  const line = points
    .map(({ x, y }) => `${x},${y}`)
    .join(' ')

  const area = `${left},${toY(0)} ${line} ${width - right
    },${toY(0)}`

  return (
    <svg
      className="chart-svg"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <defs>
        <linearGradient
          id="statisticsLineFill"
          x1="0"
          y1="0"
          x2="0"
          y2="1"
        >
          <stop
            offset="0%"
            stopColor="#e5212a"
            stopOpacity="0.25"
          />

          <stop
            offset="100%"
            stopColor="#e5212a"
            stopOpacity="0"
          />
        </linearGradient>
      </defs>

      <ChartGrid
        ticks={ticks}
        toY={toY}
        left={left}
        right={right}
        width={width}
      />

      {points.length > 1 && (
        <>
          <polygon
            points={area}
            fill="url(#statisticsLineFill)"
          />

          <polyline
            points={line}
            fill="none"
            stroke="#e5212a"
            strokeWidth="2.5"
            strokeLinejoin="round"
            strokeLinecap="round"
          />
        </>
      )}

      {points.map((point, index) => (
        <g key={`${point.label}-${index}`}>
          <circle
            cx={point.x}
            cy={point.y}
            r="3.5"
            fill="#e5212a"
          >
            <title>
              {point.label}: {point.value}
            </title>
          </circle>

          {showAxisLabel(index, points.length) && (
            <AxisLabel
              x={point.x}
              y={height - 28}
              label={point.label}
            />
          )}
        </g>
      ))}
    </svg>
  )
}

function VerticalBarChart({ labels, values }) {
  const width = 320
  const height = 200
  const left = 46
  const right = 12
  const bottom = 52

  const { ticks, toY } = getChartScale(
    values,
    height,
    14,
    bottom
  )

  const step =
    (width - left - right) / Math.max(values.length, 1)

  const barWidth = Math.min(step * 0.55, 20)
  const baseline = toY(0)

  return (
    <svg
      className="chart-svg"
      viewBox={`0 0 ${width} ${height}`}
      preserveAspectRatio="xMidYMid meet"
    >
      <ChartGrid
        ticks={ticks}
        toY={toY}
        left={left}
        right={right}
        width={width}
        formatter={formatCurrency}
      />

      {values.map((value, index) => {
        const x =
          left + step * index + (step - barWidth) / 2

        return (
          <g key={`${labels[index]}-${index}`}>
            <rect
              x={x}
              y={toY(value)}
              width={barWidth}
              height={Math.max(baseline - toY(value), 0)}
              rx="3"
              fill="#0f0f0f"
              className="vbar-rect"
            >
              <title>
                {labels[index]}: {formatCurrency(value)}
              </title>
            </rect>

            {showAxisLabel(index, labels.length) && (
              <AxisLabel
                x={x + barWidth / 2}
                y={height - 28}
                label={labels[index]}
              />
            )}
          </g>
        )
      })}
    </svg>
  )
}

function AxisLabel({ x, y, label }) {
  return (
    <text
      x={x}
      y={y}
      textAnchor="end"
      className="chart-axis-label chart-axis-label-x"
      transform={`rotate(-40 ${x} ${y})`}
    >
      {label}
    </text>
  )
}

function HorizontalBarChart({ data }) {
  const maximum = Math.max(
    ...data.map((item) => item.value),
    1
  )

  return (
    <div className="hbar-chart">
      {data.map((item) => (
        <div className="hbar-row" key={item.label}>
          <span className="hbar-label">{item.label}</span>

          <div className="hbar-track">
            <div
              className="hbar-fill"
              style={{
                width: `${(item.value / maximum) * 100}%`,
              }}
            />
          </div>

          <span className="hbar-value">{item.value}</span>
        </div>
      ))}
    </div>
  )
}

function DonutChart({ data }) {
  const size = 140
  const radius = 52
  const circumference = 2 * Math.PI * radius

  const total = data.reduce(
    (sum, item) => sum + item.value,
    0
  )

  let progress = 0

  return (
    <div className="donut-chart">
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        <g transform={`rotate(-90 ${size / 2} ${size / 2})`}>
          {data.map((item) => {
            const percentage = total
              ? item.value / total
              : 0

            const offset = -progress * circumference
            progress += percentage

            return (
              <circle
                key={item.label}
                cx={size / 2}
                cy={size / 2}
                r={radius}
                fill="none"
                stroke={item.color}
                strokeWidth="18"
                strokeDasharray={`${percentage * circumference} ${circumference}`}
                strokeDashoffset={offset}
                className="donut-segment"
              >
                <title>
                  {item.label}: {item.value}{' '}
                  {item.value === 1 ? 'vehicle' : 'vehicles'}
                </title>
              </circle>
            )
          })}
        </g>

        <text
          x={size / 2}
          y={size / 2 - 6}
          textAnchor="middle"
          className="donut-total"
        >
          {total}
        </text>

        <text
          x={size / 2}
          y={size / 2 + 12}
          textAnchor="middle"
          className="donut-total-label"
        >
          Vehicles
        </text>
      </svg>

      <ul className="donut-legend">
        {data.map((item) => (
          <li key={item.label}>
            <span
              className="legend-dot"
              style={{ backgroundColor: item.color }}
            />

            <span className="legend-label">
              {item.label}
            </span>

            <span className="legend-value">
              {item.value}{' '}
              {item.value === 1 ? 'vehicle' : 'vehicles'}
            </span>
          </li>
        ))}
      </ul>
    </div>
  )
}

// ─── Icons ───────────────────────────────────────────────────────

function UserIcon() {
  return (
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
  )
}

function SummaryIcon({ type }) {
  const paths = {
    calendar: (
      <>
        <rect x="3.5" y="5" width="17" height="15" rx="2.5" />
        <path d="M3.5 9.5h17M8 3v4M16 3v4M8 14l2.5 2.5L16 11" />
      </>
    ),

    car: (
      <>
        <path d="M4 16l1.5-5.5C6 9 7 8.2 8.6 8.2h6.8c1.6 0 2.6.8 3.1 2.3L20 16" />
        <rect x="2.8" y="16" width="18.4" height="4" rx="1.4" />
      </>
    ),

    dollar: (
      <>
        <circle cx="12" cy="12" r="9" />
        <path d="M12 7v10M14.5 9.3c0-1-1-1.8-2.5-1.8s-2.5.8-2.5 1.8c0 2.4 5 1.1 5 3.5 0 1-1 1.8-2.5 1.8s-2.5-.8-2.5-1.8" />
      </>
    ),

    warning: (
      <>
        <path d="M12 3.5L21.5 20h-19z" />
        <path d="M12 10v4.5M12 17.2h.01" />
      </>
    ),
  }

  return (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="#0f0f0f"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[type]}
    </svg>
  )
}

function TrendIcon({ direction }) {
  const path =
    direction === 'up'
      ? 'M12 19V5M5 12l7-7 7 7'
      : direction === 'down'
        ? 'M12 5v14M5 12l7 7 7-7'
        : 'M5 12h14'

  return (
    <svg
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
    >
      <path
        d={path}
        stroke="currentColor"
        strokeWidth="2.4"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  )
}

export default EmployeeStatistics