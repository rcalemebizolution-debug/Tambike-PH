import test from 'node:test'
import assert from 'node:assert/strict'
import { loginLocalUser, registerLocalUser, validateRegistration } from './auth.mjs'

test('validateRegistration requires complete rider account data', () => {
  const errors = validateRegistration({ name: '', email: 'bad', password: '123', role: 'pilot' })
  assert.equal(errors.name, 'Name is required.')
  assert.equal(errors.email, 'Valid email is required.')
  assert.equal(errors.password, 'Password must be at least 6 characters.')
  assert.equal(errors.role, 'Choose a valid role.')
})

test('registerLocalUser creates normalized role-based account', () => {
  const result = registerLocalUser({ name: ' Juan Rider ', email: 'JUAN@example.com', password: 'secret1', role: 'rider' }, [])
  assert.equal(result.ok, true)
  assert.equal(result.user.name, 'Juan Rider')
  assert.equal(result.user.email, 'juan@example.com')
  assert.equal(result.user.role, 'rider')
  assert.equal(result.users.length, 1)
})

test('loginLocalUser updates last login for existing account', () => {
  const user = { id: 'user-1', name: 'Juan', email: 'juan@example.com', role: 'rider', createdAt: '2026-01-01T00:00:00.000Z', lastLoginAt: '2026-01-01T00:00:00.000Z' }
  const result = loginLocalUser({ email: 'JUAN@example.com' }, [user])
  assert.equal(result.ok, true)
  assert.equal(result.user.email, 'juan@example.com')
  assert.notEqual(result.user.lastLoginAt, user.lastLoginAt)
})
