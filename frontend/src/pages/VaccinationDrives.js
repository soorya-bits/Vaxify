import React from 'react';
import {
    Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
    IconButton, Table, TableBody, TableCell, TableContainer,
    TableHead, TableRow, TextField, Paper, TableSortLabel, TablePagination,
    Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { Edit } from '@mui/icons-material';
import VaccinesIcon from '@mui/icons-material/Vaccines';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import ConfirmDialog from '../utils/ConfirmDialog';
import { Collapse } from '@mui/material';
import { KeyboardArrowDown, KeyboardArrowUp } from '@mui/icons-material';

const initialForm = {
  vaccine_id: '',
  date: '',
  applicable_classes: '',
  available_doses: '',
};

export default function VaccinationDrives() {
  const [drives, setDrives] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editDriveId, setEditDriveId] = useState(null);
  const [deleteDriveId, setDeleteDriveId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [orderBy, setOrderBy] = useState('date');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [expandedRows, setExpandedRows] = useState({});
  const [vaccinateDialogOpen, setVaccinateDialogOpen] = useState(false);
  const [selectedDrive, setSelectedDrive] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const toggleRow = (id) => {
    setExpandedRows(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const fetchDrives = async () => {
    try {
      const res = await api.get('/vaccination-drives');
      setDrives(res.data);
    } catch {
      toast.error('Failed to fetch drives');
    }
  };

  const fetchVaccines = async () => {
    try {
      const res = await api.get('/vaccines');
      setVaccines(res.data);
    } catch {
      toast.error('Failed to fetch vaccines');
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data);
    } catch {
      toast.error('Failed to fetch students');
    }
  };

  useEffect(() => {
    fetchDrives();
    fetchVaccines();
  }, []);

  const handleSave = async () => {
    if (!form.vaccine_id || !form.date || !form.applicable_classes || !form.available_doses) {
      toast.error('Please fill all fields');
      return;
    }

    try {
      if (editDriveId) {
        await api.put(`/vaccination-drives/${editDriveId}`, form);
        toast.success('Drive updated');
      } else {
        await api.post('/vaccination-drives', form);
        toast.success('Drive created');
      }

      fetchDrives();
      handleClose();
    } catch {
      toast.error('Failed to save drive');
    }
  };

  const handleEdit = (drive) => {
    setForm({
      vaccine_id: drive.vaccine_id,
      date: drive.date,
      applicable_classes: drive.applicable_classes,
      available_doses: drive.available_doses,
    });
    setEditDriveId(drive.id);
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/vaccination-drives/${deleteDriveId}`);
      toast.success('Drive deleted');
      fetchDrives();
    } catch {
      toast.error('Delete failed');
    }
    setDeleteDriveId(null);
  };

  const handleClose = () => {
    setOpen(false);
    setForm(initialForm);
    setEditDriveId(null);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const getVaccineName = (id) => {
    return vaccines.find(v => v.id === id)?.name || id;
  };

  const filteredDrives = drives.filter(d =>
    d.applicable_classes.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const sortedDrives = [...filteredDrives].sort((a, b) => {
    const valA = a[orderBy]?.toString().toLowerCase?.() ?? '';
    const valB = b[orderBy]?.toString().toLowerCase?.() ?? '';
    return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  const handleVaccinate = (drive) => {
    setSelectedDrive(drive);
    setVaccinateDialogOpen(true);
    fetchStudents();
  };

  const handleVaccinateConfirm = async () => {
    try {
      await api.post(`/students/${selectedStudent}/vaccinate/${selectedDrive.id}`);
      toast.success('Student vaccinated');
      setVaccinateDialogOpen(false);
      fetchDrives();
    } catch {
      toast.error('Failed to vaccinate student');
    }
  };

  const handleVaccinateClose = () => {
    setVaccinateDialogOpen(false);
    setSelectedStudent(null);
  };

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <TextField label="Search Class" value={searchQuery} onChange={e => setSearchQuery(e.target.value)} size="small" />
        <Button variant="contained" onClick={() => setOpen(true)}>Create Drive</Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
              {['Vaccine', 'Date', 'Applicable Classes', 'Available Doses', 'Vaccinated Students'].map(col => (
                <TableCell key={col} sx={{ color: 'white' }}>
                  <TableSortLabel
                    active={orderBy === col}
                    direction={orderBy === col ? order : 'asc'}
                    onClick={() => handleSort(col)}
                    sx={{ color: 'white', '&.Mui-active': { color: 'white' } }}
                  >
                    {col.replace(/_/g, ' ')}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedDrives.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((drive) => (
              <React.Fragment key={drive.id}>
                <TableRow>
                  <TableCell>
                    <IconButton size="small" onClick={() => toggleRow(drive.id)}>
                      {expandedRows[drive.id] ? <KeyboardArrowUp /> : <KeyboardArrowDown />}
                    </IconButton>
                    {getVaccineName(drive.vaccine_id)}
                  </TableCell>
                  <TableCell>{drive.date}</TableCell>
                  <TableCell>{drive.applicable_classes}</TableCell>
                  <TableCell>{drive.available_doses}</TableCell>
                  <TableCell>
                    {drive.vaccination_records?.length || 0} {/* Vaccination Done */}
                  </TableCell>
                  <TableCell>
                    <IconButton onClick={() => handleEdit(drive)}><Edit /></IconButton>
                    <IconButton onClick={() => handleVaccinate(drive)}><VaccinesIcon /></IconButton>
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                    <Collapse in={expandedRows[drive.id]} timeout="auto" unmountOnExit>
                      <Box margin={1}>
                        <strong>Vaccination Records</strong>
                        {drive.vaccination_records?.length ? (
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell><b>Student</b></TableCell>
                                <TableCell><b>Grade/Class</b></TableCell>
                                <TableCell><b>Vaccine</b></TableCell>
                                <TableCell><b>Date</b></TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {drive.vaccination_records.map((rec) => (
                                <TableRow key={rec.id}>
                                  <TableCell>{rec?.student?.name}</TableCell>
                                  <TableCell>{rec?.student?.student_class}</TableCell>
                                  <TableCell>{rec?.vaccine?.name}</TableCell>
                                  <TableCell>{rec.vaccination_date}</TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        ) : (
                          <Box mt={1}>No records available.</Box>
                        )}
                      </Box>
                    </Collapse>
                  </TableCell>
                </TableRow>
              </React.Fragment>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={sortedDrives.length}
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
        <DialogTitle>{editDriveId ? 'Edit Vaccination Drive' : 'Create Vaccination Drive'}</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Vaccine</InputLabel>
            <Select
              value={form.vaccine_id}
              label="Vaccine"
              onChange={(e) => setForm({ ...form, vaccine_id: e.target.value })}
              disabled={!!editDriveId}
            >
              {vaccines.map((v) => (
                <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth label="Date" type="date" margin="dense" InputLabelProps={{ shrink: true }}
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
          <TextField
            fullWidth label="Applicable Classes (e.g. 5,6,7)" margin="dense"
            value={form.applicable_classes}
            onChange={(e) => setForm({ ...form, applicable_classes: e.target.value })}
          />
          <TextField
            fullWidth label="Available Doses" margin="dense" type="number"
            value={form.available_doses}
            onChange={(e) => setForm({ ...form, available_doses: e.target.value })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancel</Button>
          <Button variant="contained" onClick={handleSave}>Save</Button>
        </DialogActions>
      </Dialog>

      <ConfirmDialog
        open={deleteDriveId !== null}
        onConfirm={handleDelete}
        onCancel={() => setDeleteDriveId(null)}
        title="Delete Vaccination Drive"
        message="Are you sure you want to delete this vaccination drive?"
      />

      <Dialog open={vaccinateDialogOpen} onClose={handleVaccinateClose} maxWidth="md" fullWidth>
        <DialogTitle>Mark Student as Vaccinated</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="dense">
            <InputLabel>Vaccine</InputLabel>
            <Select value={selectedDrive?.vaccine_id} disabled>
              {vaccines.map(v => (
                <MenuItem key={v.id} value={v.id}>{v.name}</MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth margin="dense">
            <InputLabel>Student</InputLabel>
            <Select value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)}>
              {students.map(student => (
                <MenuItem key={student.id} value={student.id}>{student.name} (Grade {student.student_class})</MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleVaccinateClose}>Cancel</Button>
          <Button variant="contained" onClick={handleVaccinateConfirm}>Vaccinate</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}