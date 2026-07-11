import carPlaceholder from '../assets/placeholder_image.jpg'
import logo from '../assets/Wheelio_logo.png'
import { useState, useEffect, useMemo } from 'react'
import { Link } from 'react-router-dom'
import './EmployeeInventory.css'
import { getVehicles } from '../api/vehicles'

/*
//Mock vehicle data for use in testing. Use this if you cannot connect to the backend.
const MOCK_VEHICLES = [
  { id: '2201', make: 'Toyota', model: 'Corolla', year: '2024', status: 'Available', location: 'Waterloo', image: '', plate: 'CXBT 882', fuel: 92, type: 'Gas', odometer: 14500 },
  { id: '2202', make: 'Honda', model: 'CR-V', year: '2023', status: 'Rented', location: 'Waterloo', image: '', plate: 'BVLL 401', fuel: 45, type: 'Gas', odometer: 32120 },
  { id: '2203', make: 'Ford', model: 'Mustang', year: '2025', status: 'Available', location: 'Waterloo', image: '', plate: 'FAST 995', fuel: 100, type: 'Gas', odometer: 1200 },
  { id: '2204', make: 'Chevrolet', model: 'Malibu', year: '2022', status: 'Maintenance', location: 'Waterloo', image: '', plate: 'AXXA 223', fuel: 15, type: 'Gas', odometer: 68400 },
  { id: '2205', make: 'Nissan', model: 'Rogue', year: '2024', status: 'Available', location: 'Waterloo', image: '', plate: 'CKKK 771', fuel: 87, type: 'Gas', odometer: 22800 },
  { id: '2206', make: 'Subaru', model: 'Outback', year: '2023', status: 'Rented', location: 'Waterloo', image: '', plate: 'BMRK 559', fuel: 60, type: 'Gas', odometer: 41300 },
  { id: '2207', make: 'Tesla', model: 'Model 3', year: '2024', status: 'Available', location: 'Waterloo', image: '', plate: 'ELEV 112', fuel: 88, type: 'Electric', odometer: 8900 },
  { id: '2208', make: 'Hyundai', model: 'Tucson', year: '2023', status: 'Available', location: 'Waterloo', image: '', plate: 'CHRM 334', fuel: 70, type: 'Gas', odometer: 19400 },
  { id: '2209', make: 'Kia', model: 'Sportage', year: '2024', status: 'Rented', location: 'Waterloo', image: '', plate: 'BKLP 990', fuel: 55, type: 'Gas', odometer: 11200 },
  { id: '2210', make: 'BMW', model: '3 Series', year: '2023', status: 'Maintenance', location: 'Waterloo', image: '', plate: 'BMMW 330', fuel: 100, type: 'Gas', odometer: 35000 },
  { id: '2211', make: 'Audi', model: 'Q5', year: '2024', status: 'Available', location: 'Waterloo', image: '', plate: 'AUUD 441', fuel: 95, type: 'Gas', odometer: 8100 }
]
*/

const STATUS_OPTIONS = ['Available', 'Rented', 'Maintenance']
const ITEMS_PER_PAGE = 10

function formatVehicleStatus(status) {
  const statusLabels = {
    AVAILABLE: 'Available',
    RENTED: 'Rented',
    MAINTENANCE: 'Maintenance',
    OUT_OF_SERVICE: 'Maintenance',
  }

  return statusLabels[status] || status
}

