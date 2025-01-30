import { useState, useEffect } from 'react';
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
  Box,
} from '@mui/material';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import { getAchievements } from '../../services/api';

export default function ParentDashboard() {
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
      <Paper sx={{ p: 3, mb: 3, bgcolor: 'primary.main', color: 'white' }}>
        <Typography variant="h5">Your Child's Achievements</Typography>
      </Paper>
      <Grid container spacing={3}>
        {achievements.map((achievement) => (
          <Grid item xs={12} md={6} key={achievement.id}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <EmojiEventsIcon color="primary" sx={{ mr: 1 }} />
                  <Typography variant="h6">{achievement.name}</Typography>
                </Box>
                <Typography color="textSecondary" gutterBottom>
                  School: {achievement.school_name}
                </Typography>
                <Typography variant="body1" paragraph>
                  {achievement.achievement}
                </Typography>
                <Typography variant="caption" color="textSecondary">
                  Date: {new Date(achievement.date_created).toLocaleDateString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
}
