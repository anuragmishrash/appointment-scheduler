import React, { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';
import {
  AppBar,
  Box,
  Toolbar,
  IconButton,
  Typography,
  Menu,
  Container,
  Avatar,
  Button,
  Tooltip,
  MenuItem,
  Divider,
  useMediaQuery
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import EventIcon from '@mui/icons-material/Event';
import BusinessIcon from '@mui/icons-material/Business';
import DashboardIcon from '@mui/icons-material/Dashboard';
import ThemeToggle from '../common/ThemeToggle';
import { showToast } from '../common/CustomToast';

// Logo animation variants
const logoVariants = {
  hidden: { opacity: 0, x: -20 },
  visible: { 
    opacity: 1, 
    x: 0,
    transition: { 
      type: "spring", 
      stiffness: 300, 
      damping: 20 
    } 
  }
};

// Button animation variant
const buttonVariant = {
  initial: { scale: 1 },
  hover: { 
    scale: 1.05,
    transition: { 
      type: "spring", 
      stiffness: 400, 
      damping: 10 
    } 
  },
  tap: { scale: 0.97 }
};

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

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

  const handleLogout = () => {
    logout();
    showToast.success('Logged out successfully');
    navigate('/login');
    handleCloseUserMenu();
  };

  // Get initials from user name for avatar
  const getInitials = (name) => {
    if (!name) return '?';
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };

  return (
    <AppBar 
      position="sticky" 
      elevation={0}
      sx={{ 
        backdropFilter: 'blur(10px)',
        background: theme.palette.mode === 'dark' 
          ? 'linear-gradient(90deg, rgba(32,32,36,0.9) 0%, rgba(45,55,72,0.9) 100%)' 
          : 'linear-gradient(90deg, rgba(255,255,255,0.9) 0%, rgba(240,249,255,0.9) 100%)',
        borderBottom: `1px solid ${theme.palette.mode === 'dark' ? 'rgba(255,255,255,0.1)' : 'rgba(0,0,0,0.05)'}`,
        transition: 'all 0.3s ease-in-out',
      }}
    >
      <Container maxWidth="xl">
        <Toolbar disableGutters sx={{ height: 70 }}>
          {/* Logo for desktop */}
          <motion.div
            variants={logoVariants}
            initial="hidden"
            animate="visible"
          >
            <EventIcon 
              sx={{ 
                display: { xs: 'none', md: 'flex' }, 
                mr: 1,
                color: theme.palette.primary.main,
                fontSize: 34
              }} 
            />
          </motion.div>
          <Typography
            variant="h5"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'none', md: 'flex' },
              fontFamily: '"Inter", sans-serif',
              fontWeight: 700,
              letterSpacing: '.1rem',
              color: theme.palette.mode === 'dark' ? 'white' : 'text.primary',
              textDecoration: 'none',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SCHEDULER
          </Typography>

          {/* Mobile menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'flex', md: 'none' } }}>
            <IconButton
              size="large"
              aria-label="account of current user"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="primary"
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
              PaperProps={{
                elevation: 3,
                sx: {
                  borderRadius: '12px',
                  overflow: 'visible',
                  mt: 1.5,
                  backdropFilter: 'blur(10px)',
                  background: theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
                  '&:before': {
                    content: '""',
                    display: 'block',
                    position: 'absolute',
                    top: -10,
                    left: 20,
                    width: 20,
                    height: 20,
                    background: theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
                    transform: 'translateY(0) rotate(45deg)',
                    zIndex: 0,
                  },
                  '& .MuiList-root': {
                    padding: 1,
                  },
                  '& .MuiMenuItem-root': {
                    borderRadius: '8px',
                    margin: '2px 8px',
                    padding: '8px 16px',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255,255,255,0.05)' 
                        : 'rgba(0,0,0,0.03)'
                    },
                  },
                },
              }}
            >
              {user && (
                <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/dashboard">
                  <Typography textAlign="center">Dashboard</Typography>
                </MenuItem>
              )}
              {user && user.role === 'business' && (
                <>
                  <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/business/dashboard">
                    <Typography textAlign="center">Business Dashboard</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/business/booking-dashboard">
                    <Typography textAlign="center">My Bookings</Typography>
                  </MenuItem>
                </>
              )}
              {!user && (
                <>
                  <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/login">
                    <Typography textAlign="center">Login</Typography>
                  </MenuItem>
                  <MenuItem onClick={handleCloseNavMenu} component={RouterLink} to="/register">
                    <Typography textAlign="center">Register</Typography>
                  </MenuItem>
                </>
              )}
            </Menu>
          </Box>
          
          {/* Logo for mobile */}
          <motion.div
            variants={logoVariants}
            initial="hidden"
            animate="visible"
          >
            <EventIcon 
              sx={{ 
                display: { xs: 'flex', md: 'none' }, 
                mr: 1,
                color: theme.palette.primary.main,
                fontSize: 28
              }} 
            />
          </motion.div>
          <Typography
            variant="h6"
            noWrap
            component={RouterLink}
            to="/"
            sx={{
              mr: 2,
              display: { xs: 'flex', md: 'none' },
              flexGrow: 1,
              fontFamily: '"Inter", sans-serif',
              fontWeight: 700,
              fontSize: '1.2rem',
              letterSpacing: '.1rem',
              color: theme.palette.mode === 'dark' ? 'white' : 'text.primary',
              textDecoration: 'none',
              background: `linear-gradient(90deg, ${theme.palette.primary.main}, ${theme.palette.primary.light})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            SCHEDULER
          </Typography>
          
          {/* Desktop menu */}
          <Box sx={{ flexGrow: 1, display: { xs: 'none', md: 'flex' } }}>
            {user && (
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariant}
              >
                <Button
                  startIcon={<DashboardIcon />}
                  component={RouterLink}
                  to="/dashboard"
                  sx={{ 
                    my: 2,
                    color: theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                    display: 'flex', 
                    mx: 1,
                    borderRadius: '8px',
                    padding: '8px 16px',
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'dark' 
                        ? 'rgba(255,255,255,0.05)' 
                        : 'rgba(0,0,0,0.03)'
                    },
                  }}
                >
                  Dashboard
                </Button>
              </motion.div>
            )}
            {user && user.role === 'business' && (
              <>
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariant}
                >
                  <Button
                    startIcon={<BusinessIcon />}
                    component={RouterLink}
                    to="/business/dashboard"
                    sx={{ 
                      my: 2,
                      color: theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                      display: 'flex',
                      mx: 1,
                      borderRadius: '8px',
                      padding: '8px 16px',
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(255,255,255,0.05)' 
                          : 'rgba(0,0,0,0.03)'
                      },
                    }}
                  >
                    Business Dashboard
                  </Button>
                </motion.div>
                <motion.div
                  whileHover="hover"
                  whileTap="tap"
                  variants={buttonVariant}
                >
                  <Button
                    component={RouterLink}
                    to="/business/booking-dashboard"
                    sx={{ 
                      my: 2,
                      color: theme.palette.mode === 'dark' ? 'white' : 'text.primary',
                      display: 'flex',
                      mx: 1,
                      borderRadius: '8px',
                      padding: '8px 16px',
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(255,255,255,0.05)' 
                          : 'rgba(0,0,0,0.03)'
                      },
                    }}
                  >
                    My Bookings
                  </Button>
                </motion.div>
              </>
            )}
          </Box>

          {/* Theme toggle button */}
          <Box sx={{ mr: 2 }}>
            <ThemeToggle />
          </Box>

          {/* User menu or login/register buttons */}
          {user ? (
            <Box sx={{ flexGrow: 0 }}>
              <Tooltip title="Account settings">
                <IconButton onClick={handleOpenUserMenu} sx={{ p: 0 }}>
                  <Avatar 
                    alt={user.name} 
                    src="/static/images/avatar/2.jpg"
                    sx={{ 
                      background: `linear-gradient(45deg, ${theme.palette.primary.main}, ${theme.palette.secondary.main})`,
                      border: `2px solid ${theme.palette.background.paper}`,
                      boxShadow: theme.shadows[2],
                      transition: 'all 0.3s ease',
                    }}
                  >
                    {getInitials(user.name)}
                  </Avatar>
                </IconButton>
              </Tooltip>
              <Menu
                sx={{ mt: '45px' }}
                id="menu-appbar"
                anchorEl={anchorElUser}
                anchorOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                keepMounted
                transformOrigin={{
                  vertical: 'top',
                  horizontal: 'right',
                }}
                open={Boolean(anchorElUser)}
                onClose={handleCloseUserMenu}
                PaperProps={{
                  elevation: 3,
                  sx: {
                    borderRadius: '12px',
                    overflow: 'visible',
                    mt: 1.5,
                    backdropFilter: 'blur(10px)',
                    background: theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
                    '&:before': {
                      content: '""',
                      display: 'block',
                      position: 'absolute',
                      top: -10,
                      right: 14,
                      width: 20,
                      height: 20,
                      background: theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.9)' : 'rgba(255,255,255,0.95)',
                      transform: 'translateY(0) rotate(45deg)',
                      zIndex: 0,
                    },
                    '& .MuiList-root': {
                      padding: 1,
                    },
                    '& .MuiMenuItem-root': {
                      borderRadius: '8px',
                      margin: '2px 8px',
                      padding: '8px 16px',
                      '&:hover': {
                        backgroundColor: theme.palette.mode === 'dark' 
                          ? 'rgba(255,255,255,0.05)' 
                          : 'rgba(0,0,0,0.03)'
                      },
                    },
                  },
                }}
              >
                <Box sx={{ px: 3, py: 1.5 }}>
                  <Typography 
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 0.5 }}
                  >
                    Logged in as
                  </Typography>
                  <Typography 
                    variant="body1" 
                    fontWeight="medium"
                    sx={{ mb: 0 }}
                  >
                    {user.name}
                  </Typography>
                  <Typography 
                    variant="body2" 
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {user.email}
                  </Typography>
                </Box>
                <Divider />
                <MenuItem onClick={handleCloseUserMenu} component={RouterLink} to="/profile">
                  <Typography textAlign="center">Profile</Typography>
                </MenuItem>
                <MenuItem onClick={handleCloseUserMenu} component={RouterLink} to="/dashboard">
                  <Typography textAlign="center">Dashboard</Typography>
                </MenuItem>
                {user.role === 'business' && (
                  <>
                    <Divider />
                    <MenuItem onClick={handleCloseUserMenu} component={RouterLink} to="/business/dashboard">
                      <Typography textAlign="center">Business Dashboard</Typography>
                    </MenuItem>
                    <MenuItem onClick={handleCloseUserMenu} component={RouterLink} to="/business/booking-dashboard">
                      <Typography textAlign="center">My Bookings</Typography>
                    </MenuItem>
                  </>
                )}
                <Divider />
                <MenuItem onClick={handleLogout}>
                  <Typography textAlign="center">Logout</Typography>
                </MenuItem>
              </Menu>
            </Box>
          ) : (
            <Box sx={{ display: 'flex', gap: 1 }}>
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariant}
                style={{ display: isMobile ? 'none' : 'block' }}
              >
                <Button
                  component={RouterLink}
                  to="/login"
                  variant="outlined"
                  sx={{ 
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    borderWidth: '2px',
                    '&:hover': {
                      borderWidth: '2px',
                    }
                  }}
                >
                  Login
                </Button>
              </motion.div>
              <motion.div
                whileHover="hover"
                whileTap="tap"
                variants={buttonVariant}
                style={{ display: isMobile ? 'none' : 'block' }}
              >
                <Button
                  component={RouterLink}
                  to="/register"
                  variant="contained"
                  sx={{ 
                    borderRadius: '8px',
                    textTransform: 'none',
                    fontWeight: 600,
                    boxShadow: theme.shadows[1],
                  }}
                >
                  Register
                </Button>
              </motion.div>
            </Box>
          )}
        </Toolbar>
      </Container>
    </AppBar>
  );
};

export default Navbar; 