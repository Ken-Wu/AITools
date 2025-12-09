import { Category, Tool } from './types';
import { 
  Type, 
  Image, 
  Video, 
  Mic, 
  Code, 
  Megaphone, 
  Briefcase, 
  PenTool, 
  LayoutGrid
} from 'lucide-react';
import React from 'react';

export const CATEGORIES: Category[] = [
  { id: 'productivity', label: 'Hello Tools', labelZh: '哈啰工具', iconName: 'Briefcase' },
  { id: 'text', label: 'AI Writing', labelZh: 'AI 写作', iconName: 'Type' },
  { id: 'image', label: 'AI Image', labelZh: 'AI 图像', iconName: 'Image' },
  { id: 'video', label: 'AI Video', labelZh: 'AI 视频', iconName: 'Video' },
  { id: 'audio', label: 'AI Audio', labelZh: 'AI 音频', iconName: 'Mic' },
  { id: 'code', label: 'AI Coding', labelZh: 'AI 编程', iconName: 'Code' },
  { id: 'design', label: 'AI Design', labelZh: 'AI 设计', iconName: 'PenTool' },
  { id: 'marketing', label: 'Marketing', labelZh: '营销工具', iconName: 'Megaphone' },
];

export const UI_TEXT = {
  en: {
    searchPlaceholder: "Search tools (e.g., 'image generator')...",
    aiSearch: "AI Search",
    thinking: "Thinking...",
    login: "Login",
    submitTool: "Submit Tool",
    submitDesc: "Have an AI tool? Submit it to our directory.",
    submitBtn: "Submit Now",
    visitSite: "Visit Site",
    menu: "Menu",
    categories: "Categories",
    heroTitle: "Discover the Best AI Tools for Your Workflow",
    heroSubtitle: "Browse hundreds of curated AI applications. Use our Gemini-powered smart search to find exactly what you need.",
    startSearch: "Start Searching",
    searchResults: "Search Results",
    clearSearch: "Clear Search",
    aiRecTitle: "AI Recommendation",
    aiRecDesc: (q: string) => `Gemini selected these tools based on your request: "${q}"`,
    noToolsTitle: "No tools found",
    noToolsDesc: "Try adjusting your search or selecting a different category.",
    viewAll: "View all tools",
    footer: "© 2024 AI ToolHub. Powered by Gemini.",
    newFeatures: "New Features",
    like: "Like",
    likes: "Likes",
    generateIcon: "Generate Icon",
    generating: "Generating...",
    chatTitle: "AI Concierge",
    chatPlaceholder: "Ask about tools...",
    chatWelcome: "Hi! I can help you find the perfect AI tool. What are you looking for?",
    send: "Send"
  },
  zh: {
    searchPlaceholder: "搜索 AI 工具 (例如：'图片生成' 或 '编程助手')...",
    aiSearch: "AI 搜索",
    thinking: "思考中...",
    login: "登录",
    submitTool: "提交工具",
    submitDesc: "有好的 AI 工具？提交到我们的目录。",
    submitBtn: "立即提交",
    visitSite: "访问网站",
    menu: "菜单",
    categories: "分类导航",
    heroTitle: "发现最佳 AI 工具，提升工作效率",
    heroSubtitle: "浏览数百个精选 AI 应用。使用 Gemini 智能搜索找到您需要的工具。",
    startSearch: "开始搜索",
    searchResults: "搜索结果",
    clearSearch: "清除搜索",
    aiRecTitle: "AI 智能推荐",
    aiRecDesc: (q: string) => `Gemini 根据您的请求为您挑选了这些工具："${q}"`,
    noToolsTitle: "未找到相关工具",
    noToolsDesc: "请尝试调整搜索词或切换分类。",
    viewAll: "查看所有工具",
    footer: "© 2024 AI ToolHub. 由 Gemini 驱动。",
    newFeatures: "新功能",
    like: "点赞",
    likes: "次点赞",
    generateIcon: "AI 生成图标",
    generating: "生成中...",
    chatTitle: "AI 助手",
    chatPlaceholder: "询问关于工具的问题...",
    chatWelcome: "你好！我是您的 AI 助手，可以帮您寻找合适的工具。请问您需要什么？",
    send: "发送"
  }
};

