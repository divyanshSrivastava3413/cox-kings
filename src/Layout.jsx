import React from 'react'
import { Outlet } from 'react-router-dom'

import NavTop from './Components/NavTop'
import SideNav from './Components/SideNav'

function Layout() {
  return (
    <div style={{ display: 'flex', height: '100vh' }}>
    {/* Sidebar */}
    <SideNav />

    {/* Main content area */}
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <NavTop />
      
      {/* Main content */}
      <div style={{ flex: 1, padding: '16px',margin:'auto' ,overflowY:'auto'}}>
        <Outlet />
      </div>
    </div>
  </div>
  )
}

export default Layout