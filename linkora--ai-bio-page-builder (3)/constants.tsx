
import { ThemeConfig, ThemeId } from './types';

export const THEMES: Record<ThemeId, ThemeConfig> = {
  [ThemeId.NEON]: {
    id: ThemeId.NEON,
    name: 'Cyber Neon',
    bgClass: 'bg-slate-950 bg-[radial-gradient(circle_at_50%_120%,rgba(120,0,255,0.15),rgba(0,0,0,0))]',
    cardClass: 'bg-slate-900/80 backdrop-blur-md border border-purple-500/30 shadow-[0_0_20px_rgba(168,85,247,0.1)]',
    buttonClass: 'bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white shadow-lg shadow-purple-500/20',
    textClass: 'text-white',
    accentColor: '#A855F7'
  },
  [ThemeId.MINIMAL]: {
    id: ThemeId.MINIMAL,
    name: 'Pure Minimal',
    bgClass: 'bg-white',
    cardClass: 'bg-white border border-gray-100 shadow-sm',
    buttonClass: 'bg-black hover:bg-gray-800 text-white',
    textClass: 'text-gray-900',
    accentColor: '#000000'
  },
  [ThemeId.RETRO]: {
    id: ThemeId.RETRO,
    name: '80s Retro',
    bgClass: 'bg-pink-50',
    cardClass: 'bg-white border-4 border-black shadow-[8px_8px_0px_0px_rgba(0,0,0,1)]',
    buttonClass: 'bg-yellow-400 hover:bg-yellow-300 text-black border-2 border-black font-bold uppercase tracking-wider',
    textClass: 'text-black',
    accentColor: '#FACC15'
  },
  [ThemeId.SOLAR]: {
    id: ThemeId.SOLAR,
    name: 'Desert Solar',
    bgClass: 'bg-orange-50',
    cardClass: 'bg-white/80 border border-orange-200',
    buttonClass: 'bg-orange-500 hover:bg-orange-600 text-white',
    textClass: 'text-orange-950',
    accentColor: '#F97316'
  },
  [ThemeId.GLASS]: {
    id: ThemeId.GLASS,
    name: 'Glassmorphism',
    bgClass: 'bg-gradient-to-br from-indigo-500 via-purple-500 to-pink-500',
    cardClass: 'bg-white/20 backdrop-blur-xl border border-white/30 shadow-2xl',
    buttonClass: 'bg-white/30 hover:bg-white/40 text-white border border-white/50 backdrop-blur-sm',
    textClass: 'text-white',
    accentColor: '#FFFFFF'
  }
};
