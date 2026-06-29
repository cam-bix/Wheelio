import './Checkout.css'

function Checkout() {
  return (
    <main className="checkout-page">
      <section className="checkout-card">

        {/* Wheelio Logo */}
        <div className="checkout-logo">
          <div className="logo-badge">
            <svg width="28" height="28" viewBox="0 0 28 28" fill="none" aria-hidden="true">
              <circle cx="14" cy="14" r="13" stroke="white" strokeWidth="2" />
              <circle cx="14" cy="14" r="4" fill="white" />
              <line x1="14" y1="1" x2="14" y2="9" stroke="white" strokeWidth="2" />
              <line x1="14" y1="19" x2="14" y2="27" stroke="white" strokeWidth="2" />
              <line x1="1" y1="14" x2="9" y2="14" stroke="white" strokeWidth="2" />
              <line x1="19" y1="14" x2="27" y2="14" stroke="white" strokeWidth="2" />
              <line x1="4" y1="4" x2="9.9" y2="9.9" stroke="white" strokeWidth="2" />
              <line x1="18.1" y1="18.1" x2="24" y2="24" stroke="white" strokeWidth="2" />
              <line x1="24" y1="4" x2="18.1" y2="9.9" stroke="white" strokeWidth="2" />
              <line x1="9.9" y1="18.1" x2="4" y2="24" stroke="white" strokeWidth="2" />
            </svg>

            <svg
              className="speed-lines"
              width="20"
              height="14"
              viewBox="0 0 20 14"
              fill="none"
              aria-hidden="true"
            >
              <path d="M0 3 H14" stroke="#e5212a" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M0 7 H18" stroke="#e5212a" strokeWidth="2.5" strokeLinecap="round" />
              <path d="M0 11 H12" stroke="#e5212a" strokeWidth="2.5" strokeLinecap="round" />
            </svg>

            <span className="logo-text">
              Wheel<span className="logo-accent">io</span>
            </span>
          </div>
        </div>

        <h1 className="checkout-title">Checkout</h1>

        <div className="receipt-card">
          <h2>Booking Receipt</h2>

          <div className="receipt-row">
            <span>Vehicle</span>
            <strong>Toyota Corolla</strong>
          </div>

          <div className="receipt-row">
            <span>Pick-up Date</span>
            <strong>July 18, 2026</strong>
          </div>

          <div className="receipt-row">
            <span>Drop-off Date</span>
            <strong>July 23, 2026</strong>
          </div>

          <div className="receipt-row total">
            <span>Total Cost</span>
            <strong>$418.95</strong>
          </div>
        </div>

        <form className="checkout-form">

          <label className="agreement">
            <input type="checkbox" required />
            <span>I have read and agree to the Wheelio Terms & Conditions.</span>
          </label>

          <button className="checkout-btn" type="submit">
            Proceed to Payment
          </button>

        </form>

      </section>
    </main>
  )
}

export default Checkout