import { useEffect, useState } from 'react'
import wheelioLogo from '../assets/Wheelio_logo.png'
import carPlaceholder from '../assets/placeholder_image.jpg'
import './Home.css'
import './ModifyBooking.css'
import { Link } from 'react-router-dom'
import {
  cancelRental,
  getActiveRentalsForUser,
  updateRentalDates,
} from '../api/rentals'

function PlaceholderImage() {
  return (
    <img
      className="modify-booking-card__image"
      src={carPlaceholder}
      alt="Vehicle"
    />
  )
}

function formatDate(dateString) {
  return new Date(dateString).toLocaleString()
}

function formatDateTimeLocalValue(dateString) {
  const date = new Date(dateString)
  const timezoneOffset = date.getTimezoneOffset() * 60000
  return new Date(date.getTime() - timezoneOffset).toISOString().slice(0, 16)
}

function canEditRental(rental) {
  return rental.status === 'BOOKED' && new Date(rental.pickupDate) > new Date()
}

function ModifyBooking() {
  const [currentUser, setCurrentUser] = useState(null)
  const [rentals, setRentals] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [editingRentalId, setEditingRentalId] = useState(null)
  const [pickupDraft, setPickupDraft] = useState('')
  const [returnDraft, setReturnDraft] = useState('')
  const [savingRentalId, setSavingRentalId] = useState(null)
  const [cancellingRentalId, setCancellingRentalId] = useState(null)

  async function loadRentals(userId) {
    try {
      setLoading(true)
      setError('')
      const data = await getActiveRentalsForUser(userId)
      setRentals(data)
    } catch (err) {
      setError(err.message || 'Could not load bookings.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem('wheelioUser') || 'null')

    if (!storedUser) {
      setLoading(false)
      return
    }

    setCurrentUser(storedUser)
    loadRentals(storedUser.userId)
  }, [])

  function beginEditing(rental) {
    setActionError('')
    setEditingRentalId(rental.rentalId)
    setPickupDraft(formatDateTimeLocalValue(rental.pickupDate))
    setReturnDraft(formatDateTimeLocalValue(rental.returnDate))
  }

  function stopEditing() {
    setEditingRentalId(null)
    setPickupDraft('')
    setReturnDraft('')
  }

  async function handleSaveDates(rentalId) {
    if (!pickupDraft || !returnDraft) {
      setActionError('Please choose both pickup and drop-off times.')
      return
    }

    if (new Date(returnDraft) <= new Date(pickupDraft)) {
      setActionError('Drop-off time must be after pickup time.')
      return
    }

    try {
      setSavingRentalId(rentalId)
      setActionError('')

      await updateRentalDates(rentalId, {
        pickupDate: new Date(pickupDraft).toISOString(),
        returnDate: new Date(returnDraft).toISOString(),
      })

      if (currentUser) {
        await loadRentals(currentUser.userId)
      }

      stopEditing()
    } catch (err) {
      setActionError(err.message || 'Could not update booking times.')
    } finally {
      setSavingRentalId(null)
    }
  }

  async function handleDeleteBooking(rentalId) {
    try {
      setCancellingRentalId(rentalId)
      setActionError('')
      await cancelRental(rentalId)

      if (currentUser) {
        await loadRentals(currentUser.userId)
      }

      if (editingRentalId === rentalId) {
        stopEditing()
      }
    } catch (err) {
      setActionError(err.message || 'Could not delete booking.')
    } finally {
      setCancellingRentalId(null)
    }
  }

  return (
    <div className="dashboard-page modify-page">
      <header className="dashboard-topbar">
        <div className="brand">
          <img className="brand-logo" src={wheelioLogo} alt="Wheelio logo" />
        </div>

        <nav className="dashboard-nav">
          <Link to="/">Home</Link>
          <Link to="/book">Book a Vehicle</Link>
          <Link to="/modify-booking">Modify Booking</Link>
          <Link to="/change-location">Change Location</Link>
          <Link to="/settings">Settings</Link>
        </nav>

        <div className="dashboard-user">
          <div className="dashboard-user__icon"></div>
          {currentUser ? (
            <span>{currentUser.firstName}</span>
          ) : (
            <Link to="/login" className="dashboard-user__link">Sign In</Link>
          )}
        </div>
      </header>

      <main className="modify-main">
        <section className="modify-hero">
          <span className="modify-hero__eyebrow">Bookings</span>
          <h1>Modify Your Current Bookings</h1>
          <p>
            Review the rentals tied to your account and choose which booking you want
            to manage next.
          </p>
        </section>

        {loading && <p className="modify-message">Loading your bookings...</p>}

        {!loading && error && (
          <p className="modify-message modify-message--error">{error}</p>
        )}

        {!loading && !error && rentals.length === 0 && (
          <p className="modify-message">No bookings to display</p>
        )}

        {!loading && !error && rentals.length > 0 && (
          <section className="modify-bookings-list">
            {rentals.map((rental) => (
              <article className="modify-booking-card" key={rental.rentalId}>
                <PlaceholderImage />

                <div className="modify-booking-card__content">
                  <div className="modify-booking-card__header">
                    <span className="modify-booking-card__badge">Current Rental</span>
                    <h2>{rental.vehicleName}</h2>
                  </div>

                  <div className="modify-booking-card__details">
                    <p><span>Pickup</span>{formatDate(rental.pickupDate)}</p>
                    <p><span>Return</span>{formatDate(rental.returnDate)}</p>
                    <p><span>Status</span>{rental.status}</p>
                    <p><span>Total</span>${rental.totalCost}</p>
                  </div>

                  {editingRentalId === rental.rentalId && (
                    <div className="modify-booking-card__editor">
                      <label>
                        Pickup Time
                        <input
                          type="datetime-local"
                          value={pickupDraft}
                          onChange={(event) => setPickupDraft(event.target.value)}
                        />
                      </label>

                      <label>
                        Drop-off Time
                        <input
                          type="datetime-local"
                          value={returnDraft}
                          onChange={(event) => setReturnDraft(event.target.value)}
                        />
                      </label>

                      <div className="modify-booking-card__editor-actions">
                        <button
                          className="outline-button outline-button--dark"
                          type="button"
                          onClick={() => handleSaveDates(rental.rentalId)}
                          disabled={savingRentalId === rental.rentalId}
                        >
                          {savingRentalId === rental.rentalId ? 'Saving...' : 'Save Times'}
                          <span className="button-arrow">›</span>
                        </button>

                        <button
                          className="outline-button"
                          type="button"
                          onClick={stopEditing}
                          disabled={savingRentalId === rental.rentalId}
                        >
                          Cancel Edit
                          <span className="button-arrow">›</span>
                        </button>
                      </div>
                    </div>
                  )}

                  {actionError && editingRentalId === rental.rentalId && (
                    <p className="modify-booking-card__error">{actionError}</p>
                  )}

                  <div className="modify-booking-card__actions">
                    {canEditRental(rental) ? (
                      <button
                        className="outline-button"
                        type="button"
                        onClick={() => beginEditing(rental)}
                        disabled={savingRentalId === rental.rentalId}
                      >
                        Change Pickup / Drop-off
                        <span className="button-arrow">›</span>
                      </button>
                    ) : (
                      <p className="modify-booking-card__notice">
                        Pickup has already started, so the booking times can no longer be changed.
                      </p>
                    )}

                    <button
                      className="outline-button outline-button--danger"
                      type="button"
                      onClick={() => handleDeleteBooking(rental.rentalId)}
                      disabled={cancellingRentalId === rental.rentalId}
                    >
                      {cancellingRentalId === rental.rentalId ? 'Deleting...' : 'Delete Booking'}
                      <span className="button-arrow">›</span>
                    </button>
                  </div>
                </div>
              </article>
            ))}
          </section>
        )}
      </main>
    </div>
  )
}

export default ModifyBooking
