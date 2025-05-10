import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Paper, Select, MenuItem, InputLabel,
  FormControl, TableSortLabel, TablePagination
} from '@mui/material';
import { Edit, Delete, FileDownload } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import Papa from 'papaparse';
import ConfirmDialog from '../utils/ConfirmDialog';

const initialForm = { username: '', full_name: '', email: '', role: 'Staff' };

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editUserId, setEditUserId] = useState(null);
  const [deleteUserId, setDeleteUserId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderBy, setOrderBy] = useState('username');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const fetchUsers = async () => {
    try {
      const res = await api.get('/users');
      setUsers(res.data);
      setFilteredUsers(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleSave = async () => {
    try {
      if (editUserId) {
        await api.put(`/users/${editUserId}`, form);
        toast.success('User updated');
      } else {
        if (!form.username || !form.email) {
          toast.error("Username and Email are required");
          return;
        }
        const payload = {
          ...form,
          hashed_password: 'default123'
        };
        await api.post('/users', payload);
        toast.success('User created');
      }
      fetchUsers();
      handleClose();
    } catch (err) {}
  };

  const handleEdit = (user) => {
    setForm({
      username: user.username,
      full_name: user.full_name,
      email: user.email,
      role: user.role,
    });
    setEditUserId(user.id);
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/users/${deleteUserId}`);
      toast.success('User deleted');
      fetchUsers();
    } catch (err) {}
    setDeleteUserId(null);
  };

  const handleClose = () => {
    setOpen(false);
    setForm(initialForm);
    setEditUserId(null);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const sortedUsers = [...filteredUsers].sort((a, b) => {
    const valA = a[orderBy]?.toLowerCase?.() ?? '';
    const valB = b[orderBy]?.toLowerCase?.() ?? '';
    return (order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA));
  });

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = users.filter(u =>
      u.username.toLowerCase().includes(query.toLowerCase()) ||
      u.full_name?.toLowerCase()?.includes(query.toLowerCase()) ||
      u.email?.toLowerCase()?.includes(query.toLowerCase())
    );
    setFilteredUsers(filtered);
    setPage(0);
  };

  const handleExport = () => {
    const csv = Papa.unparse(filteredUsers);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'users.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField label="Search" value={searchQuery} onChange={handleSearch} size="small" />
        <Box>
          <Button startIcon={<FileDownload />} onClick={handleExport} sx={{ mr: 1 }}>Export</Button>
          <Button variant="contained" onClick={() => setOpen(true)}>Create User</Button>
        </Box>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
              {['Username', 'Full Name', 'Email', 'Role'].map((col) => (
                <TableCell key={col} sx={{ color: 'white' }}>
                  <TableSortLabel
                    active={orderBy === col}
                    direction={orderBy === col ? order : 'asc'}
                    onClick={() => handleSort(col)}
                    sx={{ color: 'white', '&.Mui-active': { color: 'white' } }}
                  >
                    {col.replace('_', ' ')}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedUsers.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.full_name}</TableCell>
                <TableCell>{user.email}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(user)}><Edit /></IconButton>
                  <IconButton onClick={() => setDeleteUserId(user.id)}><Delete /></IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={sortedUsers.length}
          page={page}
          onPageChange={(_, newPage) => setPage(newPage)}
          rowsPerPage={rowsPerPage}
          onRowsPerPageChange={(e) => {
            setRowsPerPage(parseInt(e.target.value, 10));
            setPage(0);
          }}
        />
      </TableContainer>

      <Dialog open={open} onClose={handleClose}>
        <DialogTitle>{editUserId ? "Edit User" : "Create User"}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth label="Username" margin="dense"
            value={form.username}
            onChange={(e) => setForm({ ...form, username: e.target.value })}
            disabled={!!editUserId}
          />
          <TextField
            fullWidth label="Full Name" margin="dense"
            value={form.full_name}
            onChange={(e) => setForm({ ...form, full_name: e.target.value })}
          />
          <TextField
            fullWidth label="Email" margin="dense"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <FormControl fullWidth margin="dense">
            <InputLabel>Role</InputLabel>
            <Select
              value={form.role}
              label="Role"
              onChange={(e) => setForm({ ...form, role: e.target.value })}
            >
              <MenuItem value="Admin">Admin</MenuItem>
              <MenuItem value="Staff">Staff</MenuItem>
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={Boolean(deleteUserId)}
        title="Confirm Deletion"
        content="Are you sure you want to delete this user?"
        onClose={() => setDeleteUserId(null)}
        onConfirm={handleDelete}
      />
    </Box>
  );
}
