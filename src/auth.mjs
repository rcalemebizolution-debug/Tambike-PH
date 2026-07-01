export const roles = [
  { id: 'rider', label: 'Rider', description: 'Discover rides, register for events, and show QR passes.' },
  { id: 'organizer', label: 'Organizer', description: 'Create events, scan QR passes, and manage attendance.' },
  { id: 'business', label: 'Business Partner', description: 'Promote a motorcycle-friendly venue and host tambikes.' },
  { id: 'creator', label: 'Content Creator', description: 'Find events to cover and connect with organizers.' },
  { id: 'admin', label: 'Admin', description: 'Approve businesses, organizers, events, and subscriptions.' }
]

export function validateRegistration({ name, email, password, role }) {
  const errors = {}
  if (!name || name.trim().length < 2) errors.name = 'Name is required.'
  if (!email || !/^\S+@\S+\.\S+$/.test(email)) errors.email = 'Valid email is required.'
  if (!password || password.length < 6) errors.password = 'Password must be at least 6 characters.'
  if (!roles.some((item) => item.id === role)) errors.role = 'Choose a valid role.'
  return errors
}

export function registerLocalUser(form, existingUsers = []) {
  const errors = validateRegistration(form)
  if (Object.keys(errors).length) return { ok: false, errors }

  const normalizedEmail = form.email.trim().toLowerCase()
  if (existingUsers.some((user) => user.email === normalizedEmail)) {
    return { ok: false, errors: { email: 'Email is already registered.' } }
  }

  const now = new Date().toISOString()
  const user = {
    id: `user-${Date.now()}`,
    name: form.name.trim(),
    email: normalizedEmail,
    role: form.role,
    createdAt: now,
    lastLoginAt: now
  }

  return { ok: true, user, users: [user, ...existingUsers] }
}

export function loginLocalUser({ email }, existingUsers = []) {
  const normalizedEmail = (email || '').trim().toLowerCase()
  const user = existingUsers.find((item) => item.email === normalizedEmail)
  if (!user) return { ok: false, error: 'Account not found. Register first.' }

  const updatedUser = { ...user, lastLoginAt: new Date().toISOString() }
  return {
    ok: true,
    user: updatedUser,
    users: existingUsers.map((item) => item.id === user.id ? updatedUser : item)
  }
}
