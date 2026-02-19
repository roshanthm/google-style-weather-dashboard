
import React, { useState, useEffect, useCallback } from 'react';
import { Sun, Moon, AlertTriangle, RefreshCw } from 'lucide-react';
import { WeatherState, WeatherData, ForecastItem } from '../types';
import { fetchWeatherByCoords } from '../services/weatherService';
import { generateWeatherInsight } from '../services/geminiService';
import SearchBar from './SearchBar';
import CurrentWeather from './CurrentWeather';
import ForecastSection from './ForecastSection';
import WeatherCharts from './WeatherCharts';
import InsightsPanel from './InsightsPanel';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorMessage from './ErrorMessage';

const WeatherDashboard: React.FC = () => {
  const [state, setState] = useState<WeatherState>({
    current: null,
    hourly: [],
    daily: [],
    loading: true,
    error: null,
    unit: 'metric'
  });
  const [insight, setInsight] = useState<string>('');
  const [darkMode, setDarkMode] = useState(false);

  const loadWeather = useCallback(async (lat: number, lon: number) => {
    setState(prev => ({ ...prev, loading: true, error: null }));
    try {
      const data = await fetchWeatherByCoords(lat, lon, state.unit);
      setState(prev => ({
        ...prev,
        current: data.current,
        hourly: data.hourly,
        daily: data.daily,
        loading: false
      }));
      
      const aiInsight = await generateWeatherInsight(data.current, data.daily);
      setInsight(aiInsight);
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, loading: false }));
    }
  }, [state.unit]);

  const useCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (pos) => loadWeather(pos.coords.latitude, pos.coords.longitude),
        (err) => {
          console.warn("Location permission denied", err);
          // Default to London if denied
          loadWeather(51.5074, -0.1278);
        }
      );
    } else {
      loadWeather(51.5074, -0.1278);
    }
  }, [loadWeather]);

  useEffect(() => {
    useCurrentLocation();
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleUnit = () => {
    setState(prev => ({ ...prev, unit: prev.unit === 'metric' ? 'imperial' : 'metric' }));
  };

  return (
    <div className="min-h-screen pb-12 transition-colors duration-500">
      <header className="p-4 md:p-8 flex flex-col md:flex-row items-center justify-between gap-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center text-white font-bold text-xl shadow-lg shadow-blue-500/30">
            S
          </div>
          <h1 className="text-2xl font-bold tracking-tight">SkyCast <span className="text-blue-600">Pro</span></h1>
        </div>
        
        <div className="flex-1 w-full flex justify-center">
          <SearchBar 
            onSelect={(lat, lon) => loadWeather(lat, lon)} 
            onUseCurrentLocation={useCurrentLocation}
          />
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={toggleUnit}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 font-medium text-sm w-12 hover:border-blue-500 transition-colors"
          >
            {state.unit === 'metric' ? '°C' : '°F'}
          </button>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-500 transition-colors"
          >
            {darkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
          <button 
            onClick={useCurrentLocation}
            className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-500 transition-colors"
          >
            <RefreshCw size={20} className={state.loading ? 'animate-spin' : ''} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 space-y-6">
        {state.error && <ErrorMessage message={state.error} onRetry={useCurrentLocation} />}
        
        {state.loading ? (
          <LoadingSkeleton />
        ) : (
          state.current && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <div className="lg:col-span-8 space-y-6">
                <CurrentWeather data={state.current} unit={state.unit} />
                <InsightsPanel insight={insight} />
                <WeatherCharts hourly={state.hourly} unit={state.unit} />
              </div>
              <div className="lg:col-span-4">
                <ForecastSection daily={state.daily} unit={state.unit} />
              </div>
            </div>
          )
        )}
      </main>
    </div>
  );
};

export default WeatherDashboard;
