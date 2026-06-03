import React from 'react'
import {Navigate,Outlet,useLocation} from 'react-router-dom'

const ProtectsRoutes = ({requiredrole}) => {
  return <Outlet /> //will implement later when we have auth and role management in place
}

export default ProtectsRoutes
