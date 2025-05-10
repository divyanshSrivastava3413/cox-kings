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

import {Link,NavLink} from 'react-router-dom';


const SideNav = () => {
  const [collapsed, setCollapsed] = useState(false);

  const toggleSidebar = () => {
    setCollapsed(!collapsed);
  };

  return (
    
      <Box 
        sx={{
          height: '100vh',
          display: 'flex',
          color:"#005899",
          
          
          
         
          
          
        }}
      >
        <Sidebar backgroundColor='white' 
        className='custom-sidebar'
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
              <img src='/images/clientlogo.png' alt='Client Logo' width={100} style={{margin:"auto"}}/>
            )}
            <IconButton onClick={toggleSidebar}>
              <MenuOutlinedIcon style={{color:"#005899"}}/>
            </IconButton>
          </Box>

          <Menu iconShape="circle" style={{fontSize:'16px',fontWeight:'500'}}>
          <MenuItem icon={<DashboardOutlinedIcon />}component={<Link to="/"/>} >Dashboard</MenuItem>
            
  
  <SubMenu label="Onboarding" icon={<PeopleOutlinedIcon />}>
              <MenuItem component={<Link to="OnboardingCustomer"/>}>Customers</MenuItem>
              <MenuItem component={<Link to="OnboardingVendor"/>}>Vendors</MenuItem>
              
            </SubMenu>

            {/* <MenuItem icon={<PeopleOutlinedIcon />}>User Section</MenuItem> */}

            {/* <SubMenu label="User Section" icon={<PeopleOutlinedIcon />}>
              <MenuItem>User List</MenuItem>
              <MenuItem>Create User</MenuItem>
              <MenuItem>Roles</MenuItem>
              <MenuItem>Permissions</MenuItem>
            </SubMenu> */}

            <SubMenu label="Booking Section" icon={<BookOnline />} >
              <MenuItem component={<Link to="bookings"/>}>All Orders</MenuItem>
              <MenuItem>Pending</MenuItem>
              <MenuItem>Completed</MenuItem>
              <MenuItem>Refunds</MenuItem>
            </SubMenu>
            <SubMenu label="Masters Section" icon={<LibraryBooks/>}>
            <MenuItem>Sales</MenuItem>
              <MenuItem>Users</MenuItem>
              <MenuItem>Inventory</MenuItem>
              <MenuItem>Revenue</MenuItem>
            </SubMenu>

            <SubMenu label="Reciept Management" icon={<Receipt />}>
              
              <MenuItem>All Orders</MenuItem>
              <MenuItem>Pending</MenuItem>
              <MenuItem>Completed</MenuItem>
              <MenuItem>Refunds</MenuItem>
            </SubMenu>

            <MenuItem icon={<PaymentOutlined/>} >Purchase Management</MenuItem>
            <MenuItem icon={<HelpOutlineOutlinedIcon />} component={<Link to="paymentadvisory"/>}>Help</MenuItem>
            <MenuItem icon={<LogoutOutlinedIcon />} component={<Link to="paymentreconcilation"/>}>Logout</MenuItem>
          </Menu>
        </Sidebar>
      </Box>
   
  );
};

export default SideNav;
