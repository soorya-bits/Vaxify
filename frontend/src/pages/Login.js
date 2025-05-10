import { Box, Button, Card, CardContent, TextField, Typography } from '@mui/material';
import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { login } from '../utils/auth';
import config from '../config';
import { toast } from "react-toastify";

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent form refresh
    try {
      const res = await axios.post(`${config.apiUrl}/auth/login`, new URLSearchParams({
        username,
        password
      }), {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
      });
      login(res.data.access_token, res.data.user);
      toast.success("Welcome!");
      navigate('/dashboard');
    } catch (err) {
      toast.error("Invalid credentials");
    }
  };

  return (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh" bgcolor="#f5f5f5">
      <Card sx={{ minWidth: 320, padding: 3, px: 4 }}>
        <CardContent>
          <Box textAlign="center" mb={3}>
            <Typography variant="h4" sx={{ fontFamily: '"Pacifico", cursive', color: 'primary.main', fontWeight: 'bold', paddingBottom: '10px' }}>
              Vaxify
            </Typography>
            <Typography variant="subtitle2" color="text.secondary">
              St. Mary’s High School
            </Typography>
          </Box>

          <form onSubmit={handleLogin}>
            <Typography sx={{ textAlign: 'center', fontWeight: 'bold' }} variant="h6" mb={2}>Login</Typography>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <Button fullWidth variant="contained" sx={{ mt: 2 }} type="submit">
              Login
            </Button>
          </form>
        </CardContent>
      </Card>
    </Box>
  );
}
