
import React, { useState, useEffect, useRef } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { LanguageProvider, useLanguage } from './contexts/LanguageContext';
import { LoginView, SignupView } from './components/AuthViews';
import Dashboard from './components/Dashboard';
import BookPage from './components/BookPage';
import QuizView from './components/QuizView';
import ThemeToggle from './components/ThemeToggle';
import { CourseModule, ContentItem } from './types';
import Hero from './components/Hero';
import { GoogleGenAI, Modality } from "@google/genai";
import { getCourseStructure } from './utils/dataMapper';

// --- Helper to extract text from content for TTS ---
const extractTextFromPage = (content: ContentItem[]): string => {
    let text = "";
    content.forEach(item => {
        if (item.text) text += item.text + ". ";
        if (item.items) text += item.items.join(". ") + ". ";
        if (item.content) text += extractTextFromPage(item.content);
    });
    return text;
};

// --- Smart Segmentation for Real-Time Streaming ---
const segmentTextForStreaming = (fullText: string): string[] => {
    const rawSegments = fullText.split(/([.!?։]+)/).reduce((acc: string[], curr, idx, arr) => {
        if (idx % 2 === 0) {
             const nextChar = arr[idx + 1] || "";
             if (curr.trim()) acc.push(curr.trim() + nextChar);
        }
        return acc;
    }, []);

    const finalSegments: string[] = [];
    let buffer = "";

    rawSegments.forEach((seg, index) => {
        if (index === 0) {
            finalSegments.push(seg);
        } else {
            if ((buffer + seg).length < 200) {
                buffer += " " + seg;
            } else {
                finalSegments.push(buffer.trim());
                buffer = seg;
            }
        }
    });
    if (buffer.trim()) finalSegments.push(buffer.trim());

    return finalSegments.length > 0 ? finalSegments : [fullText];
};

// --- Main App Controller ---

