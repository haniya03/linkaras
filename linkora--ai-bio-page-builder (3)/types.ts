
export interface LinkItem {
  id: string;
  title: string;
  url: string;
  icon?: string;
}

export interface ThemeConfig {
  id: string;
  name: string;
  bgClass: string;
  cardClass: string;
  buttonClass: string;
  textClass: string;
  accentColor: string;
}

export interface UserProfile {
  name: string;
  bio: string;
  profileImage: string | null;
  links: LinkItem[];
  theme: string;
}

export enum ThemeId {
  NEON = 'neon',
  MINIMAL = 'minimal',
  RETRO = 'retro',
  SOLAR = 'solar',
  GLASS = 'glass'
}
