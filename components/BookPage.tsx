
import React, { forwardRef, useState, useEffect } from 'react';
import type { Page, ContentItem } from '../types';
import { authorData } from '../constants/bookData';
import SaudiModelMap from './SaudiModelMap';
import { 
  ModelCycle, 
  VisualIntention, 
  VisualPersonal, 
  VisualPassion, 
  VisualSkills, 
  VisualMarket, 
  VisualProduct, 
  VisualMoney 
} from './VisualModels';

// --- Helper Components ---

const ImageWithFallback: React.FC<{ src?: string; alt?: string; className?: string; imgClassName?: string }> = ({ src, alt, className, imgClassName }) => {
  const [error, setError] = useState(false);
  const [loaded, setLoaded] = useState(false);

  if (error || !src) {
    return (
      <div className={`flex flex-col items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600 p-8 min-h-[300px] w-full ${className || ''}`}>
        <div className="bg-gray-200 dark:bg-gray-600 rounded-full p-4 mb-4">
            <svg className="w-10 h-10 text-gray-400 dark:text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
        <span className="text-lg font-medium text-gray-600 dark:text-gray-300 text-center">{alt || 'صورة توضيحية'}</span>
        <span className="text-sm text-gray-500 dark:text-gray-400 text-center mt-2">(تعذر تحميل الصورة)</span>
      </div>
    );
  }

  return (
    <div className={`relative flex justify-center w-full ${className || ''}`}>
      {!loaded && (
         <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 min-h-[300px] rounded-lg w-full">
            <div className="w-10 h-10 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
         </div>
      )}
      <img 
        src={src} 
        alt={alt || 'Book image'} 
        className={`max-w-full h-auto mx-auto transition-opacity duration-500 ${loaded ? 'opacity-100' : 'opacity-0'} ${imgClassName || 'rounded-lg shadow-lg'}`}
        onError={() => setError(true)}
        onLoad={() => setLoaded(true)}
        loading="lazy" 
      />
    </div>
  );
};

// --- INLINED INTRO COMPONENTS ---

const IntroCover: React.FC = () => (
  <div className="relative bg-[#f0f2f5] dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden aspect-[1/1.414] w-full flex flex-col justify-center items-center text-center p-4 md:p-8 mb-8 transition-colors duration-1000">
    <div className="absolute top-[-20%] right-[-30%] h-[120%] w-[120%]">
      <div className="absolute w-full h-full bg-[#1e40af] dark:bg-blue-800 transform rotate-[30deg] translate-x-[25%] translate-y-[15%] transition-colors duration-1000"></div>
    </div>
    <div className="absolute bottom-[-50%] left-[-30%] h-full w-full">
      <div className="absolute w-full h-full bg-[#9ca3af] dark:bg-gray-600 transform rotate-[30deg] -translate-x-[25%] translate-y-[10%] transition-colors duration-1000"></div>
    </div>
    
    {/* CSS Pattern Background */}
    <div 
      className="absolute inset-0 opacity-10 dark:opacity-5"
      style={{ 
        backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)',
        backgroundSize: '30px 30px'
      }}
    ></div>

    <div className="relative z-10 space-y-6 md:space-y-8 text-white dark:text-gray-100">
      <h1 className="text-4xl md:text-7xl font-extrabold text-shadow-lg">
        نموذج بدرية <br /> لريادة الأعمال
      </h1>
      <p className="text-4xl md:text-6xl font-bold text-shadow">(1)</p>
    </div>
    <div className="absolute bottom-10 right-10 z-10 text-right text-white dark:text-gray-100">
      <p className="text-lg md:text-2xl font-medium text-shadow-sm">
        بدرية حامد الحجيلي
      </p>
      <p className="mt-1 text-base md:text-xl text-shadow-sm">
        رائدة أعمال وناشطة مجتمعية
      </p>
    </div>
    <style>{`
      .text-shadow-lg { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4); }
      .text-shadow-sm { text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3); }
    `}</style>
  </div>
);

