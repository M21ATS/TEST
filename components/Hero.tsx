
import React from 'react';

const Hero: React.FC = () => {
  return (
    <section id="hero" className="relative bg-[#f0f2f5] dark:bg-gray-800 rounded-3xl shadow-2xl overflow-hidden h-[90vh] flex flex-col justify-center items-center text-center p-8 mb-12 scroll-mt-20 border border-white/20">
      {/* Decorative shapes */}
      <div className="absolute top-[-20%] right-[-30%] h-[120%] w-[120%] pointer-events-none">
        <div className="absolute w-full h-full bg-[#1e40af] dark:bg-blue-800 transform rotate-[30deg] translate-x-[25%] translate-y-[15%] opacity-20 dark:opacity-40 blur-3xl"></div>
      </div>
      <div className="absolute bottom-[-50%] left-[-30%] h-full w-full pointer-events-none">
          <div className="absolute w-full h-full bg-[#9ca3af] dark:bg-gray-600 transform rotate-[30deg] -translate-x-[25%] translate-y-[10%] opacity-20 dark:opacity-40 blur-3xl"></div>
      </div>
      
      {/* CSS Pattern Background */}
      <div 
        className="absolute inset-0 opacity-10 dark:opacity-5 pointer-events-none"
        style={{ 
          backgroundImage: 'radial-gradient(#4b5563 1px, transparent 1px)',
          backgroundSize: '30px 30px'
        }}
      ></div>
      
      <div className="relative z-10 space-y-8 text-black dark:text-gray-100">
        <h1 className="text-5xl md:text-7xl font-extrabold text-shadow-none dark:text-shadow-lg tracking-tight">
          نموذج بدرية <br/> لريادة الأعمال
        </h1>
        <p className="text-5xl md:text-6xl font-bold text-shadow-none dark:text-shadow opacity-80">(1)</p>
      </div>
       <div className="absolute bottom-10 right-10 z-10 text-right text-black dark:text-gray-100">
            <p className="text-xl md:text-2xl font-medium text-shadow-none dark:text-shadow-sm">
                بدرية حامد الحجيلي
            </p>
            <p className="mt-1 text-lg md:text-xl text-shadow-none dark:text-shadow-sm opacity-80">
                رائدة أعمال وناشطة مجتمعية
            </p>
        </div>
        <style>{`
          .text-shadow-lg { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4); }
          .text-shadow-sm { text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3); }
          .text-shadow { text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3); }
        `}</style>
    </section>
  );
};

export default Hero;
