import React, { useEffect, useState } from 'react';
import {
  Grid,
  Paper,
  Typography,
  CircularProgress,
  Box,
  Avatar,
} from '@mui/material';
import {
  School,
  CheckCircle,
  Event,
  ErrorOutline,
  BarChart,
  LocalHospital
} from '@mui/icons-material';
import CountUp from 'react-countup';
import { PieChart, Pie, Cell, Tooltip, ResponsiveContainer } from 'recharts';
import api from '../services/api';

const COLORS = ['#4caf50', '#f44336'];

const StatCard = ({ title, value, icon, color }) => (
  <Paper elevation={3} sx={{ p: 3 }}>
    <Box display="flex" alignItems="center">
      <Avatar sx={{ bgcolor: color, mr: 2 }}>{icon}</Avatar>
      <Box>
        <Typography variant="subtitle2" color="textSecondary">
          {title}
        </Typography>
        <Typography variant="h5">
          <CountUp end={value} duration={1.5} />
        </Typography>
      </Box>
    </Box>
  </Paper>
);

export default function Dashboard() {
  const [metrics, setMetrics] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/dashboard/')
      .then((res) => setMetrics(res.data))
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, []);

  if (loading) {
    return <Box display="flex" justifyContent="center" mt={6}><CircularProgress /></Box>;
  }

  if (!metrics) {
    return <Typography variant="h6" color="error" align="center" mt={4}>Failed to load dashboard metrics.</Typography>;
  }

  const pieData = [
    { name: 'Vaccinated', value: metrics.vaccinated },
    { name: 'Not Vaccinated', value: metrics.missing_vaccinations }
  ];

  return (
    <Box p={4}>
      <Grid container spacing={3}>
        <Grid item xs={12} md={2}>
          <StatCard title="Total Students" value={metrics.total_students} icon={<School />} color="#3f51b5" />
        </Grid>
        <Grid item xs={12} md={2}>
          <StatCard title="Vaccinated Students" value={metrics.vaccinated} icon={<CheckCircle />} color="#4caf50" />
        </Grid>
        <Grid item xs={12} md={2}>
          <StatCard title="Missing Vaccinations" value={metrics.missing_vaccinations} icon={<ErrorOutline />} color="#f44336" />
        </Grid>
        <Grid item xs={12} md={2}>
          <StatCard title="Recent Vaccinations" value={metrics.recent_vaccinated} icon={<BarChart />} color="#00bcd4" />
        </Grid>
        <Grid item xs={12} md={2}>
          <StatCard title="Total Drives" value={metrics.total_drives} icon={<Event />} color="#ff9800" />
        </Grid>
        <Grid item xs={12} md={3}>
          <StatCard title="Total Vaccines Administered" value={metrics.total_vaccines} icon={<LocalHospital />} color="#673ab7" />
        </Grid>

        {metrics.most_used_vaccine && (
          <Grid item xs={12}>
            <Paper elevation={3} sx={{ p: 3 }}>
              <Typography variant="subtitle1" gutterBottom>
                Most Used Vaccine
              </Typography>
              <Typography variant="body1">
                {metrics.most_used_vaccine.name} ({metrics.most_used_vaccine.count} doses)
              </Typography>
            </Paper>
          </Grid>
        )}

      </Grid>

      <Grid container spacing={3} mt={3}>
        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Vaccination Coverage
            </Typography>
            <ResponsiveContainer width="100%" height={200}>
              <PieChart>
                <Pie dataKey="value" data={pieData} cx="50%" cy="50%" outerRadius={60} label>
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        <Grid item xs={12} md={6}>
          <Paper elevation={3} sx={{ p: 3 }}>
            <Typography variant="subtitle1" gutterBottom>
              Upcoming Vaccination Drives (next 30 days)
            </Typography>
            {metrics.upcoming_drives.length === 0 ? (
              <Typography variant="body2" color="textSecondary">No upcoming drives.</Typography>
            ) : (
              <ul style={{ paddingLeft: 16 }}>
                {metrics.upcoming_drives.map((drive) => (
                  <li key={drive.id}>
                    {drive.vaccine_name} – {new Date(drive.date).toLocaleDateString()}
                  </li>
                ))}
              </ul>
            )}
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}
