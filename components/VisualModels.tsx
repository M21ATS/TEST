
import React from 'react';

// Common styles
const containerClass = "w-full flex flex-col items-center my-8";
const svgClass = "w-full max-w-xl aspect-video drop-shadow-xl mb-2";
const textStyle = { fill: "white", textAnchor: "middle" as const, fontWeight: "bold" };
const captionClass = "text-xs text-gray-400 dark:text-gray-500 font-mono";
const captionText = "تم تصميم هذا النموذج التصوري بواسطة الذكاء الاصطناعي";

export const ModelCycle: React.FC = () => (
  <div className={containerClass}>
    <svg viewBox="0 0 600 400" className={svgClass}>
      <rect width="600" height="400" rx="20" fill="#f3f4f6" className="dark:fill-gray-800" />
      <circle cx="300" cy="200" r="50" fill="#a3e635" stroke="white" strokeWidth="3" />
      <text x="300" y="205" fontSize="20" fill="#1f2937" {...textStyle}>النية</text>
      <line x1="300" y1="200" x2="450" y2="120" stroke="#9ca3af" strokeWidth="2" strokeDasharray="5,5" />
      <circle cx="450" cy="120" r="45" fill="#1e3a8a" />
      <text x="450" y="125" fontSize="14" {...textStyle}>المميزات الذاتية</text>
      <line x1="300" y1="200" x2="500" y2="250" stroke="#9ca3af" strokeWidth="2" strokeDasharray="5,5" />
      <circle cx="500" cy="250" r="45" fill="#facc15" />
      <text x="500" y="255" fontSize="16" fill="#1f2937" {...textStyle}>الشغف</text>
      <line x1="300" y1="200" x2="300" y2="330" stroke="#9ca3af" strokeWidth="2" strokeDasharray="5,5" />
      <circle cx="300" cy="330" r="45" fill="#1d4ed8" />
      <text x="300" y="335" fontSize="16" {...textStyle}>المهارات</text>
      <line x1="300" y1="200" x2="100" y2="250" stroke="#9ca3af" strokeWidth="2" strokeDasharray="5,5" />
      <circle cx="100" cy="250" r="45" fill="#ea580c" />
      <text x="100" y="255" fontSize="14" {...textStyle}>احتياج السوق</text>
      <line x1="300" y1="200" x2="150" y2="120" stroke="#9ca3af" strokeWidth="2" strokeDasharray="5,5" />
      <circle cx="150" cy="120" r="45" fill="#2dd4bf" />
      <text x="150" y="125" fontSize="16" {...textStyle}>منتج مبتكر</text>
      <line x1="300" y1="200" x2="300" y2="70" stroke="#9ca3af" strokeWidth="2" strokeDasharray="5,5" />
      <circle cx="300" cy="70" r="45" fill="#3b82f6" />
      <text x="300" y="75" fontSize="18" {...textStyle}>المال</text>
    </svg>
    <span className={captionClass}>{captionText}</span>
  </div>
);

export const VisualIntention: React.FC = () => (
  <div className={containerClass}>
    <svg viewBox="0 0 400 300" className={svgClass}>
      <defs>
        <linearGradient id="compassGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#a3e635" />
          <stop offset="100%" stopColor="#4d7c0f" />
        </linearGradient>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="4" stdDeviation="4" floodColor="#000" floodOpacity="0.25"/>
        </filter>
      </defs>
      
      {/* Background */}
      <rect width="400" height="300" rx="15" fill="#f0fdf4" className="dark:fill-gray-900" />
      
      {/* Compass Body */}
      <circle cx="200" cy="150" r="80" fill="white" stroke="#d1fae5" strokeWidth="8" filter="url(#shadow)" />
      
      {/* Compass Star/Needle */}
      <g transform="translate(200, 150)">
        {/* North */}
        <path d="M0 -60 L15 0 L0 60 L-15 0 Z" fill="url(#compassGradient)" transform="rotate(45)"/>
        <path d="M0 -60 L15 0 L0 60 L-15 0 Z" fill="#e5e7eb" transform="rotate(45) scale(1, -1)"/>
        
        {/* Center Pin */}
        <circle r="8" fill="#3f6212" />
        <circle r="4" fill="#a3e635" />
      </g>

      {/* Labels */}
      <text x="200" y="50" fontSize="32" fill="#3f6212" {...textStyle} fontWeight="800">النية</text>
      <text x="200" y="270" fontSize="16" fill="#4d7c0f" {...textStyle} fontWeight="500">البوصلة التي توجه العمل</text>
    </svg>
    <span className={captionClass}>{captionText}</span>
  </div>
);

export const VisualPersonal: React.FC = () => (
  <div className={containerClass}>
    <svg viewBox="0 0 400 300" className={svgClass}>
      <rect width="400" height="300" rx="15" fill="#dbeafe" className="dark:fill-gray-900" />
      <circle cx="200" cy="120" r="60" fill="#1e3a8a" />
      <path d="M100 300 L300 300 L300 240 C 300 200, 100 200, 100 240 Z" fill="#1e3a8a" />
      <circle cx="200" cy="120" r="40" fill="#3b82f6" opacity="0.5" />
      <text x="200" y="130" fontSize="32" fill="white" {...textStyle}>?</text>
      <text x="200" y="250" fontSize="28" fill="white" {...textStyle}>المميزات الذاتية</text>
    </svg>
    <span className={captionClass}>{captionText}</span>
  </div>
);

