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
  { id: 'all', label: 'All Tools', iconName: 'LayoutGrid' },
  { id: 'text', label: 'AI Writing', iconName: 'Type' },
  { id: 'image', label: 'AI Image', iconName: 'Image' },
  { id: 'video', label: 'AI Video', iconName: 'Video' },
  { id: 'audio', label: 'AI Audio', iconName: 'Mic' },
  { id: 'code', label: 'AI Coding', iconName: 'Code' },
  { id: 'design', label: 'AI Design', iconName: 'PenTool' },
  { id: 'marketing', label: 'Marketing', iconName: 'Megaphone' },
  { id: 'productivity', label: 'Office', iconName: 'Briefcase' },
];

export const MOCK_TOOLS: Tool[] = [
  {
    id: '1',
    name: 'ChatGPT',
    description: 'Advanced conversational AI for writing, coding, and analysis.',
    category: 'text',
    url: 'https://chat.openai.com',
    iconUrl: 'https://picsum.photos/id/237/64/64',
    tags: ['chatbot', 'writing', 'assistant'],
    isFeatured: true
  },
  {
    id: '2',
    name: 'Midjourney',
    description: 'High-quality artistic image generation from text prompts.',
    category: 'image',
    url: 'https://www.midjourney.com',
    iconUrl: 'https://picsum.photos/id/238/64/64',
    tags: ['art', 'generation', 'creative'],
    isFeatured: true
  },
  {
    id: '3',
    name: 'Jasper',
    description: 'AI content creator for marketing teams and blogs.',
    category: 'marketing',
    url: 'https://www.jasper.ai',
    iconUrl: 'https://picsum.photos/id/239/64/64',
    tags: ['copywriting', 'seo', 'blogging']
  },
  {
    id: '4',
    name: 'GitHub Copilot',
    description: 'Your AI pair programmer that helps write better code.',
    category: 'code',
    url: 'https://github.com/features/copilot',
    iconUrl: 'https://picsum.photos/id/240/64/64',
    tags: ['coding', 'developer', 'autocomplete']
  },
  {
    id: '5',
    name: 'Runway',
    description: 'Advanced video editing and generation suite powered by AI.',
    category: 'video',
    url: 'https://runwayml.com',
    iconUrl: 'https://picsum.photos/id/241/64/64',
    tags: ['video editing', 'vfx', 'generation']
  },
  {
    id: '6',
    name: 'ElevenLabs',
    description: 'The most realistic text-to-speech and voice cloning software.',
    category: 'audio',
    url: 'https://elevenlabs.io',
    iconUrl: 'https://picsum.photos/id/242/64/64',
    tags: ['tts', 'voice', 'audio']
  },
  {
    id: '7',
    name: 'Canva Magic',
    description: 'AI-powered design tools integrated into the Canva suite.',
    category: 'design',
    url: 'https://www.canva.com',
    iconUrl: 'https://picsum.photos/id/243/64/64',
    tags: ['design', 'social media', 'easy']
  },
  {
    id: '8',
    name: 'Notion AI',
    description: 'Write, plan, and get organized with AI right inside Notion.',
    category: 'productivity',
    url: 'https://www.notion.so',
    iconUrl: 'https://picsum.photos/id/244/64/64',
    tags: ['notes', 'wiki', 'productivity']
  },
  {
    id: '9',
    name: 'Stable Diffusion',
    description: 'Open source text-to-image model for detailed generation.',
    category: 'image',
    url: 'https://stability.ai',
    iconUrl: 'https://picsum.photos/id/247/64/64',
    tags: ['open source', 'image', 'generation']
  },
  {
    id: '10',
    name: 'Synthesia',
    description: 'Create professional AI videos from text in minutes.',
    category: 'video',
    url: 'https://www.synthesia.io',
    iconUrl: 'https://picsum.photos/id/248/64/64',
    tags: ['avatar', 'presentation', 'business']
  },
  {
    id: '11',
    name: 'Claude',
    description: 'Next-generation AI assistant built for work and reliability.',
    category: 'text',
    url: 'https://claude.ai',
    iconUrl: 'https://picsum.photos/id/249/64/64',
    tags: ['analysis', 'writing', 'coding']
  },
  {
    id: '12',
    name: 'Framer',
    description: 'Design and publish your dream site with AI.',
    category: 'design',
    url: 'https://framer.com',
    iconUrl: 'https://picsum.photos/id/250/64/64',
    tags: ['website', 'builder', 'no-code']
  },
  {
    id: '13',
    name: 'Suno',
    description: 'Make a song about anything with AI.',
    category: 'audio',
    url: 'https://suno.ai',
    iconUrl: 'https://picsum.photos/id/251/64/64',
    tags: ['music', 'generation', 'creative']
  },
  {
    id: '14',
    name: 'Cursor',
    description: 'The AI code editor built for pair programming.',
    category: 'code',
    url: 'https://cursor.sh',
    iconUrl: 'https://picsum.photos/id/252/64/64',
    tags: ['editor', 'ide', 'developer']
  },
  {
    id: '15',
    name: 'Perplexity',
    description: 'AI-powered search engine for accurate answers.',
    category: 'text',
    url: 'https://perplexity.ai',
    iconUrl: 'https://picsum.photos/id/253/64/64',
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