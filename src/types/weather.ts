export interface WeatherData {
    main: {
      temp: number;
      feels_like: number;
      humidity: number;
    };
    weather: {
      main: string;
      description: string;
      icon: string;
    }[];
    wind: {
      speed: number;
    };
    name: string;
  }
  
  export interface ForecastData {
    list: {
      [x: string]: any;
      dt: number;
      main: {
        temp: number;
      };
      weather: {
        main: string;
        description: string;
        icon: string;
      }[];
    }[];
    city: {
      name: string;
    };
  }