import React, { useMemo, useState } from 'react'
import { createRoot } from 'react-dom/client'
import { Link, NavLink, Route, Routes, useNavigate } from 'react-router-dom'
import { BrowserRouter } from 'react-router-dom'
import { CalendarDays, CheckCircle2, LayoutDashboard, MapPin, Menu, QrCode, Search, ShieldCheck, Store, Trophy, Users } from 'lucide-react'
import { businesses, events, stats } from './data.js'
import { loginLocalUser, registerLocalUser, roles } from './auth.mjs'
import { createQrPass, getAttendanceRate } from './utils.mjs'
import './styles.css'

function App() {
  const [selectedEvent, setSelectedEvent] = useState(events[0])
  const [pass, setPass] = useState(() => createQrPass(events[0], 'Tambike Rider'))
  const [users, setUsers] = useState(() => readStorage('tambikeUsers', []))
  const [currentUser, setCurrentUser] = useState(() => readStorage('tambikeCurrentUser', null))
  const [toast, setToast] = useState('')

  const selectedPass = useMemo(() => createQrPass(selectedEvent, 'Tambike Rider'), [selectedEvent])

  function flash(message) {
    setToast(message)
    window.setTimeout(() => setToast(''), 2400)
  }

  function registerForEvent(event) {
    setSelectedEvent(event)
    setPass(createQrPass(event, 'Tambike Rider'))
    flash(`Registered for ${event.title}. QR pass ready.`)
  }

  function scanPass() {
    setPass({ ...selectedPass, status: 'checked-in' })
    flash('QR scanned. Rider checked in successfully.')
  }

  function registerAccount(form) {
    const result = registerLocalUser(form, users)
    if (!result.ok) return result
    setUsers(result.users)
    setCurrentUser(result.user)
    writeStorage('tambikeUsers', result.users)
    writeStorage('tambikeCurrentUser', result.user)
    flash(`Welcome to Tambike PH, ${result.user.name}.`)
    return result
  }

  function loginAccount(form) {
    const result = loginLocalUser(form, users)
    if (!result.ok) return result
    setUsers(result.users)
    setCurrentUser(result.user)
    writeStorage('tambikeUsers', result.users)
    writeStorage('tambikeCurrentUser', result.user)
    flash(`Welcome back, ${result.user.name}.`)
    return result
  }

  function logoutAccount() {
    setCurrentUser(null)
    window.localStorage.removeItem('tambikeCurrentUser')
    flash('Logged out.')
  }

  const appState = { selectedEvent, pass, registerForEvent, scanPass, flash, currentUser, users, registerAccount, loginAccount, logoutAccount }

  return (
    <BrowserRouter>
      <header className="site-header">
        <Link className="brand" to="/" aria-label="Tambike PH home">
          <span className="brand-mark">TPH</span>
          <span><strong>Tambike PH</strong><small>Motorcycle events</small></span>
        </Link>
        <nav className="desktop-nav" aria-label="Main navigation">
          <NavLink to="/events">Events</NavLink>
          <NavLink to="/businesses">Businesses</NavLink>
          <NavLink to="/rider">Rider</NavLink>
          <NavLink to="/organizer">Organizer</NavLink>
          <NavLink to="/admin">Admin</NavLink>
        </nav>
        <div className="header-actions">
          {currentUser ? <button className="ghost-button" onClick={logoutAccount}>{currentUser.name}</button> : <Link className="ghost-button" to="/login">Log in</Link>}
          {!currentUser && <Link className="primary-button" to="/register">Join now</Link>}
          <Link className="primary-button" to="/events">Find rides</Link>
          <button className="menu-button" aria-label="Open menu"><Menu size={20} /></button>
        </div>
      </header>

      <Routes>
        <Route path="/" element={<HomePage {...appState} />} />
        <Route path="/events" element={<EventsPage {...appState} />} />
        <Route path="/events/:eventId" element={<EventDetailsPage {...appState} />} />
        <Route path="/businesses" element={<BusinessesPage />} />
        <Route path="/login" element={<LoginPage {...appState} />} />
        <Route path="/register" element={<RegisterPage {...appState} />} />
        <Route path="/rider" element={<RiderDashboardPage {...appState} />} />
        <Route path="/organizer" element={<OrganizerDashboardPage />} />
        <Route path="/admin" element={<AdminDashboardPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Routes>

      <footer className="footer section-shell">
        <strong>Tambike PH</strong>
        <p>Motorcycle-only platform foundation: event discovery, business partners, QR attendance, rider/organizer dashboards, and admin approvals.</p>
      </footer>

      <nav className="mobile-bottom-nav" aria-label="Mobile navigation">
        <NavLink to="/"><span>Home</span></NavLink>
        <NavLink to="/events"><span>Events</span></NavLink>
        <NavLink to="/rider"><span>Pass</span></NavLink>
        <NavLink to="/organizer"><span>Org</span></NavLink>
      </nav>

      {toast && <div className="toast" role="status">{toast}</div>}
    </BrowserRouter>
  )
}

function HomePage({ registerForEvent }) {
  return (
    <main>
      <section className="hero section-shell">
        <div className="hero-copy">
          <p className="eyebrow">Black + neon pink motorcycle community</p>
          <h1>Find the next <span>tambike</span> near you.</h1>
          <p className="hero-text">Tambike PH connects riders, motorcycle-friendly businesses, organizers, and creators through events, QR attendance, and checked-in rider raffles.</p>
          <div className="hero-actions"><Link className="primary-button large" to="/events">Explore events</Link><Link className="ghost-button large" to="/rider">View QR pass</Link></div>
          <div className="hero-stats" aria-label="Platform preview statistics">{stats.map((item) => <div key={item.label}><strong>{item.value}</strong><span>{item.label}</span></div>)}</div>
        </div>
        <aside className="phone-preview" aria-label="Mobile preview">
          <div className="phone-screen">
            <div className="phone-top"><span>9:41</span><strong>Tambike PH</strong><span>●●●</span></div>
            <div className="mobile-title"><div><h2>Tonight's rides</h2><p>Near Quezon City</p></div><span className="live-badge">Live</span></div>
            <label className="mobile-search"><Search size={16} /> Search events, cafes, clubs...</label>
            <EventCard event={events[0]} compact onRegister={registerForEvent} />
            <EventCard event={events[1]} compact onRegister={registerForEvent} />
          </div>
        </aside>
      </section>
      <section className="section-shell section page-preview-grid">
        <PreviewCard icon={<CalendarDays />} title="Events" text="Browse and register for tambikes and ride-outs." to="/events" />
        <PreviewCard icon={<Store />} title="Businesses" text="Find motorcycle-friendly partner venues." to="/businesses" />
        <PreviewCard icon={<QrCode />} title="QR Pass" text="Open your rider pass and check-in status." to="/rider" />
      </section>
    </main>
  )
}

function EventsPage({ selectedEvent, registerForEvent }) {
  return (
    <main className="page-main section-shell">
      <PageHero kicker="Event discovery" title="Upcoming motorcycle events" text="Browse tambikes, ride-outs, business-hosted meetups, and rider community events." />
      <div className="filter-row" aria-label="Event filters">{['Today', 'This weekend', 'Near me', 'Cafe meet', 'Ride-out', 'Raffle enabled'].map((filter) => <button key={filter}>{filter}</button>)}</div>
      <div className="event-grid">{events.map((event) => <EventCard key={event.id} event={event} onRegister={registerForEvent} selected={selectedEvent.id === event.id} showDetails />)}</div>
    </main>
  )
}

function EventDetailsPage({ registerForEvent }) {
  const eventId = window.location.pathname.split('/').pop()
  const event = events.find((item) => item.id === eventId) || events[0]
  return (
    <main className="page-main section-shell split detail-layout">
      <div>
        <p className="eyebrow">Event details</p>
        <h1 className="page-title">{event.title}</h1>
        <p className="hero-text">{event.description}</p>
        <div className="detail-meta">
          <FlowItem icon={<CalendarDays />} title={event.date} text="Event schedule" />
          <FlowItem icon={<MapPin />} title={event.location} text={`${event.distance} away`} />
          <FlowItem icon={<Users />} title={`${event.registered}/${event.capacity} riders`} text="Registration count" />
          <FlowItem icon={<Trophy />} title={event.raffle ? 'Raffle enabled' : 'No raffle'} text="Giveaway eligibility" />
        </div>
        <button className="primary-button large" onClick={() => registerForEvent(event)}>Register and generate QR pass</button>
      </div>
      <article className="event-card selected detail-card"><div className="event-poster"><span>{event.category}</span></div><h3>{event.title}</h3><p>{event.description}</p></article>
    </main>
  )
}

function BusinessesPage() {
  return (
    <main className="page-main section-shell">
      <PageHero kicker="Partner businesses" title="Motorcycle-friendly places" text="Promote cafes, garages, detailing shops, service centers, and venues that welcome riders." />
      <div className="business-grid">{businesses.map((business) => <BusinessCard key={business.name} business={business} />)}</div>
    </main>
  )
}

function LoginPage({ loginAccount, currentUser }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ email: '' })
  const [error, setError] = useState('')

  function submit(event) {
    event.preventDefault()
    const result = loginAccount(form)
    if (!result.ok) {
      setError(result.error)
      return
    }
    navigate(roleHome(result.user.role))
  }

  return (
    <main className="page-main section-shell auth-layout">
      <AuthIntro title="Welcome back" text="Log in with the email you registered in this browser-local prototype." />
      <form className="auth-card" onSubmit={submit}>
        <span className="pill">Login</span>
        {currentUser && <p className="status-ok">Currently signed in as {currentUser.name}.</p>}
        {error && <p className="form-error">{error}</p>}
        <label>Email<input value={form.email} onChange={(event) => setForm({ email: event.target.value })} placeholder="rider@example.com" /></label>
        <button className="primary-button wide" type="submit">Log in</button>
        <p className="auth-switch">No account yet? <Link to="/register">Create one</Link></p>
      </form>
    </main>
  )
}

