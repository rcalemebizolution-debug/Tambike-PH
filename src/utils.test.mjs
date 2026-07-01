import test from 'node:test'
import assert from 'node:assert/strict'
import { createQrPass, getAttendanceRate } from './utils.mjs'

test('createQrPass builds a secure-looking Tambike PH pass token', () => {
  const pass = createQrPass({ id: 'neon-night-tambike', title: 'Neon Night Tambike' }, 'Juan Rider')
  assert.equal(pass.eventId, 'neon-night-tambike')
  assert.equal(pass.eventTitle, 'Neon Night Tambike')
  assert.equal(pass.riderName, 'Juan Rider')
  assert.equal(pass.status, 'registered')
  assert.match(pass.token, /^TPH-NEON-NIGHT-TAMBIKE-JUAN-RIDER$/)
})

test('getAttendanceRate returns rounded attendance percentage', () => {
  assert.equal(getAttendanceRate(128, 89), 70)
  assert.equal(getAttendanceRate(0, 10), 0)
})
