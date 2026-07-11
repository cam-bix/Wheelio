//import { useState } from 'react'
import wheelioLogo from '../assets/Wheelio_logo.png'
import './Home.css'
import { Link } from 'react-router-dom'

function ModifyBooking() {

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
        </div>
    )

}

export default ModifyBooking