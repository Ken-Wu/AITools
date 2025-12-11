import React, { useState, useMemo } from 'react';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import ToolCard from './components/ToolCard';
import { CATEGORIES, MOCK_TOOLS } from './constants';
import { CategoryId, Tool } from './types';
import { searchToolsWithGemini } from './services/geminiService';
import { Sparkles, XCircle, Search } from 'lucide-react';

const App: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<CategoryId>('all');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [smartResultIds, setSmartResultIds] = useState<string[] | null>(null);

  const handleSearch = async (query: string, useSmartSearch: boolean) => {
    setSearchQuery(query);
    setActiveCategory('all'); // Reset category on search
    
    if (useSmartSearch) {
      setIsSearching(true);
      const ids = await searchToolsWithGemini(query, MOCK_TOOLS);
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

  // Filter logic
  const filteredTools = useMemo(() => {
    let tools = MOCK_TOOLS;

    // 1. Filter by Smart Search (Gemini IDs)
    if (smartResultIds !== null) {
      return tools.filter(t => smartResultIds.includes(t.id));
    }

    // 2. Filter by Text Query (Basic Search)
    if (searchQuery && smartResultIds === null) {
      const lowerQ = searchQuery.toLowerCase();
      tools = tools.filter(t => 
        t.name.toLowerCase().includes(lowerQ) || 
        t.description.toLowerCase().includes(lowerQ) ||
        t.tags.some(tag => tag.toLowerCase().includes(lowerQ))
      );
    }

    // 3. Filter by Category
    if (activeCategory !== 'all') {
      tools = tools.filter(t => t.category === activeCategory);
    }

    return tools;
  }, [activeCategory, searchQuery, smartResultIds]);

  const activeCategoryLabel = CATEGORIES.find(c => c.id === activeCategory)?.label;

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      
      <Header 
        onSearch={handleSearch} 
        onMobileMenuClick={() => setMobileMenuOpen(true)}
        isSearching={isSearching}
      />

      <div className="flex flex-1 max-w-7xl mx-auto w-full">
        {/* Sidebar */}
        <Sidebar 
          activeCategory={activeCategory} 
          onSelectCategory={(id) => {
            setActiveCategory(id);
            clearSearch();
          }}
          isOpenMobile={mobileMenuOpen}
          setIsOpenMobile={setMobileMenuOpen}
        />

        {/* Main Content */}
        <main className="flex-1 p-4 md:p-6 lg:p-8 h-[calc(100vh-64px)] overflow-y-auto no-scrollbar">
          
          {/* Banner Area - Only show if no search is active */}
          {!searchQuery && activeCategory === 'all' && (
            <div className="mb-8 rounded-2xl bg-gradient-to-r from-gray-900 to-gray-800 text-white p-6 md:p-10 relative overflow-hidden shadow-xl">
               {/* Abstract shapes */}
               <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-blue-500 opacity-20 blur-3xl"></div>
               <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-purple-500 opacity-20 blur-3xl"></div>
               
               <div className="relative z-10 max-w-2xl">
                 <div className="inline-block px-3 py-1 rounded-full bg-white/10 text-xs font-semibold mb-4 border border-white/10">
                   New Features
                 </div>
                 <h1 className="text-3xl md:text-4xl font-bold mb-4 leading-tight">
                   Discover the Best <span className="text-blue-400">AI Tools</span> for Your Workflow
                 </h1>
                 <p className="text-gray-300 mb-6 text-lg">
                   Browse hundreds of curated AI applications. Use our Gemini-powered smart search to find exactly what you need.
                 </p>
                 <button 
                  onClick={() => document.querySelector('input')?.focus()}
                  className="bg-white text-gray-900 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-colors shadow-lg"
                 >
                   Start Searching
                 </button>
               </div>
            </div>
          )}

          {/* Results Header */}
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <h2 className="text-2xl font-bold text-gray-800">
                {searchQuery ? `Search Results` : activeCategoryLabel}
              </h2>
              <span className="bg-gray-200 text-gray-600 text-xs font-bold px-2 py-1 rounded-full">
                {filteredTools.length}
              </span>
            </div>
            
            {(searchQuery || smartResultIds) && (
              <button 
                onClick={clearSearch}
                className="text-sm text-red-500 hover:text-red-700 flex items-center gap-1 font-medium"
              >
                <XCircle size={16} />
                Clear Search
              </button>
            )}
          </div>

          {/* Smart Search Indicator */}
          {smartResultIds && (
            <div className="bg-indigo-50 border border-indigo-100 text-indigo-700 px-4 py-3 rounded-xl mb-6 flex items-start gap-3">
              <Sparkles className="flex-shrink-0 mt-0.5" size={18} />
              <div>
                <p className="font-semibold text-sm">AI Recommendation</p>
                <p className="text-sm opacity-90">
                  Gemini selected these tools based on your request: "{searchQuery}"
                </p>
              </div>
            </div>
          )}

          {/* Tool Grid */}
          {filteredTools.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredTools.map((tool) => (
                <ToolCard key={tool.id} tool={tool} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <div className="bg-gray-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 text-gray-400">
                <Search size={32} />
              </div>
              <h3 className="text-lg font-bold text-gray-700">No tools found</h3>
              <p className="text-gray-500 mt-2">Try adjusting your search or selecting a different category.</p>
              {searchQuery && (
                 <button 
                  onClick={clearSearch}
                  className="mt-4 text-blue-600 font-medium hover:underline"
                 >
                   View all tools
                 </button>
              )}
            </div>
          )}

          <div className="mt-12 py-8 border-t border-gray-200 text-center text-gray-400 text-sm">
            <p>© 2024 AI ToolHub. Powered by Gemini.</p>
          </div>
        </main>
      </div>
    </div>
  );
};

export default App;