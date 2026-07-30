import { useState, useEffect } from 'react'
import wheelioLogo from '../assets/Wheelio_logo.png'
import './Home.css'
import './Settings.css'
import { Link, Navigate } from 'react-router-dom'
import { createCustomerTicket } from '../api/tickets'
import { getStoredUser } from '../utils/userSession'

function Settings() {
    const [currentUser] = useState(() => getStoredUser())

    // Personal Info
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [phone, setPhone] = useState('')
    const [infoSaved, setInfoSaved] = useState(false)
    const [infoError, setInfoError] = useState('')
    const [loading, setLoading] = useState(true)

    // Password
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordMessage, setPasswordMessage] = useState('')

    // Customer Support
    const [ticketSubject, setTicketSubject] = useState('')
    const [ticketDescription, setTicketDescription] = useState('')
    const [ticketPriority, setTicketPriority] = useState('NORMAL')
    const [ticketRentalId, setTicketRentalId] = useState('')
    const [ticketSubmitting, setTicketSubmitting] = useState(false)
    const [ticketError, setTicketError] = useState('')
    const [ticketSuccess, setTicketSuccess] = useState('')

    // ── Fetch user info on page load ──
    useEffect(() => {
        const userId = currentUser?.userId

        if (!userId) {
            setLoading(false)
            return
        }

        const fetchUser = async () => {
            try {
                
                const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
                const response = await fetch(`${API_BASE_URL}/api/users/${userId}`)
                if (!response.ok) throw new Error('Failed to fetch user')
                const data = await response.json()
                setFirstName(data.firstName || '')
                setLastName(data.lastName || '')
                setEmail(data.email || '')
                setPhone(data.phone || '')
            } catch (err) {
                setInfoError('Could not load your information. Please try again.')
            } finally {
                setLoading(false)
            }
        }

        fetchUser()

        //***LocalStorage way, in case the fetchUser() does not work:

        // const storedUser = JSON.parse(localStorage.getItem('wheelioUser') || '{}')
        // setFirstName(storedUser?.firstName || '')
        // setLastName(storedUser?.lastName || '')
        // setEmail(storedUser?.email || '')
        // setPhone(storedUser?.phone || '')
        // setLoading(false)

    }, [currentUser])

    // ── Save Personal Info ──
    const handleSaveInfo = async () => {
        const userId = currentUser?.userId
        setInfoError('')
        setInfoSaved(false)

        try {
            //const response = await fetch(`/api/users/${userId}`, {
            const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080'
            const response = await fetch(`${API_BASE_URL}/api/users/${userId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    firstName,
                    lastName,
                    email,
                    phone,
                }),
            })

            if (!response.ok) throw new Error('Failed to update user')

            const updatedUser = await response.json()

            // Update localStorage with new info
            localStorage.setItem('wheelioUser', JSON.stringify({
                ...currentUser,
                ...updatedUser,
            }))

            setInfoSaved(true)
            setTimeout(() => setInfoSaved(false), 3000)
        } catch (err) {
            setInfoError('❌ Could not save changes. Please try again.')
        }
    }

    // ── Change Password ──
    const handleChangePassword = () => {
        setPasswordMessage('')

        if (!currentPassword || !newPassword || !confirmPassword) {
            setPasswordMessage('❌ Please fill in all password fields.')
            return
        }
        if (newPassword !== confirmPassword) {
            setPasswordMessage('❌ New passwords do not match.')
            return
        }
        if (newPassword.length < 6) {
            setPasswordMessage('❌ Password must be at least 6 characters.')
            return
        }

        // TODO: Wire to backend password change endpoint when available
        setPasswordMessage('Password changed successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => setPasswordMessage(''), 3000)
    }

    const handleCreateTicket = async (event) => {
        event.preventDefault()
        setTicketError('')
        setTicketSuccess('')

        if (!currentUser?.userId) {
            setTicketError('You must be signed in to submit a support ticket.')
            return
        }

        if (!ticketSubject.trim() || !ticketDescription.trim()) {
            setTicketError('Please enter a subject and description.')
            return
        }

        const rentalId = ticketRentalId.trim()
            ? Number(ticketRentalId)
            : null

        if (rentalId !== null && (!Number.isInteger(rentalId) || rentalId <= 0)) {
            setTicketError('Booking ID must be a positive number.')
            return
        }

        try {
            setTicketSubmitting(true)

            const ticket = await createCustomerTicket({
                rental_id: rentalId,
                subject: ticketSubject.trim(),
                description: ticketDescription.trim(),
                priority: ticketPriority,
            })

            setTicketSubject('')
            setTicketDescription('')
            setTicketPriority('NORMAL')
            setTicketRentalId('')
            setTicketSuccess(
                `Ticket #${ticket.ticket_id} was submitted successfully.`
            )
        } catch (err) {
            setTicketError(
                err.message || 'Unable to submit your support ticket.'
            )
        } finally {
            setTicketSubmitting(false)
        }
    }

    if (!currentUser?.userId) {
        return <Navigate to="/login" replace />
    }

    if (loading) {
        return (
            <div className="dashboard-page">
                <header className="dashboard-topbar">
                    <div className="brand">
                        <img className="brand-logo" src={wheelioLogo} alt="Wheelio logo" />
                    </div>
                </header>
                <main className="settings-main">
                    <p style={{ textAlign: 'center', marginTop: '60px', color: '#666' }}>
                        Loading your information...
                    </p>
                </main>
            </div>
        )
    }

    return (
        <div className="dashboard-page">
            {/* ── Top Bar ── */}
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
                    <span>{firstName || currentUser.firstName || 'User'}</span>
                </div>
            </header>

            {/* ── Settings Content ── */}
            <main className="settings-main">
                <h1 className="settings-title">Settings</h1>
                <p className="settings-subtitle">Manage your account and preferences</p>

                {/* ── Personal Information ── */}
                <section className="settings-section">
                    <h2 className="settings-section-title">Personal Information</h2>
                    <p className="settings-section-desc">Update your name, email, and phone number.</p>

                    <div className="settings-form-grid">
                        <div className="settings-field">
                            <label>First Name</label>
                            <input
                                type="text"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                            />
                        </div>
                        <div className="settings-field">
                            <label>Last Name</label>
                            <input
                                type="text"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                            />
                        </div>
                        <div className="settings-field settings-field--full">
                            <label>Email Address</label>
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                            />
                        </div>
                        <div className="settings-field settings-field--full">
                            <label>Phone Number</label>
                            <input
                                type="tel"
                                value={phone}
                                onChange={(e) => setPhone(e.target.value)}
                            />
                        </div>
                    </div>

                    {infoError && <p className="settings-error">{infoError}</p>}
                    {infoSaved && <p className="settings-success">✅ Information saved successfully!</p>}

                    <button className="settings-btn" onClick={handleSaveInfo}>
                        Save Changes
                    </button>
                </section>

                {/* ── Password & Security ── */}
                <section className="settings-section">
                    <h2 className="settings-section-title">Password & Security</h2>
                    <p className="settings-section-desc">Change your password to keep your account safe.</p>

                    <div className="settings-form-grid">
                        <div className="settings-field settings-field--full">
                            <label>Current Password</label>
                            <input
                                type="password"
                                value={currentPassword}
                                placeholder="Enter your current password"
                                onChange={(e) => setCurrentPassword(e.target.value)}
                            />
                        </div>
                        <div className="settings-field">
                            <label>New Password</label>
                            <input
                                type="password"
                                value={newPassword}
                                placeholder="Enter new password"
                                onChange={(e) => setNewPassword(e.target.value)}
                            />
                        </div>
                        <div className="settings-field">
                            <label>Confirm New Password</label>
                            <input
                                type="password"
                                value={confirmPassword}
                                placeholder="Re-enter new password"
                                onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {passwordMessage && (
                        <p className={passwordMessage.startsWith('✅') ? 'settings-success' : 'settings-error'}>
                            {passwordMessage}
                        </p>
                    )}
                    <button className="settings-btn" onClick={handleChangePassword}>
                        Change Password
                    </button>
                </section>

                <section className="settings-section">
                    <h2 className="settings-section-title">Customer Support</h2>
                    <p className="settings-section-desc">
                        Submit a support ticket using your signed-in Wheelio account.
                    </p>

                    <p className="settings-account-context">
                        Submitting as <strong>{currentUser.firstName} {currentUser.lastName}</strong>
                        {' '}({currentUser.email})
                    </p>

                    <form onSubmit={handleCreateTicket}>
                        <div className="settings-form-grid">
                            <div className="settings-field settings-field--full">
                                <label htmlFor="ticket-subject">Subject</label>
                                <input
                                    id="ticket-subject"
                                    type="text"
                                    maxLength="150"
                                    value={ticketSubject}
                                    onChange={(event) => setTicketSubject(event.target.value)}
                                    placeholder="Briefly describe the issue"
                                    required
                                />
                            </div>

                            <div className="settings-field">
                                <label htmlFor="ticket-rental">Booking ID (optional)</label>
                                <input
                                    id="ticket-rental"
                                    type="number"
                                    min="1"
                                    value={ticketRentalId}
                                    onChange={(event) => setTicketRentalId(event.target.value)}
                                    placeholder="Example: 14"
                                />
                            </div>

                            <div className="settings-field">
                                <label htmlFor="ticket-priority">Priority</label>
                                <select
                                    id="ticket-priority"
                                    value={ticketPriority}
                                    onChange={(event) => setTicketPriority(event.target.value)}
                                >
                                    <option value="LOW">Low</option>
                                    <option value="NORMAL">Normal</option>
                                    <option value="HIGH">High</option>
                                    <option value="URGENT">Urgent</option>
                                </select>
                            </div>

                            <div className="settings-field settings-field--full">
                                <label htmlFor="ticket-description">Description</label>
                                <textarea
                                    id="ticket-description"
                                    value={ticketDescription}
                                    onChange={(event) => setTicketDescription(event.target.value)}
                                    placeholder="Tell us what happened and how we can help"
                                    required
                                />
                            </div>
                        </div>

                        {ticketError && (
                            <p className="settings-error" role="alert">{ticketError}</p>
                        )}
                        {ticketSuccess && (
                            <p className="settings-success" role="status">{ticketSuccess}</p>
                        )}

                        <button
                            className="settings-btn"
                            type="submit"
                            disabled={ticketSubmitting}
                        >
                            {ticketSubmitting ? 'Submitting...' : 'Submit Ticket'}
                        </button>
                    </form>
                </section>

            </main>
        </div>
    )
}

export default Settings
