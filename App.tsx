import React, { useState, useMemo, useEffect } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ToolCard from './components/ToolCard';
import FloatingLikeButton from './components/FloatingLikeButton';
import AdminPanel from './components/AdminPanel';
import { CATEGORIES, MOCK_TOOLS, UI_TEXT } from './constants';
import { CategoryId, Tool } from './types';
import { searchToolsWithGemini } from './services/geminiService';
import { Sparkles, XCircle, Search } from 'lucide-react';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('productivity');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [smartResultIds, setSmartResultIds] = useState<string[] | null>(null);

  // Language state, default to 'zh' (Chinese)
  const [lang, setLang] = useState<'en' | 'zh'>('zh');
  const text = UI_TEXT[lang];

  // Tools Data State with LocalStorage persistence
  const [tools, setTools] = useState<Tool[]>(() => {
    try {
      const savedTools = localStorage.getItem('ai-toolhub-data');
      return savedTools ? JSON.parse(savedTools) : MOCK_TOOLS;
    } catch (e) {
      console.error("Failed to load tools from storage", e);
      return MOCK_TOOLS;
    }
  });

  // Admin Panel State
  const [showAdmin, setShowAdmin] = useState(false);

  // Persist tools whenever they change
  useEffect(() => {
    localStorage.setItem('ai-toolhub-data', JSON.stringify(tools));
  }, [tools]);

  // Scroll Spy logic to update sidebar active state
  useEffect(() => {
    const handleScroll = () => {
      if (searchQuery || smartResultIds) return; // Don't update on scroll if searching

      // Offset to account for sticky header
      const scrollPosition = window.scrollY + 100;

      for (const category of CATEGORIES) {
        const element = document.getElementById(category.id);
        if (element) {
          const { offsetTop, offsetHeight } = element;
          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
            setActiveCategory(category.id);
            break;
          }
        }
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [searchQuery, smartResultIds]);

  const handleSearch = async (query: string, useSmartSearch: boolean) => {
    setSearchQuery(query);
    // Don't change active category immediately, let the view update
    
    if (useSmartSearch) {
      setIsSearching(true);
      const ids = await searchToolsWithGemini(query, tools); // Pass current tools
      setSmartResultIds(ids);
      setIsSearching(false);
    } else {
      setSmartResultIds(null); // Clear smart results for regular search
    }
  };

  const clearSearch = () => {
    setSearchQuery('');
    setSmartResultIds(null);
  };

  const scrollToCategory = (id: CategoryId) => {
    if (searchQuery || smartResultIds) {
      clearSearch();
      // Wait for re-render to restore sections, then scroll
      setTimeout(() => {
        const element = document.getElementById(id);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          // Adjust for header
          window.scrollBy(0, -80);
        }
      }, 100);
    } else {
      const element = document.getElementById(id);
      if (element) {
        element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        // Adjust for header
        window.scrollBy(0, -80);
      }
    }
    setActiveCategory(id);
  };

  // Search Results Filtering
  const searchResults = useMemo(() => {
    if (!searchQuery && !smartResultIds) return [];

    let result = tools;

    // 1. Filter by Smart Search (Gemini IDs)
    if (smartResultIds !== null) {
      result = result.filter(t => smartResultIds.includes(t.id));
    }
    // 2. Filter by Text Query (Basic Search)
    else if (searchQuery) {
      const lowerQ = searchQuery.toLowerCase();
      result = result.filter(t => 
        t.name.toLowerCase().includes(lowerQ) || 
        t.description.toLowerCase().includes(lowerQ) ||
        (t.descriptionZh && t.descriptionZh.includes(lowerQ)) ||
        t.tags.some(tag => tag.toLowerCase().includes(lowerQ))
      );
    }

    return result;
  }, [searchQuery, smartResultIds, tools]);

  const isSearchMode = !!(searchQuery || smartResultIds);

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      
      <Header 
        onMobileMenuClick={() => setMobileMenuOpen(true)}
        lang={lang}
        setLang={setLang}
        onOpenAdmin={() => setShowAdmin(true)}
      />

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <Sidebar 
          activeCategory={activeCategory} 
          onSelectCategory={scrollToCategory}
          isOpenMobile={mobileMenuOpen}
          setIsOpenMobile={setMobileMenuOpen}
          lang={lang}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto no-scrollbar scroll-smooth">
          
          {/* Banner Area - Only show if no search is active */}
          {!isSearchMode && (
            <div className="mb-8 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 md:p-10 relative overflow-hidden shadow-xl">
               {/* Abstract shapes */}
               <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
               <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-purple-500 opacity-20 blur-3xl"></div>
               
               <div className="relative z-10 max-w-2xl">
                 <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-semibold mb-4 border border-white/10">
                   {text.newFeatures}
                 </div>
                 <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                   {text.heroTitle}
                 </h1>
                 <p className="text-gray-300 mb-6 text-lg">
                   {text.heroSubtitle}
                 </p>
               </div>
            </div>
          )}

          {/* Search Mode View */}
          {isSearchMode ? (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <h2 className="text-2xl font-bold text-gray-800">{text.searchResults}</h2>
                  <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                    {searchResults.length}
                  </span>
                </div>
                
                <button 
                  onClick={clearSearch}
                  className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
                >
                  <XCircle size={16} />
                  {text.clearSearch}
                </button>
              </div>

              {/* Smart Search Indicator */}
              {smartResultIds && (
                <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-3 rounded-xl mb-6 flex items-start gap-3">
                  <Sparkles className="flex-shrink-0 mt-0.5" size={18} />
                  <div>
                    <p className="font-semibold text-sm">{text.aiRecTitle}</p>
                    <p className="text-sm opacity-90">{text.aiRecDesc(searchQuery)}</p>
                  </div>
                </div>
              )}

              {/* Search Results Grid */}
              {searchResults.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {searchResults.map((tool) => (
                    <ToolCard key={tool.id} tool={tool} lang={lang} />
                  ))}
                </div>
              ) : (
                <div className="text-center py-20">
                  <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                    <Search size={32} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-700">{text.noToolsTitle}</h3>
                  <p className="text-gray-500 mt-2">{text.noToolsDesc}</p>
                  <button 
                    onClick={clearSearch}
                    className="mt-4 text-blue-600 font-medium hover:underline"
                  >
                    {text.viewAll}
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* Normal Category Sections View */
            <div className="space-y-12 pb-24">
              {CATEGORIES.map((category) => {
                const categoryTools = tools.filter(t => t.category === category.id);
                if (categoryTools.length === 0) return null;

                return (
                  <section key={category.id} id={category.id} className="scroll-mt-24">
                    <div className="flex items-center gap-3 mb-6">
                      <h2 className="text-xl font-bold text-gray-900">
                        {lang === 'zh' ? category.labelZh : category.label}
                      </h2>
                      <span className="text-xs font-semibold text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                        {categoryTools.length}
                      </span>
                    </div>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                      {categoryTools.map((tool) => (
                        <ToolCard key={tool.id} tool={tool} lang={lang} />
                      ))}
                    </div>
                  </section>
                );
              })}
            </div>
          )}

          <div className="mt-12 py-8 border-t border-gray-200 text-center text-gray-400 text-sm">
            <p>{text.footer}</p>
          </div>
        </main>
      </div>
      
      {/* Floating Like Button */}
      <FloatingLikeButton lang={lang} />

      {/* Admin Panel Overlay */}
      <AdminPanel 
        isOpen={showAdmin} 
        onClose={() => setShowAdmin(false)} 
        tools={tools} 
        setTools={setTools}
        lang={lang}
      />
      
    </div>
  );
};

export default App;