
import React from 'react';

const SaudiModelMap: React.FC = () => {
  return (
    <div className="w-full flex justify-center my-16 animate-fade-in">
      <div className="relative w-full max-w-5xl aspect-[16/10] glass-panel bg-[#0f172a] rounded-[3rem] shadow-2xl border border-gray-700 overflow-hidden p-4 md:p-10 group">
        
        {/* Abstract Grid Background */}
        <div className="absolute inset-0 opacity-20" 
             style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}>
        </div>
        
        {/* Header Label */}
        <div className="absolute top-8 right-10 z-20">
            <h3 className="text-3xl font-black text-white tracking-tight">نموذج ريادة الأعمال</h3>
            <p className="text-sm font-bold text-emerald-400 mt-2 tracking-wide uppercase">Strategic Map View</p>
        </div>

        <svg viewBox="0 0 800 600" className="w-full h-full drop-shadow-[0_0_30px_rgba(0,0,0,0.5)]">
          <defs>
             <linearGradient id="landGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#1e293b" />
                <stop offset="100%" stopColor="#0f172a" />
             </linearGradient>
             <filter id="neonGlow" x="-20%" y="-20%" width="140%" height="140%">
                <feGaussianBlur stdDeviation="4" result="coloredBlur" />
                <feMerge>
                    <feMergeNode in="coloredBlur" />
                    <feMergeNode in="SourceGraphic" />
                </feMerge>
             </filter>
             <pattern id="techPattern" x="0" y="0" width="10" height="10" patternUnits="userSpaceOnUse">
                 <circle cx="1" cy="1" r="1" fill="rgba(255,255,255,0.1)" />
             </pattern>
          </defs>

          {/* Base Map Silhouette - Dark Tech Style */}
          <g transform="translate(50, 50) scale(0.9)">
             
             {/* Western Region (Intention) */}
             <path 
                d="M120,150 L220,150 L250,400 L150,500 L80,420 L50,200 Z" 
                fill="rgba(132, 204, 22, 0.15)" stroke="#84cc16" strokeWidth="1"
                className="hover:fill-lime-500/40 transition-all duration-500 cursor-pointer"
             />
             <circle cx="150" cy="300" r="6" fill="#84cc16" filter="url(#neonGlow)" />
             <text x="150" y="330" fontSize="14" fill="#d9f99d" textAnchor="middle" fontWeight="bold">النية</text>

             {/* Northern Region (Personal) */}
             <path 
                d="M50,200 L120,150 L220,150 L300,100 L450,100 L350,200 L250,220 Z" 
                fill="rgba(59, 130, 246, 0.15)" stroke="#3b82f6" strokeWidth="1"
                className="hover:fill-blue-500/40 transition-all duration-500 cursor-pointer"
             />
             <circle cx="280" cy="160" r="6" fill="#3b82f6" filter="url(#neonGlow)" />
             <text x="280" y="190" fontSize="14" fill="#bfdbfe" textAnchor="middle" fontWeight="bold">الذات</text>

             {/* Central Region (Market) */}
             <path 
                d="M250,220 L350,200 L500,250 L450,400 L250,400 Z" 
                fill="rgba(249, 115, 22, 0.15)" stroke="#f97316" strokeWidth="1"
                className="hover:fill-orange-500/40 transition-all duration-500 cursor-pointer"
             />
             <circle cx="350" cy="300" r="15" fill="none" stroke="#f97316" strokeWidth="2" className="animate-ping" />
             <circle cx="350" cy="300" r="6" fill="#f97316" filter="url(#neonGlow)" />
             <text x="350" y="330" fontSize="16" fill="#fed7aa" textAnchor="middle" fontWeight="bold">السوق</text>

             {/* Eastern Region (Product) */}
             <path 
                d="M450,100 L550,120 L600,180 L620,300 L500,250 L350,200 Z" 
                fill="rgba(20, 184, 166, 0.15)" stroke="#14b8a6" strokeWidth="1"
                className="hover:fill-teal-500/40 transition-all duration-500 cursor-pointer"
             />
             <circle cx="520" cy="200" r="6" fill="#14b8a6" filter="url(#neonGlow)" />
             <text x="520" y="230" fontSize="14" fill="#99f6e4" textAnchor="middle" fontWeight="bold">المنتج</text>

             {/* Southern Region (Passion) */}
             <path 
                d="M150,500 L250,400 L350,450 L300,580 L180,550 Z" 
                fill="rgba(234, 179, 8, 0.15)" stroke="#eab308" strokeWidth="1"
                className="hover:fill-yellow-500/40 transition-all duration-500 cursor-pointer"
             />
             <circle cx="250" cy="480" r="6" fill="#eab308" filter="url(#neonGlow)" />
             <text x="250" y="510" fontSize="14" fill="#fef08a" textAnchor="middle" fontWeight="bold">الشغف</text>

             {/* Empty Quarter (Skills) */}
             <path 
                d="M350,450 L450,400 L500,250 L620,300 L650,450 L500,550 L300,580 Z" 
                fill="rgba(99, 102, 241, 0.15)" stroke="#6366f1" strokeWidth="1"
                className="hover:fill-indigo-500/40 transition-all duration-500 cursor-pointer"
             />
             <circle cx="500" cy="450" r="6" fill="#6366f1" filter="url(#neonGlow)" />
             <text x="500" y="480" fontSize="14" fill="#c7d2fe" textAnchor="middle" fontWeight="bold">المهارات</text>

             {/* Connection Lines */}
             <path d="M150,300 L280,160 L520,200 L500,450 L250,480 L150,300" fill="none" stroke="rgba(255,255,255,0.2)" strokeDasharray="4,4" />
             
          </g>
        </svg>
        
        <div className="absolute bottom-6 left-8">
           <div className="flex gap-2 items-center bg-black/60 backdrop-blur-md px-4 py-2 rounded-full border border-gray-700">
               <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
               <span className="text-xs text-gray-300 font-mono">LIVE SYSTEM VIEW</span>
           </div>
        </div>
      </div>
    </div>
  );
};

export default SaudiModelMap;