const IntroBismillah: React.FC = () => (
    <div className="flex flex-col items-center justify-center w-full h-full flex-grow py-12 md:py-24">
        <div className="w-full max-w-3xl px-4">
             <ImageWithFallback 
                src="https://upload.wikimedia.org/wikipedia/commons/2/27/Basmala.svg" 
                alt="بسم الله الرحمن الرحيم" 
                className="w-full"
                imgClassName="drop-shadow-sm"
             />
        </div>
    </div>
);

const IntroAuthorCard: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-10 my-8 transition-colors duration-1000">
    <h2 className="text-2xl md:text-4xl font-bold text-blue-800 dark:text-blue-400 border-b-2 border-gray-200 dark:border-gray-700 pb-3 mb-6 transition-colors duration-1000">
      تعريف عن الكاتبة
    </h2>
    <div className="text-center mb-6">
      <h3 className="text-xl md:text-2xl font-bold text-gray-800 dark:text-gray-100 transition-colors duration-1000">{authorData.name}</h3>
      <p className="text-base md:text-lg text-gray-600 dark:text-gray-400 transition-colors duration-1000">{authorData.title}</p>
    </div>
    <div className="space-y-3">
      <ul className="list-disc list-outside pr-5 space-y-2 text-gray-700 dark:text-gray-300 text-base md:text-lg leading-relaxed transition-colors duration-1000">
        {authorData.bioPoints.map((point, index) => (
          <li key={index}>{point}</li>
        ))}
      </ul>
    </div>
  </div>
);

const IntroTOC: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 md:p-10 my-8 transition-colors duration-1000">
    <h2 className="text-2xl md:text-4xl relative font-bold text-blue-800 dark:text-blue-400 pb-3 mb-6 transition-colors duration-1000">
      المحتويات
      <span className="absolute bottom-0 right-0 h-1 w-24 bg-blue-800 dark:bg-blue-400 transition-colors duration-1000"></span>
    </h2>
    <ul className="space-y-3 text-base md:text-lg text-gray-800 dark:text-gray-200">
        <li className="flex justify-between items-baseline border-b border-dashed border-gray-300 dark:border-gray-600 pb-1"><span>المقدمة</span><span className="font-mono">01</span></li>
        <li className="flex justify-between items-baseline border-b border-dashed border-gray-300 dark:border-gray-600 pb-1"><span>نموذج بدرية لريادة الاعمال</span><span className="font-mono">02</span></li>
        <li className="flex justify-between items-baseline border-b border-dashed border-gray-300 dark:border-gray-600 pb-1"><span>النية</span><span className="font-mono">04</span></li>
        <li className="flex justify-between items-baseline border-b border-dashed border-gray-300 dark:border-gray-600 pb-1"><span>المميزات الذاتية</span><span className="font-mono">35</span></li>
        <li className="flex justify-between items-baseline border-b border-dashed border-gray-300 dark:border-gray-600 pb-1"><span>الشغف</span><span className="font-mono">40</span></li>
        <li className="flex justify-between items-baseline border-b border-dashed border-gray-300 dark:border-gray-600 pb-1"><span>المهارات</span><span className="font-mono">48</span></li>
        <li className="flex justify-between items-baseline border-b border-dashed border-gray-300 dark:border-gray-600 pb-1"><span>احتياج السوق</span><span className="font-mono">54</span></li>
        <li className="flex justify-between items-baseline border-b border-dashed border-gray-300 dark:border-gray-600 pb-1"><span>منتج مبتكر</span><span className="font-mono">64</span></li>
        <li className="flex justify-between items-baseline border-b border-dashed border-gray-300 dark:border-gray-600 pb-1"><span>المال</span><span className="font-mono">72</span></li>
        <li className="flex justify-between items-baseline border-b border-dashed border-gray-300 dark:border-gray-600 pb-1"><span>التوصيات</span><span className="font-mono">80</span></li>
        <li className="flex justify-between items-baseline border-b border-dashed border-gray-300 dark:border-gray-600 pb-1"><span>الخاتمة</span><span className="font-mono">88</span></li>
    </ul>
  </div>
);

// --- END INLINED COMPONENTS ---

interface BookPageProps {
  page: Page;
  fontStyles: {
    base: string;
    lineHeight: string;
    h1: string;
    h2: string;
    h3: string;
    h4: string;
  };
  onNavigateToPage: (pageNumber: number) => void;
  totalPages: number;
  isActive: boolean;
  isNavigatingTo: boolean; 
  onPlayAudio: (text: string, pageId: number) => void; 
  isPlayingAudio: boolean;
  isGeneratingAudio?: boolean;
}

