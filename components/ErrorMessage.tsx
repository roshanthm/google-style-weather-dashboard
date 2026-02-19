
import React from 'react';
import { AlertCircle, RefreshCcw } from 'lucide-react';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
}

const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry }) => {
  return (
    <div className="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/30 p-6 rounded-3xl flex flex-col md:flex-row items-center gap-6 shadow-sm">
      <div className="p-4 rounded-2xl bg-red-100 dark:bg-red-900/30 text-red-600">
        <AlertCircle size={32} />
      </div>
      <div className="flex-1 text-center md:text-left">
        <h3 className="text-xl font-bold text-red-900 dark:text-red-400 mb-1">Unable to load weather</h3>
        <p className="text-red-700 dark:text-red-300 font-medium">
          {message}. Please check your connection or try another city.
        </p>
      </div>
      <button 
        onClick={onRetry}
        className="px-6 py-3 bg-red-600 hover:bg-red-700 text-white rounded-2xl font-bold transition-all shadow-lg shadow-red-600/20 flex items-center gap-2"
      >
        <RefreshCcw size={18} />
        Retry Now
      </button>
    </div>
  );
};

export default ErrorMessage;
