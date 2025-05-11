import {
  Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography
} from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import SchoolIcon from '@mui/icons-material/School';
import MasksIcon from '@mui/icons-material/Masks';
import { useNavigate, useLocation } from 'react-router-dom';

const drawerWidth = 240;

export default function Sidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, route: '/dashboard' },
    { text: 'Users', icon: <PeopleIcon />, route: '/users' },
    { text: 'Students', icon: <SchoolIcon />, route: '/students' },
    { text: 'Vaccines', icon: <VaccinesIcon />, route: '/vaccines' },
    { text: 'Vaccination Drives', icon: <MasksIcon />, route: '/vaccination-drives' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          width: drawerWidth,
          boxSizing: 'border-box',
        },
      }}
    >
      <Box sx={{ textAlign: 'center', p: 2, borderBottom: '1px solid #ddd' }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Pacifico", cursive',
            fontWeight: 'bold',
            color: 'primary.main',
          }}
        >
          Vaxify
        </Typography>
        <Typography variant="caption" sx={{ fontStyle: 'italic', color: 'text.secondary' }}>
          S.M.H.S
        </Typography>
      </Box>

      <List>
        {menuItems.map((item) => {
          const isActive = location.pathname.startsWith(item.route);
          return (
            <ListItem
              key={item.route}
              button
              onClick={() => navigate(item.route)}
              sx={{
                cursor: 'pointer',
                backgroundColor: isActive ? 'rgba(0, 123, 255, 0.1)' : 'transparent',
                '&:hover': {
                  backgroundColor: isActive ? 'rgba(0, 123, 255, 0.15)' : 'rgba(0,0,0,0.04)',
                },
              }}
            >
              <ListItemIcon sx={{ color: isActive ? 'primary.main' : 'inherit' }}>
                {item.icon}
              </ListItemIcon>
              <ListItemText
                primary={item.text}
                primaryTypographyProps={{ color: isActive ? 'primary.main' : 'text.primary' }}
              />
            </ListItem>
          );
        })}
      </List>
    </Drawer>
  );
}
