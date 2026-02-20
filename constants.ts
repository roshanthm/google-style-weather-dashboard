
/**
 * API CONFIGURATION
 */

export const OWM_API_KEY = (typeof process !== 'undefined' && process.env.WEATHER_API_KEY) 
  ? process.env.WEATHER_API_KEY 
  : ;

export const OWM_BASE_URL = "https://api.openweathermap.org/data/2.5";
export const OWM_GEO_URL = "https://api.openweathermap.org/geo/1.0";

export const DEFAULT_CITY = "Kanjirappally";
export const DEFAULT_LAT = 9.5540;
export const DEFAULT_LON = 77.0315;

export const WEATHER_ICON_MAP: Record<string, string> = {
  '01d': 'Sun',
  '01n': 'Moon',
  '02d': 'CloudSun',
  '02n': 'CloudMoon',
  '03d': 'Cloud',
  '03n': 'Cloud',
  '04d': 'Clouds',
  '04n': 'Clouds',
  '09d': 'CloudDrizzle',
  '09n': 'CloudDrizzle',
  '10d': 'CloudRain',
  '10n': 'CloudRain',
  '11d': 'CloudLightning',
  '11n': 'CloudLightning',
  '13d': 'Snowflake',
  '13n': 'Snowflake',
  '50d': 'CloudFog',
  '50n': 'CloudFog',
};
