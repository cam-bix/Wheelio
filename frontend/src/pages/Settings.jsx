import { useState } from 'react'
import wheelioLogo from '../assets/Wheelio_logo.png'
import './Home.css'
import './Settings.css'
import { Link } from 'react-router-dom'

function Settings() {
    // Personal Info
    const [firstName, setFirstName] = useState('John')
    const [lastName, setLastName] = useState('Doe')
    const [email, setEmail] = useState('john.doe@example.com')
    const [phone, setPhone] = useState('555-222-2222')
    const [infoSaved, setInfoSaved] = useState(false)

    // Password
    const [currentPassword, setCurrentPassword] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [passwordMessage, setPasswordMessage] = useState('')

    // Notifications
    const [emailNotif, setEmailNotif] = useState(true)
    const [smsNotif, setSmsNotif] = useState(false)
    const [promoNotif, setPromoNotif] = useState(false)

    const handleSaveInfo = () => {
        setInfoSaved(true)
        setTimeout(() => setInfoSaved(false), 3000)
    }

    //Logic to Change password (For now)
    const handleChangePassword = () => {
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
        setPasswordMessage('✅ Password changed successfully!')
        setCurrentPassword('')
        setNewPassword('')
        setConfirmPassword('')
        setTimeout(() => setPasswordMessage(''), 3000)
    }

    return (
        <div className="dashboard-page">
            <header className="dashboard-topbar">
                <div className="brand">
                    <img className="brand-logo" src={wheelioLogo} alt="Wheelio logo" />
                </div>

                <nav className="dashboard-nav">
                    <Link to="/">Home</Link>
                    <Link to="/book/:vehicleId">Book a Vehicle</Link>
                    <Link to="/modify-booking">Modify Booking</Link>
                    <Link to="/change-location">Change Location</Link>
                    <Link to="/settings">Settings</Link>
                </nav>

                <div className="dashboard-user">
                    <div className="dashboard-user__icon"></div>
                    <span>Username</span>
                </div>
            </header>

            {/* ── Settings Content ── */}
            <main className="settings-main">
                <h1 className="settings-title">⚙️ Settings</h1>
                <p className="settings-subtitle">Manage your account and preferences</p>

                {/* ── Personal Information ── */}
                <section className="settings-section">
                    <h2 className="settings-section-title">👤 Personal Information</h2>
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

                    {infoSaved && <p className="settings-success">✅ Information saved successfully!</p>}
                    <button className="settings-btn" onClick={handleSaveInfo}>
                        Save Changes
                    </button>
                </section>

                {/* ── Password & Security ── */}
                <section className="settings-section">
                    <h2 className="settings-section-title">🔒 Password & Security</h2>
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

                {/* ── Notifications ── */}
                <section className="settings-section">
                    <h2 className="settings-section-title">🔔 Notifications</h2>
                    <p className="settings-section-desc">Choose how you would like to hear from us.</p>

                    <div className="settings-toggles">
                        <div className="settings-toggle-row">
                            <div>
                                <p className="toggle-label">Email Notifications</p>
                                <p className="toggle-desc">Booking confirmations and reminders sent to your email</p>
                            </div>
                            <button
                                className={`toggle-btn ${emailNotif ? 'toggle-btn--on' : ''}`}
                                onClick={() => setEmailNotif(!emailNotif)}
                                aria-label="Toggle email notifications"
                            >
                                {emailNotif ? 'ON' : 'OFF'}
                            </button>
                        </div>

                        <div className="settings-toggle-row">
                            <div>
                                <p className="toggle-label">SMS / Text Notifications</p>
                                <p className="toggle-desc">Receive text messages about your bookings</p>
                            </div>
                            <button
                                className={`toggle-btn ${smsNotif ? 'toggle-btn--on' : ''}`}
                                onClick={() => setSmsNotif(!smsNotif)}
                                aria-label="Toggle SMS notifications"
                            >
                                {smsNotif ? 'ON' : 'OFF'}
                            </button>
                        </div>

                        <div className="settings-toggle-row">
                            <div>
                                <p className="toggle-label">Promotions & Special Offers</p>
                                <p className="toggle-desc">Be the first to know about deals and discounts</p>
                            </div>
                            <button
                                className={`toggle-btn ${promoNotif ? 'toggle-btn--on' : ''}`}
                                onClick={() => setPromoNotif(!promoNotif)}
                                aria-label="Toggle promotions notifications"
                            >
                                {promoNotif ? 'ON' : 'OFF'}
                            </button>
                        </div>
                    </div>
                </section>
            </main>
        </div>
    )
}

export default Settings
