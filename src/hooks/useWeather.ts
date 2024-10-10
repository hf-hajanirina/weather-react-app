import { useState } from "react";
import axios from "axios";
import { WeatherData, ForecastData } from "../types/weather";

interface Notification {
  message: string;
  severity: "success" | "error" | "info" | "warning";
}

const useWeather = () => {
  const [weather, setWeather] = useState<WeatherData | null>(null);
  const [forecast, setForecast] = useState<ForecastData | null>(null);
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState<Notification | null>(null);

  const fetchWeather = async (city: string) => {
    setLoading(true);
    setNotification(null);
    try {
      const [weatherResponse, forecastResponse] = await Promise.all([
        axios.get<WeatherData>(
          `${import.meta.env.VITE_OPENWEATHER_BASE_URL}/weather`,
          {
            params: {
              q: city,
              units: "metric",
              appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
            },
          }
        ),
        axios.get<ForecastData>(
          `${import.meta.env.VITE_OPENWEATHER_BASE_URL}/forecast`,
          {
            params: {
              q: city,
              units: "metric",
              appid: import.meta.env.VITE_OPENWEATHER_API_KEY,
            },
          }
        ),
      ]);

      setWeather(weatherResponse.data);
      setForecast(forecastResponse.data);
      setNotification({
        message: `Weather data fetched for ${city}`,
        severity: "success",
      });
    } catch (error) {
      if (axios.isAxiosError(error)) {
        setNotification({
          message:
            error.response?.data.message ||
            "An error occurred while fetching weather data",
          severity: "error",
        });
      } else {
        setNotification({
          message: "An unexpected error occurred",
          severity: "error",
        });
      }
    } finally {
      setLoading(false);
    }
  };

  const resetNotification = () => setNotification(null);

  return {
    weather,
    forecast,
    loading,
    notification,
    fetchWeather,
    resetNotification,
  };
};

export default useWeather;
