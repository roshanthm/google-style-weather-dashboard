
import React from 'react';
import { Sparkles } from 'lucide-react';

interface InsightsPanelProps {
  insight: string;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ insight }) => {
  if (!insight) return null;

  return (
    <div className="relative overflow-hidden p-[1px] rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500">
      <div className="glass-card rounded-[23px] p-6 flex flex-col md:flex-row items-center gap-6">
        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white shrink-0 shadow-lg shadow-blue-500/20">
          <Sparkles size={24} className="animate-pulse" />
        </div>
        <div className="text-center md:text-left">
          <h4 className="font-bold text-sm text-blue-600 dark:text-blue-400 uppercase tracking-widest mb-1">SkyCast AI Insight</h4>
          <p className="text-lg font-medium leading-relaxed text-slate-800 dark:text-slate-200">
            {insight}
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
