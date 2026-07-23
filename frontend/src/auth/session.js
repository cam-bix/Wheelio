export function getStoredUser() {
  try {
    return JSON.parse(localStorage.getItem('wheelioUser') || 'null')
  } catch {
    localStorage.removeItem('wheelioUser')
    return null
  }
}

export function storeUser(user) {
  localStorage.setItem('wheelioUser', JSON.stringify(user))
}

export function isEmployeeUser(user) {
  return user?.role === 'EMPLOYEE' || user?.role === 'ADMIN'
}

export function getRoleHomePath(user) {
  return isEmployeeUser(user) ? '/employee-home' : '/home'
}
