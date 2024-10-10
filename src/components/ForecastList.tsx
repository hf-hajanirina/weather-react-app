import React from 'react';
import { Box, Card, CardContent, Typography } from '@mui/material';
import { WbSunny, Cloud, Opacity, AcUnit } from '@mui/icons-material';

interface ForecastDay {
  date: string;
  temperature: number;
  description: string;
  icon: string;
}

interface ForecastListProps {
  forecast: ForecastDay[];
}

const getWeatherIcon = (icon: string) => {
  switch (icon) {
    case '01d':
    case '01n':
      return <WbSunny />;
    case '02d':
    case '02n':
    case '03d':
    case '03n':
    case '04d':
    case '04n':
      return <Cloud />;
    case '09d':
    case '09n':
    case '10d':
    case '10n':
      return <Opacity />;
    case '13d':
    case '13n':
      return <AcUnit />;
    default:
      return <Cloud />;
  }
};

const ForecastList: React.FC<ForecastListProps> = ({ forecast }) => {
  return (
    <Box sx={{ mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        5-Day Forecast
      </Typography>
      <Box sx={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        gap: 2,
        justifyContent: 'space-between'
      }}>
        {forecast.map((day, index) => (
          <Box key={index} sx={{ flexBasis: { xs: '100%', sm: 'calc(50% - 8px)', md: 'calc(20% - 8px)' } }}>
            <Card>
              <CardContent>
                <Typography variant="h6" component="div">
                  {day.date}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', my: 2 }}>
                  {getWeatherIcon(day.icon)}
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {day.temperature}°C
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {day.description}
                </Typography>
              </CardContent>
            </Card>
          </Box>
        ))}
      </Box>
    </Box>
  );
};

export default ForecastList;