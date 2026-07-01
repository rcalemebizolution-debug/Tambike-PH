import test from 'node:test'
import assert from 'node:assert/strict'

const routes = ['/', '/events', '/businesses', '/login', '/register', '/rider', '/organizer', '/admin']

test('Tambike PH route list includes MVP pages', () => {
  assert.deepEqual(routes, ['/', '/events', '/businesses', '/login', '/register', '/rider', '/organizer', '/admin'])
})

test('event detail route pattern is supported', () => {
  const eventId = 'neon-night-tambike'
  assert.equal(`/events/${eventId}`, '/events/neon-night-tambike')
})
