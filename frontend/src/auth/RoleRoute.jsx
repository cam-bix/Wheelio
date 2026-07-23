import { Navigate } from 'react-router-dom'
import { getRoleHomePath, getStoredUser, isEmployeeUser } from './session'

function RoleRoute({ children, allow }) {
  const user = getStoredUser()

  if (!user) {
    return <Navigate to="/login" replace />
  }

  const isEmployee = isEmployeeUser(user)

  if (allow === 'employee' && !isEmployee) {
    return <Navigate to="/home" replace />
  }

  if (allow === 'customer' && isEmployee) {
    return <Navigate to="/employee-home" replace />
  }

  return children
}

export function RoleHomeRedirect() {
  const user = getStoredUser()
  return <Navigate to={user ? getRoleHomePath(user) : '/login'} replace />
}

export default RoleRoute
