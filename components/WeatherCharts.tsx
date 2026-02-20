
import React from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { ForecastItem } from '../types';
import { TrendingUp, CloudRain } from 'lucide-react';

interface WeatherChartsProps {
  hourly: ForecastItem[];
  unit: 'metric' | 'imperial';
}

const CustomTooltip = ({ active, payload, label, unitLabel }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white/90 dark:bg-slate-900/90 backdrop-blur-md p-3 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl">
        <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mb-1">{label}</p>
        <p className="text-sm font-black text-blue-600 dark:text-blue-400">
          {payload[0].value}{unitLabel}
        </p>
      </div>
    );
  }
  return null;
};

const WeatherCharts: React.FC<WeatherChartsProps> = ({ hourly, unit }) => {
  const chartData = hourly.map(item => ({
    time: new Date(item.dt * 1000).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit', hour12: true }),
    temp: item.temp,
    rain: item.rainProb,
  }));

  const tempUnit = unit === 'metric' ? 'C' : 'F';

  return (
    <div className="space-y-6">
      {/* Temperature Chart */}
      <div className="glass-card rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-orange-100 dark:bg-orange-900/30 text-orange-600">
              <TrendingUp size={20} />
            </div>
            <h3 className="font-bold text-lg uppercase tracking-tight">24h Temperature Trend</h3>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorTemp" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.4} />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                interval={1}
              />
              <YAxis 
                hide 
                domain={['dataMin - 2', 'dataMax + 2']} 
              />
              <Tooltip 
                content={<CustomTooltip unitLabel={tempUnit} />}
                cursor={{ stroke: '#3b82f6', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="temp" 
                stroke="#3b82f6" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorTemp)" 
                animationDuration={1500}
                dot={false}
                activeDot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Rain Probability Chart */}
      <div className="glass-card rounded-3xl p-6 shadow-xl shadow-slate-200/50 dark:shadow-none">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600">
              <CloudRain size={20} />
            </div>
            <h3 className="font-bold text-lg uppercase tracking-tight">24h Rain Probability</h3>
          </div>
        </div>

        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="colorRain" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e2e8f0" opacity={0.4} />
              <XAxis 
                dataKey="time" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 11, fill: '#94a3b8' }}
                interval={1}
              />
              <YAxis 
                hide 
                domain={[0, 100]} 
              />
              <Tooltip 
                content={<CustomTooltip unitLabel="%" />}
                cursor={{ stroke: '#0ea5e9', strokeWidth: 1, strokeDasharray: '4 4' }}
              />
              <Area 
                type="monotone" 
                dataKey="rain" 
                stroke="#0ea5e9" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorRain)" 
                animationDuration={1500}
                dot={false}
                activeDot={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default WeatherCharts;
