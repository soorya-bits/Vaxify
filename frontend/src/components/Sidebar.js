import { Drawer, List, ListItem, ListItemIcon, ListItemText, Box, Typography } from '@mui/material';
import PeopleIcon from '@mui/icons-material/People';
import DashboardIcon from '@mui/icons-material/Dashboard';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import SchoolIcon from '@mui/icons-material/School';
import { useNavigate } from 'react-router-dom';

const drawerWidth = 240;

export default function Sidebar() {
  const navigate = useNavigate();

  const menuItems = [
    { text: 'Dashboard', icon: <DashboardIcon />, route: '/dashboard' },
    { text: 'Users', icon: <PeopleIcon />, route: '/users' },
    { text: 'Vaccines', icon: <VaccinesIcon />, route: '/vaccines' },
    { text: 'Students', icon: <SchoolIcon />, route: '/students' },
  ];

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
      }}
    >
      <Box sx={{ textAlign: 'center', p: 2, borderBottom: '1px solid #ddd' }}>
        <Typography
          variant="h5"
          sx={{
            fontFamily: '"Pacifico", cursive', // decorative Google Font
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
        {menuItems.map((item) => (
          <ListItem sx={{cursor: 'pointer'}} button key={item.route} onClick={() => navigate(item.route)}>
            <ListItemIcon>{item.icon}</ListItemIcon>
            <ListItemText primary={item.text} />
          </ListItem>
        ))}
      </List>
    </Drawer>
  );
}
