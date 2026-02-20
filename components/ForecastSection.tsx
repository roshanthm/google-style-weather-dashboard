
import React from 'react';
import { ForecastItem } from '../types';
import { Calendar } from 'lucide-react';

interface ForecastSectionProps {
  daily: ForecastItem[];
  unit: 'metric' | 'imperial';
}

const ForecastSection: React.FC<ForecastSectionProps> = ({ daily, unit }) => {
  const tempUnit = unit === 'metric' ? 'C' : 'F';
  const getIconUrl = (icon: string) => `https://openweathermap.org/img/wn/${icon}.png`;

  return (
    <div className="reveal-item glass-card rounded-[40px] p-8 shadow-xl shadow-slate-200/50 dark:shadow-none h-full" style={{ animationDelay: '0.2s' }}>
      <div className="flex items-center gap-4 mb-8">
        <div className="p-3 rounded-2xl bg-blue-500/10 text-blue-600 dark:text-blue-400 border border-blue-500/10">
          <Calendar size={22} />
        </div>
        <h3 className="font-black text-lg uppercase tracking-[0.2em] text-slate-900 dark:text-white">7-Day Outlook</h3>
      </div>

      <div className="space-y-4">
        {daily.map((day, idx) => (
          <div 
            key={day.dt} 
            className={`reveal-item flex items-center justify-between p-4 rounded-3xl transition-all duration-500 hover:bg-white dark:hover:bg-white/5 border border-transparent hover:border-blue-500/10 ${idx === 0 ? 'bg-blue-500/10 dark:bg-blue-500/5 border-blue-500/20' : ''}`}
            style={{ animationDelay: `${0.3 + idx * 0.08}s` }}
          >
            <span className="w-14 font-black text-sm uppercase tracking-wider text-slate-500 dark:text-slate-400">
              {idx === 0 ? 'Today' : new Date(day.dt * 1000).toLocaleDateString(undefined, { weekday: 'short' })}
            </span>
            
            <div className="flex items-center gap-3 flex-1 justify-center">
              <img src={getIconUrl(day.icon)} alt={day.description} className="w-12 h-12 drop-shadow-md" />
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-blue-500/80 uppercase tracking-widest">{day.rainProb}%</span>
                <span className="text-[9px] font-bold text-slate-400 uppercase">Rain</span>
              </div>
            </div>

            <div className="flex items-center gap-4 min-w-[90px] justify-end">
              <span className="text-lg font-[900] text-slate-900 dark:text-white tracking-tighter">{day.maxTemp}{tempUnit}</span>
              <span className="text-sm font-bold text-slate-400 tracking-tighter">{day.minTemp}{tempUnit}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ForecastSection;
