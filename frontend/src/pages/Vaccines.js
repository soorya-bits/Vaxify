import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TextField, Paper, TablePagination,
    InputAdornment
  } from '@mui/material';
  import { Edit, Search, FileDownload } from '@mui/icons-material';
  import { useEffect, useState } from 'react';
  import { toast } from 'react-toastify';
  import api from '../services/api';
  
  const initialForm = { name: '', description: '', manufacturer: '' };
  
  export default function Vaccines() {
    const [vaccines, setVaccines] = useState([]);
    const [filtered, setFiltered] = useState([]);
    const [open, setOpen] = useState(false);
    const [form, setForm] = useState(initialForm);
    const [editId, setEditId] = useState(null);
    const [search, setSearch] = useState('');
    const [page, setPage] = useState(0);
    const [rowsPerPage, setRowsPerPage] = useState(5);
  
    const fetchVaccines = async () => {
      try {
        const res = await api.get('/vaccines');
        setVaccines(res.data);
        setFiltered(res.data);
      } catch (err) {
        console.error(err);
      }
    };
  
    useEffect(() => {
      fetchVaccines();
    }, []);
  
    useEffect(() => {
      const q = search.toLowerCase();
      setFiltered(
        vaccines.filter(
          v =>
            v.name.toLowerCase().includes(q) ||
            (v.description || '').toLowerCase().includes(q) ||
            (v.manufacturer || '').toLowerCase().includes(q)
        )
      );
    }, [search, vaccines]);
  
    const handleSave = async () => {
      try {
        if (!form.name) return toast.error("Name is required");
  
        if (editId) {
          await api.put(`/vaccines/${editId}`, null, { params: form });
          toast.success('Vaccine updated');
        } else {
          await api.post('/vaccines', null, { params: form });
          toast.success('Vaccine created');
        }
  
        fetchVaccines();
        handleClose();
      } catch (err) {}
    };
  
    const handleEdit = (vaccine) => {
      setForm({
        name: vaccine.name,
        description: vaccine.description || '',
        manufacturer: vaccine.manufacturer || '',
      });
      setEditId(vaccine.id);
      setOpen(true);
    };
  
    const handleClose = () => {
      setOpen(false);
      setForm(initialForm);
      setEditId(null);
    };
  
    const handleExport = () => {
      const csv = filtered.map(v => [v.name, v.description, v.manufacturer].join(',')).join('\n');
      const blob = new Blob([`Name,Description,Manufacturer\n${csv}`], { type: 'text/csv' });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = 'vaccines.csv';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    };
  
    return (
      <Box>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <TextField
            size="small"
            placeholder="Search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start"><Search /></InputAdornment>
              )
            }}
          />
          <Box>
            <Button startIcon={<FileDownload />} onClick={handleExport} sx={{ mr: 1 }}>
              Export
            </Button>
            <Button variant="contained" onClick={() => setOpen(true)}>
              Create Vaccine
            </Button>
          </Box>
        </Box>
  
        <TableContainer component={Paper}>
          <Table>
            <TableHead sx={{ bgcolor: 'primary.main' }}>
              <TableRow>
                <TableCell sx={{ color: 'white' }}>Name</TableCell>
                <TableCell sx={{ color: 'white' }}>Description</TableCell>
                <TableCell sx={{ color: 'white' }}>Manufacturer</TableCell>
                <TableCell sx={{ color: 'white' }}>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filtered.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((vaccine) => (
                <TableRow key={vaccine.id}>
                  <TableCell>{vaccine.name}</TableCell>
                  <TableCell>{vaccine.description}</TableCell>
                  <TableCell>{vaccine.manufacturer}</TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(vaccine)}><Edit /></IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell colSpan={4} align="center">No vaccines found.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <TablePagination
            rowsPerPageOptions={[5, 10, 20]}
            component="div"
            count={filtered.length}
            rowsPerPage={rowsPerPage}
            page={page}
            onPageChange={(_, newPage) => setPage(newPage)}
            onRowsPerPageChange={(e) => {
              setRowsPerPage(parseInt(e.target.value, 10));
              setPage(0);
            }}
          />
        </TableContainer>
  
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{editId ? "Edit Vaccine" : "Create Vaccine"}</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth label="Name" margin="dense"
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              disabled={!!editId}
            />
            <TextField
              fullWidth label="Description" margin="dense"
              value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
            />
            <TextField
              fullWidth label="Manufacturer" margin="dense"
              value={form.manufacturer}
              onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancel</Button>
            <Button variant="contained" onClick={handleSave}>Save</Button>
          </DialogActions>
        </Dialog>
      </Box>
    );
  }
  