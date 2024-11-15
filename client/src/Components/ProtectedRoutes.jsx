import React from 'react'
import { Navigate } from 'react-router-dom'
// ProtectedRoutes component: wraps around components that need authentication
const ProtectedRoutes = ({children}) => {
  const token=localStorage.getItem('token')
  return token?children:<Navigate to="/login" replace/>
}

export default ProtectedRoutes
