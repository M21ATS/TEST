import React from 'react';
import type { ContentItem } from '../types';

interface SectionProps {
  id: string;
  title: string;
  subtitle?: string;
  content: ContentItem[];
  fontStyles: {
    base: string;
    lineHeight: string;
    h2: string;
    h3: string;
    h4: string;
  };
  isBismillah?: boolean;
}

const Section: React.FC<SectionProps> = ({ id, title, subtitle, content, fontStyles, isBismillah = false }) => {
  if (isBismillah) {
    return (
        <section id={id} className="mb-12 scroll-mt-20">
             <img src={content[0].src} alt={content[0].alt} className="max-w-full md:max-w-2xl mx-auto"/>
        </section>
    )
  }

  const isTOC = id === 'table-of-contents';

  return (
    <section id={id} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-10 mb-12 scroll-mt-20">
      <h2 className={`${fontStyles.h2} relative font-bold text-blue-800 dark:text-blue-400 pb-3 mb-6`}>
        {title}
        <span className="absolute bottom-0 right-0 h-1 w-24 bg-blue-800 dark:bg-blue-400"></span>
      </h2>
      {subtitle && (
        <h3 className={`${fontStyles.h3} font-semibold text-gray-700 dark:text-gray-300 mb-6`}>{subtitle}</h3>
      )}
      <div className={`space-y-4 text-gray-700 dark:text-gray-300 ${fontStyles.base} ${fontStyles.lineHeight}`}>
        {content.map((item, index) => {
          switch (item.type) {
            case 'heading':
              return (
                <h4 key={index} className={`${fontStyles.h4} font-semibold text-gray-800 dark:text-gray-100 pt-4`}>
                  {item.text}
                </h4>
              );
            case 'list':
              if (isTOC) {
                 return (
                    <ul key={index} className="space-y-3">
                        {item.items?.map((li, i) => (
                            <li key={i} className="flex justify-between items-baseline border-b border-dashed border-gray-300 dark:border-gray-600 pb-1">
                                <span>{li.split('...')[0]}</span>
                                <span className="font-mono">{li.split('...').pop()}</span>
                            </li>
                        ))}
                    </ul>
                 )
              }
              return (
                <ul key={index} className="list-disc list-outside pr-5 space-y-2">
                  {item.items?.map((li, i) => <li key={i}>{li}</li>)}
                </ul>
              );
            case 'image':
              return (
                <div key={index} className="py-4 flex justify-center">
                    <img src={item.src} alt={item.alt || title} className="max-w-full md:max-w-2xl mx-auto rounded-lg shadow-md"/>
                </div>
              )
            case 'paragraph':
            default:
              return <p key={index}>{item.text}</p>;
          }
        })}
      </div>
    </section>
  );
};

export default Section;