
import React from 'react';
import { ForecastItem } from '../types';
import { Calendar } from 'lucide-react';

interface ForecastSectionProps {
  daily: ForecastItem[];
  unit: 'metric' | 'imperial';
}

const ForecastSection: React.FC<ForecastSectionProps> = ({ daily, unit }) => {
  const tempUnit = unit === 'metric' ? '°C' : '°F';
  const getIconUrl = (icon: string) => `https://openweathermap.org/img/wn/${icon}.png`;

  return (
    <div className="glass-card rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none h-full">
      <div className="flex items-center gap-3 mb-6">
        <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600">
          <Calendar size={20} />
        </div>
        <h3 className="font-bold text-lg uppercase tracking-tight">7-Day Forecast</h3>
      </div>

      <div className="space-y-4">
        {daily.map((day, idx) => (
          <div 
            key={day.dt} 
            className={`flex items-center justify-between p-3 rounded-2xl transition-all duration-300 hover:bg-slate-100 dark:hover:bg-slate-800/50 ${idx === 0 ? 'bg-blue-50/50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-900/20' : ''}`}
          >
            <span className="w-12 font-semibold text-slate-500 dark:text-slate-400">
              {idx === 0 ? 'Today' : new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'short' })}
            </span>
            
            <div className="flex items-center gap-2 flex-1 justify-center">
              <img src={getIconUrl(day.icon)} alt={day.description} className="w-10 h-10" />
              <span className="text-xs font-medium text-blue-500 w-10">{day.rainProb}%</span>
            </div>

            <div className="flex items-center gap-3 min-w-[80px] justify-end">
              <span className="font-bold text-slate-900 dark:text-white">{day.maxTemp}{tempUnit}</span>
              <span className="font-medium text-slate-400">{day.minTemp}{tempUnit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastSection;
