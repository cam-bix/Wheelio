import { useState, useEffect, useMemo, useRef } from 'react'
import logo from '../assets/Wheelio_logo.png'
import { Link } from 'react-router-dom'
import './CustomerSupport.css'


// Placeholder conversation list. Swap this out for a real API call
// (e.g. import { getConversations } from '../api/support') once the
// support endpoint is ready.
const MOCK_CONVERSATIONS = [
  {
    id: 'c1',
    customer: 'Jordan Lee',
    lastMessage: 'My Corolla has a flat tire, can someone help?',
    avatar: '',
  },
  {
    id: 'c2',
    customer: 'Priya Nair',
    lastMessage: 'I was charged twice for my rental in Waterloo.',
    avatar: '',
  },
  {
    id: 'c3',
    customer: 'Marcus Ontiveros',
    lastMessage: 'Can I extend my return date by two days?',
    avatar: '',
  },
]

// Placeholder message history, keyed by conversation id. Swap this
// out for a real API call (e.g. import { getMessages } from
// '../api/support') once the messages endpoint is ready — this
// should probably be fetched per-conversation instead of all at
// once as the ticket volume grows.
const MOCK_MESSAGES = {
  c1: [
    { id: 'm1', sender: 'customer', text: 'Hi, my Corolla has a flat tire, can someone help?', timestamp: '9:02 AM' },
    { id: 'm2', sender: 'employee', text: 'Sorry to hear that! Are you in a safe location right now?', timestamp: '9:04 AM' },
    { id: 'm3', sender: 'customer', text: "Yes, I'm parked in a lot off King Street.", timestamp: '9:05 AM' },
  ],
  c2: [
    { id: 'm1', sender: 'customer', text: 'I was charged twice for my rental in Waterloo.', timestamp: 'Yesterday' },
  ],
  c3: [
    { id: 'm1', sender: 'customer', text: 'Can I extend my return date by two days?', timestamp: 'Monday' },
    { id: 'm2', sender: 'employee', text: 'Let me check availability for you.', timestamp: 'Monday' },
  ],
}


