
import React from 'react';

const SaudiModelMap: React.FC = () => {
  return (
    <div className="w-full flex justify-center my-8">
      <div className="relative w-full max-w-2xl aspect-[4/3] bg-blue-50 dark:bg-gray-900 rounded-xl shadow-inner border border-gray-200 dark:border-gray-700 overflow-hidden p-4">
        <svg viewBox="0 0 500 400" className="w-full h-full drop-shadow-xl">
          {/* 
            Approximation of Saudi Arabia Map Regions based on the "Badriyah Model" 
            Coordinates are roughly estimated to create the visual representation.
          */}
          
          {/* 1. Money (North) - Blue */}
          <path 
            d="M150,20 L250,10 L350,30 L320,100 L200,120 L120,80 Z" 
            fill="#3b82f6" 
            stroke="white" 
            strokeWidth="2"
            className="hover:brightness-110 transition-all duration-300"
          />
          <text x="240" y="70" fontSize="22" fill="white" textAnchor="middle" fontWeight="bold" className="pointer-events-none">المال</text>

          {/* 2. Innovative Product (North West) - Teal */}
          <path 
            d="M30,80 L150,20 L120,80 L200,120 L180,180 L50,150 Z" 
            fill="#2dd4bf" 
            stroke="white" 
            strokeWidth="2"
            className="hover:brightness-110 transition-all duration-300"
          />
          <text x="110" y="120" fontSize="20" fill="white" textAnchor="middle" fontWeight="bold" transform="rotate(-15, 110, 120)" className="pointer-events-none">منتج مبتكر</text>

          {/* 3. Intention (Center Small) - Lime Green */}
          <path 
            d="M200,120 L260,120 L280,170 L220,180 L180,180 Z" 
            fill="#a3e635" 
            stroke="white" 
            strokeWidth="2"
            className="hover:brightness-110 transition-all duration-300"
          />
          <text x="235" y="160" fontSize="18" fill="#1f2937" textAnchor="middle" fontWeight="bold" className="pointer-events-none">النية</text>

          {/* 4. Market Need (Center East) - Orange */}
          <path 
            d="M260,120 L320,100 L360,160 L350,280 L250,290 L220,180 L280,170 Z" 
            fill="#ea580c" 
            stroke="white" 
            strokeWidth="2"
            className="hover:brightness-110 transition-all duration-300"
          />
          <text x="300" y="210" fontSize="24" fill="white" textAnchor="middle" fontWeight="bold" className="pointer-events-none">احتياج السوق</text>

          {/* 5. Personal Advantages (East) - Dark Blue */}
          <path 
            d="M350,30 L450,150 L480,250 L350,280 L360,160 L320,100 Z" 
            fill="#1e3a8a" 
            stroke="white" 
            strokeWidth="2"
            className="hover:brightness-110 transition-all duration-300"
          />
          <text x="400" y="180" fontSize="20" fill="white" textAnchor="middle" fontWeight="bold" transform="rotate(60, 400, 180)" className="pointer-events-none">المميزات الذاتية</text>

          {/* 6. Skills (West Coast) - Medium Blue */}
          <path 
            d="M50,150 L180,180 L220,180 L250,290 L180,280 L150,350 L100,300 Z" 
            fill="#1d4ed8" 
            stroke="white" 
            strokeWidth="2"
            className="hover:brightness-110 transition-all duration-300"
          />
          <text x="140" y="240" fontSize="22" fill="white" textAnchor="middle" fontWeight="bold" transform="rotate(55, 140, 240)" className="pointer-events-none">المهارات</text>

          {/* 7. Passion (South) - Yellow */}
          <path 
            d="M180,280 L250,290 L350,280 L330,380 L250,390 L150,350 Z" 
            fill="#facc15" 
            stroke="white" 
            strokeWidth="2"
            className="hover:brightness-110 transition-all duration-300"
          />
          <text x="260" y="340" fontSize="24" fill="#1f2937" textAnchor="middle" fontWeight="bold" className="pointer-events-none">الشغف</text>

        </svg>
        <div className="absolute bottom-2 left-2 text-xs text-gray-400">
          * تمثيل تخيلي للنموذج
        </div>
      </div>
    </div>
  );
};

export default SaudiModelMap;
