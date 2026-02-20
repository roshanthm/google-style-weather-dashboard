
/**
 * Backend Simulator Service
 * Mimics production server-side behavior: Logging, Caching, and Persistence.
 */

const CACHE_KEY = 'skycast_weather_cache';
const HISTORY_KEY = 'skycast_location_history';
const SETTINGS_KEY = 'skycast_user_settings';

export interface CachedData {
  timestamp: number;
  data: any;
  lat: number;
  lon: number;
  unit: string;
}

export const logBackendRequest = (action: string, details: any) => {
  // In a real app, this would be a POST to /api/logs
  console.log(`[BACKEND SERVER LOG] ${new Date().toLocaleTimeString()} | Action: ${action}`, details);
};

export const getHistory = () => {
  return JSON.parse(localStorage.getItem(HISTORY_KEY) || '[]');
};

export const saveToHistory = (name: string, lat: number, lon: number, country?: string, state?: string) => {
  const history = getHistory();
  const newItem = { name, lat, lon, country: country || 'IN', state, timestamp: Date.now() };
  
  // Remove duplicates and keep top 5
  const filtered = history.filter((h: any) => h.name !== name).slice(0, 4);
  localStorage.setItem(HISTORY_KEY, JSON.stringify([newItem, ...filtered]));
  logBackendRequest('ANALYTICS_SEARCH_ENTRY', { name, coordinates: `${lat},${lon}` });
};

export const clearHistory = () => {
  localStorage.removeItem(HISTORY_KEY);
  logBackendRequest('USER_DATA_PURGE', { target: 'history' });
};

export const getCachedWeather = (lat: number, lon: number, unit: string): CachedData | null => {
  const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  const key = `${lat.toFixed(2)}_${lon.toFixed(2)}_${unit}`;
  const entry = cache[key];

  if (entry && (Date.now() - entry.timestamp < 300000)) { // 5 minute cache for better responsiveness
    logBackendRequest('DATABASE_CACHE_HIT', { key });
    return entry;
  }
  return null;
};

export const setCachedWeather = (lat: number, lon: number, unit: string, data: any) => {
  const cache = JSON.parse(localStorage.getItem(CACHE_KEY) || '{}');
  const key = `${lat.toFixed(2)}_${lon.toFixed(2)}_${unit}`;
  cache[key] = { timestamp: Date.now(), data, lat, lon, unit };
  localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
};

export const getSettings = () => {
  const defaults = { unit: 'metric', darkMode: false };
  return JSON.parse(localStorage.getItem(SETTINGS_KEY) || JSON.stringify(defaults));
};

export const saveSettings = (settings: any) => {
  localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
  logBackendRequest('USER_PREFERENCE_UPDATE', settings);
};
