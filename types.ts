export interface Tool {
  id: string;
  name: string;
  description: string;
  category: CategoryId;
  url: string;
  iconUrl: string;
  tags: string[];
  isFeatured?: boolean;
}

export type CategoryId = 
  | 'all'
  | 'text'
  | 'image'
  | 'video'
  | 'audio'
  | 'code'
  | 'marketing'
  | 'productivity'
  | 'design';

export interface Category {
  id: CategoryId;
  label: string;
  labelZh: string;
  iconName: string;
}

export interface SearchState {
  query: string;
  isSmartSearch: boolean;
  isLoading: boolean;
  results: Tool[];
}