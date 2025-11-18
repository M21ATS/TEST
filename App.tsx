
import React, { useState, useEffect, useRef } from 'react';
import { bookPages, sectionToc } from './constants/bookData';
import Sidebar from './components/Sidebar';
import BookPage from './components/BookPage';
import ThemeToggle from './components/ThemeToggle';
import SearchBar from './components/SearchBar';
import { GoogleGenAI, Modality } from "@google/genai";

const FONT_SIZE_LEVELS = [
  { base: 'text-base', h1: 'text-3xl', h2: 'text-2xl', h3: 'text-xl', h4: 'text-lg' },
  { base: 'text-lg', h1: 'text-4xl md:text-5xl', h2: 'text-3xl md:text-4xl', h3: 'text-2xl md:text-3xl', h4: 'text-xl md:text-2xl' },
  { base: 'text-xl', h1: 'text-5xl md:text-6xl', h2: 'text-4xl md:text-5xl', h3: 'text-3xl md:text-4xl', h4: 'text-2xl md:text-3xl' },
  { base: 'text-2xl', h1: 'text-6xl md:text-7xl', h2: 'text-5xl md:text-6xl', h3: 'text-4xl md:text-5xl', h4: 'text-3xl md:text-4xl' },
];

type Theme = 'light' | 'dark';

