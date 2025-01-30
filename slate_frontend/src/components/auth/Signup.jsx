import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Box, Card, CardContent, TextField, Button, Typography,
  FormControl, InputLabel, Select, MenuItem, Alert,
  Dialog, DialogTitle, DialogContent, DialogActions
} from '@mui/material';
import { signup, getStudents } from '../../services/api';

export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    role: '',
    name: '',
    linked_student_id: null
  });
  const [error, setError] = useState('');
  const [students, setStudents] = useState([]);
  const [showStudentDialog, setShowStudentDialog] = useState(false);

  const handleRoleChange = async (role) => {
    setFormData({ ...formData, role });
    if (role === 'PARENT') {
      try {
        const response = await getStudents();
        setStudents(response.data);
        setShowStudentDialog(true);
      } catch (err) {
        setError('Error fetching students');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await signup(formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Signup failed');
    }
  };

  return (
    <Box sx={{ height: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <Card sx={{ maxWidth: 400, width: '100%', mx: 2 }}>
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h4" align="center" gutterBottom>Sign Up</Typography>
          {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Name"
              margin="normal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <TextField
              fullWidth
              label="Email"
              type="email"
              margin="normal"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <TextField
              fullWidth
              label="Password"
              type="password"
              margin="normal"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel>Role</InputLabel>
              <Select
                value={formData.role}
                label="Role"
                onChange={(e) => handleRoleChange(e.target.value)}
              >
                <MenuItem value="SCHOOL">School</MenuItem>
                <MenuItem value="PARENT">Parent</MenuItem>
                <MenuItem value="STUDENT">Student</MenuItem>
              </Select>
            </FormControl>
            <Button
              fullWidth
              type="submit"
              variant="contained"
              size="large"
              sx={{ mt: 3 }}
            >
              Sign Up
            </Button>
          </form>
        </CardContent>
      </Card>

      <Dialog open={showStudentDialog} onClose={() => setShowStudentDialog(false)} PaperProps={{
    style: {
      minHeight: '35vh',
      maxHeight: '85vh'
    }
  }}>
        <DialogTitle>Select Your Child</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Student</InputLabel>
            <Select
            MenuProps={{
              PaperProps: {
                style: {
                  maxHeight: 300
                }
              }
            }}
              value={formData.linked_student_id || ''}
              label="Student"
              onChange={(e) => setFormData({ ...formData, linked_student_id: e.target.value })}
            >
              {students.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.name} (ID: {student.id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowStudentDialog(false)}>Done</Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}