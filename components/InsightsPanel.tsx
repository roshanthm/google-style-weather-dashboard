
import React from 'react';
import { Sparkles } from 'lucide-react';

interface InsightsPanelProps {
  insight: string;
}

const InsightsPanel: React.FC<InsightsPanelProps> = ({ insight }) => {
  if (!insight) return null;

  return (
    <div className="reveal-item relative overflow-hidden p-[1.5px] rounded-[32px] bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-600 shadow-xl shadow-indigo-500/10 group" style={{ animationDelay: '0.1s' }}>
      <div className="absolute inset-0 bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-500 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 blur-xl"></div>
      <div className="glass-card rounded-[31px] p-8 flex flex-col md:flex-row items-center gap-8 relative z-10">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-700 flex items-center justify-center text-white shrink-0 shadow-2xl shadow-blue-600/30 animate-pulse">
          <Sparkles size={28} />
        </div>
        <div className="text-center md:text-left flex-1">
          <h4 className="font-black text-[11px] text-blue-600 dark:text-blue-400 uppercase tracking-[0.25em] mb-2">SkyCast AI Assistant</h4>
          <p className="text-xl font-bold leading-relaxed text-slate-800 dark:text-slate-100 tracking-tight">
            "{insight}"
          </p>
        </div>
      </div>
    </div>
  );
};

export default InsightsPanel;
