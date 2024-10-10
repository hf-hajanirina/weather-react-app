import React, { useCallback } from "react";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import {
  Container,
  Typography,
  Box,
  CircularProgress,
  Alert,
  Snackbar,
  AppBar,
  Toolbar,
} from "@mui/material";
import SearchForm from "./components/SearchForm";
import ForecastList from "./components/ForecastList";
import ThemeToggle from "./components/ThemeToggle";
import useWeather from "./hooks/useWeather";
import { useTheme } from "./hooks/useTheme";
import { getTheme } from "./styles/theme";

interface DailyForecast {
  date: string;
  temperature: number;
  description: string;
  icon: string;
}

const App: React.FC = () => {
  const {
    weather,
    forecast,
    loading,
    notification,
    fetchWeather,
    resetNotification,
  } = useWeather();
  const { theme, toggleTheme } = useTheme();
  const muiTheme = React.useMemo(() => getTheme(theme), [theme]);

  const handleSearch = useCallback(
    (query: string) => {
      fetchWeather(query);
    },
    [fetchWeather]
  );

  const handleCloseNotification = useCallback(() => {
    resetNotification();
  }, [resetNotification]);

  const formattedForecast: DailyForecast[] = React.useMemo(() => {
    if (!forecast?.list) return [];

    const dailyForecasts: { [key: string]: DailyForecast } = {};

    forecast.list.forEach((item) => {
      const date = new Date(item.dt * 1000);
      const dateKey = date.toISOString().split("T")[0];

      if (!dailyForecasts[dateKey]) {
        dailyForecasts[dateKey] = {
          date: date.toLocaleDateString("en-US", { weekday: "long" }),
          temperature: item.main.temp,
          description: item.weather[0].description,
          icon: item.weather[0].icon,
        };
      }
    });

    return Object.values(dailyForecasts).slice(0, 5);
  }, [forecast]);

  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Weather React App
          </Typography>
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg">
        <Box sx={{ my: 4 }}>
          <SearchForm onSearch={handleSearch} />
          {loading && (
            <Box display="flex" justifyContent="center" my={4}>
              <CircularProgress />
            </Box>
          )}
          {weather && (
            <Box sx={{ mt: 4, mb: 2, textAlign: "center" }}>
              <Typography variant="h4" gutterBottom>
                {weather.name}
              </Typography>
              <Typography variant="h2">
                {Math.round(weather.main.temp)}°C
              </Typography>
              <Typography variant="h5">
                {weather.weather[0].description}
              </Typography>
              <Box mt={2}>
                <Typography>Humidity: {weather.main.humidity}%</Typography>
                <Typography>Wind: {weather.wind.speed} m/s</Typography>
              </Box>
            </Box>
          )}
          {formattedForecast.length > 0 && (
            <ForecastList forecast={formattedForecast} />
          )}
          <Snackbar
            open={!!notification}
            autoHideDuration={6000}
            onClose={handleCloseNotification}
            anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
          >
            <Alert
              onClose={handleCloseNotification}
              severity={notification?.severity}
              sx={{ width: "100%" }}
              variant="filled"
            >
              {notification?.message}
            </Alert>
          </Snackbar>
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default App;
