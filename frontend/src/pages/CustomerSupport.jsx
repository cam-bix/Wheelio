import { useState, useEffect, useMemo } from 'react'
import logo from '../assets/Wheelio_logo.png'
import { Link } from 'react-router-dom'
import './CustomerSupport.css'


// ─── Ticket table schema (from schema.sql) ────────────────────────
// ticket_id                 int, primary key
// created_by_employee_id    int, FK -> employee that opened/owns the ticket
// customer_id               int, FK -> customer the ticket is about
// rental_id                 int, FK -> the rental/booking the ticket relates to
// subject                   text, short title shown in the ticket list
// description               text, full details of the issue
// status                    text, one of: "OPEN" | "IN_PROGRESS" | "CLOSED"
// priority                  text, e.g. "HIGH" | "MEDIUM" | "LOW"
//                            (only HIGH/LOW have shown up in sample data so far,
//                            MEDIUM is included defensively — see STATUS/PRIORITY
//                            option lists below if that ever needs updating)
// created_at                timestamptz, e.g. "2026-07-23 19:31:02.395295+00"
//
// Placeholder ticket data, shaped to match that table exactly. Swap
// this out for a real API call (e.g. import { getTickets } from
// '../api/tickets') once the tickets endpoint is ready.
const MOCK_TICKETS = [
  {
    ticket_id: 1,
    created_by_employee_id: 4,
    customer_id: 4,
    rental_id: 3,
    subject: 'Rental broken down on highway',
    description:
      "During the rental's use on the highway 401, customer reports pulling over after witnessing fumes from under the hood.",
    status: 'OPEN',
    priority: 'HIGH',
    created_at: '2026-07-23 19:31:02.395295+00',
  },
  {
    ticket_id: 3,
    created_by_employee_id: 5,
    customer_id: 2,
    rental_id: 7,
    subject: 'Vomit on centre console',
    description: 'Toddler vomited over centre console while parked at Square One shopping centre.',
    status: 'IN_PROGRESS',
    priority: 'LOW',
    created_at: '2026-07-23 19:35:00.444715+00',
  },
  {
    ticket_id: 5,
    created_by_employee_id: 4,
    customer_id: 8,
    rental_id: 12,
    subject: 'Billing dispute — charged twice',
    description: 'Customer was charged twice for a one-day rental in Waterloo and is requesting a refund.',
    status: 'CLOSED',
    priority: 'MEDIUM',
    created_at: '2026-07-20 14:02:11.001200+00',
  },
]

// Every value the `status` column can hold, in the order they should
// appear in the status dropdown/filter.
const STATUS_OPTIONS = ['OPEN', 'IN_PROGRESS', 'CLOSED']

// Every value the `priority` column can hold, in the order they
// should appear in the "New Ticket" form's priority select.
const PRIORITY_OPTIONS = ['HIGH', 'MEDIUM', 'LOW']

// TODO: replace with the actual logged-in employee's id once auth
// exists (e.g. from a session/context), instead of hardcoding it.
const CURRENT_EMPLOYEE_ID = 4

const EMPTY_TICKET_FORM = {
  subject: '',
  description: '',
  customer_id: '',
  rental_id: '',
  priority: 'MEDIUM',
}

// Turns a status value into the label shown on screen, e.g.
// "IN_PROGRESS" -> "In Progress".
const formatStatusLabel = (status) =>
  status
    .toLowerCase()
    .split('_')
    .map((word) => word[0].toUpperCase() + word.slice(1))
    .join(' ')

// CSS class suffix for a given status/priority value, e.g.
// "IN_PROGRESS" -> "in-progress" so it matches .ticket-status-in-progress.
const toClassSuffix = (value) => value.toLowerCase().replace(/_/g, '-')

// Formats the created_at timestamp for display, e.g.
// "2026-07-23 19:31:02.395295+00" -> "Jul 23, 2026, 3:31 PM"
const formatTimestamp = (value) => {
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return value
  return date.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}


