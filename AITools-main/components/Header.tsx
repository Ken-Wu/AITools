import React from 'react';
import { Menu, Command, Languages, Settings } from 'lucide-react';
import { UI_TEXT } from '../constants';

interface HeaderProps {
  onMobileMenuClick: () => void;
  lang: 'en' | 'zh';
  setLang: (lang: 'en' | 'zh') => void;
  onOpenAdmin: () => void;
}

const Header: React.FC<HeaderProps> = ({ 
  onMobileMenuClick, 
  lang, 
  setLang,
  onOpenAdmin 
}) => {
  const text = UI_TEXT[lang];

  const toggleLang = () => {
    setLang(lang === 'en' ? 'zh' : 'en');
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

        <div className="flex items-center gap-3 text-sm font-medium text-gray-600">
          <button 
            onClick={toggleLang}
            className="flex items-center gap-2 hover:text-blue-600 transition-colors px-2 py-1 rounded-md hover:bg-gray-100"
          >
            <Languages size={18} />
            <span>{lang === 'en' ? '中文' : 'English'}</span>
          </button>
          
          <button 
            onClick={onOpenAdmin}
            className="p-2 hover:bg-gray-100 rounded-lg text-gray-500 hover:text-blue-600 transition-colors"
            title="Configuration"
          >
            <Settings size={20} />
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header;