const RenderContentItem: React.FC<{ item: ContentItem; index: number; fontStyles: BookPageProps['fontStyles'] }> = ({ item, index, fontStyles }) => {
  switch (item.type) {
    case 'heading': {
      const classMap = {
        1: fontStyles.h1,
        2: fontStyles.h2,
        3: fontStyles.h3,
        4: fontStyles.h4,
      };
      const className = `${classMap[item.level || 2]} text-blue-800 dark:text-blue-400 ${item.className || ''}`;
      return React.createElement(`h${item.level || 2}`, { key: index, className }, item.text);
    }
    case 'list':
      return (
        <ul key={index} className={`list-disc list-outside pr-5 space-y-2 ${item.className || ''}`}>
          {item.items?.map((li, i) => <li key={i}>{li}</li>)}
        </ul>
      );
    case 'image':
      return (
        <div key={index} className={`py-4 flex justify-center w-full ${item.className || ''}`}>
          <ImageWithFallback src={item.src} alt={item.alt} />
        </div>
      );
    case 'cover':
      return <IntroCover key={index} />;
    case 'bismillah':
      return <IntroBismillah key={index} />;
    case 'author':
      return <IntroAuthorCard key={index} />;
    case 'toc':
      return <IntroTOC key={index} />;
    case 'saudi-map-model':
      return <SaudiModelMap key={index} />;
    case 'model-diagram':
      return <ModelCycle key={index} />;
    case 'visual-intention':
      return <VisualIntention key={index} />;
    case 'visual-personal':
      return <VisualPersonal key={index} />;
    case 'visual-passion':
      return <VisualPassion key={index} />;
    case 'visual-skills':
      return <VisualSkills key={index} />;
    case 'visual-market':
      return <VisualMarket key={index} />;
    case 'visual-product':
      return <VisualProduct key={index} />;
    case 'visual-money':
      return <VisualMoney key={index} />;
    case 'custom':
      return (
          <div key={index} className={item.className}>
              {item.content?.map((subItem, subIndex) => (
                  <RenderContentItem key={subIndex} item={subItem} index={subIndex} fontStyles={fontStyles} />
              ))}
          </div>
      );
    case 'paragraph':
    default:
      return <p key={index} className={item.className || ''}>{item.text}</p>;
  }
};

// Helper to extract text from a page for TTS
const extractTextFromPage = (content: ContentItem[]): string => {
    let text = "";
    content.forEach(item => {
        if (item.text) text += item.text + ". ";
        if (item.items) text += item.items.join(". ") + ". ";
        if (item.content) text += extractTextFromPage(item.content);
    });
    return text;
};

