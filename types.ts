
export interface WeatherData {
  city: string;
  originalName?: string; // The name the user actually searched for
  country: string;
  temp: number;
  feelsLike: number;
  humidity: number;
  windSpeed: number;
  windDeg: number;
  pressure: number;
  visibility: number;
  description: string;
  icon: string;
  timestamp: number;
  sunrise: number;
  sunset: number;
  uvIndex?: number;
}

export interface ForecastItem {
  dt: number;
  temp: number;
  minTemp: number;
  maxTemp: number;
  description: string;
  icon: string;
  rainProb: number;
  humidity: number;
}

export interface WeatherState {
  current: WeatherData | null;
  hourly: ForecastItem[];
  daily: ForecastItem[];
  loading: boolean;
  error: string | null;
  unit: 'metric' | 'imperial';
  lat?: number;
  lon?: number;
  selectedName?: string;
}

export interface SearchSuggestion {
  name: string;
  lat: number;
  lon: number;
  country: string;
  state?: string;
}