//The following is the employee customer support page. It's a ticketing
//system — staff can create new tickets, browse/filter existing ones,
//and resolve them, rather than a live chat interface.
function CustomerSupport() {
  const [tickets, setTickets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('ALL')
  const [activeTicketId, setActiveTicketId] = useState(null)
  const [showNewTicketForm, setShowNewTicketForm] = useState(false)
  const [newTicket, setNewTicket] = useState(EMPTY_TICKET_FORM)
  const [formError, setFormError] = useState('')

  useEffect(() => {
    const fetchTickets = async () => {
      setLoading(true)
      setError('')
      try {
        // TODO: replace with a real API call once the tickets
        // endpoint exists, e.g. const data = await getTickets()
        const data = MOCK_TICKETS
        setTickets(data)
        setActiveTicketId(data[0]?.ticket_id ?? null)
      } catch (err) {
        setError(err.message || 'Unable to load tickets.')
      } finally {
        setLoading(false)
      }
    }

    fetchTickets()
  }, [])

  // Filter by subject/customer id, and by the selected status tab,
  // so staff can quickly find a ticket.
  const visibleTickets = useMemo(() => {
    const query = search.trim().toLowerCase()

    return tickets.filter((ticket) => {
      const matchesQuery =
        !query ||
        ticket.subject.toLowerCase().includes(query) ||
        String(ticket.customer_id).includes(query) ||
        String(ticket.ticket_id).includes(query)

      const matchesStatus = statusFilter === 'ALL' || ticket.status === statusFilter

      return matchesQuery && matchesStatus
    })
  }, [tickets, search, statusFilter])

  const activeTicket = tickets.find((t) => t.ticket_id === activeTicketId) ?? null

  // Updates a ticket's status locally (e.g. via the dropdown, or the
  // one-click "Resolve" button in the detail panel).
  // TODO: replace with a real API call, e.g. await updateTicketStatus(ticketId, status)
  const handleStatusChange = (ticketId, newStatus) => {
    setTickets((prev) =>
      prev.map((ticket) =>
        ticket.ticket_id === ticketId ? { ...ticket, status: newStatus } : ticket
      )
    )
  }

  const handleNewTicketFieldChange = (field, value) => {
    setNewTicket((prev) => ({ ...prev, [field]: value }))
  }

  const resetNewTicketForm = () => {
    setNewTicket(EMPTY_TICKET_FORM)
    setFormError('')
    setShowNewTicketForm(false)
  }

  // Creates a new ticket locally and opens it in the detail panel.
  // TODO: replace with a real API call, e.g. await createTicket(payload) —
  // the backend should assign the real ticket_id and created_at rather
  // than generating them client-side like this placeholder does.
  const handleCreateTicket = (e) => {
    e.preventDefault()

    if (!newTicket.subject.trim() || !newTicket.customer_id || !newTicket.rental_id) {
      setFormError('Subject, Customer ID, and Rental ID are required.')
      return
    }

    const ticket = {
      ticket_id: Math.max(0, ...tickets.map((t) => t.ticket_id)) + 1,
      created_by_employee_id: CURRENT_EMPLOYEE_ID,
      customer_id: Number(newTicket.customer_id),
      rental_id: Number(newTicket.rental_id),
      subject: newTicket.subject.trim(),
      description: newTicket.description.trim(),
      status: 'OPEN',
      priority: newTicket.priority,
      created_at: new Date().toISOString(),
    }

    setTickets((prev) => [ticket, ...prev])
    setActiveTicketId(ticket.ticket_id)
    resetNewTicketForm()
  }

  return (
    <div className="employee-support-page">

      {/* ─── Top Navigation Bar ─────────────────────────────── */}
      <nav className="navbar">
        <div className="navbar-logo">
          <Link to="/employee-home">
            <img src={logo} alt="Wheelio Logo" className="navbar-logo-image" />
          </Link>
        </div>

        <div className="navbar-links">
          <Link to="/employee-home">Home</Link>
          <Link to="/employee-inventory">Check Inventory</Link>
          <Link to="/employee-bookings">Bookings</Link>
          <Link to="/employee-stats">Statistics</Link>
          <Link to="/support" className="nav-active">Customer Support</Link>
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
      <main className="support-content">
        <div className="support-page-header">
          <h1 className="support-title">Customer Service</h1>
          <button
            type="button"
            className="new-ticket-btn"
            onClick={() => setShowNewTicketForm(true)}
          >
            <IconPlus />
            New Ticket
          </button>
        </div>

        {error && <p className="support-error" role="alert">{error}</p>}

        {loading ? (
          <p className="support-loading">Loading tickets...</p>
        ) : (
          <div className="support-panels">

            {/* ─── Left Panel: Ticket List ────────────────────── */}
            <aside className="tickets-panel">
              <div className="tickets-search-wrapper">
                <input
                  type="text"
                  className="tickets-search"
                  placeholder="Search Tickets"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search tickets"
                />
                <IconSearch className="tickets-search-icon" />
              </div>

              <div className="ticket-filter-tabs" role="tablist" aria-label="Filter by status">
                {['ALL', ...STATUS_OPTIONS].map((status) => (
                  <button
                    key={status}
                    type="button"
                    role="tab"
                    aria-selected={statusFilter === status}
                    className={`ticket-filter-tab ${statusFilter === status ? 'ticket-filter-tab-active' : ''}`}
                    onClick={() => setStatusFilter(status)}
                  >
                    {status === 'ALL' ? 'All' : formatStatusLabel(status)}
                  </button>
                ))}
              </div>

              <div className="tickets-list">
                {visibleTickets.map((ticket) => (
                  <button
                    type="button"
                    key={ticket.ticket_id}
                    className={`ticket-item ${ticket.ticket_id === activeTicketId ? 'ticket-item-active' : ''}`}
                    onClick={() => setActiveTicketId(ticket.ticket_id)}
                  >
                    <div className="ticket-item-top">
                      <span className="ticket-item-number">#{ticket.ticket_id}</span>
                      <span className={`ticket-priority-badge ticket-priority-${toClassSuffix(ticket.priority)}`}>
                        {ticket.priority}
                      </span>
                    </div>
                    <span className="ticket-item-subject">{ticket.subject}</span>
                    <div className="ticket-item-bottom">
                      <span className={`ticket-status-badge ticket-status-${toClassSuffix(ticket.status)}`}>
                        {formatStatusLabel(ticket.status)}
                      </span>
                      <span className="ticket-item-customer">Customer #{ticket.customer_id}</span>
                    </div>
                  </button>
                ))}

                {visibleTickets.length === 0 && (
                  <p className="tickets-empty">
                    {search ? `No tickets match "${search}".` : 'No tickets found.'}
                  </p>
                )}
              </div>
            </aside>

            {/* ─── Right Panel: Ticket Detail ─────────────────── */}
            <section className="ticket-detail-panel">
              {activeTicket ? (
                <>
                  <div className="ticket-detail-header">
                    <div>
                      <p className="ticket-detail-number">Ticket #{activeTicket.ticket_id}</p>
                      <h2 className="ticket-detail-subject">{activeTicket.subject}</h2>
                    </div>

                    <div className="ticket-detail-header-actions">
                      {/* One-click resolve, in addition to the dropdown
                          below, so staff don't have to open the select
                          just to close out a finished ticket. */}
                      {activeTicket.status !== 'CLOSED' && (
                        <button
                          type="button"
                          className="resolve-ticket-btn"
                          onClick={() => handleStatusChange(activeTicket.ticket_id, 'CLOSED')}
                        >
                          <IconCheck />
                          Resolve
                        </button>
                      )}

                      <select
                        className={`ticket-status-select ticket-status-select-${toClassSuffix(activeTicket.status)}`}
                        value={activeTicket.status}
                        onChange={(e) => handleStatusChange(activeTicket.ticket_id, e.target.value)}
                        aria-label="Ticket status"
                      >
                        {STATUS_OPTIONS.map((status) => (
                          <option key={status} value={status}>
                            {formatStatusLabel(status)}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="ticket-detail-meta">
                    <div className="meta-field">
                      <span className="meta-label">Priority</span>
                      <span className={`ticket-priority-badge ticket-priority-${toClassSuffix(activeTicket.priority)}`}>
                        {activeTicket.priority}
                      </span>
                    </div>
                    <div className="meta-field">
                      <span className="meta-label">Customer ID</span>
                      <span className="meta-value">#{activeTicket.customer_id}</span>
                    </div>
                    <div className="meta-field">
                      <span className="meta-label">Rental ID</span>
                      <span className="meta-value">#{activeTicket.rental_id}</span>
                    </div>
                    <div className="meta-field">
                      <span className="meta-label">Opened By</span>
                      <span className="meta-value">Employee #{activeTicket.created_by_employee_id}</span>
                    </div>
                    <div className="meta-field">
                      <span className="meta-label">Created</span>
                      <span className="meta-value">{formatTimestamp(activeTicket.created_at)}</span>
                    </div>
                  </div>

                  <div className="ticket-detail-description">
                    <span className="meta-label">Description</span>
                    <p>{activeTicket.description}</p>
                  </div>
                </>
              ) : (
                <p className="ticket-empty-panel">Select a ticket to view details.</p>
              )}
            </section>
          </div>
        )}
      </main>

      {/* ─── New Ticket Modal ────────────────────────────────── */}
      {showNewTicketForm && (
        <div className="modal-overlay" onClick={resetNewTicketForm}>
          <div className="modal-card" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2 className="modal-title">New Ticket</h2>
              <button type="button" className="modal-close-btn" onClick={resetNewTicketForm} aria-label="Close">
                <IconClose />
              </button>
            </div>

            <form className="ticket-form" onSubmit={handleCreateTicket}>
              {formError && <p className="support-error" role="alert">{formError}</p>}

              <label className="form-field">
                <span className="form-label">Subject</span>
                <input
                  type="text"
                  value={newTicket.subject}
                  onChange={(e) => handleNewTicketFieldChange('subject', e.target.value)}
                  placeholder="Short summary of the issue"
                />
              </label>

              <div className="form-row">
                <label className="form-field">
                  <span className="form-label">Customer ID</span>
                  <input
                    type="number"
                    value={newTicket.customer_id}
                    onChange={(e) => handleNewTicketFieldChange('customer_id', e.target.value)}
                    placeholder="e.g. 4"
                  />
                </label>

                <label className="form-field">
                  <span className="form-label">Rental ID</span>
                  <input
                    type="number"
                    value={newTicket.rental_id}
                    onChange={(e) => handleNewTicketFieldChange('rental_id', e.target.value)}
                    placeholder="e.g. 3"
                  />
                </label>

                <label className="form-field">
                  <span className="form-label">Priority</span>
                  <select
                    value={newTicket.priority}
                    onChange={(e) => handleNewTicketFieldChange('priority', e.target.value)}
                  >
                    {PRIORITY_OPTIONS.map((priority) => (
                      <option key={priority} value={priority}>
                        {priority}
                      </option>
                    ))}
                  </select>
                </label>
              </div>

              <label className="form-field">
                <span className="form-label">Description</span>
                <textarea
                  rows={4}
                  value={newTicket.description}
                  onChange={(e) => handleNewTicketFieldChange('description', e.target.value)}
                  placeholder="Full details of the issue"
                />
              </label>

              <div className="form-actions">
                <button type="button" className="form-cancel-btn" onClick={resetNewTicketForm}>
                  Cancel
                </button>
                <button type="submit" className="form-submit-btn">
                  Create Ticket
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}


/* ─── Icons ──────────────────────────────────────────────────────
   Small inline SVG icons, kept dependency-free like the rest of
   the site's illustrations. ─────────────────────────────────── */

function IconSearch({ className }) {
  return (
    <svg className={className} width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="11" cy="11" r="7" stroke="#0f0f0f" strokeWidth="1.8" />
      <line x1="16.2" y1="16.2" x2="21" y2="21" stroke="#0f0f0f" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

function IconPlus() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="12" y1="4" x2="12" y2="20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
      <line x1="4" y1="12" x2="20" y2="12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
    </svg>
  )
}

function IconCheck() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M4 12.5 9.5 18 20 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <line x1="5" y1="5" x2="19" y2="19" stroke="#0f0f0f" strokeWidth="1.8" strokeLinecap="round" />
      <line x1="19" y1="5" x2="5" y2="19" stroke="#0f0f0f" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  )
}

export default CustomerSupport