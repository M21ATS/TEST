
import React, { forwardRef, useState } from 'react';
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
      <div className={`flex flex-col items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-3xl border-2 border-dashed border-gray-200 dark:border-gray-700 p-10 w-full ${className || ''}`}>
        <div className="bg-gray-100 dark:bg-gray-700 rounded-full p-4 mb-4">
            <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
        </div>
        <span className="text-sm font-medium text-gray-500 dark:text-gray-400 text-center">{alt || 'صورة توضيحية'}</span>
      </div>
    );
  }

  return (
    <div className={`relative flex justify-center w-full group ${className || ''}`}>
      {!loaded && (
         <div className="absolute inset-0 flex items-center justify-center bg-gray-50 dark:bg-gray-800 rounded-3xl w-full h-64">
            <div className="w-8 h-8 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
         </div>
      )}
      <img 
        src={src} 
        alt={alt || 'Book image'} 
        className={`max-w-full h-auto mx-auto transition-all duration-700 ${loaded ? 'opacity-100 scale-100' : 'opacity-0 scale-95'} ${imgClassName || 'rounded-3xl shadow-lg'}`}
        onError={() => setError(true)}
        onLoad={() => setLoaded(true)}
        loading="lazy" 
      />
    </div>
  );
};

// --- SPECIAL COMPONENTS ---

const IntroCover: React.FC = () => (
  <div className="relative bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-900 dark:to-gray-800 rounded-[3rem] overflow-hidden aspect-[3/4] md:aspect-video w-full flex flex-col justify-center items-center text-center p-6 md:p-12 shadow-2xl mb-12 border border-white/20">
    <div className="absolute top-0 left-0 w-full h-full overflow-hidden opacity-30 pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-96 h-96 bg-blue-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob"></div>
        <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-500 rounded-full mix-blend-multiply filter blur-3xl opacity-70 animate-blob animation-delay-2000"></div>
    </div>

    <div className="relative z-10 flex flex-col items-center justify-center h-full">
      <div className="mb-8 transform hover:scale-105 transition-transform duration-500">
          <h1 className="text-5xl md:text-8xl font-black text-transparent bg-clip-text bg-gradient-to-r from-blue-800 to-purple-800 dark:from-blue-400 dark:to-purple-400 mb-6 drop-shadow-sm">
            نموذج بدرية
          </h1>
          <h2 className="text-3xl md:text-5xl font-bold text-gray-700 dark:text-gray-200 tracking-wide">
            لريادة الأعمال
          </h2>
      </div>
      
      <div className="w-32 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mb-10"></div>

      <div className="text-center">
        <p className="text-xl font-medium text-gray-600 dark:text-gray-300 mb-2">تأليف</p>
        <p className="text-2xl md:text-4xl font-bold text-gray-900 dark:text-white">
          بدرية حامد الحجيلي
        </p>
      </div>
    </div>
  </div>
);

const IntroBismillah: React.FC = () => (
    <div className="flex flex-col items-center justify-center w-full py-12 md:py-16">
        <div className="w-full max-w-lg px-4 opacity-90 hover:opacity-100 transition-opacity duration-500">
             <ImageWithFallback 
                src="https://upload.wikimedia.org/wikipedia/commons/2/27/Basmala.svg" 
                alt="بسم الله الرحمن الرحيم" 
                className="w-full"
                imgClassName="drop-shadow-md"
             />
        </div>
    </div>
);

