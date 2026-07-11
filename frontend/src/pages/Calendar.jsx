import React, { useMemo, useState } from "react"
import { Link } from "react-router-dom"
import wheelioLogo from "../assets/Wheelio_logo.png"
import "./Calendar.css"

const initialRentals = [
  {
    rentalId: 1,
    customerName: "Sebastian Caro",
    vehicleName: "Toyota Corolla",
    licensePlate: "ABC-123",
    pickupDate: "2026-07-12T09:00:00",
    returnDate: "2026-07-15T17:00:00",
    pickupLocation: "Waterloo Branch",
    returnLocation: "Waterloo Branch",
    status: "BOOKED",
  },
  {
    rentalId: 2,
    customerName: "Jamie Ferretti",
    vehicleName: "Honda Civic",
    licensePlate: "CIV-202",
    pickupDate: "2026-07-18T10:30:00",
    returnDate: "2026-07-20T16:00:00",
    pickupLocation: "Toronto Branch",
    returnLocation: "Oakville Branch",
    status: "ACTIVE",
  },
  {
    rentalId: 3,
    customerName: "Cam Bickerton",
    vehicleName: "Ford Escape",
    licensePlate: "SUV-777",
    pickupDate: "2026-07-22T08:00:00",
    returnDate: "2026-07-25T12:00:00",
    pickupLocation: "Mississauga Branch",
    returnLocation: "Mississauga Branch",
    status: "COMPLETED",
  },
]

function formatDateKey(date) {
  return date.toISOString().split("T")[0]
}