function RegisterPage({ registerAccount }) {
  const navigate = useNavigate()
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'rider' })
  const [errors, setErrors] = useState({})

  function update(field, value) {
    setForm((current) => ({ ...current, [field]: value }))
  }

  function submit(event) {
    event.preventDefault()
    const result = registerAccount(form)
    if (!result.ok) {
      setErrors(result.errors)
      return
    }
    navigate(roleHome(result.user.role))
  }

  return (
    <main className="page-main section-shell auth-layout">
      <AuthIntro title="Join Tambike PH" text="Choose your role so the platform can send you to the right dashboard after registration." />
      <form className="auth-card" onSubmit={submit}>
        <span className="pill">Create account</span>
        <label>Full name<input value={form.name} onChange={(event) => update('name', event.target.value)} placeholder="Juan Rider" />{errors.name && <small>{errors.name}</small>}</label>
        <label>Email<input value={form.email} onChange={(event) => update('email', event.target.value)} placeholder="rider@example.com" />{errors.email && <small>{errors.email}</small>}</label>
        <label>Password<input type="password" value={form.password} onChange={(event) => update('password', event.target.value)} placeholder="At least 6 characters" />{errors.password && <small>{errors.password}</small>}</label>
        <div className="role-grid">
          {roles.map((role) => <button className={form.role === role.id ? 'role-card selected' : 'role-card'} key={role.id} onClick={() => update('role', role.id)} type="button"><strong>{role.label}</strong><span>{role.description}</span></button>)}
        </div>
        {errors.role && <p className="form-error">{errors.role}</p>}
        <button className="primary-button wide" type="submit">Create account</button>
        <p className="auth-switch">Already registered? <Link to="/login">Log in</Link></p>
      </form>
    </main>
  )
}

