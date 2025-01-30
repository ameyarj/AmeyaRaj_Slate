import { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Box,
  Paper,
  Chip,
} from '@mui/material';
import SchoolIcon from '@mui/icons-material/School';
import { getAchievements } from '../../services/api';

export default function StudentDashboard() {
  const [achievements, setAchievements] = useState([]);

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const response = await getAchievements();
        setAchievements(response.data);
      } catch (error) {
        console.error('Error fetching achievements:', error);
      }
    };
    fetchAchievements();
  }, []);

  return (
    <Box>
      <Paper 
        sx={{ 
          p: 4, 
          mb: 4, 
          bgcolor: 'primary.main', 
          color: 'white',
          borderRadius: 3,
          textAlign: 'center'
        }}
      >
        <SchoolIcon sx={{ fontSize: 40, mb: 2 }} />
        <Typography variant="h4" gutterBottom>My Achievements</Typography>
        <Typography variant="subtitle1">
          Keep up the great work! Your achievements showcase your dedication.
        </Typography>
      </Paper>

      <Grid container spacing={3}>
        {achievements.map((achievement) => (
          <Grid item xs={12} md={6} key={achievement.id}>
            <Card sx={{ height: '100%' }}>
              <CardContent>
                <Box mb={2}>
                  <Chip 
                    label={achievement.school_name}
                    color="primary"
                    size="small"
                    sx={{ mb: 1 }}
                  />
                  <Typography variant="h6">{achievement.name}</Typography>
                </Box>
                <Typography variant="body1" paragraph>
                  {achievement.achievement}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Achieved on {new Date(achievement.date_created).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