//The following is the employee customer support page, where staff can
//view and respond to customer conversations in a two-panel chat layout.
function CustomerSupport() {
  const [conversations, setConversations] = useState([])
  const [messages, setMessages] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [activeConversationId, setActiveConversationId] = useState(null)
  const [draft, setDraft] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    const fetchSupportData = async () => {
      setLoading(true)
      setError('')
      try {
        // TODO: replace with real API calls once the endpoints exist,
        // e.g. const convos = await getConversations()
        const convos = MOCK_CONVERSATIONS
        setConversations(convos)
        setMessages(MOCK_MESSAGES)
        setActiveConversationId(convos[0]?.id ?? null)
      } catch (err) {
        setError(err.message || 'Unable to load conversations.')
      } finally {
        setLoading(false)
      }
    }

    fetchSupportData()
  }, [])

  // Filter the conversation list by customer name so staff can
  // quickly find a chat.
  const visibleConversations = useMemo(() => {
    const query = search.trim().toLowerCase()
    if (!query) return conversations

    return conversations.filter((conversation) =>
      conversation.customer.toLowerCase().includes(query)
    )
  }, [conversations, search])

  const activeConversation = conversations.find((c) => c.id === activeConversationId) ?? null
  const activeMessages = activeConversationId ? messages[activeConversationId] ?? [] : []

  // Auto-scroll to the latest message whenever the open conversation
  // or its messages change.
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [activeConversationId, activeMessages.length])

  // Appends the drafted message to the open conversation.
  // TODO: replace with a real API call, e.g. await sendMessage(activeConversationId, draft)
  const handleSend = () => {
    const text = draft.trim()
    if (!text || !activeConversationId) return

    const newMessage = {
      id: `m${Date.now()}`,
      sender: 'employee',
      text,
      timestamp: 'Just now',
    }

    setMessages((prev) => ({
      ...prev,
      [activeConversationId]: [...(prev[activeConversationId] ?? []), newMessage],
    }))
    setDraft('')
  }

  const handleDraftKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      handleSend()
    }
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
        <h1 className="support-title">Customer Service</h1>

        {error && <p className="support-error" role="alert">{error}</p>}

        {loading ? (
          <p className="support-loading">Loading conversations...</p>
        ) : (
          <div className="support-panels">

            {/* ─── Left Panel: Conversation List ─────────────── */}
            <aside className="conversations-panel">
              <div className="conversations-search-wrapper">
                <input
                  type="text"
                  className="conversations-search"
                  placeholder="Search Conversations"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  aria-label="Search conversations"
                />
                <IconSearch className="conversations-search-icon" />
              </div>

              <div className="conversations-list">
                {visibleConversations.map((conversation) => (
                  <button
                    type="button"
                    key={conversation.id}
                    className={`conversation-item ${conversation.id === activeConversationId ? 'conversation-item-active' : ''}`}
                    onClick={() => setActiveConversationId(conversation.id)}
                  >
                    <div className="conversation-avatar" aria-hidden="true">
                      {conversation.avatar ? (
                        <img src={conversation.avatar} alt="" />
                      ) : (
                        <IconPerson />
                      )}
                    </div>

                    <div className="conversation-preview">
                      <span className="conversation-name">{conversation.customer}</span>
                      <span className="conversation-last-message">{conversation.lastMessage}</span>
                    </div>
                  </button>
                ))}

                {visibleConversations.length === 0 && (
                  <p className="conversations-empty">
                    {search ? `No conversations match "${search}".` : 'No conversations found.'}
                  </p>
                )}
              </div>
            </aside>

            {/* ─── Right Panel: Open Conversation ────────────── */}
            <section className="chat-panel">
              {activeConversation ? (
                <>
                  <div className="chat-header">
                    <div className="chat-header-avatar" aria-hidden="true">
                      {activeConversation.avatar ? (
                        <img src={activeConversation.avatar} alt="" />
                      ) : (
                        <IconPerson />
                      )}
                    </div>
                    <span className="chat-header-name">{activeConversation.customer}</span>
                  </div>

                  <div className="chat-messages">
                    {activeMessages.map((message) => (
                      <div
                        key={message.id}
                        className={`chat-bubble-row ${message.sender === 'employee' ? 'chat-bubble-row-employee' : ''}`}
                      >
                        <div className={`chat-bubble ${message.sender === 'employee' ? 'chat-bubble-employee' : 'chat-bubble-customer'}`}>
                          <p className="chat-bubble-text">{message.text}</p>
                          <span className="chat-bubble-timestamp">{message.timestamp}</span>
                        </div>
                      </div>
                    ))}

                    {activeMessages.length === 0 && (
                      <p className="chat-empty">No messages yet — say hello!</p>
                    )}

                    <div ref={messagesEndRef} />
                  </div>

                  <div className="chat-input-row">
                    <input
                      type="text"
                      className="chat-input"
                      placeholder="Type Message Here"
                      value={draft}
                      onChange={(e) => setDraft(e.target.value)}
                      onKeyDown={handleDraftKeyDown}
                      aria-label="Type a message"
                    />
                    <button type="button" className="chat-send-btn" onClick={handleSend}>
                      <IconSend />
                      Send
                    </button>
                  </div>
                </>
              ) : (
                <p className="chat-empty chat-empty-panel">
                  Select a conversation to view messages.
                </p>
              )}
            </section>
          </div>
        )}
      </main>
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

function IconPerson() {
  return (
    <svg width="22" height="22" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <circle cx="12" cy="8" r="4" stroke="#6c757d" strokeWidth="1.6" />
      <path d="M4 20c1.5-4 5-6 8-6s6.5 2 8 6" stroke="#6c757d" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

function IconSend() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <path d="M3.5 12 20.5 4 13 20.5 10.8 13.2 3.5 12Z" stroke="#ffffff" strokeWidth="1.6" strokeLinejoin="round" strokeLinecap="round" />
      <line x1="10.8" y1="13.2" x2="20.5" y2="4" stroke="#ffffff" strokeWidth="1.6" strokeLinecap="round" />
    </svg>
  )
}

export default CustomerSupport