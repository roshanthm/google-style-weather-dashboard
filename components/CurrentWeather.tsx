
import React from 'react';
import { Wind, Droplets, Eye, Gauge, Info, Sun } from 'lucide-react';
import { WeatherData } from '../types';

interface CurrentWeatherProps {
  data: WeatherData;
  unit: 'metric' | 'imperial';
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, unit }) => {
  const getIconUrl = (icon: string) => `https://openweathermap.org/img/wn/${icon}@4x.png`;
  const tempUnit = unit === 'metric' ? 'C' : 'F';
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph';

  const displayLocation = data.originalName || data.city;
  const stationName = data.city;

  const getUVStatus = (uv: number) => {
    if (uv <= 2) return "Low";
    if (uv <= 5) return "Moderate";
    if (uv <= 7) return "High";
    if (uv <= 10) return "Very High";
    return "Extreme";
  };

  const DetailItem = ({ icon: Icon, label, value, subValue, index }: { icon: any, label: string, value: string, subValue?: string, index: number }) => (
    <div 
      className="reveal-item flex items-center gap-4 p-6 rounded-[32px] bg-white/40 dark:bg-slate-900/40 border border-white/40 dark:border-white/5 hover:bg-white/80 dark:hover:bg-slate-800/80 transition-all duration-500 group shadow-sm hover:shadow-xl hover:-translate-y-1"
      style={{ animationDelay: `${0.2 + index * 0.1}s` }}
    >
      <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 text-blue-600 shadow-lg group-hover:scale-110 group-hover:bg-blue-600 group-hover:text-white transition-all duration-500">
        <Icon size={24} />
      </div>
      <div className="min-w-0">
        <p className="text-[11px] font-[900] text-slate-400 dark:text-slate-500 uppercase tracking-[0.2em] mb-1">{label}</p>
        <p className="text-2xl font-black tracking-tighter text-slate-800 dark:text-slate-100 leading-tight">{value}</p>
        {subValue && <p className="text-[10px] font-black text-blue-500/80 uppercase tracking-widest mt-1 bg-blue-500/5 px-2 py-0.5 rounded-md w-fit">{subValue}</p>}
      </div>
    </div>
  );

  return (
    <div className="reveal-item glass-card border-beam rounded-[50px] p-10 md:p-14 flex flex-col md:flex-row items-center gap-14 shadow-2xl shadow-blue-500/10 relative" style={{ animationDelay: '0s' }}>
      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left relative z-10">
        <div className="flex flex-col gap-3">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-blue-500 text-white text-[11px] font-black uppercase tracking-[0.2em] mb-3 shadow-lg shadow-blue-500/40 w-fit self-center md:self-start">
            <span className="w-2 h-2 bg-white rounded-full animate-ping"></span>
            Real-time Station Data
          </div>
          <h2 className="text-5xl md:text-7xl font-[1000] text-slate-900 dark:text-white tracking-tighter leading-[0.9]">
            {displayLocation}
          </h2>
          {data.originalName && data.originalName !== data.city && (
            <div className="flex items-center gap-2 text-[12px] font-[800] text-slate-500 uppercase tracking-[0.15em] bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm px-4 py-2 rounded-2xl w-fit self-center md:self-start border border-white/30 dark:border-white/10 mt-2">
              <Info size={14} className="text-blue-500" />
              Sensor: {stationName}
            </div>
          )}
        </div>
        
        <p className="text-slate-400 dark:text-slate-500 font-black text-sm mt-6 uppercase tracking-[0.3em]">
          {new Date(data.timestamp * 1000).toLocaleDateString(undefined, { 
            weekday: 'long', day: 'numeric', month: 'long'
          })}
        </p>
        
        <div className="flex items-center gap-8 mt-12 group">
          <div className="relative">
            <span className="text-9xl md:text-[13rem] font-[1000] tracking-[-0.08em] text-slate-900 dark:text-white leading-none temp-glow transition-all duration-700 group-hover:tracking-[-0.05em]">
              {data.temp}<span className="text-blue-600 text-6xl md:text-8xl align-top ml-2 drop-shadow-xl font-black">°</span>
            </span>
          </div>
          <div className="relative flex items-center justify-center">
            <div className="absolute w-40 h-40 bg-blue-500/30 blur-[100px] rounded-full animate-pulse"></div>
            <img 
              src={getIconUrl(data.icon)} 
              alt={data.description}
              className="w-32 h-32 md:w-56 md:h-56 drop-shadow-[0_20px_50px_rgba(0,0,0,0.2)] animate-weather-icon relative z-10"
            />
          </div>
        </div>
        
        <div className="mt-8 flex flex-col items-center md:items-start gap-2">
          <p className="text-3xl md:text-4xl font-black capitalize text-blue-600 dark:text-blue-400 tracking-tighter">
            {data.description}
          </p>
          <div className="flex items-center gap-3">
             <p className="text-slate-400 dark:text-slate-500 font-[900] uppercase text-[12px] tracking-[0.25em]">
                Feels like <span className="text-slate-800 dark:text-slate-200">{data.feelsLike}°{tempUnit}</span>
             </p>
             <div className="w-1.5 h-1.5 bg-slate-300 rounded-full"></div>
             <p className="text-slate-400 dark:text-slate-500 font-[900] uppercase text-[12px] tracking-[0.25em]">
                {data.humidity}% Humidity
             </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 w-full md:w-auto md:min-w-[480px] relative z-10">
        <DetailItem index={1} icon={Wind} label="Wind Speed" value={`${data.windSpeed} ${speedUnit}`} />
        <DetailItem index={2} icon={Droplets} label="Precipitation" value={`${data.humidity}%`} />
        {data.uvIndex !== undefined && (
          <DetailItem 
            index={3}
            icon={Sun} 
            label="UV Index" 
            value={data.uvIndex.toString()} 
            subValue={getUVStatus(data.uvIndex)} 
          />
        )}
        <DetailItem index={4} icon={Eye} label="Visibility" value={`${(data.visibility / 1000).toFixed(1)} km`} />
        <DetailItem index={5} icon={Gauge} label="Atm. Pressure" value={`${data.pressure} hPa`} />
      </div>
    </div>
  );
};

export default CurrentWeather;
