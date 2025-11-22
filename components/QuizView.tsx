
import React, { useState, useEffect } from 'react';
import { QuizQuestion } from '../types';

interface QuizViewProps {
  questions: QuizQuestion[];
  onComplete: (score: number) => void;
  onRetry: () => void;
  onNextModule: () => void;
}

const QuizView: React.FC<QuizViewProps> = ({ questions, onComplete, onRetry, onNextModule }) => {
  const [currentQIndex, setCurrentQIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isAnswerConfirmed, setIsAnswerConfirmed] = useState(false);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);

  const currentQuestion = questions[currentQIndex];

  const handleConfirm = () => {
    if (selectedOption === null) return;

    const isCorrect = selectedOption === currentQuestion.correctAnswerIndex;
    if (isCorrect) setScore(prev => prev + 1);
    
    setIsAnswerConfirmed(true);
  };

  const handleNext = () => {
    if (currentQIndex < questions.length - 1) {
        setCurrentQIndex(prev => prev + 1);
        setSelectedOption(null);
        setIsAnswerConfirmed(false);
    } else {
        setShowResult(true);
    }
  };
  
  useEffect(() => {
      if (showResult) {
          const finalPercent = Math.round((score / questions.length) * 100);
          onComplete(finalPercent);
      }
  }, [showResult, score, questions.length, onComplete]);

  if (showResult) {
      const percentage = Math.round((score / questions.length) * 100);
      const isPassed = percentage >= 60;

      return (
          <div className="flex flex-col items-center justify-center min-h-[50vh] text-center p-8 animate-fade-in">
              <div className={`w-28 h-28 rounded-full flex items-center justify-center text-5xl mb-8 shadow-2xl
                  ${isPassed ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-600'}
              `}>
                  {isPassed ? '🎉' : '💪'}
              </div>
              <h2 className="text-3xl font-bold mb-2 text-gray-900 dark:text-white">
                  {isPassed ? 'أحسنت! لقد اجتزت الاختبار' : 'لم تجتز الاختبار هذه المرة'}
              </h2>
              <p className="text-xl text-gray-600 dark:text-gray-300 mb-10">
                  نتيجتك: <span className={`font-bold ${isPassed ? 'text-green-600' : 'text-red-600'}`}>{percentage}%</span>
              </p>
              
              <div className="flex gap-6">
                  {!isPassed && (
                      <button 
                          onClick={onRetry}
                          className="btn-liquid-primary px-8 py-4 rounded-2xl font-bold text-lg shadow-lg"
                      >
                          إعادة المحاولة
                      </button>
                  )}
                  {isPassed && (
                       <button 
                           onClick={onNextModule}
                           className="btn-liquid-primary px-10 py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center gap-3 animate-pulse-slow"
                           style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
                       >
                           <span>الانتقال للوحدة التالية</span>
                           <svg className="w-6 h-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                           </svg>
                       </button>
                  )}
              </div>
          </div>
      );
  }

  return (
    <div className="max-w-3xl mx-auto p-6 md:p-12 glass-panel bg-white/90 dark:bg-gray-800/90 rounded-[2.5rem] shadow-2xl mt-8 transition-all duration-500 backdrop-blur-xl">
        
        {/* Header / Progress */}
        <div className="flex flex-col gap-4 mb-8">
            <div className="flex justify-between items-center">
                <span className="text-sm font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider bg-blue-50 dark:bg-blue-900/20 px-3 py-1 rounded-full">اختبار المعلومات</span>
                <span className="text-sm font-bold text-gray-500 dark:text-gray-400">سؤال {currentQIndex + 1} من {questions.length}</span>
            </div>
            <div className="h-3 w-full bg-gray-100 dark:bg-gray-700 rounded-full overflow-hidden">
                <div 
                    className="h-full bg-gradient-to-r from-blue-500 to-purple-600 transition-all duration-500 ease-out rounded-full shadow-[0_0_10px_rgba(59,130,246,0.5)]" 
                    style={{ width: `${((currentQIndex + 1) / questions.length) * 100}%` }}
                ></div>
            </div>
        </div>

        {/* Question */}
        <h3 className="text-2xl md:text-3xl font-black text-gray-900 dark:text-white mb-10 leading-relaxed text-right">
            {currentQuestion.question}
        </h3>

        {/* Options */}
        <div className="space-y-5 mb-12">
            {currentQuestion.options.map((option, idx) => {
                let optionClass = "w-full p-6 rounded-2xl border-2 text-right transition-all duration-300 flex justify-between items-center text-lg font-medium ";
                
                if (isAnswerConfirmed) {
                    if (idx === currentQuestion.correctAnswerIndex) {
                        optionClass += "border-green-500 bg-green-50 dark:bg-green-900/30 text-green-800 dark:text-green-300 shadow-lg scale-[1.02]";
                    } else if (idx === selectedOption) {
                        optionClass += "border-red-500 bg-red-50 dark:bg-red-900/30 text-red-800 dark:text-red-300 opacity-90";
                    } else {
                        optionClass += "border-gray-100 dark:border-gray-700 bg-gray-50/50 dark:bg-gray-800/50 text-gray-400 dark:text-gray-500 opacity-50";
                    }
                } else {
                    if (selectedOption === idx) {
                        optionClass += "border-blue-500 bg-blue-50 dark:bg-blue-900/30 text-blue-900 dark:text-blue-100 ring-4 ring-blue-100 dark:ring-blue-900/50 shadow-lg scale-[1.02]";
                    } else {
                        optionClass += "border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-200 hover:border-blue-400 hover:bg-blue-50 dark:hover:bg-gray-700 hover:shadow-md";
                    }
                }

                return (
                    <button
                        key={idx}
                        onClick={() => !isAnswerConfirmed && setSelectedOption(idx)}
                        disabled={isAnswerConfirmed}
                        className={optionClass}
                    >
                        <span className="leading-relaxed">{option}</span>
                        {isAnswerConfirmed && idx === currentQuestion.correctAnswerIndex && (
                            <div className="w-8 h-8 bg-green-100 dark:bg-green-800 rounded-full flex items-center justify-center text-green-600 dark:text-green-200 flex-shrink-0 mr-4 shadow-sm">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                                </svg>
                            </div>
                        )}
                        {isAnswerConfirmed && idx === selectedOption && idx !== currentQuestion.correctAnswerIndex && (
                            <div className="w-8 h-8 bg-red-100 dark:bg-red-800 rounded-full flex items-center justify-center text-red-600 dark:text-red-200 flex-shrink-0 mr-4 shadow-sm">
                                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                                </svg>
                            </div>
                        )}
                    </button>
                );
            })}
        </div>

        {/* Explanation Box */}
        {isAnswerConfirmed && (
            <div className="mb-10 p-8 bg-blue-50/80 dark:bg-blue-900/20 rounded-3xl border border-blue-100 dark:border-blue-800 animate-slide-up backdrop-blur-sm">
                <div className="flex items-start gap-4">
                    <div className="mt-1 w-8 h-8 rounded-full bg-blue-200 dark:bg-blue-800 flex items-center justify-center text-blue-700 dark:text-blue-200 font-bold text-sm flex-shrink-0 shadow-inner">i</div>
                    <div>
                        <h4 className="font-bold text-blue-900 dark:text-blue-100 mb-2 text-lg">توضيح الإجابة:</h4>
                        <p className="text-blue-800 dark:text-blue-200 leading-relaxed text-lg">
                            {currentQuestion.explanation}
                        </p>
                    </div>
                </div>
            </div>
        )}

        {/* Actions */}
        <div className="flex justify-end pt-6 border-t border-gray-100 dark:border-gray-700">
            {!isAnswerConfirmed ? (
                <button
                    onClick={handleConfirm}
                    disabled={selectedOption === null}
                    className="btn-liquid-primary px-12 py-4 rounded-2xl font-bold text-lg shadow-xl"
                >
                    تأكيد الإجابة
                </button>
            ) : (
                <button
                    onClick={handleNext}
                    className="btn-liquid-primary px-12 py-4 rounded-2xl font-bold text-lg shadow-xl flex items-center gap-3"
                    style={{ background: 'linear-gradient(135deg, #16a34a, #15803d)' }}
                >
                    {currentQIndex < questions.length - 1 ? 'السؤال التالي' : 'عرض النتيجة'}
                    <svg className="w-6 h-6 transform rotate-180" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                         <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                </button>
            )}
        </div>
    </div>
  );
};

export default QuizView;
