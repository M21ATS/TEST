import React, { forwardRef } from 'react';

const CoverPage = forwardRef<HTMLElement>((props, ref) => {
  return (
    <section id="cover" ref={ref} className="relative bg-[#f0f2f5] dark:bg-gray-800 rounded-xl shadow-2xl overflow-hidden aspect-[1/1.414] w-full flex flex-col justify-center items-center text-center p-8 mb-8">
      {/* Decorative shapes */}
      <div className="absolute top-[-20%] right-[-30%] h-[120%] w-[120%]">
        <div className="absolute w-full h-full bg-[#1e40af] dark:bg-blue-800 transform rotate-[30deg] translate-x-[25%] translate-y-[15%]"></div>
      </div>
      <div className="absolute bottom-[-50%] left-[-30%] h-full w-full">
          <div className="absolute w-full h-full bg-[#9ca3af] dark:bg-gray-600 transform rotate-[30deg] -translate-x-[25%] translate-y-[10%]"></div>
      </div>
      
      <div className="relative z-10 space-y-8 text-white dark:text-gray-100">
        <h1 className="text-5xl md:text-7xl font-extrabold text-shadow-lg">
          نموذج بدرية <br/> لريادة الأعمال
        </h1>
        <p className="text-5xl md:text-6xl font-bold text-shadow">(1)</p>
      </div>
       <div className="absolute bottom-10 right-10 z-10 text-right text-white dark:text-gray-100">
            <p className="text-xl md:text-2xl font-medium text-shadow-sm">
                بدرية حامد الحجيلي
            </p>
            <p className="mt-1 text-lg md:text-xl text-shadow-sm">
                رائدة أعمال وناشطة مجتمعية
            </p>
        </div>
        <footer className="absolute bottom-4 text-center w-full">
            <p className="font-mono text-sm text-gray-200 dark:text-gray-400 text-shadow">1</p>
        </footer>
        <style>{`
          .text-shadow-lg { text-shadow: 2px 2px 4px rgba(0, 0, 0, 0.4); }
          .text-shadow-sm { text-shadow: 1px 1px 2px rgba(0, 0, 0, 0.3); }
          .text-shadow { text-shadow: 1px 1px 3px rgba(0, 0, 0, 0.3); }
        `}</style>
    </section>
  );
});

export default CoverPage;