import { toast } from 'react-toastify';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Menu,
  MenuItem
} from '@mui/material';
import { useLocation } from 'react-router-dom';
import AccountCircle from '@mui/icons-material/AccountCircle';
import { useEffect, useState } from 'react';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { logout, get_user } from '../utils/auth';

export default function DashboardLayout({ children }) {
  const [anchorEl, setAnchorEl] = useState(null);
  const [user, setUser] = useState(null);
  const location = useLocation();

  const getPageTitle = (path) => {
    const title = path.split('/')[1]; // Split the path and take the second segment
    return title.charAt(0).toUpperCase() + title.slice(1); // Capitalize the first letter
  };

  useEffect(() => {
    const userData = get_user();
    if (userData) {
      setUser(userData);
    }
  }, []);

  const handleLogout = () => {
    logout();
    toast.success('Come back soon!');
    window.location.href = '/login';
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh' }}>
      <Sidebar />
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          display: 'flex',
          flexDirection: 'column',
          height: '100vh',
          overflow: 'hidden'
        }}
      >
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
              {getPageTitle(location.pathname)}
            </Typography>
            <IconButton color="inherit" onClick={(e) => setAnchorEl(e.currentTarget)}>
              <AccountCircle sx={{ marginRight: 1 }} />
              <Typography variant="body1">
                {user?.full_name || user?.username || 'User'}
              </Typography>
            </IconButton>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={() => setAnchorEl(null)}
            >
              <MenuItem
                onClick={() => {
                  setAnchorEl(null);
                  handleLogout();
                }}
              >
                Logout
              </MenuItem>
            </Menu>
          </Toolbar>
        </AppBar>
        <Box sx={{ p: 3 }}>{children}</Box>
        <Footer />
      </Box>
    </Box>
  );
}
