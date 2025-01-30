import { useState, useEffect } from 'react';
import {
  Grid, Card, CardContent, Typography, Button, Dialog,
  DialogTitle, DialogContent, DialogActions, TextField,
  FormControl, InputLabel, Select, MenuItem
} from '@mui/material';
import { getAchievements, createAchievement, getStudents } from '../../services/api';

export default function SchoolDashboard() {
  const [achievements, setAchievements] = useState([]);
  const [students, setStudents] = useState([]);
  const [open, setOpen] = useState(false);
  const [newAchievement, setNewAchievement] = useState({
    student: '',
    name: '',
    school_name: '',
    achievement: ''
  });

  useEffect(() => {
    fetchAchievements();
    fetchStudents();
  }, []);

  const fetchAchievements = async () => {
    try {
      const response = await getAchievements();
      setAchievements(response.data);
    } catch (error) {
      console.error('Error fetching achievements:', error);
    }
  };

  const fetchStudents = async () => {
    try {
      const response = await getStudents();
      setStudents(response.data);
    } catch (error) {
      console.error('Error fetching students:', error);
    }
  };

  const handleSubmit = async () => {
    try {
      await createAchievement(newAchievement);
      setOpen(false);
      fetchAchievements();
    } catch (error) {
      console.error('Error creating achievement:', error);
    }
  };

  return (
    <>
      <Grid container spacing={3}>
        <Grid item xs={12}>
          <Button variant="contained" onClick={() => setOpen(true)} sx={{ mb: 3 }}>
            Add New Achievement
          </Button>
        </Grid>
        {achievements.map((achievement) => (
          <Grid item xs={12} md={6} key={achievement.id}>
            <Card>
              <CardContent>
                <Typography variant="h6">{achievement.name}</Typography>
                <Typography color="textSecondary">
                  Student: {achievement.student}
                </Typography>
                <Typography>{achievement.achievement}</Typography>
                <Typography variant="caption">
                  {new Date(achievement.date_created).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <DialogTitle>Add New Achievement</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Student</InputLabel>
            <Select
              value={newAchievement.student}
              label="Student"
              onChange={(e) => setNewAchievement({
                ...newAchievement,
                student: e.target.value
              })}
            >
              {students.map((student) => (
                <MenuItem key={student.id} value={student.id}>
                  {student.name} (ID: {student.id})
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            fullWidth
            label="Achievement Name"
            margin="normal"
            value={newAchievement.name}
            onChange={(e) => setNewAchievement({
              ...newAchievement,
              name: e.target.value
            })}
          />
          <TextField
            fullWidth
            label="School Name"
            margin="normal"
            value={newAchievement.school_name}
            onChange={(e) => setNewAchievement({
              ...newAchievement,
              school_name: e.target.value
            })}
          />
          <TextField
            fullWidth
            label="Achievement Description"
            margin="normal"
            multiline
            rows={4}
            value={newAchievement.achievement}
            onChange={(e) => setNewAchievement({
              ...newAchievement,
              achievement: e.target.value
            })}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button onClick={handleSubmit} variant="contained">
            Add Achievement
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}