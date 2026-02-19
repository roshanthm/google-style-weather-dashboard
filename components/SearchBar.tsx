
import React, { useState, useEffect, useRef } from 'react';
import { Search, MapPin, X } from 'lucide-react';
import { fetchGeocoding } from '../services/weatherService';
import { SearchSuggestion } from '../types';

interface SearchBarProps {
  onSelect: (lat: number, lon: number) => void;
  onUseCurrentLocation: () => void;
}

const SearchBar: React.FC<SearchBarProps> = ({ onSelect, onUseCurrentLocation }) => {
  const [query, setQuery] = useState('');
  const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (query.trim().length > 2) {
        try {
          const results = await fetchGeocoding(query);
          setSuggestions(results);
          setIsOpen(true);
        } catch (err) {
          console.error(err);
        }
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 400);

    return () => clearTimeout(delayDebounceFn);
  }, [query]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative w-full max-w-lg mx-auto" ref={containerRef}>
      <div className="relative flex items-center">
        <div className="absolute left-4 text-slate-400">
          <Search size={18} />
        </div>
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search for a city..."
          className="w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl py-3 pl-12 pr-12 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm transition-all text-lg"
        />
        {query && (
          <button 
            onClick={() => setQuery('')}
            className="absolute right-12 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
          >
            <X size={18} />
          </button>
        )}
        <button
          onClick={onUseCurrentLocation}
          className="absolute right-4 text-blue-500 hover:text-blue-600 transition-colors"
          title="Use my location"
        >
          <MapPin size={20} />
        </button>
      </div>

      {isOpen && suggestions.length > 0 && (
        <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100 dark:divide-slate-800">
          {suggestions.map((s, idx) => (
            <button
              key={`${s.lat}-${s.lon}-${idx}`}
              onClick={() => {
                onSelect(s.lat, s.lon);
                setQuery('');
                setIsOpen(false);
              }}
              className="w-full text-left px-5 py-4 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors flex flex-col"
            >
              <span className="font-semibold">{s.name}</span>
              <span className="text-sm text-slate-500">{s.state ? `${s.state}, ` : ''}{s.country}</span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default SearchBar;
