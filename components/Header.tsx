import React, { useState } from 'react';
import { Search, Sparkles, Menu, Command } from 'lucide-react';

interface HeaderProps {
  onSearch: (query: string, useSmartSearch: boolean) => void;
  onMobileMenuClick: () => void;
  isSearching: boolean;
}

const Header: React.FC<HeaderProps> = ({ onSearch, onMobileMenuClick, isSearching }) => {
  const [query, setQuery] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(query, false);
  };

  const handleSmartSearch = () => {
    if (query.trim()) {
      onSearch(query, true);
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white/80 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={onMobileMenuClick}
            className="lg:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
          >
            <Menu size={20} />
          </button>
          
          <div className="flex items-center gap-2">
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-1.5 rounded-lg">
              <Command size={20} />
            </div>
            <span className="font-bold text-lg tracking-tight text-gray-900">AI ToolHub</span>
          </div>
        </div>

        <div className="flex-1 max-w-2xl mx-4 hidden md:block">
          <form onSubmit={handleSubmit} className="relative group">
            <input
              type="text"
              placeholder="Search tools (e.g., 'image generator' or 'helper for coding')..."
              className="w-full pl-10 pr-24 py-2.5 bg-gray-100 border-transparent text-gray-900 placeholder-gray-500 focus:bg-white focus:border-blue-500 focus:ring-2 focus:ring-blue-200 rounded-xl transition-all outline-none text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-3 text-gray-400" size={18} />
            
            <button
              type="button"
              onClick={handleSmartSearch}
              disabled={isSearching || !query.trim()}
              className={`
                absolute right-1.5 top-1.5 bottom-1.5 px-3 rounded-lg flex items-center gap-1.5 text-xs font-medium transition-colors
                ${isSearching 
                  ? 'bg-blue-100 text-blue-400 cursor-wait' 
                  : 'bg-white text-indigo-600 shadow-sm hover:bg-indigo-50 border border-gray-200'}
              `}
            >
              <Sparkles size={12} className={isSearching ? 'animate-pulse' : ''} />
              {isSearching ? 'Thinking...' : 'AI Search'}
            </button>
          </form>
        </div>

        <div className="flex items-center gap-4 text-sm font-medium text-gray-600">
          <a href="#" className="hidden sm:block hover:text-blue-600">Community</a>
          <a href="#" className="hidden sm:block hover:text-blue-600">Blog</a>
          <button className="px-4 py-2 bg-gray-900 text-white rounded-lg hover:bg-gray-800 transition-colors">
            Login
          </button>
        </div>
      </div>
      
      {/* Mobile Search Bar (visible only on small screens) */}
      <div className="md:hidden px-4 pb-3">
        <form onSubmit={handleSubmit} className="relative">
             <input
              type="text"
              placeholder="Search AI tools..."
              className="w-full pl-10 pr-20 py-2 bg-gray-100 rounded-lg outline-none text-sm"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
            />
            <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            <button 
              type="button"
              onClick={handleSmartSearch}
              className="absolute right-2 top-1 text-indigo-600 p-1"
            >
              <Sparkles size={18} />
            </button>
        </form>
      </div>
    </header>
  );
};

export default Header;