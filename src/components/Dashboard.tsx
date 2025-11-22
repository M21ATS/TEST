
import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { CourseModule } from '../types';
import { getCourseStructure } from '../utils/dataMapper';
import ThemeToggle from './ThemeToggle';
import { useLanguage } from '../contexts/LanguageContext';

interface DashboardProps {
  onModuleSelect: (module: CourseModule) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  LanguageToggle: React.FC;
}

const Dashboard: React.FC<DashboardProps> = ({ onModuleSelect, theme, onToggleTheme, LanguageToggle }) => {
  const { user, progress, logout } = useAuth();
  const { t } = useLanguage();
  const modules = getCourseStructure(progress);
  
  const totalModules = modules.length;
  const completed = modules.filter(m => m.status === 'completed').length;
  const percentage = Math.round((completed / totalModules) * 100);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-white p-4 md:p-8 pb-24">
        <header className="flex flex-col-reverse gap-4 md:flex-row justify-between items-center mb-10 max-w-6xl mx-auto">
            <div className="flex items-center gap-4 w-full md:w-auto glass-panel px-6 py-3 rounded-3xl animate-pop">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center text-xl font-bold text-white shrink-0 shadow-lg border border-white/20">
                    {user?.name.charAt(0)}
                </div>
                <div>
                    <h1 className="text-xl md:text-2xl font-bold truncate">{t('dashboard.welcome')} {user?.name}</h1>
                    <p className="text-gray-500 dark:text-gray-400 text-sm">{t('dashboard.subtitle')}</p>
                </div>
            </div>
            
            <div className="flex items-center gap-3 w-full md:w-auto justify-end">
                <LanguageToggle />
                <ThemeToggle theme={theme} onToggle={onToggleTheme} />
                <button onClick={logout} className="btn-liquid-secondary px-6 py-3 rounded-2xl text-sm font-bold whitespace-nowrap flex items-center gap-2 group">
                    <svg className="w-4 h-4 transition-transform group-active:-translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" /></svg>
                    {t('dashboard.logout')}
                </button>
            </div>
        </header>

        <div className="max-w-6xl mx-auto glass-panel bg-white/80 dark:bg-gray-800/80 rounded-3xl p-8 shadow-xl mb-12 border border-white/50 dark:border-white/10 relative overflow-hidden animate-pop" style={{animationDelay: '0.1s'}}>
            <div className="absolute top-0 left-0 w-full h-1 bg-gray-200 dark:bg-gray-700">
                <div className="h-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-1000 shadow-[0_0_10px_rgba(59,130,246,0.5)]" style={{ width: `${percentage}%` }}></div>
            </div>
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <h2 className="text-2xl font-bold mb-2 bg-clip-text text-transparent bg-gradient-to-r from-gray-900 to-gray-600 dark:from-white dark:to-gray-300">{t('dashboard.progressTitle')}</h2>
                    <p className="text-gray-500 dark:text-gray-400 text-lg">{t('dashboard.progressText', { completed, total: totalModules })}</p>
                </div>
                <div className="flex items-center gap-4">
                    <div className="relative w-24 h-24">
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="currentColor" strokeWidth="3" strokeDasharray="100, 100" className="text-gray-200 dark:text-gray-700"/>
                            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="url(#progressGradient)" strokeWidth="3" strokeDasharray={`${percentage}, 100`} className="animate-[dash_1s_ease-out] drop-shadow-md" strokeLinecap="round"/>
                            <defs><linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#a855f7" /></linearGradient></defs>
                        </svg>
                        <div className="absolute inset-0 flex items-center justify-center font-bold text-xl text-gray-800 dark:text-white">{percentage}%</div>
                    </div>
                </div>
            </div>
        </div>

        <div className="max-w-4xl mx-auto space-y-8 relative">
            <div className="absolute right-[2rem] md:right-[50%] top-0 bottom-0 w-1 bg-gray-200 dark:bg-gray-800 transform md:translate-x-1/2 z-0 rounded-full"></div>
            {modules.map((module, index) => {
                const isLocked = module.status === 'locked';
                const isCompleted = module.status === 'completed';
                return (
                    <div key={module.id} className="relative z-10 animate-pop" style={{animationDelay: `${0.2 + (index * 0.1)}s`}}>
                        <div className={`group flex flex-col md:flex-row items-center gap-6 md:gap-12 transition-all duration-500 ${isLocked ? 'opacity-60 grayscale' : 'opacity-100'}`}>
                            <div className={`w-16 h-16 rounded-full flex-shrink-0 flex items-center justify-center border-4 shadow-xl transition-all duration-300 z-20 ${isCompleted ? 'bg-green-500 border-green-200 text-white scale-110' : isLocked ? 'bg-gray-200 dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-400' : 'bg-white dark:bg-gray-800 border-blue-500 text-blue-600 animate-pulse-slow'}`}>
                                {isCompleted ? <svg className="h-8 w-8" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg> : isLocked ? <svg className="h-6 w-6" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" /></svg> : <span className="text-2xl font-bold">{index + 1}</span>}
                            </div>
                            <button onClick={() => !isLocked && onModuleSelect(module)} disabled={isLocked} className={`flex-1 w-full glass-panel p-6 rounded-3xl transition-all duration-300 relative overflow-hidden ${isLocked ? 'cursor-not-allowed bg-gray-50/50 dark:bg-gray-900/50' : 'bg-white/90 dark:bg-gray-800/90 hover:shadow-[0_20px_50px_-12px_rgba(0,0,0,0.2)] transform hover:-translate-y-2 cursor-pointer'} text-start`}>
                                <div className="flex justify-between items-start mb-2">
                                    <h3 className="text-xl font-bold text-gray-900 dark:text-white">{module.title}</h3>
                                    <span className={`text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wide ${isCompleted ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' : isLocked ? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400' : 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                                        {isCompleted ? t('dashboard.status.completed') : isLocked ? t('dashboard.status.locked') : t('dashboard.status.available')}
                                    </span>
                                </div>
                                <div className="flex items-center justify-between mt-6">
                                    {isCompleted && module.quiz ? <span className="text-sm font-medium text-gray-500 dark:text-gray-400 flex items-center gap-1"><span>⭐</span> {t('dashboard.quizResult')}: {progress.quizScores[module.id] || 0}%</span> : <span></span>}
                                    {!isLocked && !isCompleted && (
                                        <div className="btn-liquid-primary px-5 py-2 rounded-xl text-sm font-bold flex items-center gap-2 group-hover:scale-105 transition-transform">
                                            {t('dashboard.startLearning')}
                                            <svg className="w-4 h-4 transform rotate-180 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" /></svg>
                                        </div>
                                    )}
                                </div>
                            </button>
                        </div>
                    </div>
                );
            })}
        </div>
    </div>
  );
};

export default Dashboard;