const IntroAuthorCard: React.FC = () => (
  <div className="bg-white dark:bg-gray-800 rounded-[2.5rem] shadow-xl overflow-hidden my-12 border border-gray-100 dark:border-gray-700">
    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 md:p-10 text-white text-right">
        <h2 className="text-4xl font-bold mb-3">عن الكاتبة</h2>
        <p className="text-blue-100 text-xl">بدرية حامد الحجيلي</p>
    </div>
    <div className="p-8 md:p-10">
        <ul className="grid gap-6">
            {authorData.bioPoints.map((point, index) => (
            <li key={index} className="flex items-start gap-4 text-right bg-gray-50 dark:bg-gray-700/50 p-5 rounded-2xl hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors">
                <span className="flex-shrink-0 mt-1 w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 flex items-center justify-center text-base font-bold">✓</span>
                <span className="text-gray-900 dark:text-gray-300 text-lg leading-relaxed font-medium">{point}</span>
            </li>
            ))}
        </ul>
    </div>
  </div>
);

const IntroTOC: React.FC = () => (
  <div className="my-12">
     <h2 className="text-4xl font-black text-gray-900 dark:text-white mb-10 text-right border-r-8 border-blue-600 pr-6">
      خارطة الطريق
     </h2>
     <div className="grid gap-4 md:grid-cols-2">
        {[
            { t: 'المقدمة', p: '01' },
            { t: 'نموذج بدرية للريادة', p: '02' },
            { t: 'النية', p: '03' },
            { t: 'المميزات الذاتية', p: '04' },
            { t: 'الشغف', p: '05' },
            { t: 'المهارات', p: '06' },
            { t: 'احتياج السوق', p: '07' },
            { t: 'منتج مبتكر', p: '08' },
            { t: 'المال', p: '09' },
            { t: 'التوصيات', p: '10' },
            { t: 'الخاتمة', p: '11' }
        ].map((item, idx) => (
            <div key={idx} className="flex justify-between items-center p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700 hover:border-blue-500 dark:hover:border-blue-500 hover:shadow-md transition-all duration-300 cursor-default">
                <span className="text-lg font-bold text-gray-900 dark:text-gray-200">{item.t}</span>
                <span className="text-sm font-mono text-gray-500 dark:text-gray-400 bg-gray-100 dark:bg-gray-700 px-3 py-1 rounded-lg">{item.p}</span>
            </div>
        ))}
     </div>
  </div>
);

// --- CONTENT RENDERER ---

interface BookPageProps {
  page: Page;
  fontStyles: any;
  onNavigateToPage: (pageNumber: number) => void;
  totalPages: number;
  isActive: boolean;
  isNavigatingTo: boolean; 
  onPlayAudio: (text: string, pageId: number) => void; 
  isPlayingAudio: boolean;
  isGeneratingAudio?: boolean;
}

