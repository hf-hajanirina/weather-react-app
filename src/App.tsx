import React from 'react';
import { Container, Typography, Box, CircularProgress, Alert, Snackbar } from '@mui/material';
import SearchForm from './components/SearchForm';
import ForecastList from './components/ForecastList';
import useWeather from './hooks/useWeather';

interface DailyForecast {
  date: string;
  temperature: number;
  description: string;
  icon: string;
}

const App: React.FC = () => {
  const { weather, forecast, loading, notification, fetchWeather } = useWeather();

  const handleSearch = (query: string) => {
    fetchWeather(query);
  };

  const handleCloseNotification = () => {
    // Idéalement, nous devrions avoir une fonction dans useWeather pour réinitialiser la notification
  //  fetchWeather('');
  };

  // Formater les données de prévision pour obtenir une prévision quotidienne
  const formattedForecast: DailyForecast[] = React.useMemo(() => {
    if (!forecast?.list) return [];

    const dailyForecasts: { [key: string]: DailyForecast } = {};

    forecast.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split('T')[0]; // Use date as key

      if (!dailyForecasts[dateKey]) {
        dailyForecasts[dateKey] = {
          date: date.toLocaleDateString('en-US', { weekday: 'long' }),
          temperature: item.main.temp,
          description: item.weather[0].description,
          icon: item.weather[0].icon
        };
      }
    });

    // Convert object to array and take only the next 5 days
    return Object.values(dailyForecasts).slice(0, 5);
  }, [forecast]);

  return (
    <Container maxWidth="lg">
      <Box sx={{ my: 4 }}>
        <Typography variant="h2" component="h1" gutterBottom>
          Weather App
        </Typography>
        <SearchForm onSearch={handleSearch} />
        {loading && <CircularProgress />}
        {weather && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="h4">{weather.name}</Typography>
            <Typography variant="h5">{Math.round(weather.main.temp)}°C</Typography>
            <Typography>{weather.weather[0].description}</Typography>
          </Box>
        )}
        {formattedForecast.length > 0 && <ForecastList forecast={formattedForecast} />}
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