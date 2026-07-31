import { findLocationById } from '../data/locations'

const USER_STORAGE_KEY = 'wheelioUser'
const LEGACY_LOCATION_STORAGE_KEY = 'wheelioLocation'

function getLocationStorageKey(userId) {
  return `wheelioUserLocation:${userId}`
}

export function getStoredUserLocation(userId) {
  if (!userId) {
    return null
  }

  const storedLocation = localStorage.getItem(getLocationStorageKey(userId))

  if (!storedLocation) {
    return null
  }

  try {
    return JSON.parse(storedLocation)
  } catch {
    return null
  }
}

function getLegacyStoredLocation() {
  const legacyLocationId = localStorage.getItem(LEGACY_LOCATION_STORAGE_KEY)

  if (!legacyLocationId) {
    return null
  }

  return findLocationById(legacyLocationId)
}

export function hydrateUserWithSavedLocation(user) {
  if (!user) {
    return null
  }

  const savedLocation = getStoredUserLocation(user.userId)
  const derivedLocation =
    savedLocation ||
    user.selectedLocation ||
    findLocationById(user.locationId)

  if (!derivedLocation) {
    return user
  }

  return {
    ...user,
    locationId: derivedLocation.id,
    locationName: derivedLocation.name,
    selectedLocation: derivedLocation,
  }
}

export function getStoredUser() {
  const rawUser = localStorage.getItem(USER_STORAGE_KEY)

  if (!rawUser) {
    return null
  }

  try {
    return hydrateUserWithSavedLocation(JSON.parse(rawUser))
  } catch {
    return null
  }
}

export function storeAuthenticatedUser(user) {
  const hydratedUser = hydrateUserWithSavedLocation(user)
  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(hydratedUser))
  return hydratedUser
}

export function saveUserLocation(user, location) {
  if (!user?.userId || !location) {
    return user
  }

  localStorage.setItem(
    getLocationStorageKey(user.userId),
    JSON.stringify(location)
  )

  const updatedUser = {
    ...user,
    locationId: location.id,
    locationName: location.name,
    selectedLocation: location,
  }

  localStorage.setItem(USER_STORAGE_KEY, JSON.stringify(updatedUser))

  return updatedUser
}

export function getUserLocation(user) {
  return (
    user?.selectedLocation ||
    getStoredUserLocation(user?.userId) ||
    getLegacyStoredLocation() ||
    findLocationById(user?.locationId)
  )
}

export function getUserLocationLabel(user, fallback = 'Your Location') {
  const location = getUserLocation(user)
  return location?.shortName || location?.name || fallback
}