const AppContent: React.FC = () => {
  const { user, loading, progress, updateProgress } = useAuth();
  const { t, language, setLanguage } = useLanguage();
  const [currentView, setCurrentView] = useState<'landing' | 'auth' | 'dashboard' | 'player'>('landing');
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [activeModule, setActiveModule] = useState<CourseModule | null>(null);
  const [hasChosenLanguage, setHasChosenLanguage] = useState(false);
  
  // Player State
  const [currentUnitIndex, setCurrentUnitIndex] = useState(0);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => (localStorage.getItem('theme') as 'light' | 'dark') || 'light');
  const [showQuiz, setShowQuiz] = useState(false);
  const [isReadingMode, setIsReadingMode] = useState(false);
  const [fontSizeLevel, setFontSizeLevel] = useState(2);
  const [showMobileSettings, setShowMobileSettings] = useState(false);

  // Refs
  const parallaxRef1 = useRef<HTMLDivElement>(null);
  const parallaxRef2 = useRef<HTMLDivElement>(null);
  const mainContentRef = useRef<HTMLElement>(null);

  // TTS State
  const [playingAudioPage, setPlayingAudioPage] = useState<number | null>(null);
  const [generatingPageId, setGeneratingPageId] = useState<number | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const activeSourcesRef = useRef<AudioBufferSourceNode[]>([]);
  const audioRequestIdRef = useRef<number>(0);
  const nextStartTimeRef = useRef<number>(0);

  // Sidebar State
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  useEffect(() => {
    if (!loading) {
      if (user) {
        if (currentView === 'landing' || currentView === 'auth') {
           setCurrentView('dashboard');
           setHasChosenLanguage(true); // If logged in, skip lang check
        }
      } else {
        if (currentView === 'dashboard' || currentView === 'player') {
           setCurrentView('landing');
        }
      }
    }
  }, [user, loading, currentView]);

  // Audio Functions
  function decodeAudioData(base64: string): Uint8Array {
      const binaryString = atob(base64);
      const len = binaryString.length;
      const bytes = new Uint8Array(len);
      for (let i = 0; i < len; i++) bytes[i] = binaryString.charCodeAt(i);
      return bytes;
  }

  async function createAudioBuffer(data: Uint8Array, ctx: AudioContext): Promise<AudioBuffer> {
      const dataInt16 = new Int16Array(data.buffer);
      const frameCount = dataInt16.length;
      const buffer = ctx.createBuffer(1, frameCount, 24000);
      const channelData = buffer.getChannelData(0);
      for (let i = 0; i < frameCount; i++) channelData[i] = dataInt16[i] / 32768.0;
      return buffer;
  }

  const stopAudio = () => {
      activeSourcesRef.current.forEach(source => {
          try { source.stop(); } catch(e) {}
      });
      activeSourcesRef.current = [];
      setPlayingAudioPage(null);
      setGeneratingPageId(null);
      audioRequestIdRef.current = 0;
  };

  const handlePlayAudio = async () => {
    if (!process.env.API_KEY) {
        alert("API Key is missing. Please check Netlify environment variables.");
        return;
    }
    if (!activeModule) return;
    const currentPage = activeModule.pages[currentUnitIndex];
    const pageId = currentPage.pageNumber;
    
    if (playingAudioPage === pageId || generatingPageId === pageId) {
        stopAudio();
        return;
    }
    stopAudio();

    const fullText = extractTextFromPage(currentPage.content);
    if (!fullText || fullText.trim().length === 0) return;

    const currentRequestId = Date.now();
    audioRequestIdRef.current = currentRequestId;
    setGeneratingPageId(pageId); 

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        if (!audioContextRef.current) audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
        if (audioContextRef.current.state === 'suspended') await audioContextRef.current.resume();
        nextStartTimeRef.current = audioContextRef.current.currentTime + 0.1;

        const segments = segmentTextForStreaming(fullText);
        setPlayingAudioPage(pageId);

        for (let i = 0; i < segments.length; i++) {
            if (audioRequestIdRef.current !== currentRequestId) break;
            const segmentText = segments[i];
            const response = await ai.models.generateContent({
                model: "gemini-2.5-flash-preview-tts",
                contents: [{ parts: [{ text: segmentText }] }],
                config: {
                    responseModalities: [Modality.AUDIO],
                    speechConfig: { voiceConfig: { prebuiltVoiceConfig: { voiceName: 'Zephyr' } } },
                },
            });
            if (audioRequestIdRef.current !== currentRequestId) break;
            const base64 = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
            if (base64) {
                setGeneratingPageId(null);
                const audioData = decodeAudioData(base64);
                const audioBuffer = await createAudioBuffer(audioData, audioContextRef.current);
                const source = audioContextRef.current.createBufferSource();
                source.buffer = audioBuffer;
                source.connect(audioContextRef.current.destination);
                const scheduleTime = Math.max(audioContextRef.current.currentTime, nextStartTimeRef.current);
                source.start(scheduleTime);
                nextStartTimeRef.current = scheduleTime + audioBuffer.duration;
                activeSourcesRef.current.push(source);
                source.onended = () => {
                     const index = activeSourcesRef.current.indexOf(source);
                     if (index > -1) activeSourcesRef.current.splice(index, 1);
                     if (i === segments.length - 1 && activeSourcesRef.current.length === 0) {
                         setPlayingAudioPage(null);
                     }
                };
            }
        }
    } catch (error) {
        console.error("TTS Error", error);
        stopAudio();
    } finally {
        if (audioRequestIdRef.current === currentRequestId) {
            setGeneratingPageId(null);
        }
    }
  };

  const scrollToTop = () => {
      if (mainContentRef.current) {
          mainContentRef.current.scrollTo({ top: 0, behavior: 'auto' });
      } else {
          window.scrollTo({ top: 0, behavior: 'auto' });
      }
  };

  const handleModuleSelect = (module: CourseModule) => {
      setActiveModule(module);
      setCurrentUnitIndex(0);
      setShowQuiz(false);
      setIsReadingMode(false);
      setCurrentView('player');
      setShowMobileSettings(false);
      setTimeout(scrollToTop, 50);
  };

  const handleNextUnit = () => {
      if (!activeModule) return;
      stopAudio();
      if (currentUnitIndex < activeModule.pages.length - 1) {
          setCurrentUnitIndex(prev => prev + 1);
          scrollToTop();
      } else {
          if (activeModule.quiz) {
              setShowQuiz(true);
              scrollToTop();
          } else {
              updateProgress(activeModule.id);
              handleNextModuleNavigation();
          }
      }
  };

  const handlePrevUnit = () => {
      stopAudio();
      if (showQuiz) {
          setShowQuiz(false);
          scrollToTop();
      } else if (currentUnitIndex > 0) {
          setCurrentUnitIndex(prev => prev - 1);
          scrollToTop();
      } else {
          handlePrevModuleNavigation();
      }
  };

  const handleNextModuleNavigation = () => {
      stopAudio();
      if (!activeModule) return;
      const modules = getCourseStructure(progress);
      const currentIndex = modules.findIndex(m => m.id === activeModule.id);
      if (currentIndex !== -1 && currentIndex < modules.length - 1) {
          const nextMod = modules[currentIndex + 1];
          setActiveModule(nextMod);
          setCurrentUnitIndex(0);
          setShowQuiz(false);
          scrollToTop();
      } else {
          setCurrentView('dashboard');
      }
  };

  const handlePrevModuleNavigation = () => {
      stopAudio();
      if (!activeModule) return;
      const modules = getCourseStructure(progress);
      const currentIndex = modules.findIndex(m => m.id === activeModule.id);
      if (currentIndex > 0) {
          const prevMod = modules[currentIndex - 1];
          setActiveModule(prevMod);
          setCurrentUnitIndex(prevMod.pages.length - 1);
          setShowQuiz(false); 
          scrollToTop();
      }
  };

  const handleQuizComplete = (score: number) => {
      if (activeModule && score >= 60) {
          updateProgress(activeModule.id, score);
      }
  };

  const handleBackToDashboard = () => {
      stopAudio();
      setCurrentView('dashboard');
      setActiveModule(null);
      setIsSidebarOpen(false);
  };
  
  const handlePlayerScroll = (e: React.UIEvent<HTMLElement>) => {
      const scrollTop = e.currentTarget.scrollTop;
      requestAnimationFrame(() => {
          if (parallaxRef1.current) {
              parallaxRef1.current.style.transform = `translateY(${scrollTop * 0.2}px) rotate(${scrollTop * 0.01}deg)`; 
          }
          if (parallaxRef2.current) {
              parallaxRef2.current.style.transform = `translateY(${scrollTop * 0.1}px) rotate(-${scrollTop * 0.01}deg)`;
          }
      });
  };

  const getFontStyles = (level: number) => {
    const styles = {
        1: { base: 'text-base leading-loose', h1: 'text-3xl md:text-4xl', h2: 'text-2xl md:text-3xl', h3: 'text-xl', h4: 'text-lg' },
        2: { base: 'text-lg md:text-xl leading-[2.2]', h1: 'text-4xl md:text-6xl', h2: 'text-3xl md:text-4xl', h3: 'text-2xl', h4: 'text-xl' },
        3: { base: 'text-xl md:text-2xl leading-[2.3]', h1: 'text-5xl md:text-7xl', h2: 'text-4xl md:text-5xl', h3: 'text-3xl', h4: 'text-2xl' },
        4: { base: 'text-2xl md:text-3xl leading-[2.4]', h1: 'text-6xl md:text-8xl', h2: 'text-5xl md:text-6xl', h3: 'text-4xl', h4: 'text-3xl' },
        5: { base: 'text-3xl md:text-4xl leading-[2.5]', h1: 'text-7xl md:text-9xl', h2: 'text-6xl md:text-7xl', h3: 'text-5xl', h4: 'text-4xl' }
    };
    return styles[level as keyof typeof styles] || styles[2];
  };
  const activeFontStyles = getFontStyles(fontSizeLevel);
  const increaseFontSize = () => setFontSizeLevel(prev => Math.min(prev + 1, 5));
  const decreaseFontSize = () => setFontSizeLevel(prev => Math.max(prev - 1, 1));

  // Shared Toggle Component
  const LanguageToggle = () => (
    <button 
        onClick={() => setLanguage(language === 'ar' ? 'en' : 'ar')}
        className="btn-glass-icon px-3 h-10 text-sm font-bold flex items-center justify-center shadow-md hover:shadow-lg gap-1"
    >
        {language === 'ar' ? 'English' : 'العربية'}
    </button>
  );

  if (loading) {
      return <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900"><div className="animate-spin h-12 w-12 border-4 border-blue-500 rounded-full border-t-transparent"></div></div>;
  }

  // Language Selection Screen (First Visit)
  if (!user && !hasChosenLanguage) {
      return (
          <div className="min-h-screen fixed inset-0 z-[100] flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-900 text-center p-4 animate-fade-in">
              <div className="glass-panel p-10 rounded-[3rem] shadow-2xl max-w-md w-full border border-white/20 flex flex-col items-center bg-white/90 dark:bg-black/90 backdrop-blur-2xl">
                  <h1 className="text-3xl font-black mb-8 text-gray-900 dark:text-white">
                      Choose Language <br/> اختر اللغة
                  </h1>
                  <div className="flex flex-col gap-4 w-full">
                      <button 
                        onClick={() => { setLanguage('ar'); setHasChosenLanguage(true); }}
                        className="btn-liquid-primary py-4 px-8 rounded-2xl text-xl font-bold w-full hover:scale-105 transition-transform flex justify-center items-center gap-2"
                      >
                        <span>🇸🇦</span> العربية
                      </button>
                      <button 
                        onClick={() => { setLanguage('en'); setHasChosenLanguage(true); }}
                        className="btn-liquid-secondary py-4 px-8 rounded-2xl text-xl font-bold w-full hover:scale-105 transition-transform flex justify-center items-center gap-2"
                      >
                        <span>🇺🇸</span> English
                      </button>
                  </div>
              </div>
          </div>
      )
  }

  // Common Header Controls used in Landing and Auth - Fixed to Top Left/Right
  const FloatingControls = () => (
    <div className="fixed top-5 left-5 z-[100] flex gap-3 animate-pop">
         <LanguageToggle />
         <ThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} />
    </div>
  );

  // Landing View
  if (currentView === 'landing') {
      return (
          <div className="min-h-screen bg-gray-50 dark:bg-gray-900 relative transition-colors duration-700 text-gray-900 dark:text-white">
             <FloatingControls />
             <div className="max-w-4xl mx-auto pt-20 px-4 pb-10 flex flex-col gap-8">
                 <Hero />
                 <div className="flex justify-center gap-6">
                     <button onClick={() => { setAuthMode('login'); setCurrentView('auth'); }} className="btn-liquid-primary px-10 py-5 rounded-3xl font-bold text-xl min-w-[180px]">{t('landing.login')}</button>
                     <button onClick={() => { setAuthMode('signup'); setCurrentView('auth'); }} className="btn-liquid-secondary px-10 py-5 rounded-3xl font-bold text-xl min-w-[180px]">{t('landing.signup')}</button>
                 </div>
             </div>
          </div>
      );
  }

  // Auth View - Now includes FloatingControls
  if (currentView === 'auth') {
      return (
          <div className="relative">
              <FloatingControls />
              {authMode === 'login' 
                ? <LoginView onViewChange={(v) => v === 'landing' ? setCurrentView('landing') : setAuthMode(v as any)} /> 
                : <SignupView onViewChange={(v) => v === 'landing' ? setCurrentView('landing') : setAuthMode(v as any)} />
              }
          </div>
      );
  }

  // Dashboard View
  if (currentView === 'dashboard') {
      return (
        <div className="relative transition-colors duration-700 text-gray-900 dark:text-white">
            <Dashboard 
              onModuleSelect={handleModuleSelect} 
              theme={theme}
              onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')}
              LanguageToggle={LanguageToggle}
            />
        </div>
      );
  }

  // Player View
  if (currentView === 'player' && activeModule) {
      const currentPage = activeModule.pages[currentUnitIndex];
      const isLastPage = currentUnitIndex === activeModule.pages.length - 1;
      
      const modules = getCourseStructure(progress);
      const modIndex = modules.findIndex(m => m.id === activeModule.id);
      const isFirstModule = modIndex === 0;
      const canGoBack = showQuiz || currentUnitIndex > 0 || !isFirstModule;
      const isAudioLoading = generatingPageId === currentPage.pageNumber;
      const isAudioPlaying = playingAudioPage === currentPage.pageNumber;

      return (
          <div className="flex h-screen bg-gray-50 dark:bg-black transition-colors duration-700 overflow-hidden text-gray-900 dark:text-white">
              {!isReadingMode && (
                  <aside className="hidden md:block w-80 bg-white/80 dark:bg-gray-900/80 border-r border-gray-200 dark:border-gray-800 h-full overflow-hidden flex-shrink-0 z-20 shadow-2xl backdrop-blur-lg transition-all duration-500">
                      <div className="h-20 flex items-center justify-between px-6 border-b border-gray-100 dark:border-gray-800">
                          <button onClick={handleBackToDashboard} className="btn-glass-icon px-4 py-2 w-full rounded-xl flex items-center justify-center gap-2 text-sm font-bold">
                              <div className="p-1 rounded-full bg-gray-200 dark:bg-gray-700">
                                <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
                              </div>
                              {t('player.exit')}
                          </button>
                      </div>
                      <div className="h-full overflow-y-auto p-4">
                          <h3 className="text-sm font-bold text-gray-500 dark:text-gray-400 mb-4 uppercase tracking-wider">{t('player.contents')}</h3>
                          <ul className="space-y-3">
                              {activeModule.pages.map((p, idx) => (
                                  <li key={idx}>
                                      <button 
                                         onClick={() => { setCurrentUnitIndex(idx); setShowQuiz(false); setIsSidebarOpen(false); scrollToTop(); }}
                                         className={`w-full text-start px-4 py-4 rounded-2xl text-sm font-medium transition-all duration-300 border border-transparent
                                            ${currentUnitIndex === idx && !showQuiz 
                                                ? 'bg-blue-600 text-white shadow-lg transform scale-105' 
                                                : 'bg-gray-50 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-gray-700 hover:shadow-md'}
                                         `}
                                      >
                                         {p.content.find(c => c.type === 'heading')?.text || `${t('player.page')} ${idx + 1}`}
                                      </button>
                                  </li>
                              ))}
                              {activeModule.quiz && (
                                  <li>
                                      <button 
                                         onClick={() => { setShowQuiz(true); setIsSidebarOpen(false); scrollToTop(); }}
                                         className={`w-full text-start px-4 py-4 rounded-2xl text-sm font-bold transition-all duration-300 flex items-center gap-2 border border-transparent
                                            ${showQuiz ? 'bg-purple-600 text-white shadow-lg transform scale-105' : 'bg-purple-50 dark:bg-purple-900/20 text-purple-600 dark:text-purple-300 hover:bg-purple-100'}
                                         `}
                                      >
                                         <span>📝</span> {t('player.quiz')}
                                      </button>
                                  </li>
                              )}
                          </ul>
                      </div>
                  </aside>
              )}

              <div className="flex-1 flex flex-col h-full relative overflow-hidden">
                  <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
                      <div ref={parallaxRef1} className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-blue-400/10 dark:bg-blue-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px]"></div>
                      <div ref={parallaxRef2} className="absolute bottom-[-20%] left-[-10%] w-[500px] h-[500px] bg-purple-400/10 dark:bg-purple-600/10 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-[80px]"></div>
                  </div>

                  <header className="h-16 md:h-20 bg-white/80 dark:bg-gray-900/80 backdrop-blur-md border-b border-gray-200 dark:border-gray-800 flex items-center justify-between px-4 z-30 sticky top-0 shadow-sm transition-all">
                      <div className="flex items-center gap-3 md:gap-4">
                          {!isReadingMode && (
                              <button onClick={() => setIsSidebarOpen(true)} className="md:hidden btn-glass-icon w-10 h-10 active:scale-90 transition-transform">
                                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" /></svg>
                              </button>
                          )}
                          <h2 className="font-bold text-base md:text-xl text-gray-900 dark:text-white truncate max-w-[150px] md:max-w-none leading-tight">{activeModule.title}</h2>
                      </div>

                      <div className="flex items-center gap-2 md:gap-3">
                          <button onClick={handlePlayAudio} disabled={isAudioLoading} className={`btn-glass-icon w-10 h-10 rounded-full ${isAudioPlaying ? 'bg-red-50/80 text-red-500 border-red-200 shadow-[0_0_15px_rgba(239,68,68,0.4)]' : ''}`}>
                              {isAudioLoading ? <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div> : isAudioPlaying ? (
                                  <div className="flex items-end gap-0.5 h-4"><div className="w-1 bg-red-500 rounded-full animate-[pulse_0.6s_infinite]" style={{height: '40%'}}></div><div className="w-1 bg-red-500 rounded-full animate-[pulse_0.6s_infinite_0.2s]" style={{height: '100%'}}></div><div className="w-1 bg-red-500 rounded-full animate-[pulse_0.6s_infinite_0.4s]" style={{height: '60%'}}></div></div>
                              ) : (
                                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                              )}
                          </button>

                          <div className="hidden md:flex items-center gap-3">
                               <button onClick={() => setIsReadingMode(!isReadingMode)} className={`btn-glass-icon w-10 h-10 group ${isReadingMode ? 'bg-blue-50 dark:bg-blue-900/40 text-blue-600' : ''}`}>
                                   <div className="relative w-6 h-6">
                                       <svg className={`w-6 h-6 absolute top-0 left-0 transition-all duration-500 ${isReadingMode ? 'opacity-0 scale-75 rotate-90' : 'opacity-100 scale-100 rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" /></svg>
                                       <svg className={`w-6 h-6 absolute top-0 left-0 transition-all duration-500 ${!isReadingMode ? 'opacity-0 scale-75 -rotate-90' : 'opacity-100 scale-100 rotate-0'}`} fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" /></svg>
                                   </div>
                               </button>
                               <div className="flex items-center gap-2 bg-white/50 dark:bg-gray-800/50 rounded-2xl p-1.5 border border-white/30 dark:border-gray-700 backdrop-blur-md">
                                  <button onClick={decreaseFontSize} disabled={fontSizeLevel <= 1} className="btn-glass-icon w-9 h-9 group rounded-xl"><span className="text-xs font-black">A-</span></button>
                                  <span className="w-6 text-center text-xs font-black text-gray-600 dark:text-gray-300">A</span>
                                  <button onClick={increaseFontSize} disabled={fontSizeLevel >= 5} className="btn-glass-icon w-9 h-9 group rounded-xl"><span className="text-xs font-black">A+</span></button>
                               </div>
                              <ThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} />
                              <LanguageToggle />
                          </div>
                          <button onClick={() => setShowMobileSettings(!showMobileSettings)} className={`md:hidden btn-glass-icon w-10 h-10 relative ${showMobileSettings ? 'bg-blue-100 dark:bg-blue-900/30 text-blue-600' : ''}`}>
                              <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                          </button>
                      </div>
                  </header>

                  {showMobileSettings && (
                      <div className="md:hidden absolute top-16 left-4 right-4 z-40 animate-pop">
                          <div className="glass-panel rounded-2xl p-4 shadow-2xl bg-white/90 dark:bg-gray-800/90 backdrop-blur-xl border border-gray-200 dark:border-gray-700 flex flex-col gap-4">
                               <div className="flex justify-between items-center">
                                   <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{t('player.language')}</span>
                                   <LanguageToggle />
                               </div>
                               <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4">
                                   <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{t('player.theme')}</span>
                                   <ThemeToggle theme={theme} onToggle={() => setTheme(t => t === 'light' ? 'dark' : 'light')} />
                               </div>
                               <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4">
                                   <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{t('player.fontSize')}</span>
                                   <div className="flex items-center gap-3 bg-gray-100 dark:bg-gray-900 rounded-xl p-1">
                                      <button onClick={decreaseFontSize} disabled={fontSizeLevel <= 1} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 shadow-sm active:scale-90 transition-transform"><span className="text-xs font-black">A-</span></button>
                                      <button onClick={increaseFontSize} disabled={fontSizeLevel >= 5} className="w-10 h-10 flex items-center justify-center rounded-lg bg-white dark:bg-gray-800 shadow-sm active:scale-90 transition-transform"><span className="text-lg font-black">A+</span></button>
                                   </div>
                               </div>
                               <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4">
                                   <span className="text-sm font-bold text-gray-600 dark:text-gray-300">{t('player.readingMode')}</span>
                                   <button onClick={() => { setIsReadingMode(!isReadingMode); setShowMobileSettings(false); }} className={`px-4 py-2 rounded-xl text-sm font-bold transition-colors ${isReadingMode ? 'bg-blue-500 text-white shadow-md' : 'bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300'}`}>
                                      {isReadingMode ? 'ON' : 'OFF'}
                                   </button>
                               </div>
                          </div>
                      </div>
                  )}

                  {isSidebarOpen && (
                      <div className="fixed inset-0 z-50 md:hidden">
                          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={() => setIsSidebarOpen(false)}></div>
                          <div className={`absolute top-0 h-full w-[85%] max-w-[320px] bg-white dark:bg-gray-900 shadow-2xl flex flex-col ${language === 'ar' ? 'right-0 animate-slide-in-right' : 'left-0'}`}>
                               <div className="h-16 flex items-center justify-between px-6 border-b border-gray-200 dark:border-gray-800 bg-gray-50 dark:bg-gray-800/50">
                                  <span className="font-black text-lg text-gray-900 dark:text-white">{t('player.contents')}</span>
                                  <button onClick={() => setIsSidebarOpen(false)} className="w-8 h-8 flex items-center justify-center rounded-full bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300">✕</button>
                               </div>
                               <div className="p-4 border-b border-gray-100 dark:border-gray-800">
                                   <button onClick={handleBackToDashboard} className="w-full btn-liquid-secondary px-4 py-3 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 text-red-600 dark:text-red-400 border-red-100 dark:border-red-900/30 hover:bg-red-50 dark:hover:bg-red-900/20">
                                      {t('player.exitToDash')}
                                   </button>
                               </div>
                               <div className="flex-1 overflow-y-auto p-4">
                                  <ul className="space-y-3">
                                    {activeModule.pages.map((p, idx) => (
                                        <li key={idx}>
                                            <button 
                                                onClick={() => { setCurrentUnitIndex(idx); setShowQuiz(false); setIsSidebarOpen(false); scrollToTop(); }}
                                                className={`w-full text-start px-4 py-3 rounded-xl text-sm font-medium ${currentUnitIndex === idx && !showQuiz ? 'bg-blue-500 text-white' : 'bg-gray-50 dark:bg-gray-800'}`}
                                            >
                                                {p.content.find(c => c.type === 'heading')?.text || `${t('player.page')} ${idx + 1}`}
                                            </button>
                                        </li>
                                    ))}
                                  </ul>
                               </div>
                          </div>
                      </div>
                  )}

                  <main ref={mainContentRef} className={`flex-1 overflow-y-auto p-4 scroll-auto z-10 relative transition-all duration-500 ${isReadingMode ? 'md:px-12 md:py-12 max-w-[95vw] mx-auto w-full' : 'md:p-10'} pb-32 md:pb-10`} onScroll={handlePlayerScroll}>
                      {showQuiz && activeModule.quiz ? (
                          <QuizView questions={activeModule.quiz} onComplete={handleQuizComplete} onRetry={() => { setShowQuiz(false); setCurrentUnitIndex(0); scrollToTop(); }} onNextModule={handleNextModuleNavigation} />
                      ) : (
                          <BookPage key={currentUnitIndex} page={currentPage} fontStyles={activeFontStyles} onNavigateToPage={() => {}} totalPages={1} isActive={true} isNavigatingTo={false} onPlayAudio={() => {}} isPlayingAudio={false} isGeneratingAudio={false} />
                      )}
                      <div className="mt-16 mb-8 glass-panel bg-white/60 dark:bg-gray-800/60 rounded-3xl p-4 md:p-6 border border-gray-200 dark:border-gray-700 transition-all duration-500 max-w-4xl mx-auto shadow-xl backdrop-blur-md">
                          <div className="flex flex-col md:flex-row gap-4 md:gap-0 justify-between items-center">
                                <button onClick={handlePrevUnit} disabled={!canGoBack} className="w-full md:w-auto btn-liquid-secondary px-6 py-3.5 rounded-2xl font-bold text-sm disabled:opacity-30 disabled:cursor-not-allowed flex items-center justify-center gap-2">
                                    {currentUnitIndex === 0 && !showQuiz && !isFirstModule ? t('player.prevUnit') : t('player.prev')}
                                </button>
                                <div className="hidden sm:flex gap-2 bg-gray-100 dark:bg-gray-800 p-1.5 rounded-full overflow-x-auto max-w-[200px] md:max-w-none scrollbar-hide">
                                    {activeModule.pages.map((_, idx) => (
                                        <div key={idx} className={`h-2 rounded-full transition-all duration-500 flex-shrink-0 ${idx === currentUnitIndex && !showQuiz ? 'bg-blue-500 w-8 shadow-[0_0_8px_rgba(59,130,246,0.6)]' : 'bg-gray-300 dark:bg-gray-600 w-2'}`}></div>
                                    ))}
                                    {activeModule.quiz && (
                                        <div className={`h-2 rounded-full transition-all duration-500 flex-shrink-0 ${showQuiz ? 'bg-purple-500 w-8 shadow-[0_0_8px_rgba(168,85,247,0.6)]' : 'bg-gray-300 dark:bg-gray-600 w-2'}`}></div>
                                    )}
                                </div>
                                {!showQuiz ? (
                                    <button onClick={handleNextUnit} className="w-full md:w-auto btn-liquid-primary px-8 py-3.5 rounded-2xl font-bold text-sm flex items-center justify-center gap-2 group">
                                        {isLastPage && activeModule.quiz ? t('player.startQuiz') : t('player.next')}
                                        <span className="text-lg group-active:translate-x-1 transition-transform">{isLastPage && activeModule.quiz ? '📝' : language === 'ar' ? '←' : '→'}</span>
                                    </button>
                                ) : (
                                    <button onClick={handleBackToDashboard} className="w-full md:w-auto btn-liquid-secondary px-6 py-3.5 font-bold rounded-2xl">
                                    {t('player.exit')}
                                    </button>
                                )}
                          </div>
                      </div>
                  </main>
              </div>
          </div>
      );
  }
  return null;
};

const App: React.FC = () => {
  return (
    <LanguageProvider>
      <AuthProvider>
        <AppContent />
      </AuthProvider>
    </LanguageProvider>
  );
};

export default App;
