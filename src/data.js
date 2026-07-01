export const events = [
  {
    id: 'neon-night-tambike',
    title: 'Neon Night Tambike',
    category: 'Cafe Meet',
    date: 'Saturday, 8:00 PM',
    location: 'Moto Brew Cafe, Quezon City',
    distance: '3.2 km',
    registered: 128,
    capacity: 180,
    status: 'Open',
    raffle: true,
    description: 'A night meet for riders who want coffee, bikes, stories, and a clean QR check-in experience.'
  },
  {
    id: 'breakfast-ride-out',
    title: 'Breakfast Ride-Out',
    category: 'Ride-Out',
    date: 'Sunday, 6:00 AM',
    location: 'Marilaque meetup point',
    distance: '24 km',
    registered: 120,
    capacity: 160,
    status: 'Open',
    raffle: false,
    description: 'Early morning group ride with breakfast stop and organizer-led route briefing.'
  },
  {
    id: 'bike-wash-weekend',
    title: 'Bike Wash Weekend Meet',
    category: 'Business Event',
    date: 'Saturday, 3:00 PM',
    location: 'Northside Garage',
    distance: '7.6 km',
    registered: 64,
    capacity: 100,
    status: 'Open',
    raffle: true,
    description: 'Partner business event with wash promos, rider networking, and giveaway for checked-in riders.'
  }
]

export const businesses = [
  { name: 'Moto Brew Cafe', type: 'Cafe', location: 'Quezon City', events: 6, status: 'Partner' },
  { name: 'Northside Garage', type: 'Service Center', location: 'Caloocan', events: 3, status: 'Partner' },
  { name: 'Detailing Hub Moto', type: 'Detailing Shop', location: 'Pasig', events: 4, status: 'Pending' }
]

export const stats = [
  { label: 'Registered riders', value: '312' },
  { label: 'Checked in', value: '184' },
  { label: 'Partner businesses', value: '18' },
  { label: 'Pending approvals', value: '7' }
]