// --- TTS Helpers ---
function decodeAudioData(base64: string): Uint8Array {
  const binaryString = atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

async function createAudioBuffer(
  data: Uint8Array,
  ctx: AudioContext,
  sampleRate: number = 24000,
  numChannels: number = 1
): Promise<AudioBuffer> {
  const dataInt16 = new Int16Array(data.buffer);
  const frameCount = dataInt16.length / numChannels;
  const buffer = ctx.createBuffer(numChannels, frameCount, sampleRate);

  for (let channel = 0; channel < numChannels; channel++) {
    const channelData = buffer.getChannelData(channel);
    for (let i = 0; i < frameCount; i++) {
      channelData[i] = dataInt16[i * numChannels + channel] / 32768.0;
    }
  }
  return buffer;
}
// --- End TTS Helpers ---

const App: React.FC = () => {
  const [activeSectionId, setActiveSectionId] = useState('cover');
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('theme') as Theme) || 'light');
  const [zoomLevel, setZoomLevel] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  // Change: Store array of bookmarked pages
  const [bookmarkedPages, setBookmarkedPages] = useState<number[]>([]);
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [targetPageForAnimation, setTargetPageForAnimation] = useState<number | null>(null);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
  // TTS State
  const [playingAudioPage, setPlayingAudioPage] = useState<number | null>(null);
  const [generatingPageId, setGeneratingPageId] = useState<number | null>(null); // Track which page is loading
  const audioContextRef = useRef<AudioContext | null>(null);
  const sourceNodeRef = useRef<AudioBufferSourceNode | null>(null);
  const audioRequestIdRef = useRef<number>(0); // To handle race conditions

  // Parallax Refs
  const lightBlob1Ref = useRef<HTMLDivElement>(null);
  const lightBlob2Ref = useRef<HTMLDivElement>(null);
  const lightBlob3Ref = useRef<HTMLDivElement>(null);
  const darkBlob1Ref = useRef<HTMLDivElement>(null);
  const darkBlob2Ref = useRef<HTMLDivElement>(null);
  const darkBlob3Ref = useRef<HTMLDivElement>(null);

  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);

  // Load bookmarks
  useEffect(() => {
    const saved = localStorage.getItem('bookmarkedPages');
    if (saved) {
      try {
        setBookmarkedPages(JSON.parse(saved));
      } catch (e) {
        console.error("Failed to parse bookmarks", e);
      }
    }
  }, []);

  // Save bookmarks
  useEffect(() => {
    localStorage.setItem('bookmarkedPages', JSON.stringify(bookmarkedPages));
  }, [bookmarkedPages]);

  // Theme effect
  useEffect(() => {
    const root = window.document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('theme', theme);
  }, [theme]);

  // Parallax Effect
  useEffect(() => {
    const handleScroll = () => {
        const scrollY = window.scrollY;
        requestAnimationFrame(() => {
            // Light Mode Blobs
            if (lightBlob1Ref.current) lightBlob1Ref.current.style.transform = `translateY(${scrollY * 0.2}px)`;
            if (lightBlob2Ref.current) lightBlob2Ref.current.style.transform = `translateY(${scrollY * -0.15}px)`;
            if (lightBlob3Ref.current) lightBlob3Ref.current.style.transform = `translateY(${scrollY * 0.1}px)`;
            
            // Dark Mode Blobs
            if (darkBlob1Ref.current) darkBlob1Ref.current.style.transform = `translateY(${scrollY * 0.25}px)`;
            if (darkBlob2Ref.current) darkBlob2Ref.current.style.transform = `translateY(${scrollY * -0.2}px)`;
            if (darkBlob3Ref.current) darkBlob3Ref.current.style.transform = `translateY(${scrollY * 0.15}px)`;
        });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Keyboard listeners
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isPreviewMode) {
        setIsPreviewMode(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isPreviewMode]);
  
  // Observer for Scroll Spy
  useEffect(() => {
    pageRefs.current = pageRefs.current.slice(0, bookPages.length);
    
    const options = {
      root: null,
      rootMargin: '-40% 0px -40% 0px',
      threshold: 0.1
    };

    const navigationObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const pageId = entry.target.id;
            const pageNumber = parseInt(pageId.replace('page-', ''), 10);
            setCurrentPage(pageNumber);
            const pageData = bookPages.find(p => p.pageNumber === pageNumber);
            if(pageData) {
              setActiveSectionId(pageData.sectionId);
            }
          }
        });
      }, options);

    pageRefs.current.forEach((ref) => {
      if (ref) navigationObserver.observe(ref);
    });
    return () => {
      pageRefs.current.forEach((ref) => {
        if (ref) navigationObserver.unobserve(ref);
      });
    };
  }, []);

  // TTS Handler with Race Condition Fix
  const handlePlayAudio = async (text: string, pageId: number) => {
    // 1. Stop any existing audio immediately
    if (sourceNodeRef.current) {
        try { sourceNodeRef.current.stop(); } catch(e) {}
        sourceNodeRef.current = null;
    }

    // 2. If we clicked the same page that is playing, just stop and return (toggle off)
    if (playingAudioPage === pageId) {
        setPlayingAudioPage(null);
        setGeneratingPageId(null);
        return;
    }

    // 3. Generate a new Request ID. This invalidates any previous pending requests.
    const currentRequestId = Date.now();
    audioRequestIdRef.current = currentRequestId;

    setPlayingAudioPage(null); // Clear playing state
    
    if (!text || text.trim().length === 0) return;

    setGeneratingPageId(pageId); // Start loading for this specific page

    try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: "gemini-2.5-flash-preview-tts",
            contents: [{ parts: [{ text: text }] }],
            config: {
                responseModalities: [Modality.AUDIO],
                speechConfig: {
                    voiceConfig: {
                        prebuiltVoiceConfig: { voiceName: 'Zephyr' },
                    },
                },
            },
        });

        // Check if a newer request started while we were waiting
        if (audioRequestIdRef.current !== currentRequestId) {
            console.log("Audio request superseded, ignoring result.");
            return;
        }

        const base64Audio = response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data;
        
        if (base64Audio) {
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)({ sampleRate: 24000 });
            }
            
            if (audioContextRef.current.state === 'suspended') {
                await audioContextRef.current.resume();
            }

            const audioData = decodeAudioData(base64Audio);
            const audioBuffer = await createAudioBuffer(audioData, audioContextRef.current, 24000, 1);
            
            const source = audioContextRef.current.createBufferSource();
            source.buffer = audioBuffer;
            source.connect(audioContextRef.current.destination);
            
            source.onended = () => {
                setPlayingAudioPage(prev => prev === pageId ? null : prev);
            };
            
            // Final check before playing
            if (audioRequestIdRef.current !== currentRequestId) {
                return;
            }
            
            setPlayingAudioPage(pageId);
            source.start();
            sourceNodeRef.current = source;
        }
    } catch (error) {
        // Only alert if this is still the active request
        if (audioRequestIdRef.current === currentRequestId) {
            console.error("Error generating speech:", error);
            // Optional: alert("تعذر توليد الصوت حالياً");
        }
    } finally {
        // Only clear loading if this is the active request
        if (audioRequestIdRef.current === currentRequestId) {
            setGeneratingPageId(null);
        }
    }
  };

  const animateScrollToPage = (pageNum: number) => {
      if (pageNum >= 1 && pageNum <= bookPages.length) {
        setTargetPageForAnimation(pageNum);
        const targetElement = document.getElementById(`page-${pageNum}`);
        if (targetElement) {
          targetElement.scrollIntoView({ behavior: 'smooth', block: 'start' });
          setTimeout(() => {
            setTargetPageForAnimation(null);
          }, 1500);
        }
      }
  };

  const handleNavigate = (sectionId: string) => {
    setIsMobileMenuOpen(false);
    const section = sectionToc.find((s) => s.id === sectionId);
    if (section) {
        animateScrollToPage(section.startPage);
    }
  };

  const navigateToPage = (pageNum: number) => {
    setIsMobileMenuOpen(false);
    animateScrollToPage(pageNum);
  };
  
  const handleThemeToggle = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };
  
  const handleSearch = (query: string) => {
    setIsMobileMenuOpen(false);
    const pageNum = parseInt(query, 10);
    if (!isNaN(pageNum)) {
      navigateToPage(pageNum);
      return;
    }
    const lowerCaseQuery = query.toLowerCase();
    const targetSection = sectionToc.find(s => s.title.toLowerCase().includes(lowerCaseQuery));
    if(targetSection) {
        handleNavigate(targetSection.id);
    }
  };

  // Modified to support multiple bookmarks
  const handleToggleBookmark = () => {
    setBookmarkedPages(prev => {
      if (prev.includes(currentPage)) {
        return prev.filter(p => p !== currentPage);
      } else {
        return [...prev, currentPage].sort((a, b) => a - b);
      }
    });
  };

  const currentFontConfig = FONT_SIZE_LEVELS[zoomLevel];
  // Added transition to font styles for smooth zooming
  const fontStyles = {
    ...currentFontConfig,
    base: `${currentFontConfig.base} transition-all duration-700 ease-in-out`,
    h1: `${currentFontConfig.h1} font-extrabold transition-all duration-700 ease-in-out`,
    h2: `${currentFontConfig.h2} font-bold transition-all duration-700 ease-in-out`,
    h3: `${currentFontConfig.h3} font-bold transition-all duration-700 ease-in-out`,
    h4: `${currentFontConfig.h4} font-bold transition-all duration-700 ease-in-out`,
    lineHeight: 'leading-relaxed',
  };

  const isCurrentPageBookmarked = bookmarkedPages.includes(currentPage);

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-black text-gray-900 dark:text-gray-100 font-sans transition-colors duration-1000 ease-in-out overflow-x-hidden">
      
      {/* Ambient Background with Parallax */}
      <div className="fixed inset-0 pointer-events-none z-0 transition-opacity duration-1000">
        
        {/* Light Mode Blobs */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${theme === 'dark' ? 'opacity-0' : 'opacity-40'}`}>
           <div ref={lightBlob1Ref} className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] will-change-transform">
               <div className="w-full h-full bg-blue-300 rounded-full mix-blend-multiply filter blur-[120px] animate-blob"></div>
           </div>
           <div ref={lightBlob2Ref} className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] will-change-transform">
               <div className="w-full h-full bg-purple-300 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-2000"></div>
           </div>
           <div ref={lightBlob3Ref} className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] will-change-transform">
               <div className="w-full h-full bg-pink-300 rounded-full mix-blend-multiply filter blur-[120px] animate-blob animation-delay-4000"></div>
           </div>
        </div>

        {/* Dark Mode Blobs */}
        <div className={`absolute inset-0 transition-opacity duration-1000 ${theme === 'dark' ? 'opacity-30' : 'opacity-0'}`}>
           <div ref={darkBlob1Ref} className="absolute top-[-10%] left-[-10%] w-[50%] h-[50%] will-change-transform">
              <div className="w-full h-full bg-blue-900 rounded-full mix-blend-screen filter blur-[100px] animate-blob"></div>
           </div>
           <div ref={darkBlob2Ref} className="absolute top-[20%] right-[-10%] w-[50%] h-[50%] will-change-transform">
              <div className="w-full h-full bg-indigo-900 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-2000"></div>
           </div>
           <div ref={darkBlob3Ref} className="absolute bottom-[-10%] left-[20%] w-[50%] h-[50%] will-change-transform">
              <div className="w-full h-full bg-purple-900 rounded-full mix-blend-screen filter blur-[100px] animate-blob animation-delay-4000"></div>
           </div>
        </div>

      </div>

      <div className="relative z-10 flex flex-col md:flex-row">
        
        {/* Mobile Top Bar */}
        <div className="md:hidden fixed top-0 left-0 right-0 h-16 bg-white/80 dark:bg-black/80 backdrop-blur-lg border-b border-gray-200 dark:border-gray-800 z-50 flex items-center justify-between px-4 transition-all duration-500">
             <div className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
               نموذج بدرية
             </div>
             <button 
                onClick={() => setIsMobileMenuOpen(true)}
                className="p-2 rounded-lg text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                aria-label="Menu"
             >
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                 </svg>
             </button>
        </div>

        {/* Mobile Sidebar Drawer Overlay */}
        <div 
            className={`md:hidden fixed inset-0 z-[60] bg-black/50 backdrop-blur-sm transition-opacity duration-500 
                ${isMobileMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'}
            `}
            onClick={() => setIsMobileMenuOpen(false)}
        >
            <div 
                className={`absolute top-0 right-0 bottom-0 w-[85%] max-w-sm bg-white dark:bg-gray-900 shadow-2xl transform transition-transform duration-500 ease-out-cubic flex flex-col
                    ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}
                `}
                onClick={e => e.stopPropagation()}
            >
                 <div className="p-4 border-b border-gray-100 dark:border-gray-800 flex justify-between items-center">
                    <h2 className="text-lg font-bold text-gray-800 dark:text-gray-200">القائمة</h2>
                    <button onClick={() => setIsMobileMenuOpen(false)} className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-500">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                 </div>
                 <div className="p-4">
                    <SearchBar onSearch={handleSearch} />
                 </div>
                 <div className="flex-1 overflow-y-auto p-4">
                    <Sidebar 
                      activeSectionId={activeSectionId}
                      bookmarkedPages={bookmarkedPages}
                      onNavigate={handleNavigate}
                      onNavigateToPage={navigateToPage}
                    />
                 </div>
                 <div className="p-4 border-t border-gray-100 dark:border-gray-800 flex justify-center">
                    <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
                 </div>
            </div>
        </div>

        {/* Desktop Sidebar */}
        <aside 
          className={`fixed top-4 right-4 bottom-4 w-80 rounded-3xl z-40 transform transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) shadow-2xl
            bg-white/70 dark:bg-gray-900/60 backdrop-blur-xl border border-white/20 dark:border-gray-700/30
            flex flex-col overflow-hidden
            ${isPreviewMode ? 'translate-x-[120%] opacity-0' : 'translate-x-0 opacity-100'}
            hidden md:flex
          `}
        >
          <div className="p-5 pb-2 border-b border-gray-200/50 dark:border-gray-700/50">
             <h1 className="text-xl font-bold mb-4 text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-purple-600 dark:from-blue-400 dark:to-purple-400">
               نموذج بدرية
             </h1>
             <SearchBar onSearch={handleSearch} />
          </div>

          <div className="flex-1 overflow-y-auto p-2 custom-scrollbar">
            <Sidebar 
              activeSectionId={activeSectionId}
              bookmarkedPages={bookmarkedPages}
              onNavigate={handleNavigate}
              onNavigateToPage={navigateToPage}
            />
          </div>

          <div className="p-4 border-t border-gray-200/50 dark:border-gray-700/50 flex justify-center">
             <ThemeToggle theme={theme} onToggle={handleThemeToggle} />
          </div>
        </aside>

        {/* Main Content */}
        <main 
          className={`flex-1 transition-all duration-700 ease-out-cubic p-2 pt-20 md:pt-6 lg:p-8 pb-32 flex flex-col items-center
            ${isPreviewMode ? 'mr-0' : 'md:mr-[21rem]'}
          `}
        >
          <div className={`w-full transition-all duration-500 ${isPreviewMode ? 'max-w-7xl' : 'max-w-6xl'}`}>
             {bookPages.map((page, index) => (
                <BookPage 
                    key={page.pageNumber}
                    page={page}
                    fontStyles={fontStyles}
                    isActive={currentPage === page.pageNumber}
                    isNavigatingTo={targetPageForAnimation === page.pageNumber}
                    ref={el => pageRefs.current[index] = el}
                    onNavigateToPage={navigateToPage}
                    totalPages={bookPages.length}
                    onPlayAudio={handlePlayAudio}
                    isPlayingAudio={playingAudioPage === page.pageNumber}
                    isGeneratingAudio={generatingPageId === page.pageNumber} // Only true if this specific page is loading
                />
             ))}
          </div>
        </main>

        {/* Control Dock */}
        <div 
          className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-50 transition-all duration-700 cubic-bezier(0.4, 0, 0.2, 1) max-w-[95vw]
            ${isPreviewMode ? 'translate-y-[200%] opacity-0' : 'translate-y-0 opacity-100'}
          `}
        >
          <div className="flex items-center gap-3 px-4 md:px-6 py-3 bg-white/80 dark:bg-gray-800/80 backdrop-blur-2xl rounded-full shadow-2xl border border-white/30 dark:border-gray-700/30 overflow-x-auto hide-scrollbar">
            
            <DockButton onClick={() => setIsPreviewMode(true)} label="وضع القراءة">
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
               </svg>
            </DockButton>
            
            <Divider />

            <DockButton onClick={() => navigateToPage(currentPage - 1)} disabled={currentPage <= 1} label="السابق">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </DockButton>

            <span className="font-mono font-bold text-gray-700 dark:text-gray-200 min-w-[2rem] md:min-w-[3rem] text-center text-sm whitespace-nowrap">
              {currentPage}
            </span>

            <DockButton onClick={() => navigateToPage(currentPage + 1)} disabled={currentPage >= bookPages.length} label="التالي">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
            </DockButton>

            <Divider />

            <DockButton onClick={() => setZoomLevel(prev => Math.max(prev - 1, 0))} disabled={zoomLevel <= 0} label="تصغير">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </DockButton>

            <DockButton onClick={() => setZoomLevel(prev => Math.min(prev + 1, FONT_SIZE_LEVELS.length - 1))} disabled={zoomLevel >= FONT_SIZE_LEVELS.length - 1} label="تكبير">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </DockButton>

            <Divider />

            <DockButton 
              onClick={handleToggleBookmark} 
              isActive={isCurrentPageBookmarked}
              activeColor="text-yellow-500 dark:text-yellow-400"
              label={isCurrentPageBookmarked ? "إزالة الحفظ" : "حفظ الصفحة"}
            >
               <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill={isCurrentPageBookmarked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
               </svg>
            </DockButton>

          </div>
        </div>

        <button
          onClick={() => setIsPreviewMode(false)}
          className={`fixed bottom-8 right-8 z-50 p-4 bg-black/70 dark:bg-white/70 backdrop-blur-md text-white dark:text-black rounded-full shadow-2xl 
            border border-white/20 transition-all duration-500 hover:scale-110 hover:bg-black dark:hover:bg-white
            ${isPreviewMode ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}
          `}
          aria-label="Exit Preview"
          title="خروج من وضع القراءة"
        >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
        </button>

      </div>
      
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
        .custom-scrollbar::-webkit-scrollbar {
            width: 4px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
            background-color: rgba(156, 163, 175, 0.5);
            border-radius: 20px;
        }
        .hide-scrollbar::-webkit-scrollbar {
            display: none;
        }
        .hide-scrollbar {
            -ms-overflow-style: none;
            scrollbar-width: none;
        }
        .ease-out-cubic {
            transition-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
        }
        .will-change-transform {
            will-change: transform;
        }
      `}</style>
    </div>
  );
};

const DockButton: React.FC<{ 
    onClick: () => void; 
    children: React.ReactNode; 
    disabled?: boolean;
    isActive?: boolean;
    activeColor?: string;
    label: string;
    className?: string;
}> = ({ onClick, children, disabled, isActive, activeColor, label, className }) => (
    <button
        onClick={onClick}
        disabled={disabled}
        title={label}
        className={`group relative p-3 rounded-2xl transition-all duration-300 ease-out flex-shrink-0
          ${disabled ? 'opacity-30 cursor-not-allowed' : 'hover:bg-white/50 dark:hover:bg-gray-700/50 hover:scale-125 active:scale-95'}
          ${isActive ? (activeColor || 'text-blue-600 dark:text-blue-400 bg-blue-50 dark:bg-blue-900/30') : 'text-gray-600 dark:text-gray-300'}
          ${className || ''}
        `}
    >
        {children}
        <span className="hidden md:block absolute -top-10 left-1/2 transform -translate-x-1/2 px-2 py-1 bg-black/80 text-white text-xs rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none whitespace-nowrap">
            {label}
        </span>
    </button>
);

const Divider = () => (
    <div className="w-px h-6 md:h-8 bg-gray-300/50 dark:bg-gray-600/50 mx-1 flex-shrink-0"></div>
);

export default App;
