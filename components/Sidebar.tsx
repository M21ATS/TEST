
import React from 'react';
import { sectionToc } from '../constants/bookData';

interface SidebarProps {
  activeSectionId: string;
  bookmarkedPages: number[];
  onNavigate: (sectionId: string) => void;
  onNavigateToPage: (page: number) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeSectionId, bookmarkedPages, onNavigate, onNavigateToPage }) => {
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, sectionId: string) => {
    e.preventDefault();
    onNavigate(sectionId);
  };
  
  return (
    <nav className="w-full h-full flex flex-col gap-4">
        
        {/* Saved Pages Section */}
        {bookmarkedPages.length > 0 && (
            <div className="bg-yellow-50/50 dark:bg-yellow-900/10 rounded-xl p-3 border border-yellow-100 dark:border-yellow-900/20 mb-2">
                <h3 className="text-xs font-bold text-yellow-600 dark:text-yellow-500 uppercase tracking-wider mb-2 px-1 flex items-center gap-2">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                        <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z" />
                    </svg>
                    الصفحات المحفوظة
                </h3>
                <ul className="grid grid-cols-4 gap-2">
                    {bookmarkedPages.map(page => (
                        <li key={page}>
                            <button 
                                onClick={() => onNavigateToPage(page)}
                                className="w-full aspect-square flex items-center justify-center rounded-lg text-sm font-mono font-bold
                                    bg-white dark:bg-gray-800 text-yellow-600 dark:text-yellow-500 
                                    hover:bg-yellow-500 hover:text-white dark:hover:bg-yellow-600 
                                    border border-yellow-200 dark:border-yellow-800/50 transition-all duration-200"
                                title={`الذهاب لصفحة ${page}`}
                            >
                                {page}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {/* Table of Contents */}
        <div>
            <h3 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-2 px-3">الفهرس</h3>
            <ul>
            {sectionToc && sectionToc.map((item) => {
                const isActive = activeSectionId === item.id;
                return (
                <li key={item.id} className="mb-1">
                    <a
                    href={`#${item.id}`}
                    onClick={(e) => handleNavClick(e, item.id)}
                    className={`block px-3 py-2 rounded-xl transition-all duration-200 text-sm md:text-base group relative overflow-hidden
                        ${isActive 
                        ? 'bg-blue-500/10 text-blue-700 dark:text-blue-300 font-bold' 
                        : 'text-gray-600 dark:text-gray-400 hover:bg-gray-100/50 dark:hover:bg-gray-800/50 hover:text-gray-900 dark:hover:text-white'
                        }`}
                    >
                    {/* Active Indicator */}
                    {isActive && (
                        <div className="absolute left-0 top-0 bottom-0 w-1 bg-blue-500 rounded-r-full"></div>
                    )}

                    <div className="flex justify-between items-center">
                        <div className="flex items-center gap-2">
                            <span className="truncate">{item.title}</span>
                        </div>
                        <span className={`text-xs font-mono ${isActive ? 'opacity-100' : 'opacity-50 group-hover:opacity-80'}`}>
                            {item.pageLabel}
                        </span>
                    </div>
                    </a>
                </li>
                );
            })}
            </ul>
        </div>
    </nav>
  );
};

export default Sidebar;
