import React from 'react';
import { Tool } from '../types';

interface ToolCardProps {
  tool: Tool;
  lang: 'en' | 'zh';
}

const ToolCard: React.FC<ToolCardProps> = ({ tool, lang }) => {
  return (
    <a 
      href={tool.url} 
      target="_blank" 
      rel="noopener noreferrer"
      className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-lg transition-all duration-300 flex flex-col h-full group relative block hover:-translate-y-1"
    >
      
      <div className="flex items-start space-x-4 mb-3">
        <div 
          className="w-12 h-12 rounded-lg overflow-hidden bg-gray-50 border border-gray-100 flex-shrink-0 group-hover:opacity-90 transition-opacity"
        >
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

      <p className="text-sm text-gray-500 line-clamp-3">
        {lang === 'zh' ? tool.descriptionZh : tool.description}
      </p>

    </a>
  );
};

export default ToolCard;