function RiderDashboardPage({ selectedEvent, pass, scanPass }) {
  return (
    <main className="page-main section-shell split">
      <div>
        <PageHero kicker="Rider dashboard" title="Your event pass" text="Access registered rides, QR event pass, participation history, and check-in status." />
        <div className="flow-list">
          <FlowItem icon={<CalendarDays />} title="Registered" text={selectedEvent.title} />
          <FlowItem icon={<QrCode />} title="QR ready" text="Show this pass at the venue." />
          <FlowItem icon={<CheckCircle2 />} title={pass.status === 'checked-in' ? 'Checked in' : 'Not checked in'} text="Attendance status" />
          <FlowItem icon={<Trophy />} title="Raffle" text="Eligible only after check-in." />
        </div>
      </div>
      <PassCard event={selectedEvent} pass={pass} onScan={scanPass} />
    </main>
  )
}

function OrganizerDashboardPage() {
  const attendanceRate = getAttendanceRate(128, 89)
  return (
    <main className="page-main section-shell">
      <PageHero kicker="Organizer dashboard" title="Manage registration and attendance" text="Create events, view registration counts, scan QR passes, export attendance, and run raffles." />
      <div className="dashboard-card">
        <div className="dashboard-top"><h3>Neon Night Tambike</h3><span className="pill">Approved</span></div>
        <div className="metric-grid"><Metric value="128" label="Registered" /><Metric value="89" label="Checked in" /><Metric value={`${attendanceRate}%`} label="Attendance rate" /><Metric value="12" label="Raffle entries" /></div>
        <div className="dashboard-actions"><button className="primary-button">Scan QR</button><button className="ghost-button">Export CSV</button><button className="ghost-button">Pick raffle winner</button></div>
      </div>
    </main>
  )
}

