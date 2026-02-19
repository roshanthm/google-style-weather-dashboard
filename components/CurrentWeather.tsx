
import React from 'react';
import { Wind, Droplets, Thermometer, Eye, CloudRain, Sun, Gauge } from 'lucide-react';
import { WeatherData } from '../types';

interface CurrentWeatherProps {
  data: WeatherData;
  unit: 'metric' | 'imperial';
}

const CurrentWeather: React.FC<CurrentWeatherProps> = ({ data, unit }) => {
  const getIconUrl = (icon: string) => `https://openweathermap.org/img/wn/${icon}@4x.png`;
  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const speedUnit = unit === 'metric' ? 'm/s' : 'mph';

  const DetailItem = ({ icon: Icon, label, value, subValue }: { icon: any, label: string, value: string, subValue?: string }) => (
    <div className="flex items-center gap-4 p-4 rounded-2xl bg-slate-100/50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50">
      <div className="p-3 rounded-xl bg-white dark:bg-slate-900 text-blue-500 shadow-sm">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-xs font-medium text-slate-500 dark:text-slate-400 uppercase tracking-wider">{label}</p>
        <p className="text-lg font-bold">{value}</p>
        {subValue && <p className="text-xs text-slate-400">{subValue}</p>}
      </div>
    </div>
  );

  return (
    <div className="glass-card rounded-3xl p-6 md:p-10 flex flex-col md:flex-row items-center gap-8 shadow-xl shadow-slate-200/50 dark:shadow-none">
      <div className="flex-1 flex flex-col items-center md:items-start text-center md:text-left">
        <h2 className="text-3xl md:text-4xl font-bold flex items-center gap-2">
          {data.city}, {data.country}
        </h2>
        <p className="text-slate-500 font-medium mt-1">
          {new Date(data.timestamp * 1000).toLocaleDateString(undefined, { 
            weekday: 'long', day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' 
          })}
        </p>
        
        <div className="flex items-center gap-4 mt-8">
          <span className="text-7xl md:text-8xl font-black tracking-tighter text-slate-900 dark:text-white">
            {data.temp}{tempUnit}
          </span>
          <img 
            src={getIconUrl(data.icon)} 
            alt={data.description}
            className="w-24 h-24 md:w-32 md:h-32 drop-shadow-2xl"
          />
        </div>
        
        <p className="text-xl md:text-2xl font-semibold capitalize text-blue-600 dark:text-blue-400 mt-2">
          {data.description}
        </p>
        <p className="text-slate-500 font-medium">
          Feels like {data.feelsLike}{tempUnit}
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4 w-full md:w-auto">
        <DetailItem icon={Wind} label="Wind" value={`${data.windSpeed} ${speedUnit}`} subValue={`${data.windDeg}°`} />
        <DetailItem icon={Droplets} label="Humidity" value={`${data.humidity}%`} />
        <DetailItem icon={Eye} label="Visibility" value={`${(data.visibility / 1000).toFixed(1)} km`} />
        <DetailItem icon={Gauge} label="Pressure" value={`${data.pressure} hPa`} />
      </div>
    </div>
  );
};

export default CurrentWeather;
