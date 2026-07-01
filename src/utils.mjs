export function createQrPass(event, riderName = 'Tambike Rider') {
  if (!event?.id || !event?.title) {
    throw new Error('event id and title are required')
  }

  const safeRider = riderName.trim() || 'Tambike Rider'
  const token = `TPH-${event.id.toUpperCase().replace(/[^A-Z0-9]+/g, '-')}-${safeRider.toUpperCase().replace(/[^A-Z0-9]+/g, '-')}`

  return {
    token,
    eventId: event.id,
    eventTitle: event.title,
    riderName: safeRider,
    status: 'registered'
  }
}

export function getAttendanceRate(registered, checkedIn) {
  if (!registered || registered < 1) return 0
  return Math.round((checkedIn / registered) * 100)
}