function formatTime(dateString) {
  return new Date(dateString).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  })
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleDateString([], {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

function getDaysInMonth(year, month) {
  const firstDay = new Date(year, month, 1)
  const lastDay = new Date(year, month + 1, 0)
  const days = []

  for (let i = 0; i < firstDay.getDay(); i++) {
    days.push(null)
  }

  for (let day = 1; day <= lastDay.getDate(); day++) {
    days.push(new Date(year, month, day))
  }

  return days
}

function rentalTouchesDate(rental, date) {
  const dayStart = new Date(date)
  dayStart.setHours(0, 0, 0, 0)

  const dayEnd = new Date(date)
  dayEnd.setHours(23, 59, 59, 999)

  const pickup = new Date(rental.pickupDate)
  const dropoff = new Date(rental.returnDate)

  return pickup <= dayEnd && dropoff >= dayStart
}

function getEventType(rental, date) {
  const dateKey = formatDateKey(date)
  const pickupKey = formatDateKey(new Date(rental.pickupDate))
  const returnKey = formatDateKey(new Date(rental.returnDate))

  if (dateKey === pickupKey) return "pickup"
  if (dateKey === returnKey) return "dropoff"
  return "rented"
}

function getRentalLabel(rental, date) {
  const type = getEventType(rental, date)

  if (type === "pickup") return `Pickup · ${rental.vehicleName}`
  if (type === "dropoff") return `Drop-off · ${rental.vehicleName}`
  return `Rented · ${rental.vehicleName}`
}

function Calendar() {
  const today = new Date()

  const [rentals, setRentals] = useState(initialRentals)
  const [currentMonth, setCurrentMonth] = useState(today.getMonth())
  const [currentYear, setCurrentYear] = useState(today.getFullYear())
  const [selectedDate, setSelectedDate] = useState(today)
  const [statusFilter, setStatusFilter] = useState("ALL")
  const [editingRental, setEditingRental] = useState(null)

  const monthDays = useMemo(
    () => getDaysInMonth(currentYear, currentMonth),
    [currentYear, currentMonth]
  )

  const filteredRentals = useMemo(() => {
    if (statusFilter === "ALL") {
      return rentals
    }

    return rentals.filter((rental) => rental.status === statusFilter)
  }, [rentals, statusFilter])

  const selectedDateRentals = filteredRentals.filter((rental) =>
    rentalTouchesDate(rental, selectedDate)
  )

  function goToPreviousMonth() {
    if (currentMonth === 0) {
      setCurrentMonth(11)
      setCurrentYear(currentYear - 1)
    } else {
      setCurrentMonth(currentMonth - 1)
    }
  }

  function goToNextMonth() {
    if (currentMonth === 11) {
      setCurrentMonth(0)
      setCurrentYear(currentYear + 1)
    } else {
      setCurrentMonth(currentMonth + 1)
    }
  }

  function handleEditChange(field, value) {
    setEditingRental({
      ...editingRental,
      [field]: value,
    })
  }

  function saveReservationChanges() {
    setRentals((currentRentals) =>
      currentRentals.map((rental) =>
        rental.rentalId === editingRental.rentalId ? editingRental : rental
      )
    )

    setEditingRental(null)
  }

  function cancelReservation(rentalId) {
    setRentals((currentRentals) =>
      currentRentals.map((rental) =>
        rental.rentalId === rentalId
          ? {
              ...rental,
              status: "CANCELLED",
            }
          : rental
      )
    )
  }

  const monthName = new Date(currentYear, currentMonth).toLocaleDateString([], {
    month: "long",
    year: "numeric",
  })

  return (
    <div className="calendar-dashboard-page">
      <header className="dashboard-topbar">
        <div className="brand">
          <img className="brand-logo" src={wheelioLogo} alt="Wheelio logo" />
        </div>

        <nav className="dashboard-nav">
          <Link to="/home">Home</Link>
          <Link to="/">Book a Vehicle</Link>
          <Link to="/">Modify Booking</Link>
          <Link to="/">Change Location</Link>
          <Link to="/calendar">Calendar</Link>
          <Link to="/settings">Settings</Link>
        </nav>

        <div className="dashboard-user">
          <div className="dashboard-user__icon"></div>
          <span>Username</span>
        </div>
      </header>

      <main className="calendar-dashboard-layout">
        <section className="calendar-main-panel">
          <div className="calendar-title-row">
            <div>
              <h2>Rental Calendar</h2>
              <p>View pickup dates, drop-off dates, and full rental periods.</p>
            </div>

            <select
              value={statusFilter}
              onChange={(event) => setStatusFilter(event.target.value)}
            >
              <option value="ALL">All statuses</option>
              <option value="BOOKED">Booked</option>
              <option value="ACTIVE">Active</option>
              <option value="COMPLETED">Completed</option>
              <option value="CANCELLED">Cancelled</option>
            </select>
          </div>

          <div className="calendar-toolbar">
            <button type="button" onClick={goToPreviousMonth}>
              ‹
            </button>
            <h3>{monthName}</h3>
            <button type="button" onClick={goToNextMonth}>
              ›
            </button>
          </div>

          <div className="calendar-weekdays">
            <span>Sun</span>
            <span>Mon</span>
            <span>Tue</span>
            <span>Wed</span>
            <span>Thu</span>
            <span>Fri</span>
            <span>Sat</span>
          </div>

          <div className="calendar-grid">
            {monthDays.map((date, index) => {
              if (!date) {
                return <div className="calendar-day empty" key={`empty-${index}`} />
              }

              const dateKey = formatDateKey(date)
              const selectedKey = formatDateKey(selectedDate)
              const dayRentals = filteredRentals.filter((rental) =>
                rentalTouchesDate(rental, date)
              )

              return (
                <button
                  type="button"
                  key={dateKey}
                  className={`calendar-day ${dateKey === selectedKey ? "selected" : ""}`}
                  onClick={() => setSelectedDate(date)}
                >
                  <span className="day-number">{date.getDate()}</span>

                  <div className="day-events">
                    {dayRentals.slice(0, 3).map((rental) => {
                      const eventType = getEventType(rental, date)

                      return (
                        <span
                          key={rental.rentalId}
                          className={`event-pill ${eventType}`}
                        >
                          {getRentalLabel(rental, date)}
                        </span>
                      )
                    })}

                    {dayRentals.length > 3 && (
                      <span className="event-more">+{dayRentals.length - 3} more</span>
                    )}
                  </div>
                </button>
              )
            })}
          </div>
        </section>

        <aside className="calendar-side-panel">
          <h2>Selected Day</h2>
          <p className="selected-date">
            {selectedDate.toLocaleDateString([], {
              weekday: "long",
              month: "long",
              day: "numeric",
            })}
          </p>

          {selectedDateRentals.length === 0 ? (
            <div className="no-rentals-box">
              <h3>No Rentals</h3>
              <p>No pickup, drop-off, or rental period is scheduled for this day.</p>
            </div>
          ) : (
            <div className="rental-list">
              {selectedDateRentals.map((rental) => (
                <article className="rental-summary-card" key={rental.rentalId}>
                  <div className="rental-summary-top">
                    <div>
                      <h3>{rental.vehicleName}</h3>
                      <p>{rental.licensePlate}</p>
                    </div>

                    <span className={`status-badge ${rental.status.toLowerCase()}`}>
                      {rental.status}
                    </span>
                  </div>

                  <div className="rental-info-box">
                    <p>
                      <strong>Customer:</strong> {rental.customerName}
                    </p>
                    <p>
                      <strong>Pickup:</strong> {formatDate(rental.pickupDate)} at{" "}
                      {formatTime(rental.pickupDate)}
                    </p>
                    <p>
                      <strong>Drop-off:</strong> {formatDate(rental.returnDate)} at{" "}
                      {formatTime(rental.returnDate)}
                    </p>
                    <p>
                      <strong>Location:</strong> {rental.pickupLocation} →{" "}
                      {rental.returnLocation}
                    </p>
                  </div>

                  <div className="rental-actions">
                    <button
                      type="button"
                      className="edit-reservation-btn"
                      onClick={() => setEditingRental(rental)}
                    >
                      Edit Reservation
                    </button>

                    <button
                      type="button"
                      className="cancel-reservation-btn"
                      onClick={() => cancelReservation(rental.rentalId)}
                    >
                      Cancel Booking
                    </button>
                  </div>
                </article>
              ))}
            </div>
          )}
        </aside>
      </main>

      {editingRental && (
        <div className="calendar-modal-backdrop">
          <div className="calendar-modal">
            <h2>Edit Reservation</h2>
            <p>Update pickup time, drop-off time, location, or reservation status.</p>

            <div className="modal-form-grid">
              <label>
                Vehicle
                <input value={editingRental.vehicleName} readOnly />
              </label>

              <label>
                Customer
                <input value={editingRental.customerName} readOnly />
              </label>

              <label>
                Pickup Date and Time
                <input
                  type="datetime-local"
                  value={editingRental.pickupDate.slice(0, 16)}
                  onChange={(event) =>
                    handleEditChange("pickupDate", event.target.value)
                  }
                />
              </label>

              <label>
                Drop-off Date and Time
                <input
                  type="datetime-local"
                  value={editingRental.returnDate.slice(0, 16)}
                  onChange={(event) =>
                    handleEditChange("returnDate", event.target.value)
                  }
                />
              </label>

              <label>
                Pickup Location
                <input
                  value={editingRental.pickupLocation}
                  onChange={(event) =>
                    handleEditChange("pickupLocation", event.target.value)
                  }
                />
              </label>

              <label>
                Return Location
                <input
                  value={editingRental.returnLocation}
                  onChange={(event) =>
                    handleEditChange("returnLocation", event.target.value)
                  }
                />
              </label>

              <label>
                Status
                <select
                  value={editingRental.status}
                  onChange={(event) =>
                    handleEditChange("status", event.target.value)
                  }
                >
                  <option value="BOOKED">Booked</option>
                  <option value="ACTIVE">Active</option>
                  <option value="COMPLETED">Completed</option>
                  <option value="CANCELLED">Cancelled</option>
                </select>
              </label>
            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="modal-close-btn"
                onClick={() => setEditingRental(null)}
              >
                Close
              </button>

              <button
                type="button"
                className="modal-save-btn"
                onClick={saveReservationChanges}
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Calendar