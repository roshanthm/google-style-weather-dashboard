
import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Sun, Moon, RefreshCw, Radio, MapPin, Zap } from 'lucide-react';
import { WeatherState, SearchSuggestion } from '../types';
import { fetchWeatherByCoords, reverseGeocode } from '../services/weatherService';
import { generateWeatherInsight } from '../services/geminiService';
import { DEFAULT_LAT, DEFAULT_LON, DEFAULT_CITY } from '../constants';
import { 
  logBackendRequest, 
  getCachedWeather, 
  setCachedWeather, 
  saveToHistory,
  getSettings,
  saveSettings
} from '../services/backendSimulator';
import SearchBar from './SearchBar';
import CurrentWeather from './CurrentWeather';
import ForecastSection from './ForecastSection';
import WeatherCharts from './WeatherCharts';
import InsightsPanel from './InsightsPanel';
import LoadingSkeleton from './LoadingSkeleton';
import ErrorMessage from './ErrorMessage';

const WeatherDashboard: React.FC = () => {
  const initialSettings = getSettings();
  const [state, setState] = useState<WeatherState>({
    current: null,
    hourly: [],
    daily: [],
    loading: true,
    error: null,
    unit: initialSettings.unit || 'metric',
    lat: DEFAULT_LAT,
    lon: DEFAULT_LON,
    selectedName: DEFAULT_CITY
  });
  const [insight, setInsight] = useState<string>('');
  const [darkMode, setDarkMode] = useState(initialSettings.darkMode);
  const [lastUpdated, setLastUpdated] = useState<Date | null>(null);
  const [isLocating, setIsLocating] = useState(false);
  
  const unitRef = useRef(state.unit);
  useEffect(() => {
    unitRef.current = state.unit;
    saveSettings({ unit: state.unit, darkMode });
  }, [state.unit, darkMode]);

  const loadWeather = useCallback(async (lat: number, lon: number, name?: string, forceUnit?: 'metric' | 'imperial', country?: string, stateLabel?: string) => {
    const activeUnit = forceUnit || unitRef.current;
    setState(prev => ({ 
      ...prev, 
      loading: true, 
      error: null, 
      lat, 
      lon, 
      selectedName: name || prev.selectedName,
      unit: activeUnit 
    }));
    
    try {
      const cached = getCachedWeather(lat, lon, activeUnit);
      let data;

      if (cached) {
        data = cached.data;
      } else {
        data = await fetchWeatherByCoords(lat, lon, activeUnit, name);
        setCachedWeather(lat, lon, activeUnit, data);
      }

      if (name) saveToHistory(name, lat, lon, country, stateLabel);

      setState(prev => ({
        ...prev,
        current: data.current,
        hourly: data.hourly,
        daily: data.daily,
        loading: false
      }));
      setLastUpdated(new Date());
      
      const aiInsight = await generateWeatherInsight(data.current, data.daily);
      setInsight(aiInsight);
    } catch (err: any) {
      setState(prev => ({ ...prev, error: err.message, loading: false }));
    } finally {
      setIsLocating(false);
    }
  }, []);

  // NEW: Optimized for Amal Jyothi College of Engineering
  const useCurrentLocation = useCallback(() => {
    setIsLocating(true);
    setState(prev => ({ ...prev, loading: true, error: null }));

    // Simulate a high-tech scan delay for the WOW effect
    setTimeout(() => {
        const collegeLat = 9.527091;
        const collegeLon = 76.820919;
        const collegeName = "Divisional block, Amal Jyothi College of Engineering";
        
        logBackendRequest('COLLEGE_LOCATION_ACCESSED', { name: collegeName });
        loadWeather(collegeLat, collegeLon, collegeName);
    }, 1200);
  }, [loadWeather]);

  useEffect(() => {
    loadWeather(DEFAULT_LAT, DEFAULT_LON, DEFAULT_CITY);
  }, []);

  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const toggleUnit = () => {
    const newUnit = state.unit === 'metric' ? 'imperial' : 'metric';
    setState(prev => ({ ...prev, unit: newUnit }));
    if (state.lat !== undefined && state.lon !== undefined) {
      loadWeather(state.lat, state.lon, state.selectedName, newUnit);
    }
  };

  const handleRefresh = () => {
    if (state.lat !== undefined && state.lon !== undefined) {
      loadWeather(state.lat, state.lon, state.selectedName);
    } else {
      useCurrentLocation();
    }
  };

  return (
    <div className="min-h-screen pb-12 transition-colors duration-500 overflow-hidden relative">
      {/* Background Scanning Animation for "Use Current Location" */}
      {isLocating && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center pointer-events-none">
            <div className="absolute inset-0 bg-blue-500/10 backdrop-blur-sm"></div>
            <div className="w-96 h-96 border-4 border-blue-500 rounded-full animate-ping opacity-20"></div>
            <div className="w-64 h-64 border-2 border-blue-400 rounded-full animate-pulse opacity-40"></div>
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 flex flex-col items-center">
                <Zap size={64} className="text-blue-500 animate-bounce mb-4" />
                <span className="font-black text-blue-600 uppercase tracking-[0.4em] text-sm">Targeting Campus...</span>
            </div>
        </div>
      )}

      {/* Header with higher z-index to allow search dropdown to float over main content */}
      <header className="p-4 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6 max-w-7xl mx-auto relative z-40">
        <div className="flex flex-col reveal-item" style={{ animationDelay: '0s' }}>
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl flex items-center justify-center text-white font-black text-2xl shadow-xl shadow-blue-500/30 transform hover:scale-110 transition-transform duration-500">
              S
            </div>
            <h1 className="text-3xl font-[900] tracking-tight text-slate-900 dark:text-white">SkyCast <span className="text-blue-600">Pro</span></h1>
          </div>
          {lastUpdated && !state.loading && (
            <div className="flex items-center gap-2 mt-2 ml-1 text-[11px] uppercase tracking-[0.2em] font-black text-blue-500 dark:text-blue-400">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
              </span>
              Campus Node Connected
            </div>
          )}
        </div>
        
        <div className="flex-1 w-full flex justify-center reveal-item" style={{ animationDelay: '0.1s' }}>
          <SearchBar 
            onSelect={(s) => loadWeather(s.lat, s.lon, s.name, undefined, s.country, s.state)} 
            onUseCurrentLocation={useCurrentLocation}
          />
        </div>

        <div className="flex items-center gap-4 reveal-item" style={{ animationDelay: '0.2s' }}>
          <button 
            onClick={toggleUnit}
            className={`p-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 font-black text-sm min-w-[56px] hover:border-blue-500 transition-all shadow-sm ${state.loading ? 'opacity-50' : 'hover:scale-110 active:scale-95'}`}
            disabled={state.loading}
          >
            {state.unit === 'metric' ? '°C' : '°F'}
          </button>
          <button 
            onClick={() => setDarkMode(!darkMode)}
            className="p-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-500 transition-all hover:scale-110 shadow-sm"
          >
            {darkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <button 
            onClick={handleRefresh}
            className="p-3 rounded-2xl bg-white/50 dark:bg-slate-900/50 backdrop-blur-md border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-blue-500 transition-all hover:scale-110 shadow-sm group"
          >
            <RefreshCw size={24} className={`${state.loading ? 'animate-spin' : 'group-hover:rotate-180 transition-transform duration-700'}`} />
          </button>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 md:px-8 space-y-8 relative z-10">
        {state.error && <ErrorMessage message={state.error} onRetry={handleRefresh} />}
        
        {state.loading && !isLocating ? (
          <LoadingSkeleton />
        ) : (
          state.current && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              <div className="lg:col-span-8 space-y-8">
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
