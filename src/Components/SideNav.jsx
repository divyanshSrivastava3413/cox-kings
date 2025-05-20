import React, { useState } from 'react';
import {  Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';

import { IconButton, Box, Typography } from '@mui/material';
import MenuOutlinedIcon from '@mui/icons-material/MenuOutlined';
import DashboardOutlinedIcon from '@mui/icons-material/DashboardOutlined';
import PeopleOutlinedIcon from '@mui/icons-material/PeopleOutlined';
import ShoppingCartOutlinedIcon from '@mui/icons-material/ShoppingCartOutlined';
import BarChartOutlinedIcon from '@mui/icons-material/BarChartOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import HelpOutlineOutlinedIcon from '@mui/icons-material/HelpOutlineOutlined';
import LogoutOutlinedIcon from '@mui/icons-material/LogoutOutlined';
import { BookOnline, LibraryBooks, PaymentOutlined, Receipt } from '@mui/icons-material';

import {Link,NavLink,useLocation} from 'react-router-dom';


const SideNav = () => {
  const [collapsed, setCollapsed] = useState(false);
  const location = useLocation();
  const currentPath = location.pathname;

  const isActive = (path) => currentPath === path;

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', color: '#005899' }}>
      <Sidebar
        backgroundColor="white"
        className="custom-sidebar"
        collapsed={collapsed}
        rootStyles={{
          '& .ps-sidebar-root': {
            height: '100%',
            transition: 'all 0.3s ease',
          },
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: collapsed ? 'center' : 'space-between',
            padding: '10px',
          }}
        >
          {!collapsed && (
            <img
              src="/images/clientlogo.png"
              alt="Client Logo"
              width={100}
              style={{ margin: 'auto' }}
            />
          )}
          <IconButton onClick={toggleSidebar}>
            <MenuOutlinedIcon style={{ color: '#005899' }} />
          </IconButton>
        </Box>

        <Menu iconShape="circle" style={{ fontSize: '16px', fontWeight: '500' }}>
          <MenuItem
            icon={<DashboardOutlinedIcon />}
            component={<Link to="/" />}
            className={`menu-item ${isActive('/') ? 'active-menu-item' : ''}`}
          >
            Dashboard
          </MenuItem>

          <SubMenu label="Onboarding" icon={<PeopleOutlinedIcon />}>
            <MenuItem
              component={<Link to="/OnboardingCustomer" />}
              className={`menu-item ${isActive('/OnboardingCustomer') ? 'active-menu-item' : ''}`}
            >
              Customers
            </MenuItem>
            <MenuItem
              component={<Link to="/OnboardingVendor" />}
              className={`menu-item ${isActive('/OnboardingVendor') ? 'active-menu-item' : ''}`}
            >
              Vendors
            </MenuItem>
          </SubMenu>

          <SubMenu label="Booking Section" icon={<BookOnline />}>
            <MenuItem
              component={<Link to="/bookings" />}
              className={`menu-item ${isActive('/bookings') ? 'active-menu-item' : ''}`}
            >
              All Orders
            </MenuItem>
            <MenuItem className="menu-item">Pending</MenuItem>
            <MenuItem className="menu-item">Completed</MenuItem>
            <MenuItem className="menu-item">Refunds</MenuItem>
          </SubMenu>

          <SubMenu label="Masters Section" icon={<LibraryBooks />}>
            <MenuItem className="menu-item">Sales</MenuItem>
            <MenuItem className="menu-item">Users</MenuItem>
            <MenuItem className="menu-item">Inventory</MenuItem>
            <MenuItem className="menu-item">Revenue</MenuItem>
          </SubMenu>

          <SubMenu label="Reciept Management" icon={<Receipt />}>
            <MenuItem className="menu-item">All Orders</MenuItem>
            <MenuItem className="menu-item">Pending</MenuItem>
            <MenuItem className="menu-item">Completed</MenuItem>
            <MenuItem className="menu-item">Refunds</MenuItem>
          </SubMenu>

          <MenuItem icon={<PaymentOutlined />} className="menu-item"component={<Link to="invoicepayments" />}>
            Purchase Management
          </MenuItem>
          <MenuItem
            icon={<HelpOutlineOutlinedIcon />}
            component={<Link to="/paymentadvisory" />}
            className={`menu-item ${isActive('/paymentadvisory') ? 'active-menu-item' : ''}`}
          >
            Help
          </MenuItem>
          <MenuItem
            icon={<LogoutOutlinedIcon />}
            component={<Link to="/paymentreconcilation" />}
            className={`menu-item ${isActive('/paymentreconcilation') ? 'active-menu-item' : ''}`}
          >
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>
    </Box>
  );
};


export default SideNav;
