
import React from 'react';

interface ThemeToggleProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

const ThemeToggle: React.FC<ThemeToggleProps> = ({ theme, onToggle }) => {
  return (
    <button
      onClick={onToggle}
      aria-label="Toggle Theme"
      className="relative group overflow-hidden rounded-full p-2 bg-white/50 dark:bg-black/50 backdrop-blur-lg border border-gray-200 dark:border-gray-700 shadow-xl transition-all duration-500 hover:scale-110"
      title={theme === 'light' ? 'تفعيل الوضع الليلي' : 'تفعيل وضع النهار'}
    >
      <div className="relative w-10 h-10 flex items-center justify-center">
        
        {/* Sun / Moon Container */}
        <svg 
          className="w-8 h-8 transition-transform duration-700 ease-spring" 
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor"
          style={{
            transform: theme === 'dark' ? 'rotate(40deg)' : 'rotate(90deg)',
          }}
        >
            {/* Mask for Moon Effect */}
            <defs>
                <mask id="moon-mask">
                    <rect x="0" y="0" width="100%" height="100%" fill="white" />
                    <circle 
                        cx="24" 
                        cy="10" 
                        r="6" 
                        fill="black" 
                        className="transition-all duration-700 ease-[cubic-bezier(0.25,1,0.5,1)]"
                        style={{
                            cx: theme === 'dark' ? '12' : '24',
                            cy: theme === 'dark' ? '4' : '10',
                        }} 
                    />
                </mask>
            </defs>

            {/* Center Circle (Sun or Moon body) */}
            <circle 
                cx="12" 
                cy="12" 
                r="6" 
                mask="url(#moon-mask)" 
                className={`transition-colors duration-500 ${theme === 'dark' ? 'fill-white text-white' : 'fill-yellow-500 text-yellow-500'}`}
            />
            
            {/* Sun Rays (Only visible in Light mode) */}
            <g className={`origin-center transition-opacity duration-500 ${theme === 'dark' ? 'opacity-0' : 'opacity-100'}`}>
                <line x1="12" y1="1" x2="12" y2="3" strokeWidth="2" className="text-yellow-500" />
                <line x1="12" y1="21" x2="12" y2="23" strokeWidth="2" className="text-yellow-500" />
                <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" strokeWidth="2" className="text-yellow-500" />
                <line x1="18.36" y1="18.36" x2="19.78" y2="19.78" strokeWidth="2" className="text-yellow-500" />
                <line x1="1" y1="12" x2="3" y2="12" strokeWidth="2" className="text-yellow-500" />
                <line x1="21" y1="12" x2="23" y2="12" strokeWidth="2" className="text-yellow-500" />
                <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" strokeWidth="2" className="text-yellow-500" />
                <line x1="18.36" y1="5.64" x2="19.78" y2="4.22" strokeWidth="2" className="text-yellow-500" />
            </g>
            
            {/* Stars (Only visible in Dark mode) */}
             <g className={`transition-opacity duration-700 ${theme === 'dark' ? 'opacity-100' : 'opacity-0'}`}>
                 <circle cx="18" cy="6" r="1" fill="white" className="animate-pulse" />
                 <circle cx="6" cy="18" r="1" fill="white" className="animate-pulse delay-75" />
                 <circle cx="19" cy="15" r="0.5" fill="white" />
             </g>
        </svg>
      </div>
      <style>{`
        .ease-spring {
            transition-timing-function: cubic-bezier(0.175, 0.885, 0.32, 1.275);
        }
      `}</style>
    </button>
  );
};

export default ThemeToggle;
