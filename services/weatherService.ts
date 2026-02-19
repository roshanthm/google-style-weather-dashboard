
import { OWM_API_KEY, OWM_BASE_URL, OWM_GEO_URL } from '../constants';
import { WeatherData, ForecastItem, SearchSuggestion } from '../types';

export const fetchGeocoding = async (query: string): Promise<SearchSuggestion[]> => {
  const response = await fetch(`${OWM_GEO_URL}/direct?q=${encodeURIComponent(query)}&limit=5&appid=${OWM_API_KEY}`);
  if (!response.ok) throw new Error('Failed to fetch location suggestions');
  return await response.json();
};

export const fetchWeatherByCoords = async (lat: number, lon: number, unit: 'metric' | 'imperial' = 'metric') => {
  // Current Weather
  const currentRes = await fetch(`${OWM_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${OWM_API_KEY}`);
  if (!currentRes.ok) throw new Error('Failed to fetch current weather');
  const currentData = await currentRes.json();

  // Forecast (5 day / 3 hour)
  const forecastRes = await fetch(`${OWM_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${OWM_API_KEY}`);
  if (!forecastRes.ok) throw new Error('Failed to fetch forecast');
  const forecastData = await forecastRes.json();

  const current: WeatherData = {
    city: currentData.name,
    country: currentData.sys.country,
    temp: Math.round(currentData.main.temp),
    feelsLike: Math.round(currentData.main.feels_like),
    humidity: currentData.main.humidity,
    windSpeed: currentData.wind.speed,
    windDeg: currentData.wind.deg,
    pressure: currentData.main.pressure,
    visibility: currentData.visibility,
    description: currentData.weather[0].description,
    icon: currentData.weather[0].icon,
    timestamp: currentData.dt,
    sunrise: currentData.sys.sunrise,
    sunset: currentData.sys.sunset,
  };

  // Process hourly (first 24 hours = 8 items of 3h intervals)
  const hourly: ForecastItem[] = forecastData.list.slice(0, 8).map((item: any) => ({
    dt: item.dt,
    temp: Math.round(item.main.temp),
    description: item.weather[0].description,
    icon: item.weather[0].icon,
    rainProb: Math.round((item.pop || 0) * 100),
    humidity: item.main.humidity,
  }));

  // Process daily (grouped by day)
  const dailyMap = new Map<string, ForecastItem>();
  forecastData.list.forEach((item: any) => {
    const date = new Date(item.dt * 1000).toLocaleDateString();
    if (!dailyMap.has(date)) {
      dailyMap.set(date, {
        dt: item.dt,
        temp: Math.round(item.main.temp),
        minTemp: Math.round(item.main.temp_min),
        maxTemp: Math.round(item.main.temp_max),
        description: item.weather[0].description,
        icon: item.weather[0].icon,
        rainProb: Math.round((item.pop || 0) * 100),
        humidity: item.main.humidity,
      });
    } else {
      const existing = dailyMap.get(date)!;
      existing.minTemp = Math.min(existing.minTemp!, Math.round(item.main.temp_min));
      existing.maxTemp = Math.max(existing.maxTemp!, Math.round(item.main.temp_max));
    }
  });

  const daily = Array.from(dailyMap.values()).slice(0, 7);

  return { current, hourly, daily };
};
