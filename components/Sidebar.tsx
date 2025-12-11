import React from 'react';
import { CATEGORIES, getIconComponent } from '../constants';
import { CategoryId } from '../types';

interface SidebarProps {
  activeCategory: CategoryId;
  onSelectCategory: (id: CategoryId) => void;
  isOpenMobile: boolean;
  setIsOpenMobile: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ 
  activeCategory, 
  onSelectCategory,
  isOpenMobile,
  setIsOpenMobile
}) => {
  return (
    <>
      {/* Mobile Overlay */}
      {isOpenMobile && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={() => setIsOpenMobile(false)}
        />
      )}

      <aside className={`
        fixed top-0 left-0 bottom-0 z-50 w-64 bg-white border-r border-gray-100 
        transform transition-transform duration-300 ease-in-out
        lg:translate-x-0 lg:static lg:h-[calc(100vh-64px)] lg:overflow-y-auto no-scrollbar
        ${isOpenMobile ? 'translate-x-0' : '-translate-x-full'}
      `}>
        <div className="p-4 lg:hidden flex justify-between items-center border-b">
          <span className="font-bold text-xl text-gray-800">Menu</span>
          <button onClick={() => setIsOpenMobile(false)} className="text-gray-500">✕</button>
        </div>

        <nav className="p-3 space-y-1">
          <div className="px-3 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider">
            Categories
          </div>
          {CATEGORIES.map((category) => (
            <button
              key={category.id}
              onClick={() => {
                onSelectCategory(category.id);
                setIsOpenMobile(false);
              }}
              className={`
                w-full flex items-center space-x-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors
                ${activeCategory === category.id 
                  ? 'bg-blue-50 text-blue-600' 
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'}
              `}
            >
              <span className={activeCategory === category.id ? 'text-blue-600' : 'text-gray-400'}>
                {getIconComponent(category.iconName)}
              </span>
              <span>{category.label}</span>
            </button>
          ))}
        </nav>

        <div className="p-4 mt-4 border-t border-gray-100">
           <div className="bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl p-4 text-white">
             <h3 className="font-bold text-sm mb-1">Submit Tool</h3>
             <p className="text-xs text-blue-100 mb-3">Have an AI tool? Submit it to our directory.</p>
             <button className="w-full bg-white/20 hover:bg-white/30 text-xs font-semibold py-2 rounded-lg transition-colors">
               Submit Now
             </button>
           </div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;