function EmployeeInventory() {
  const [vehicles, setVehicles] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [showSearch, setShowSearch] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const [activeStatuses, setActiveStatuses] = useState([])
  const [currentPage, setCurrentPage] = useState(1)
  const [location, setLocation] = useState('Waterloo, ON')

useEffect(() => {
  const fetchInventory = async () => {
    setLoading(true)
    setError('')

    try {
      const data = await getVehicles()

      const formattedVehicles = data.map((vehicle) => ({
        id: String(vehicle.vehicleId),
        make: vehicle.make,
        model: vehicle.model,
        year: String(vehicle.year),
        status: formatVehicleStatus(vehicle.status),
        plate: vehicle.licensePlate,
        dailyRate: Number(vehicle.dailyRate),
        image: '',
      }))

      setVehicles(formattedVehicles)
    } catch (err) {
      setError(err.message || 'Unable to load inventory.')
    } finally {
      setLoading(false)
    }
  }

  fetchInventory()
}, [])

  // Reset pagination to page 1 whenever search filters alter the results pool
  useEffect(() => {
    setCurrentPage(1)
  }, [search, activeStatuses])

  // Calculate high-level summary statistics across the active branch
  const stats = useMemo(() => {
    const counts = { total: vehicles.length, available: 0, rented: 0, maintenance: 0 }
    vehicles.forEach(v => {
      if (v.status === 'Available') counts.available++
      if (v.status === 'Rented') counts.rented++
      if (v.status === 'Maintenance') counts.maintenance++
    })
    return counts
  }, [vehicles])

  // Match filters
  const filteredVehicles = useMemo(() => {
    const query = search.trim().toLowerCase()
    return vehicles.filter((vehicle) => {
      const matchesQuery = !query || 
        vehicle.make.toLowerCase().includes(query) || 
        vehicle.model.toLowerCase().includes(query) || 
        vehicle.id.includes(query) || 
        vehicle.plate.toLowerCase().includes(query)

      const matchesStatus = activeStatuses.length === 0 || activeStatuses.includes(vehicle.status)
      return matchesQuery && matchesStatus
    })
  }, [vehicles, search, activeStatuses])

  // Split results for Pagination chunks
  const totalPages = Math.max(1, Math.ceil(filteredVehicles.length / ITEMS_PER_PAGE))
  
  const paginatedVehicles = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE
    return filteredVehicles.slice(startIndex, startIndex + ITEMS_PER_PAGE)
  }, [filteredVehicles, currentPage])

  const toggleStatus = (status) => {
    setActiveStatuses((current) =>
      current.includes(status) ? current.filter((item) => item !== status) : [...current, status]
    )
  }

  return (
    <div className="employee-inventory-page">
      {/* ─── Top Navigation Bar ─────────────────────────────── */}
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/employee-home">
            <img src={logo} alt="Wheelio Logo" className="navbar-logo-image" />
          </Link>
        </div>

        <div className="navbar-links">
          <Link to="/employee-home">Home</Link>
          <Link to="/employee-inventory" className="nav-active">
            Check Inventory
          </Link>
          <Link to="/employee-bookings">Bookings</Link>
          <Link to="/employee-stats">Statistics</Link>
          <Link to="/support">Customer Support</Link>
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

      {/* ─── Page Content ───────────────────────────────────── */}
      <main className="inventory-content">
        <div className="inventory-page-header">
          <div className="inventory-heading">
            <span className="inventory-title">Inventory for</span>
            <span className="inventory-location">{location}</span>
            <button type="button" className="change-location-link" onClick={() => console.log('Location picker')}>Change Location</button>
          </div>

          <div className="inventory-controls">
            <div className="filters-wrapper">
              <button type="button" className="control-btn" aria-expanded={showFilters} onClick={() => setShowFilters((open) => !open)}>Filters</button>
              {showFilters && (
                <div className="filters-dropdown">
                  {STATUS_OPTIONS.map((status) => (
                    <label className="filter-option" key={status}>
                      <input type="checkbox" checked={activeStatuses.includes(status)} onChange={() => toggleStatus(status)} />
                      {status}
                    </label>
                  ))}
                </div>
              )}
            </div>

            {showSearch ? (
              <input
                type="text"
                className="inventory-search"
                placeholder="Search make, model, plate, ID"
                value={search}
                maxLength="50"
                onChange={(e) => setSearch(e.target.value)}
                onBlur={() => !search && setShowSearch(false)}
                autoFocus
              />
            ) : (
              <button type="button" className="control-btn" onClick={() => setShowSearch(true)}>Search</button>
            )}
          </div>
        </div>

        {/* Live Stat Counter Badges */}
        <div className="stat-counter-bar">
          <div className="stat-badge-item total">
            <span className="stat-count">{stats.total}</span>
            <span className="stat-label">Total Fleet</span>
          </div>
          <div className="stat-badge-item available">
            <span className="stat-count">{stats.available}</span>
            <span className="stat-label">Available</span>
          </div>
          <div className="stat-badge-item rented">
            <span className="stat-count">{stats.rented}</span>
            <span className="stat-label">Rented</span>
          </div>
          <div className="stat-badge-item maintenance">
            <span className="stat-count">{stats.maintenance}</span>
            <span className="stat-label">In Service</span>
          </div>
        </div>

        {error && <p className="inventory-error" role="alert">{error}</p>}

        {loading ? (
          <p className="inventory-loading">Loading inventory...</p>
        ) : paginatedVehicles.length === 0 ? (
          <p className="inventory-empty">No vehicles found matching current criteria.</p>
        ) : (
          <>
            <div className="inventory-grid">
              {paginatedVehicles.map((vehicle) => (
                <div className="vehicle-card" key={vehicle.id}>
                  <div className="vehicle-image">
                    <span className={`status-badge status-${vehicle.status?.toLowerCase()}`}>{vehicle.status}</span>
                    <img src={vehicle.image || carPlaceholder} alt={`${vehicle.make} ${vehicle.model}`} />
                  </div>

                  <p className="vehicle-name">{vehicle.make} {vehicle.model}</p>

                  <div className="vehicle-details-box">
                    <div className="details-row"><span className="details-label">Year:</span><span className="details-value">{vehicle.year}</span></div>
                    <div className="details-row"><span className="details-label">ID:</span><span className="details-value">#{vehicle.id}</span></div>
                    <div className="details-row"><span className="details-label">Plate:</span><span className="details-value">{vehicle.plate}</span></div>
                    <div className="details-row"><span className="details-label">Daily Rate:</span><span className="details-value">${vehicle.dailyRate.toFixed(2)}</span></div>
                  </div>
                </div>
              ))}
            </div>

            {/* Pagination UI Controls at Bottom */}
            <div className="inventory-pagination">
              <button 
                type="button" 
                className="pagination-arrow-btn" 
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              >
                &larr;
              </button>
              <span className="pagination-text">
                <strong>Page {currentPage} of {totalPages}</strong>
                <small>{filteredVehicles.length} vehicles found</small>
              </span>
              <button 
                type="button" 
                className="pagination-arrow-btn" 
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              >
                &rarr;
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  )
}

export default EmployeeInventory
