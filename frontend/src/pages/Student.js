import {
  Box, Button, Dialog, DialogActions, DialogContent, DialogTitle,
  IconButton, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, TextField, Paper, TableSortLabel, TablePagination, Select, MenuItem, InputLabel, FormControl
} from '@mui/material';
import { Edit, Delete, FileDownload, Upload } from '@mui/icons-material';
import { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../services/api';
import Papa from 'papaparse';
import ConfirmDialog from '../utils/ConfirmDialog';

const initialForm = {
  name: '',
  student_class: '',
  unique_id: '',
  date_of_birth: '',
  gender: '',
  address: '',
  phone_number: '',
  email: '',
};

export default function Students() {
  const [students, setStudents] = useState([]);
  const [filteredStudents, setFilteredStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState(initialForm);
  const [editStudentId, setEditStudentId] = useState(null);
  const [deleteStudentId, setDeleteStudentId] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [vaccinationStatusFilter, setVaccinationStatusFilter] = useState('');
  const [orderBy, setOrderBy] = useState('name');
  const [order, setOrder] = useState('asc');
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(5);
  const [openImportDialog, setOpenImportDialog] = useState(false);
  const [csvFile, setCsvFile] = useState(null);

  const fetchStudents = async () => {
    try {
      const res = await api.get('/students');
      setStudents(res.data);
      setFilteredStudents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSave = async () => {
    try {
      if (editStudentId) {
        await api.put(`/students/${editStudentId}`, form);
        toast.success('Student updated');
      } else {
        await api.post('/students', form);
        toast.success('Student created');
      }
      fetchStudents();
      handleClose();
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const handleEdit = (student) => {
    setForm(student);
    setEditStudentId(student.id);
    setOpen(true);
  };

  const handleDelete = async () => {
    try {
      await api.delete(`/students/${deleteStudentId}`);
      toast.success('Student deleted');
      fetchStudents();
    } catch (err) {
      toast.error('Failed to delete student');
    }
    setDeleteStudentId(null);
  };

  const handleClose = () => {
    setOpen(false);
    setForm(initialForm);
    setEditStudentId(null);
  };

  const handleSort = (property) => {
    const isAsc = orderBy === property && order === 'asc';
    setOrder(isAsc ? 'desc' : 'asc');
    setOrderBy(property);
  };

  const handleSearch = (e) => {
    const query = e.target.value;
    setSearchQuery(query);
    const filtered = students.filter((student) =>
      student.name.toLowerCase().includes(query.toLowerCase()) ||
      student.student_class?.toLowerCase()?.includes(query.toLowerCase()) ||
      student.email?.toLowerCase()?.includes(query.toLowerCase())
    );
    setFilteredStudents(filtered);
    setPage(0);
  };

  const handleVaccinationStatusFilter = (e) => {
    const filterValue = e.target.value;
    setVaccinationStatusFilter(filterValue);

    const filtered = students.filter((student) =>
      filterValue === '' ||
      (filterValue === 'vaccinated' && student.is_vaccinated) ||
      (filterValue === 'not_vaccinated' && !student.is_vaccinated)
    );
    setFilteredStudents(filtered);
    setPage(0);
  };

  const handleExport = () => {
    const csv = Papa.unparse(filteredStudents);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'students.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleFileUpload = async () => {
    if (!csvFile) {
      toast.error('Please select a CSV file');
      return;
    }

    const formData = new FormData();
    formData.append('file', csvFile);

    try {
      await api.post('/students/import', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Bulk import successful');
      fetchStudents();
      setOpenImportDialog(false);
      setCsvFile(null);
    } catch (err) {
      toast.error('Failed to import students');
    }
  };

  const handleCsvFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'text/csv') {
      setCsvFile(file);
    } else {
      toast.error('Please upload a valid CSV file');
    }
  };

  const handleDownloadTemplate = () => {
    // Provide a downloadable CSV template
    const templateData = [
      ['name', 'student_class', 'unique_id', 'date_of_birth', 'gender', 'address', 'phone_number', 'email'],
      ['', '', '', '', '', '', '', ''],
    ];
    const csv = Papa.unparse(templateData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'students_template.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const sortedStudents = [...filteredStudents].sort((a, b) => {
    const valA = a[orderBy]?.toLowerCase?.() ?? '';
    const valB = b[orderBy]?.toLowerCase?.() ?? '';
    return order === 'asc' ? valA.localeCompare(valB) : valB.localeCompare(valA);
  });

  return (
    <Box>
      <Box display="flex" justifyContent="space-between" mb={2}>
        <Box display="flex" alignItems="center" gap={2}>
          <TextField label="Search" value={searchQuery} onChange={handleSearch} size="small" />
          <FormControl size="small" sx={{ minWidth: 120 }}>
            <InputLabel>Vaccination Status</InputLabel>
            <Select
              value={vaccinationStatusFilter}
              onChange={handleVaccinationStatusFilter}
              label="Vaccination Status"
            >
              <MenuItem value="">All</MenuItem>
              <MenuItem value="vaccinated">Vaccinated</MenuItem>
              <MenuItem value="not_vaccinated">Not Vaccinated</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box display="flex" alignItems="center">
          <Button startIcon={<FileDownload />} onClick={handleExport} sx={{ mr: 1 }}>
            Export
          </Button>
          <Button startIcon={<Upload />} variant="contained" onClick={() => setOpenImportDialog(true)}>
            Bulk Import
          </Button>
          <Button
            variant="contained"
            onClick={() => {
              setForm(initialForm);
              setEditStudentId(null);
              setOpen(true);
            }}
            sx={{ ml: 2 }}
          >
            Create Student
          </Button>
        </Box>
      </Box>
      <TableContainer component={Paper}>
        <Table>
          <TableHead sx={{ backgroundColor: 'primary.main' }}>
            <TableRow>
              {['Name', 'Class', 'Unique ID', 'Email', 'Vaccination Status'].map((col) => (
                <TableCell key={col} sx={{ color: 'white' }}>
                  <TableSortLabel
                    active={orderBy === col}
                    direction={orderBy === col ? order : 'asc'}
                    onClick={() => handleSort(col)}
                    sx={{ color: 'white', '&.Mui-active': { color: 'white' } }}
                  >
                    {col}
                  </TableSortLabel>
                </TableCell>
              ))}
              <TableCell sx={{ color: 'white' }}>Actions</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {sortedStudents.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage).map((student) => (
              <TableRow key={student.id}>
                <TableCell>{student.name}</TableCell>
                <TableCell>{student.student_class}</TableCell>
                <TableCell>{student.unique_id}</TableCell>
                <TableCell>{student.email}</TableCell>
                <TableCell>{student.is_vaccinated ? 'Yes' : 'No'}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEdit(student)}>
                    <Edit />
                  </IconButton>
                  <IconButton onClick={() => setDeleteStudentId(student.id)}>
                    <Delete />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        <TablePagination
          component="div"
          count={sortedStudents.length}
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
        <DialogTitle>{editStudentId ? 'Edit Student' : 'Create Student'}</DialogTitle>
        <DialogContent>
          <TextField
            fullWidth
            label="Name"
            margin="dense"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <TextField
            fullWidth
            label="Class"
            margin="dense"
            value={form.student_class}
            onChange={(e) => setForm({ ...form, student_class: e.target.value })}
          />
          <TextField
            fullWidth
            label="Unique ID"
            margin="dense"
            value={form.unique_id}
            onChange={(e) => setForm({ ...form, unique_id: e.target.value })}
            InputProps={{ readOnly: editStudentId ? true : false}}
          />
          <TextField
            fullWidth
            label="Date of Birth"
            margin="dense"
            type="date"
            value={form.date_of_birth}
            onChange={(e) => setForm({ ...form, date_of_birth: e.target.value })}
          />
          <TextField
            fullWidth
            label="Gender"
            margin="dense"
            value={form.gender}
            onChange={(e) => setForm({ ...form, gender: e.target.value })}
          />
          <TextField
            fullWidth
            label="Address"
            margin="dense"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
            />
            <TextField
            fullWidth
            label="Phone Number"
            margin="dense"
            value={form.phone_number}
            onChange={(e) => setForm({ ...form, phone_number: e.target.value })}
          />
          <TextField
            fullWidth
            label="Email"
            margin="dense"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          </DialogContent>
        <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button variant="contained" onClick={handleSave}>{editStudentId ? 'Save' : 'Create'}</Button>
      </DialogActions>
     </Dialog>
     <ConfirmDialog
    open={deleteStudentId !== null}
    onConfirm={handleDelete}
    onCancel={() => setDeleteStudentId(null)}
    title="Delete Student"
    message="Are you sure you want to delete this student?"
  />

  <Dialog open={openImportDialog} onClose={() => setOpenImportDialog(false)}>
    <DialogTitle>Bulk Import Students</DialogTitle>
    <DialogContent>
      <input
        type="file"
        accept=".csv"
        onChange={handleCsvFileChange}
      />
    </DialogContent>
    <DialogActions>
      <Button onClick={handleDownloadTemplate} color="primary">Download Template</Button>
      <Button onClick={handleFileUpload} color="primary">Upload</Button>
      <Button onClick={() => setOpenImportDialog(false)} color="secondary">Cancel</Button>
    </DialogActions>
  </Dialog>
</Box>
);
}
 