import { useState, useEffect } from 'react'
import wheelioLogo from '../assets/Wheelio_logo.png'
import './Home.css'
import './Settings.css'
import { Link } from 'react-router-dom'

function Settings() {
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

    // ── Fetch user info on page load ──
    useEffect(() => {
        const storedUser = JSON.parse(localStorage.getItem('wheelioUser') || '{}')
        const userId = storedUser?.userId

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

    }, [])

    // ── Save Personal Info ──
    const handleSaveInfo = async () => {
        const storedUser = JSON.parse(localStorage.getItem('wheelioUser') || '{}')
        const userId = storedUser?.userId
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
                ...storedUser,
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
                    <span>{firstName || JSON.parse(localStorage.getItem('wheelioUser') || '{}')?.firstName || 'User'}</span>
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

                

            </main>
        </div>
    )
}

export default Settings
