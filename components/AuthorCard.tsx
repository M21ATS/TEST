import React from 'react';
import type { Author } from '../types';

interface AuthorCardProps {
  author: Author;
  fontStyles: {
    base: string;
    lineHeight: string;
    h2: string;
    h3: string;
  };
}

const AuthorCard: React.FC<AuthorCardProps> = ({ author, fontStyles }) => {
  return (
    <section id="author" className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 md:p-10 mb-12 scroll-mt-20">
      <h2 className={`${fontStyles.h2} font-bold text-blue-800 dark:text-blue-400 border-b-2 border-gray-200 dark:border-gray-700 pb-3 mb-6`}>
        تعريف عن الكاتبة
      </h2>
      <div className="text-center mb-6">
        <h3 className={`${fontStyles.h3} font-bold text-gray-800 dark:text-gray-100`}>{author.name}</h3>
        <p className={`${fontStyles.base} text-gray-600 dark:text-gray-400`}>{author.title}</p>
      </div>
      <div className="space-y-3">
        <ul className={`list-disc list-outside pr-5 space-y-2 text-gray-700 dark:text-gray-300 ${fontStyles.base} ${fontStyles.lineHeight}`}>
          {author.bioPoints.map((point, index) => (
            <li key={index}>{point}</li>
          ))}
        </ul>
      </div>
    </section>
  );
};

export default AuthorCard;