const RenderContentItem: React.FC<{ item: ContentItem; index: number; fontStyles: any }> = ({ item, index, fontStyles }) => {
  switch (item.type) {
    case 'heading': {
        if (item.level === 1) {
            return (
                <div className="mb-16 mt-12 text-right border-b-2 border-gray-100 dark:border-gray-800 pb-8">
                    <span className="inline-block py-1.5 px-4 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-sm font-bold mb-6 shadow-sm">
                        وحدة تعليمية جديدة
                    </span>
                    <h1 className={`${fontStyles.h1} font-black text-gray-900 dark:text-white leading-tight transition-all duration-300`}>
                        {item.text}
                    </h1>
                </div>
            );
        }
        if (item.level === 2) {
             return (
                <div className="mb-10 mt-16 text-right relative">
                    <div className="absolute -right-4 top-0 bottom-0 w-1.5 bg-gradient-to-b from-blue-600 to-purple-600 rounded-full"></div>
                    <h2 className={`${fontStyles.h2} font-extrabold text-gray-900 dark:text-gray-100 pr-8 leading-snug transition-all duration-300`}>
                        {item.text}
                    </h2>
                </div>
            );
        }
        return (
            <h3 className={`${fontStyles.h3} font-bold text-blue-700 dark:text-blue-300 mb-6 mt-12 text-right flex items-center gap-3 transition-all duration-300`}>
                <span className="w-2.5 h-2.5 rounded-full bg-blue-500 inline-block ring-4 ring-blue-100 dark:ring-blue-900/30"></span>
                {item.text}
            </h3>
        );
    }
    case 'list':
      return (
        <div className="grid gap-5 grid-cols-1 md:grid-cols-2 my-10 text-right">
          {item.items?.map((li, i) => (
            <div key={i} className="bg-white dark:bg-gray-800 p-6 rounded-[1.5rem] border border-gray-100 dark:border-gray-700 shadow-sm hover:shadow-lg transition-all duration-300 flex items-start gap-4 group hover:-translate-y-1">
                <div className="mt-0.5 w-8 h-8 rounded-full bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 flex items-center justify-center text-sm font-bold flex-shrink-0 border border-blue-100 dark:border-blue-800 group-hover:bg-blue-600 group-hover:text-white transition-colors">
                    {i + 1}
                </div>
                <p className={`${fontStyles.base} text-gray-900 dark:text-gray-200 font-medium transition-all duration-300`}>{li}</p>
            </div>
          ))}
        </div>
      );
    case 'paragraph':
        return (
            <div className="mb-10 group">
                <p className={`${fontStyles.base} text-gray-900 dark:text-gray-200 text-right font-medium 
                              bg-white dark:bg-gray-800 
                              p-8 md:p-10 rounded-[2rem] 
                              border border-gray-100 dark:border-gray-700/50
                              shadow-[0_4px_20px_-4px_rgba(0,0,0,0.05)] hover:shadow-[0_8px_30px_-4px_rgba(0,0,0,0.08)]
                              transition-all duration-300 hover:-translate-y-1`}>
                    {item.text}
                </p>
            </div>
        );
    case 'image':
      return (
        <div className="my-16">
          <ImageWithFallback src={item.src} alt={item.alt} className="bg-white dark:bg-gray-800 p-4 rounded-[2.5rem] shadow-xl" imgClassName="rounded-[2rem]" />
        </div>
      );
    case 'cover': return <IntroCover />;
    case 'bismillah': return <IntroBismillah />;
    case 'author': return <IntroAuthorCard />;
    case 'toc': return <IntroTOC />;
    case 'saudi-map-model': return <SaudiModelMap />;
    case 'model-diagram': return <ModelCycle />;
    case 'visual-intention': return <VisualIntention />;
    case 'visual-personal': return <VisualPersonal />;
    case 'visual-passion': return <VisualPassion />;
    case 'visual-skills': return <VisualSkills />;
    case 'visual-market': return <VisualMarket />;
    case 'visual-product': return <VisualProduct />;
    case 'visual-money': return <VisualMoney />;
    case 'custom':
      return (
          <div className={item.className}>
              {item.content?.map((subItem, subIndex) => (
                  <RenderContentItem key={subIndex} item={subItem} index={subIndex} fontStyles={fontStyles} />
              ))}
          </div>
      );
    default:
      return null;
  }
};


const BookPage = forwardRef<HTMLDivElement, BookPageProps>(({ page, fontStyles, onNavigateToPage, isActive, onPlayAudio, isPlayingAudio, isGeneratingAudio }, ref) => {
  
  return (
    <div 
        id={`page-${page.pageNumber}`} 
        ref={ref} 
        className="w-full max-w-full mx-auto px-4 md:px-8 pb-24 animate-fade-in"
    >
      {/* Page Number Indicator (Static now) */}
      <div className="flex justify-end items-center mb-12 py-4">
         <div className="flex items-center gap-3">
            <span className="text-sm font-bold text-gray-400 uppercase tracking-widest">صفحة</span>
            <div className="w-10 h-10 rounded-xl bg-gray-100 dark:bg-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 font-bold shadow-sm text-lg">
                {page.pageNumber}
            </div>
         </div>
      </div>

      {/* Content Stream */}
      <div className="w-full space-y-2">
        {page.content.map((item, index) => (
            <RenderContentItem key={index} item={item} index={index} fontStyles={fontStyles} />
        ))}
      </div>
    </div>
  );
});

export default BookPage;
