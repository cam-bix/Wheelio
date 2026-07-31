export const locations = [
  {
    id: 1,
    name: 'Region of Waterloo International Airport',
    shortName: 'Waterloo Airport',
    address: '1-4881 Fountain Street North, Breslau, Ontario, N0B 1M0',
    icon: '✈️',
  },
  {
    id: 2,
    name: 'Toronto Pearson Airport',
    shortName: 'Toronto Pearson',
    address: '6301 Silver Dart Dr, Mississauga, Ontario, L5P 1B2',
    icon: '✈️',
  },
  {
    id: 3,
    name: 'Kitchener City Hall',
    shortName: 'Kitchener City Hall',
    address: '200 King St W, Kitchener, Ontario, N2G 4V6',
    icon: '🏛️',
  },
  {
    id: 4,
    name: 'Waterloo Town Square',
    shortName: 'Waterloo Town Square',
    address: '75 King St S, Waterloo, Ontario, N2J 1P2',
    icon: '🏙️',
  },
]

export function findLocationById(locationId) {
  return locations.find((location) => location.id === Number(locationId)) || null
}