export const MOCK_TOOLS: Tool[] = [
  {
    id: '1',
    name: 'ChatGPT',
    description: 'Advanced conversational AI for writing, coding, and analysis.',
    descriptionZh: '强大的对话式AI，擅长写作、编程和分析任务。',
    category: 'text',
    url: 'https://chat.openai.com',
    iconUrl: 'https://www.google.com/s2/favicons?domain=openai.com&sz=128',
    tags: ['chatbot', 'writing', 'assistant'],
    isFeatured: true
  },
  {
    id: '2',
    name: 'Midjourney',
    description: 'High-quality artistic image generation from text prompts.',
    descriptionZh: '通过文本提示生成高质量、艺术感极强的图像。',
    category: 'image',
    url: 'https://www.midjourney.com',
    iconUrl: 'https://www.google.com/s2/favicons?domain=midjourney.com&sz=128',
    tags: ['art', 'generation', 'creative'],
    isFeatured: true
  },
  {
    id: '3',
    name: 'Jasper',
    description: 'AI content creator for marketing teams and blogs.',
    descriptionZh: '专为营销团队和博主设计的AI内容创作助手。',
    category: 'marketing',
    url: 'https://www.jasper.ai',
    iconUrl: 'https://www.google.com/s2/favicons?domain=jasper.ai&sz=128',
    tags: ['copywriting', 'seo', 'blogging']
  },
  {
    id: '4',
    name: 'GitHub Copilot',
    description: 'Your AI pair programmer that helps write better code.',
    descriptionZh: '您的AI结对程序员，助您编写更优质的代码。',
    category: 'code',
    url: 'https://github.com/features/copilot',
    iconUrl: 'https://www.google.com/s2/favicons?domain=github.com&sz=128',
    tags: ['coding', 'developer', 'autocomplete']
  },
  {
    id: '5',
    name: 'Runway',
    description: 'Advanced video editing and generation suite powered by AI.',
    descriptionZh: 'AI驱动的专业视频编辑与生成工具套件。',
    category: 'video',
    url: 'https://runwayml.com',
    iconUrl: 'https://www.google.com/s2/favicons?domain=runwayml.com&sz=128',
    tags: ['video editing', 'vfx', 'generation']
  },
  {
    id: '6',
    name: 'ElevenLabs',
    description: 'The most realistic text-to-speech and voice cloning software.',
    descriptionZh: '目前最逼真的文本转语音（TTS）与语音克隆软件。',
    category: 'audio',
    url: 'https://elevenlabs.io',
    iconUrl: 'https://www.google.com/s2/favicons?domain=elevenlabs.io&sz=128',
    tags: ['tts', 'voice', 'audio']
  },
  {
    id: '7',
    name: 'Canva Magic',
    description: 'AI-powered design tools integrated into the Canva suite.',
    descriptionZh: 'Canva设计套件中集成的智能化AI设计工具。',
    category: 'design',
    url: 'https://www.canva.com',
    iconUrl: 'https://www.google.com/s2/favicons?domain=canva.com&sz=128',
    tags: ['design', 'social media', 'easy']
  },
  {
    id: '8',
    name: 'Notion AI',
    description: 'Write, plan, and get organized with AI right inside Notion.',
    descriptionZh: '直接在Notion中利用AI进行写作、规划和整理。',
    category: 'productivity',
    url: 'https://www.notion.so',
    iconUrl: 'https://www.google.com/s2/favicons?domain=notion.so&sz=128',
    tags: ['notes', 'wiki', 'productivity']
  },
  {
    id: '9',
    name: 'Stable Diffusion',
    description: 'Open source text-to-image model for detailed generation.',
    descriptionZh: '强大的开源文本转图像模型，生成细节丰富。',
    category: 'image',
    url: 'https://stability.ai',
    iconUrl: 'https://www.google.com/s2/favicons?domain=stability.ai&sz=128',
    tags: ['open source', 'image', 'generation']
  },
  {
    id: '10',
    name: 'Synthesia',
    description: 'Create professional AI videos from text in minutes.',
    descriptionZh: '只需输入文本，几分钟内即可生成专业级AI视频。',
    category: 'video',
    url: 'https://www.synthesia.io',
    iconUrl: 'https://www.google.com/s2/favicons?domain=synthesia.io&sz=128',
    tags: ['avatar', 'presentation', 'business']
  },
  {
    id: '11',
    name: 'Claude',
    description: 'Next-generation AI assistant built for work and reliability.',
    descriptionZh: '专为工作场景打造的下一代安全可靠的AI助手。',
    category: 'text',
    url: 'https://claude.ai',
    iconUrl: 'https://www.google.com/s2/favicons?domain=anthropic.com&sz=128',
    tags: ['analysis', 'writing', 'coding']
  },
  {
    id: '12',
    name: 'Framer',
    description: 'Design and publish your dream site with AI.',
    descriptionZh: '利用AI技术设计并发布您梦想中的网站。',
    category: 'design',
    url: 'https://framer.com',
    iconUrl: 'https://www.google.com/s2/favicons?domain=framer.com&sz=128',
    tags: ['website', 'builder', 'no-code']
  },
  {
    id: '13',
    name: 'Suno',
    description: 'Make a song about anything with AI.',
    descriptionZh: '使用AI创作关于任何主题的完整歌曲。',
    category: 'audio',
    url: 'https://suno.ai',
    iconUrl: 'https://www.google.com/s2/favicons?domain=suno.com&sz=128',
    tags: ['music', 'generation', 'creative']
  },
  {
    id: '14',
    name: 'Cursor',
    description: 'The AI code editor built for pair programming.',
    descriptionZh: '专为结对编程体验打造的智能AI代码编辑器。',
    category: 'code',
    url: 'https://cursor.sh',
    iconUrl: 'https://www.google.com/s2/favicons?domain=cursor.com&sz=128',
    tags: ['editor', 'ide', 'developer']
  },
  {
    id: '15',
    name: 'Perplexity',
    description: 'AI-powered search engine for accurate answers.',
    descriptionZh: '能够提供精准答案和来源的AI驱动搜索引擎。',
    category: 'text',
    url: 'https://perplexity.ai',
    iconUrl: 'https://www.google.com/s2/favicons?domain=perplexity.ai&sz=128',
    tags: ['search', 'research', 'answers']
  }
];

export const getIconComponent = (iconName: string) => {
  switch (iconName) {
    case 'Type': return <Type size={18} />;
    case 'Image': return <Image size={18} />;
    case 'Video': return <Video size={18} />;
    case 'Mic': return <Mic size={18} />;
    case 'Code': return <Code size={18} />;
    case 'Megaphone': return <Megaphone size={18} />;
    case 'Briefcase': return <Briefcase size={18} />;
    case 'PenTool': return <PenTool size={18} />;
    default: return <LayoutGrid size={18} />;
  }
};