
import React from 'react';
import WeatherDashboard from './components/WeatherDashboard';

const App: React.FC = () => {
  return (
    <div className="bg-slate-50 dark:bg-slate-950 min-h-screen">
      <WeatherDashboard />
    </div>
  );
};

export default App;
