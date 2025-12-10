import React from 'react';
import { Tool } from '../types';
import { ExternalLink, Star } from 'lucide-react';
import { UI_TEXT } from '../constants';

interface ToolCardProps {
  tool: Tool;
  lang: 'en' | 'zh';
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, lang }) => {
  const text = UI_TEXT[lang];

  return (
    <div className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg transition-shadow duration-300 flex flex-col h-full group relative">
      {tool.isFeatured && (
        <div className="absolute top-3 right-3 text-yellow-400">
          <Star size={16} fill="currentColor" />
        </div>
      )}
      
      <div className="flex items-start space-x-4 mb-3">
        <div className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0">
          <img 
            src={tool.iconUrl} 
            alt={tool.name} 
            className="w-full h-full object-cover"
            loading="lazy"
          />
        </div>
        <div>
          <h3 className="font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
            {tool.name}
          </h3>
          <div className="flex flex-wrap gap-1 mt-1">
            {tool.tags.slice(0, 2).map((tag, idx) => (
              <span key={idx} className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded-md capitalize">
                {tag}
              </span>
            ))}
          </div>
        </div>
      </div>

      <p className="text-sm text-gray-500 line-clamp-2 mb-4 flex-grow">
        {tool.description}
      </p>

      <a 
        href={tool.url} 
        target="_blank" 
        rel="noopener noreferrer"
        className="mt-auto flex items-center justify-center w-full py-2 bg-blue-50 text-blue-600 text-sm font-medium rounded-lg hover:bg-blue-600 hover:text-white transition-all group/btn"
      >
        <span>{text.visitSite}</span>
        <ExternalLink size={14} className="ml-2 group-hover/btn:translate-x-1 transition-transform" />
      </a>
    </div>
  );
};

export default ToolCard;