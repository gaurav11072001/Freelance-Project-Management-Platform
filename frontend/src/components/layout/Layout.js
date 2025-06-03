import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link as RouterLink } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Container,
  useTheme,
  useMediaQuery,
  Avatar,
  Divider,
  Chip,
  Tooltip,
  Badge,
} from '@mui/material';
import {
  Menu as MenuIcon,
  Dashboard as DashboardIcon,
  Work as WorkIcon,
  Chat as ChatIcon,
  Person as PersonIcon,
  ExitToApp as LogoutIcon,
  Search as SearchIcon,
  Notifications as NotificationsIcon,
  Add as AddIcon,
  ArrowForward as ArrowForwardIcon,
} from '@mui/icons-material';
import { logout } from '../../features/auth/authSlice';

const Layout = ({ children }) => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const { isAuthenticated, user } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  // Define menu items based on user role
  const getMenuItems = () => {
    const baseItems = [
      { text: 'Dashboard', icon: <DashboardIcon />, path: '/projects' },
      { text: 'Messages', icon: <ChatIcon />, path: '/chat' },
      { text: 'Profile', icon: <PersonIcon />, path: '/profile' },
    ];
    
    // Only show Create Project to clients
    if (user?.role === 'client') {
      return [
        baseItems[0],
        { text: 'Create Project', icon: <AddIcon />, path: '/projects/create', highlight: true },
        ...baseItems.slice(1)
      ];
    }
    
    return baseItems;
  };
  
  const menuItems = getMenuItems();

  const drawer = (
    <Box sx={{ bgcolor: 'background.default', height: '100%', py: 4 }}>
      <Box sx={{ px: 3, display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 6 }}>
        <Typography 
          variant="h5" 
          component={RouterLink} 
          to="/" 
          sx={{ 
            color: 'primary.main', 
            textDecoration: 'none',
            fontWeight: 500,
            letterSpacing: '0px',
            fontSize: '1.5rem'
          }}
        >
          freelance
        </Typography>
      </Box>
      <List sx={{ px: 2 }}>
        {menuItems.map((item) => (
          <ListItem
            button
            key={item.text}
            component={RouterLink}
            to={item.path}
            onClick={() => isMobile && handleDrawerToggle()}
            sx={{
              borderRadius: theme.shape.borderRadius,
              mb: 1.5,
              py: 1.5,
              '&:hover': {
                bgcolor: item.highlight ? 'rgba(56, 64, 222, 0.08)' : 'rgba(0, 0, 0, 0.04)',
              },
              '&.Mui-selected': {
                bgcolor: 'rgba(56, 64, 222, 0.08)',
              }
            }}
          >
            <ListItemIcon 
              sx={{ 
                color: item.highlight ? 'primary.main' : 'text.secondary', 
                minWidth: 40 
              }}
            >
              {item.icon}
            </ListItemIcon>
            <ListItemText 
              primary={item.text} 
              primaryTypographyProps={{
                fontSize: '0.95rem',
                fontWeight: item.highlight ? 600 : 500,
                color: item.highlight ? 'primary.main' : 'text.primary'
              }}
            />
            {item.highlight && <ArrowForwardIcon color="primary" fontSize="small" sx={{ ml: 1 }} />}
          </ListItem>
        ))}
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {isAuthenticated && (
        <>
          <AppBar 
            position="fixed" 
            elevation={0}
            sx={{ 
              zIndex: theme.zIndex.drawer + 1, 
              boxShadow: 'none',
              borderBottom: '1px solid #F0F0F0',
              height: 70
            }}
          >
            <Toolbar sx={{ height: '100%' }}>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
              {isMobile && (
                <Typography 
                  variant="h6" 
                  component={RouterLink} 
                  to="/" 
                  sx={{ 
                    flexGrow: 1, 
                    textDecoration: 'none',
                    color: 'primary.main',
                    fontWeight: 500,
                    fontSize: '1.25rem'
                  }}
                >
                  freelance
                </Typography>
              )}
              
              {isAuthenticated ? (
                <Box sx={{ display: 'flex', alignItems: 'center', ml: 'auto' }}>
                  <Tooltip title="Search">
                    <IconButton 
                      color="secondary" 
                      sx={{ 
                        mx: 1,
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } 
                      }}
                    >
                      <SearchIcon />
                    </IconButton>
                  </Tooltip>
                  
                  <Tooltip title="Notifications">
                    <IconButton 
                      color="secondary" 
                      sx={{ 
                        mx: 1, 
                        '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } 
                      }}
                    >
                      <Badge badgeContent={3} color="primary">
                        <NotificationsIcon />
                      </Badge>
                    </IconButton>
                  </Tooltip>
                  
                  <Box 
                    sx={{ 
                      display: 'flex', 
                      alignItems: 'center', 
                      ml: 2,
                      borderLeft: '1px solid #F0F0F0',
                      pl: 2
                    }}
                  >
                    <Tooltip title={user?.username || 'User Profile'}>
                      <Avatar 
                        sx={{ 
                          width: 38, 
                          height: 38, 
                          bgcolor: 'primary.main',
                          fontSize: '1rem',
                          fontWeight: 500,
                          boxShadow: '0 2px 8px rgba(56, 64, 222, 0.25)'
                        }}
                      >
                        {user?.username?.charAt(0).toUpperCase()}
                      </Avatar>
                    </Tooltip>
                    
                    {!isMobile && (
                      <Box sx={{ ml: 1.5, display: 'flex', flexDirection: 'column' }}>
                        <Typography 
                          variant="subtitle2" 
                          sx={{ 
                            fontWeight: 600,
                            lineHeight: 1.2 
                          }}
                        >
                          {user?.username}
                        </Typography>
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: 'text.secondary',
                            lineHeight: 1.2 
                          }}
                        >
                          {user?.role === 'client' ? 'Client' : 'Freelancer'}
                        </Typography>
                      </Box>
                    )}
                    
                    <Tooltip title="Logout">
                      <IconButton 
                        color="secondary" 
                        onClick={handleLogout}
                        sx={{ 
                          ml: 1,
                          '&:hover': { bgcolor: 'rgba(0,0,0,0.04)' } 
                        }}
                      >
                        <LogoutIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </Box>
                </Box>
              ) : (
                <Box sx={{ ml: 'auto', display: 'flex', gap: 2 }}>
                  <Button
                    variant="outlined"
                    color="primary"
                    component={RouterLink}
                    to="/login"
                    sx={{ borderRadius: 100 }}
                  >
                    Sign In
                  </Button>
                  <Button
                    variant="wetransfer"
                    component={RouterLink}
                    to="/register"
                  >
                    Sign Up
                  </Button>
                </Box>
              )}
            </Toolbar>
          </AppBar>
          <Box
            component="nav"
            sx={{ width: { md: 280 }, flexShrink: { md: 0 } }}
          >
            {isMobile ? (
              <Drawer
                variant="temporary"
                anchor="left"
                open={mobileOpen}
                onClose={handleDrawerToggle}
                ModalProps={{
                  keepMounted: true, // Better open performance on mobile
                }}
                sx={{
                  display: { xs: 'block', md: 'none' },
                  '& .MuiDrawer-paper': { 
                    boxSizing: 'border-box', 
                    width: 280,
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.05)'
                  },
                }}
              >
                {drawer}
              </Drawer>
            ) : (
              <Drawer
                variant="permanent"
                sx={{
                  display: { xs: 'none', md: 'block' },
                  '& .MuiDrawer-paper': { 
                    boxSizing: 'border-box', 
                    width: 280,
                    border: 'none',
                    boxShadow: '0 0 20px rgba(0, 0, 0, 0.05)'
                  },
                }}
                open
              >
                {drawer}
              </Drawer>
            )}
          </Box>
        </>
      )}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 0,
          width: { md: `calc(100% - ${isAuthenticated ? 280 : 0}px)` },
          mt: isAuthenticated ? '70px' : 0,
          bgcolor: '#FAFAFA',
          minHeight: '100vh',
          overflowX: 'hidden'
        }}
      >
        <Box 
          sx={{
            py: 5,
            px: 4,
            maxWidth: '1400px',
            mx: 'auto',
            width: '100%'
          }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  );
};

export default Layout;
