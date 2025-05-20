import { Box, IconButton, InputBase, Paper, List, ListItemButton, Menu, MenuItem, Typography } from "@mui/material";
import { DarkModeOutlined, LightModeOutlined, MenuOutlined, NotificationsOutlined, PersonOutlined, SearchOutlined, SettingsOutlined } from "@mui/icons-material";

const NavTop = () => {
  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="space-between"
      borderRadius="12px"
      position={{top:'4px'}}
      py={1}
      px={4}
      sx={{ backgroundColor: "#005899", ml: 4, mr: 4, mt: 1 }}
    >
      {/* Left Section */}
      <Box display="flex" alignItems="center" gap={2}>
       

        <Box
          position="relative"
          display="flex"
          alignItems="center"
          borderRadius="8px"
          backgroundColor="white"
          sx={{ width: 300 }}
        >
          <InputBase placeholder="Search & Navigate" sx={{ ml: 2, flex: 1, color: "black" }} />
          <IconButton type="button" sx={{ p: 1, color: "black" }}>
            <SearchOutlined />
          </IconButton>

          <Paper
            elevation={3}
            sx={{
              position: "absolute",
              top: "100%",
              left: 0,
              right: 0,
              zIndex: 10,
              backgroundColor: "white",
              maxHeight: 200,
              overflowY: "auto",
              color: "black",
              display: "none", // Hide dropdown for now
            }}
          >
            <List dense>
              <ListItemButton>Dashboard</ListItemButton>
              <ListItemButton>Invoice</ListItemButton>
            </List>
          </Paper>
        </Box>
      </Box>

      {/* Right Section */}
      <Box >
        <IconButton  sx={{
    '&:hover': {
      backgroundColor: '#004577', // to avoid ripple background if needed
      
    },
  }}>
          <LightModeOutlined sx={{color:'white'}}/>
        </IconButton>
        <IconButton sx={{
    '&:hover': {
      backgroundColor: '#004577', // to avoid ripple background if needed
      
    },
  }}>
          <NotificationsOutlined sx={{color:'white'}}/>
        </IconButton>
        <Menu open={false}>
          <MenuItem>
            <Typography variant="subtitle1">Notifications</Typography>
          </MenuItem>
        </Menu>
        <IconButton sx={{
    '&:hover': {
      backgroundColor: '#004577', // to avoid ripple background if needed
      
    },
  }}>
          <SettingsOutlined sx={{color:'white'}}/>
        </IconButton>
        <Menu open={false}>
          <MenuItem>System Setup files</MenuItem>
        </Menu>
        <IconButton  sx={{
    '&:hover': {
      backgroundColor: '#004577', // to avoid ripple background if needed
      
    },
  }}>
          <PersonOutlined sx={{color:'white'}}/>
        </IconButton>
        <Menu open={false}>
          <MenuItem >Change Password</MenuItem>
          <MenuItem>Logout</MenuItem>
        </Menu>
      </Box>
    </Box>
  );
};

export default NavTop;
