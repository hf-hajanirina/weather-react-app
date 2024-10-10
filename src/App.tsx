import React from 'react';
import { Container, Typography, Box, CircularProgress, Alert, Snackbar } from '@mui/material';
import SearchForm from './components/SearchForm';
import useWeather from './hooks/useWeather';

const App: React.FC = () => {
  const { weather, loading, notification, fetchWeather } = useWeather();

  const handleSearch = (query: string) => {
    fetchWeather(query);
  };

  const handleCloseNotification = () => {
    // Ici, nous devrions idéalement avoir une fonction dans useWeather pour réinitialiser la notification
    // Pour cet exemple, nous allons simplement re-fetch avec une chaîne vide pour effacer la notification
    fetchWeather('');
  };

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Weather App
        </Typography>
        <SearchForm onSearch={handleSearch} />
        {loading && <CircularProgress />}
        {weather && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h4">{weather.name}</Typography>
            <Typography variant="h5">{weather.main.temp}°C</Typography>
            <Typography>{weather.weather[0].description}</Typography>
          </Box>
        )}
        {/* We'll add the forecast display later */}
        <Snackbar open={!!notification} autoHideDuration={6000} onClose={handleCloseNotification}>
          <Alert onClose={handleCloseNotification} severity={notification?.severity} sx={{ width: '100%' }}>
            {notification?.message}
          </Alert>
        </Snackbar>
      </Box>
    </Container>
  );
};

export default App;