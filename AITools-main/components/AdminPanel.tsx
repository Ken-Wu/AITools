import React, { useState, useEffect } from 'react';
import { X, Plus, Edit2, Trash2, Save, Upload, Sparkles } from 'lucide-react';
import { Tool, CategoryId } from '../types';
import { CATEGORIES, UI_TEXT } from '../constants';
import { generateIconWithGemini } from '../services/geminiService';

interface AdminPanelProps {
  isOpen: boolean;
  onClose: () => void;
  tools: Tool[];
  setTools: (tools: Tool[]) => void;
  lang: 'en' | 'zh';
}

const AdminPanel: React.FC<AdminPanelProps> = ({ isOpen, onClose, tools, setTools, lang }) => {
  const [editingTool, setEditingTool] = useState<Partial<Tool> | null>(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [isGeneratingIcon, setIsGeneratingIcon] = useState(false);
  const text = UI_TEXT[lang];

  // Prevent background scrolling when modal is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddNew = () => {
    setEditingTool({
      id: Date.now().toString(),
      name: '',
      description: '',
      descriptionZh: '',
      url: '',
      iconUrl: '',
      category: 'productivity',
      tags: [],
      isFeatured: false
    });
    setIsFormOpen(true);
  };

  const handleEdit = (tool: Tool) => {
    setEditingTool({ ...tool });
    setIsFormOpen(true);
  };

  const handleDelete = (id: string) => {
    if (window.confirm(lang === 'zh' ? '确定要删除这个工具吗？' : 'Are you sure you want to delete this tool?')) {
      const newTools = tools.filter(t => t.id !== id);
      setTools(newTools);
    }
  };

  const handleGenerateIcon = async () => {
    if (!editingTool || !editingTool.name) {
      alert(lang === 'zh' ? '请先填写工具名称' : 'Please enter the tool name first');
      return;
    }
    
    setIsGeneratingIcon(true);
    const desc = editingTool.description || editingTool.descriptionZh || editingTool.name;
    const iconData = await generateIconWithGemini(editingTool.name, desc);
    
    if (iconData) {
      setEditingTool(prev => ({ ...prev, iconUrl: iconData }));
    } else {
      alert(lang === 'zh' ? '生成图标失败，请重试' : 'Failed to generate icon, please try again');
    }
    setIsGeneratingIcon(false);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingTool || !editingTool.id || !editingTool.name) return;

    // Ensure iconUrl has a fallback if empty
    const finalTool = {
        ...editingTool,
        iconUrl: editingTool.iconUrl || `https://www.google.com/s2/favicons?domain=${editingTool.url || 'google.com'}&sz=128`
    } as Tool;

    const existingIndex = tools.findIndex(t => t.id === finalTool.id);
    let newTools;

    if (existingIndex >= 0) {
      newTools = [...tools];
      newTools[existingIndex] = finalTool;
    } else {
      newTools = [finalTool, ...tools];
    }

    setTools(newTools);
    setIsFormOpen(false);
    setEditingTool(null);
  };

  const renderForm = () => {
    if (!editingTool) return null;

    return (
      <div className="fixed inset-0 z-[70] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto flex flex-col">
          <div className="p-6 border-b border-gray-100 flex justify-between items-center sticky top-0 bg-white z-10">
            <h3 className="text-xl font-bold text-gray-800">
              {tools.find(t => t.id === editingTool.id) 
                ? (lang === 'zh' ? '编辑工具' : 'Edit Tool') 
                : (lang === 'zh' ? '添加新工具' : 'Add New Tool')}
            </h3>
            <button onClick={() => setIsFormOpen(false)} className="text-gray-400 hover:text-gray-600">
              <X size={24} />
            </button>
          </div>
          
          <form onSubmit={handleSave} className="p-6 space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'zh' ? '名称' : 'Name'}</label>
                <input 
                  required
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editingTool.name}
                  onChange={e => setEditingTool({...editingTool, name: e.target.value})}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'zh' ? '分类' : 'Category'}</label>
                <select 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  value={editingTool.category}
                  onChange={e => setEditingTool({...editingTool, category: e.target.value as CategoryId})}
                >
                  {CATEGORIES.map(c => (
                    <option key={c.id} value={c.id}>{lang === 'zh' ? c.labelZh : c.label}</option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'zh' ? '跳转链接' : 'URL'}</label>
              <input 
                required
                type="url"
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={editingTool.url}
                onChange={e => setEditingTool({...editingTool, url: e.target.value})}
                placeholder="https://..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'zh' ? '图标链接 (留空自动获取)' : 'Icon URL (Leave empty for auto)'}</label>
              <div className="flex gap-2">
                 <input 
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                  value={editingTool.iconUrl}
                  onChange={e => setEditingTool({...editingTool, iconUrl: e.target.value})}
                  placeholder="https://..."
                />
                <button
                  type="button"
                  onClick={handleGenerateIcon}
                  disabled={isGeneratingIcon || !editingTool.name}
                  className={`
                    px-3 py-2 rounded-lg flex items-center gap-1 text-sm font-medium transition-colors border
                    ${isGeneratingIcon 
                      ? 'bg-indigo-50 text-indigo-400 border-indigo-100 cursor-wait' 
                      : 'bg-white text-indigo-600 border-indigo-200 hover:bg-indigo-50'}
                  `}
                  title="Generate icon using AI"
                >
                  <Sparkles size={16} className={isGeneratingIcon ? 'animate-pulse' : ''} />
                  {isGeneratingIcon ? text.generating : text.generateIcon}
                </button>
                {editingTool.iconUrl && (
                    <img src={editingTool.iconUrl} alt="Preview" className="w-10 h-10 rounded border object-cover bg-white shrink-0" />
                )}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {lang === 'zh' ? '标签 (用逗号分隔)' : 'Tags (comma separated)'}
              </label>
              <input 
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                value={editingTool.tags?.join(', ')}
                onChange={e => setEditingTool({...editingTool, tags: e.target.value.split(',').map(t => t.trim()).filter(Boolean)})}
                placeholder="ai, chat, design..."
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'zh' ? '英文描述' : 'Description (En)'}</label>
              <textarea 
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-20"
                value={editingTool.description}
                onChange={e => setEditingTool({...editingTool, description: e.target.value})}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">{lang === 'zh' ? '中文描述' : 'Description (Zh)'}</label>
              <textarea 
                required
                className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none h-20"
                value={editingTool.descriptionZh}
                onChange={e => setEditingTool({...editingTool, descriptionZh: e.target.value})}
              />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
               <button 
                type="button"
                onClick={() => setIsFormOpen(false)}
                className="px-4 py-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
               >
                 {lang === 'zh' ? '取消' : 'Cancel'}
               </button>
               <button 
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
               >
                 <Save size={18} />
                 {lang === 'zh' ? '保存' : 'Save'}
               </button>
            </div>
          </form>
        </div>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 bg-gray-100/90 backdrop-blur-sm p-4 md:p-8 overflow-y-auto">
      <div className="max-w-6xl mx-auto bg-white rounded-2xl shadow-xl min-h-[80vh] flex flex-col">
        {/* Header */}
        <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-white rounded-t-2xl sticky top-0 z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{lang === 'zh' ? '配置后台' : 'Configuration'}</h2>
            <p className="text-sm text-gray-500">{lang === 'zh' ? '管理您的工具库' : 'Manage your tool library'}</p>
          </div>
          <div className="flex gap-3">
             <button 
              onClick={handleAddNew}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors font-medium"
             >
               <Plus size={18} />
               {lang === 'zh' ? '添加工具' : 'Add Tool'}
             </button>
             <button 
              onClick={onClose}
              className="bg-gray-100 hover:bg-gray-200 text-gray-600 p-2 rounded-lg transition-colors"
             >
               <X size={24} />
             </button>
          </div>
        </div>

        {/* List */}
        <div className="p-6 flex-1 overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="text-gray-400 text-sm border-b border-gray-100">
                <th className="py-3 px-2 font-medium">{lang === 'zh' ? '图标' : 'Icon'}</th>
                <th className="py-3 px-2 font-medium">{lang === 'zh' ? '名称' : 'Name'}</th>
                <th className="py-3 px-2 font-medium hidden md:table-cell">{lang === 'zh' ? '分类' : 'Category'}</th>
                <th className="py-3 px-2 font-medium hidden lg:table-cell">{lang === 'zh' ? '链接' : 'Link'}</th>
                <th className="py-3 px-2 font-medium text-right">{lang === 'zh' ? '操作' : 'Actions'}</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {tools.map(tool => (
                <tr key={tool.id} className="hover:bg-gray-50 group transition-colors">
                  <td className="py-3 px-2">
                    <img 
                      src={tool.iconUrl} 
                      alt={tool.name} 
                      className="w-8 h-8 rounded bg-gray-100 object-cover border border-gray-200"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = 'https://via.placeholder.com/32?text=?';
                      }}
                    />
                  </td>
                  <td className="py-3 px-2 font-medium text-gray-900">{tool.name}</td>
                  <td className="py-3 px-2 hidden md:table-cell">
                    <span className="bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded-md">
                      {lang === 'zh' 
                        ? CATEGORIES.find(c => c.id === tool.category)?.labelZh 
                        : CATEGORIES.find(c => c.id === tool.category)?.label}
                    </span>
                  </td>
                  <td className="py-3 px-2 text-gray-500 text-sm hidden lg:table-cell max-w-xs truncate">
                    {tool.url}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => handleEdit(tool)}
                        className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
                        title={lang === 'zh' ? '编辑' : 'Edit'}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        onClick={() => handleDelete(tool.id)}
                        className="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition-colors"
                        title={lang === 'zh' ? '删除' : 'Delete'}
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          
          {tools.length === 0 && (
             <div className="text-center py-12 text-gray-400">
               <div className="mb-2"><Upload size={40} className="mx-auto opacity-20" /></div>
               <p>{lang === 'zh' ? '暂无工具，请添加' : 'No tools found. Add one!'}</p>
             </div>
          )}
        </div>
      </div>
      
      {/* Modal Form */}
      {isFormOpen && renderForm()}
    </div>
  );
};

export default AdminPanel;