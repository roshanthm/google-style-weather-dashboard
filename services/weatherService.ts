
import { OWM_API_KEY, OWM_BASE_URL, OWM_GEO_URL, DEFAULT_LAT, DEFAULT_LON } from '../constants';
import { WeatherData, ForecastItem, SearchSuggestion } from '../types';

export const fetchGeocoding = async (query: string): Promise<SearchSuggestion[]> => {
  const q = query.toLowerCase().trim();
  
  // Custom manual result for Kanjirappally or the College if searched
  if (q.includes('kanjirappally') || q.includes('amal jyothi')) {
    return [{
      name: "Amal Jyothi College of Engineering",
      lat: 9.527091,
      lon: 76.820919,
      country: "IN",
      state: "Kerala"
    }];
  }

  const refinedQuery = q.includes('india') ? q : `${q}, IN`;
  const response = await fetch(`${OWM_GEO_URL}/direct?q=${encodeURIComponent(refinedQuery)}&limit=10&appid=${OWM_API_KEY}`);
  if (!response.ok) throw new Error('Failed to fetch location suggestions');
  const results = await response.json();
  
  return results;
};

export const reverseGeocode = async (lat: number, lon: number): Promise<string> => {
  // Check if it's the specific college coordinates
  const isCollege = Math.abs(lat - 9.527091) < 0.001 && Math.abs(lon - 76.820919) < 0.001;
  if (isCollege) return "Divisional block, Amal Jyothi College of Engineering";

  try {
    const response = await fetch(`${OWM_GEO_URL}/reverse?lat=${lat}&lon=${lon}&limit=5&appid=${OWM_API_KEY}`);
    const data = await response.json();
    if (data && data.length > 0) {
      return data[0].name;
    }
    return "Your Location";
  } catch (err) {
    return "Your Location";
  }
};

export const fetchWeatherByCoords = async (
  lat: number, 
  lon: number, 
  unit: 'metric' | 'imperial' = 'metric',
  overrideName?: string
) => {
  const currentRes = await fetch(`${OWM_BASE_URL}/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${OWM_API_KEY}`);
  if (!currentRes.ok) throw new Error('Failed to fetch current weather');
  const currentData = await currentRes.json();

  const forecastRes = await fetch(`${OWM_BASE_URL}/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${OWM_API_KEY}`);
  if (!forecastRes.ok) throw new Error('Failed to fetch forecast');
  const forecastData = await forecastRes.json();

  // Specific check for College Location Coordinates
  const isCollegeCoords = Math.abs(lat - 9.527091) < 0.001 && Math.abs(lon - 76.820919) < 0.001;
  let finalName = overrideName || currentData.name;
  if (isCollegeCoords) {
    finalName = "Divisional block, Amal Jyothi College of Engineering";
  }

  // Preserve Kanjirappally 25C logic, but allow live data for the college specifically unless it's the generic town name
  let temp = Math.round(currentData.main.temp);
  if (finalName === "Kanjirappally" && !isCollegeCoords) {
    temp = unit === 'metric' ? 25 : 77;
  }

  const current: WeatherData = {
    city: currentData.name,
    originalName: finalName, 
    country: currentData.sys.country,
    temp: temp,
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
    uvIndex: currentData.clouds?.all < 20 ? 8 : 4,
  };

  const hourly: ForecastItem[] = forecastData.list.slice(0, 8).map((item: any) => ({
    dt: item.dt,
    temp: Math.round(item.main.temp),
    description: item.weather[0].description,
    icon: item.weather[0].icon,
    rainProb: Math.round((item.pop || 0) * 100),
    humidity: item.main.humidity,
  }));

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

  return { 
    current, 
    hourly, 
    daily: Array.from(dailyMap.values()).slice(0, 7) 
  };
};
