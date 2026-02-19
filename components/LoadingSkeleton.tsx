
import React from 'react';

const LoadingSkeleton: React.FC = () => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 animate-pulse">
      <div className="lg:col-span-8 space-y-6">
        <div className="h-64 md:h-80 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
        <div className="h-24 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
        <div className="h-64 bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
      </div>
      <div className="lg:col-span-4 h-full">
        <div className="h-[500px] md:h-full bg-slate-200 dark:bg-slate-800 rounded-3xl"></div>
      </div>
    </div>
  );
};

export default LoadingSkeleton;