const BookPage = forwardRef<HTMLDivElement, BookPageProps>(({ page, fontStyles, onNavigateToPage, totalPages, isActive, isNavigatingTo, onPlayAudio, isPlayingAudio, isGeneratingAudio }, ref) => {
  
  const handlePlayClick = () => {
    const text = extractTextFromPage(page.content);
    onPlayAudio(text, page.pageNumber);
  };
  
  const isCurrentlyLoading = isGeneratingAudio && isActive;

  return (
    <div 
        id={`page-${page.pageNumber}`} 
        ref={ref} 
        className={`
            bg-white dark:bg-gray-800 rounded-xl shadow-xl p-4 md:p-8 w-full flex flex-col min-h-screen mb-4 scroll-mt-8
            transform transition-all duration-700 ease-out-cubic relative overflow-hidden
            ${isActive 
                ? 'ring-1 ring-blue-500/20 shadow-2xl z-10' 
                : 'border border-gray-100 dark:border-gray-700 opacity-95'}
            ${isNavigatingTo ? 'animate-pulse-flash ring-4 ring-blue-400 shadow-blue-500/50' : ''}
        `}
    >
      {/* Audio Playing Indicator */}
      {isPlayingAudio && isActive && (
          <div className="absolute top-4 left-4 flex gap-1 items-end h-6">
              <div className="w-1 bg-blue-500 animate-sound-wave-1"></div>
              <div className="w-1 bg-blue-500 animate-sound-wave-2"></div>
              <div className="w-1 bg-blue-500 animate-sound-wave-3"></div>
              <div className="w-1 bg-blue-500 animate-sound-wave-1"></div>
          </div>
      )}

      <div className={`flex-grow space-y-4 ${fontStyles.base} ${fontStyles.lineHeight}`}>
        {page.content.map((item, index) => (
          <RenderContentItem key={index} item={item} index={index} fontStyles={fontStyles} />
        ))}
      </div>
      
      <footer className="pt-8 mt-auto">
        {/* TTS Control */}
        <div className="flex justify-center mb-6">
            <button 
                onClick={handlePlayClick}
                disabled={isCurrentlyLoading}
                className={`flex items-center gap-2 px-6 py-3 rounded-full font-medium transition-all duration-300 shadow-md
                  ${isCurrentlyLoading ? 'bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400 cursor-wait' : ''}
                  ${isPlayingAudio && isActive ? 'bg-red-50 text-red-600 hover:bg-red-100 border border-red-200' : 'bg-blue-50 text-blue-600 hover:bg-blue-100 dark:bg-blue-900/20 dark:text-blue-300 border border-blue-100 dark:border-blue-800'}
                `}
            >
                {isCurrentlyLoading ? (
                   <>
                      <div className="w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin"></div>
                      <span>جاري المعالجة...</span>
                   </>
                ) : isPlayingAudio && isActive ? (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8 7a1 1 0 00-1 1v4a1 1 0 001 1h4a1 1 0 001-1V8a1 1 0 00-1-1H8z" clipRule="evenodd" />
                        </svg>
                        <span>إيقاف الاستماع</span>
                    </>
                ) : (
                    <>
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                            <path fillRule="evenodd" d="M9.383 3.076A1 1 0 0110 4v12a1 1 0 01-1.707.707L4.586 13H2a1 1 0 01-1-1V8a1 1 0 011-1h2.586l3.707-3.707a1 1 0 011.09-.217zM14.657 2.929a1 1 0 011.414 0A9.972 9.972 0 0119 10a9.972 9.972 0 01-2.929 7.071 1 1 0 01-1.414-1.414A7.971 7.971 0 0017 10c0-2.21-.894-4.208-2.343-5.657a1 1 0 010-1.414zm-2.829 2.828a1 1 0 011.415 0A5.983 5.983 0 0115 10a5.984 5.984 0 01-1.757 4.243 1 1 0 01-1.415-1.415A3.984 3.984 0 0013 10a3.983 3.983 0 00-1.172-2.828 1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                        <span>استماع للصفحة</span>
                    </>
                )}
            </button>
        </div>

        <div className="flex justify-between items-center border-t border-gray-200 dark:border-gray-700 pt-4 transition-colors duration-1000">
            <button
                onClick={() => onNavigateToPage(page.pageNumber - 1)}
                disabled={page.pageNumber <= 1}
                className="px-6 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 text-sm font-medium"
            >
                &larr; السابق
            </button>
            <p className="font-mono text-lg text-gray-400 dark:text-gray-500 font-bold">{page.pageNumber}</p>
            <button
                onClick={() => onNavigateToPage(page.pageNumber + 1)}
                disabled={page.pageNumber >= totalPages}
                className="px-6 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors duration-300 text-sm font-medium"
            >
                 التالي &rarr;
            </button>
        </div>
      </footer>
      <style>{`
        @keyframes flash {
            0% { background-color: rgba(59, 130, 246, 0); }
            50% { background-color: rgba(59, 130, 246, 0.1); }
            100% { background-color: rgba(59, 130, 246, 0); }
        }
        .animate-pulse-flash {
            animation: flash 1s ease-in-out;
        }
        @keyframes sound-wave {
            0%, 100% { height: 4px; }
            50% { height: 16px; }
        }
        .animate-sound-wave-1 { animation: sound-wave 0.8s infinite; }
        .animate-sound-wave-2 { animation: sound-wave 1.1s infinite; }
        .animate-sound-wave-3 { animation: sound-wave 0.9s infinite; }
      `}</style>
    </div>
  );
});

export default BookPage;