export const VisualPassion: React.FC = () => (
  <div className={containerClass}>
    <svg viewBox="0 0 400 300" className={svgClass}>
      <defs>
        <linearGradient id="heartGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#facc15" />
          <stop offset="50%" stopColor="#eab308" />
          <stop offset="100%" stopColor="#ca8a04" />
        </linearGradient>
        <radialGradient id="glow" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stopColor="#fef08a" stopOpacity="0.8"/>
          <stop offset="100%" stopColor="#fef08a" stopOpacity="0"/>
        </radialGradient>
      </defs>
      
      <rect width="400" height="300" rx="15" fill="#fffbeb" className="dark:fill-gray-900" />
      
      {/* Glow Effect */}
      <circle cx="200" cy="150" r="100" fill="url(#glow)" />
      
      {/* Stylized Heart with Inner Energy */}
      <path d="M200 230 C 200 230 290 170 290 110 C 290 60 250 40 220 60 C 200 75 200 100 200 100 C 200 100 200 75 180 60 C 150 40 110 60 110 110 C 110 170 200 230 200 230 Z" fill="url(#heartGradient)" stroke="#854d0e" strokeWidth="2" />
      
      {/* Pulse Line inside */}
      <path d="M160 110 L 180 130 L 200 90 L 220 120 L 240 110" fill="none" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" opacity="0.8" />

      <text x="200" y="270" fontSize="32" fill="#854d0e" {...textStyle}>الشغف</text>
      <text x="200" y="290" fontSize="14" fill="#ca8a04" {...textStyle} opacity="0.8">المحرك الداخلي</text>
    </svg>
    <span className={captionClass}>{captionText}</span>
  </div>
);

export const VisualSkills: React.FC = () => (
  <div className={containerClass}>
    <svg viewBox="0 0 400 300" className={svgClass}>
      <rect width="400" height="300" rx="15" fill="#eff6ff" className="dark:fill-gray-900" />
      <g transform="translate(150, 150)">
        <circle r="60" fill="#1d4ed8" />
        <circle r="20" fill="#eff6ff" />
        {[0, 45, 90, 135, 180, 225, 270, 315].map(rot => (
            <rect key={rot} x="-10" y="-75" width="20" height="25" fill="#1d4ed8" transform={`rotate(${rot})`} />
        ))}
      </g>
      <g transform="translate(260, 100)">
        <circle r="40" fill="#3b82f6" />
        <circle r="15" fill="#eff6ff" />
        {[0, 60, 120, 180, 240, 300].map(rot => (
            <rect key={rot} x="-8" y="-50" width="16" height="20" fill="#3b82f6" transform={`rotate(${rot})`} />
        ))}
      </g>
      <text x="200" y="260" fontSize="32" fill="#1e40af" {...textStyle}>المهارات</text>
    </svg>
    <span className={captionClass}>{captionText}</span>
  </div>
);

export const VisualMarket: React.FC = () => (
  <div className={containerClass}>
    <svg viewBox="0 0 400 300" className={svgClass}>
      <rect width="400" height="300" rx="15" fill="#ffedd5" className="dark:fill-gray-900" />
      <circle cx="200" cy="140" r="90" fill="#ea580c" opacity="0.2" />
      <circle cx="200" cy="140" r="70" fill="#ea580c" opacity="0.5" />
      <circle cx="200" cy="140" r="50" fill="#ea580c" />
      <path d="M235 175 L280 220" stroke="#9a3412" strokeWidth="15" strokeLinecap="round" />
      <text x="200" y="270" fontSize="32" fill="#c2410c" {...textStyle}>احتياج السوق</text>
    </svg>
    <span className={captionClass}>{captionText}</span>
  </div>
);

export const VisualProduct: React.FC = () => (
  <div className={containerClass}>
    <svg viewBox="0 0 400 300" className={svgClass}>
      <rect width="400" height="300" rx="15" fill="#ccfbf1" className="dark:fill-gray-900" />
      <path d="M160 100 C 160 50, 240 50, 240 100 C 240 130, 220 140, 220 160 L 180 160 C 180 140, 160 130, 160 100" fill="#2dd4bf" />
      <rect x="180" y="165" width="40" height="10" fill="#0f766e" />
      <rect x="180" y="180" width="40" height="10" fill="#0f766e" />
      <path d="M185 195 L 215 195 L 200 210 Z" fill="#0f766e" />
      <line x1="200" y1="40" x2="200" y2="20" stroke="#2dd4bf" strokeWidth="4" strokeLinecap="round" />
      <line x1="130" y1="70" x2="110" y2="50" stroke="#2dd4bf" strokeWidth="4" strokeLinecap="round" />
      <line x1="270" y1="70" x2="290" y2="50" stroke="#2dd4bf" strokeWidth="4" strokeLinecap="round" />
      <text x="200" y="250" fontSize="32" fill="#0f766e" {...textStyle}>منتج مبتكر</text>
    </svg>
    <span className={captionClass}>{captionText}</span>
  </div>
);

export const VisualMoney: React.FC = () => (
  <div className={containerClass}>
    <svg viewBox="0 0 400 300" className={svgClass}>
      <rect width="400" height="300" rx="15" fill="#dbeafe" className="dark:fill-gray-900" />
      <rect x="100" y="180" width="40" height="40" fill="#3b82f6" rx="4" />
      <rect x="160" y="140" width="40" height="80" fill="#2563eb" rx="4" />
      <rect x="220" y="100" width="40" height="120" fill="#1d4ed8" rx="4" />
      <rect x="280" y="60" width="40" height="160" fill="#1e40af" rx="4" />
      <polyline points="80,200 140,160 200,120 260,80 320,40" fill="none" stroke="#facc15" strokeWidth="6" strokeLinecap="round" />
      <circle cx="320" cy="40" r="6" fill="#facc15" />
      <text x="200" y="260" fontSize="32" fill="#1e3a8a" {...textStyle}>المال</text>
    </svg>
    <span className={captionClass}>{captionText}</span>
  </div>
);
