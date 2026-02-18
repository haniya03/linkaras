
import React from 'react';
import { UserProfile } from '../types';
import { THEMES } from '../constants';
import { ThemeId } from '../types';

interface PreviewFrameProps {
  profile: UserProfile;
}

export const PreviewFrame: React.FC<PreviewFrameProps> = ({ profile }) => {
  const theme = THEMES[profile.theme as ThemeId] || THEMES[ThemeId.MINIMAL];

  return (
    <div className="relative w-full max-w-[340px] aspect-[9/19] bg-black rounded-[3rem] p-3 shadow-2xl border-[8px] border-gray-800 ring-4 ring-gray-900 overflow-hidden mx-auto">
      {/* Notch */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 h-6 w-32 bg-gray-800 rounded-b-2xl z-20"></div>
      
      {/* Content Container */}
      <div className={`w-full h-full rounded-[2rem] overflow-y-auto overflow-x-hidden custom-scrollbar ${theme.bgClass}`}>
        <div className="px-6 py-12 flex flex-col items-center text-center">
          {/* Profile Pic */}
          <div className="relative mb-4">
            <div className={`w-24 h-24 rounded-full border-4 border-white shadow-lg overflow-hidden ${!profile.profileImage ? 'bg-gray-200 animate-pulse' : ''}`}>
              {profile.profileImage ? (
                <img src={profile.profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-400">
                  <svg className="w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
            </div>
          </div>

          {/* User Info */}
          <h1 className={`text-xl font-bold font-outfit mb-2 ${theme.textClass}`}>
            {profile.name || '@yourhandle'}
          </h1>
          <p className={`text-sm opacity-80 mb-8 whitespace-pre-wrap leading-relaxed ${theme.textClass}`}>
            {profile.bio || 'Your bio will appear here...'}
          </p>

          {/* Links */}
          <div className="w-full space-y-3">
            {profile.links.map((link) => (
              <a
                key={link.id}
                href={link.url || '#'}
                target="_blank"
                rel="noopener noreferrer"
                className={`block w-full py-3.5 px-6 rounded-2xl text-sm font-semibold transition-transform active:scale-95 text-center ${theme.buttonClass}`}
              >
                {link.title || 'Untitled Link'}
              </a>
            ))}
            
            {profile.links.length === 0 && (
              <div className="py-8 text-xs opacity-40 border-2 border-dashed border-current rounded-2xl">
                No links added yet
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="mt-12 opacity-50 text-[10px] uppercase tracking-widest font-bold">
            Built with LuminaLink
          </div>
        </div>
      </div>
    </div>
  );
};
