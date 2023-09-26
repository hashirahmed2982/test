import * as React from 'react';
import AppBar from '@mui/material/AppBar';

import Toolbar from '@mui/material/Toolbar';
import IconButton from '@mui/material/IconButton';

import Menu from '@mui/material/Menu';
import MenuIcon from '@mui/icons-material/Menu';
import Container from '@mui/material/Container';
import Avatar from '@mui/material/Avatar';
import Button from '@mui/material/Button';
import Tooltip from '@mui/material/Tooltip';
import Account from '../pages/account/account';
import AdbIcon from '@mui/icons-material/Adb';
import { header } from '../theme/colors';
import {useLogout} from '../components/hooks/useLogout'
import { useAuthContext } from "../components/hooks/useAuthContext";
import {useNavigate} from 'react-router-dom';
import { Box, Divider, MenuItem, MenuList, Popover, Typography } from '@mui/material';
import { width } from '@mui/system';
const pages = [];
const settings = ['Logout'];



function ResponsiveAppBar({userdata}) {
  const { logout } = useLogout()
  const [anchorElNav, setAnchorElNav] = React.useState(null);
  const [anchorElUser, setAnchorElUser] = React.useState(null);
  const navigate = useNavigate();

  const handleOpenNavMenu = (event) => {
    setAnchorElNav(event.currentTarget);
  };
  const handleOpenUserMenu = (event) => {
    setAnchorElUser(event.currentTarget);
  };

  const handleCloseNavMenu = () => {
    setAnchorElNav(null);
  };

  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  console.log(userdata)



  return (
    <AppBar position="sticky" sx={{ backgroundColor: header.background }}>
      <Container maxWidth="xl">
        <Toolbar disableGutters>
          
          

          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="inherit"
            >
              <MenuIcon />
            </IconButton>
            <Menu
              id="menu-appbar"
              anchorEl={anchorElNav}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'left',
              }}
              keepMounted
              transformOrigin={{
                vertical: 'top',
                horizontal: 'left',
              }}
              open={Boolean(anchorElNav)}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: 'block', md: 'none' },
              }}
            >
              <MenuItem key={"home"} onClick={() => navigate('/home')}>
                  <Typography textAlign="center">Home</Typography>
                </MenuItem>
              {userdata['role']==='admin'?  <MenuItem key={"settings"} onClick={() => navigate('/settings')}>
                  <Typography textAlign="center">Settings</Typography>
                </MenuItem>:<div></div>}
                
              
            </Menu>
          </Box>
          
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
          <Button
                key={"home"}
                onClick={() => navigate('/home')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                Home
              </Button>
          {userdata['role']==='admin'?  
          <><Button
                key={"settings"}
                onClick={() => navigate('/settings')}
                sx={{ my: 2, color: 'white', display: 'block' }}
              >
                  Settings
                </Button></>:<div></div>
        }
          
            
          </Box>
         
          <Box sx={{
          py: 1.5,
          px: 2
        }}>
            <Tooltip title="Open settings">
              <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                <Avatar alt={userdata['name']}  src="/static/images/avatar/2.jpg" />
              </IconButton>
            </Tooltip>
            <Menu
              sx={{ mt: '40px'  }}
              id="menu-appbar"
              anchorEl={anchorElUser}
              anchorOrigin={{
                vertical: 'left',
                horizontal: 'bottom',
              }}
              PaperProps={{ sx: { width: 200 } }}
              keepMounted
              
              open={Boolean(anchorElUser)}
              onClose={handleCloseUserMenu}
              
            >
               <Box
        sx={{
          py: 1.5,
          px: 2
        }}
      >
        <Typography variant="overline">
          Account
        </Typography>
        <Typography
          color="text.secondary"
          variant="body2"
        >
          {userdata['name']}
        </Typography>
      </Box>
      <Divider />
      <MenuList
        disablePadding
        dense
        sx={{
          p: '8px',
          '& > *': {
            borderRadius: 1
          }
        }}
      >
        <MenuItem  onClick={() => navigate('/account')
                }>
          My Profile
        </MenuItem>
        <MenuItem  onClick={() => logout()
                }>
          Sign out
        </MenuItem>
      </MenuList>
            </Menu>
          </Box>
        </Toolbar>
      </Container>
    </AppBar>
  );
}
export default ResponsiveAppBar;