function AdminDashboardPage() {
  return (
    <main className="page-main section-shell">
      <PageHero kicker="Admin approvals" title="Control what goes live" text="Approve businesses, organizers, and events before they appear publicly." />
      <div className="approval-list"><ApprovalRow type="Business" title="Moto Brew Cafe" detail="New partner application • Quezon City" /><ApprovalRow type="Event" title="Sunday Breakfast Ride" detail="Organizer submitted event • Marilaque" /><ApprovalRow type="Organizer" title="Northside Riders Club" detail="Organizer verification request" /></div>
    </main>
  )
}

function AuthIntro({ title, text }) {
  return <div><p className="eyebrow">Tambike PH accounts</p><h1 className="page-title">{title}</h1><p className="hero-text">{text}</p><div className="auth-benefits"><FlowItem icon={<Users />} title="Role-based" text="Rider, organizer, business, creator, or admin." /><FlowItem icon={<ShieldCheck />} title="Approval-ready" text="Business, organizer, and event approvals connect here next." /><FlowItem icon={<LayoutDashboard />} title="Dashboard routing" text="Each role opens the right workspace." /></div></div>
}

function roleHome(role) {
  if (role === 'organizer') return '/organizer'
  if (role === 'business') return '/businesses'
  if (role === 'admin') return '/admin'
  return '/rider'
}

function NotFoundPage() {
  return <main className="page-main section-shell"><PageHero kicker="404" title="Page not found" text="This Tambike PH page does not exist yet." /><Link className="primary-button" to="/">Back home</Link></main>
}

function PageHero({ kicker, title, text }) { return <section className="page-hero"><p className="eyebrow">{kicker}</p><h1 className="page-title">{title}</h1><p>{text}</p></section> }
function PreviewCard({ icon, title, text, to }) { return <Link className="preview-card" to={to}><span>{icon}</span><h3>{title}</h3><p>{text}</p></Link> }
function EventCard({ event, compact = false, onRegister, selected = false, showDetails = false }) {
  const navigate = useNavigate()
  return <article className={`event-card ${compact ? 'compact' : ''} ${selected ? 'selected' : ''}`}><div className="event-poster"><span>{event.category}</span></div><div className="event-meta"><span><CalendarDays size={15} />{event.date}</span><span><MapPin size={15} />{event.distance}</span></div><h3>{event.title}</h3><p>{event.description}</p><div className="event-bottom"><span>{event.registered}/{event.capacity} riders</span>{event.raffle && <span className="raffle">Raffle</span>}</div><div className="card-actions"><button className="primary-button wide" onClick={() => onRegister(event)}>Register</button>{showDetails && <button className="ghost-button wide" onClick={() => navigate(`/events/${event.id}`)}>Details</button>}</div></article>
}
function BusinessCard({ business }) { return <article className="business-card"><div className="business-art"><Store size={34} /></div><span className="pill muted">{business.status}</span><h3>{business.name}</h3><p>{business.type} • {business.location}</p><strong>{business.events} hosted events</strong></article> }
function PassCard({ event, pass, onScan }) { return <div className="pass-card"><span className="pill">Event Pass</span><h3>{event.title}</h3><p>{event.date} • {event.location}</p><div className="fake-qr" aria-label="QR code preview"><span>TPH</span></div><code>{pass.token}</code><button className="primary-button wide" onClick={onScan}>Simulate QR check-in</button><small className={pass.status === 'checked-in' ? 'status-ok' : ''}>{pass.status === 'checked-in' ? 'Checked in successfully' : 'Registered, not yet checked in'}</small></div> }
function FlowItem({ icon, title, text }) { return <div className="flow-item"><span>{icon}</span><div><strong>{title}</strong><p>{text}</p></div></div> }
function Metric({ value, label }) { return <div className="metric"><strong>{value}</strong><span>{label}</span></div> }
function ApprovalRow({ type, title, detail }) { return <article className="approval-row"><span className="approval-type">{type}</span><div><h3>{title}</h3><p>{detail}</p></div><div className="approval-actions"><button className="primary-button">Approve</button><button className="ghost-button">Review</button></div></article> }

function readStorage(key, fallback) {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function writeStorage(key, value) {
  window.localStorage.setItem(key, JSON.stringify(value))
}

createRoot(document.getElementById('root')).render(<App />)
