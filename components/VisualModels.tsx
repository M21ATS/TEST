
import React from 'react';

// Modern Abstract Container
const containerClass = "w-full flex flex-col items-center my-16 animate-fade-in group";
const svgClass = "w-full max-w-2xl aspect-video drop-shadow-2xl mb-6 transition-all duration-700 hover:scale-[1.02]";
const textStyle = { textAnchor: "middle" as const, fontWeight: "bold", fontFamily: "Tajawal, sans-serif" };

// Gradient Defs Helper
const GradientDefs = () => (
  <defs>
    <linearGradient id="blueGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#3b82f6" /><stop offset="100%" stopColor="#1d4ed8" /></linearGradient>
    <linearGradient id="greenGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#84cc16" /><stop offset="100%" stopColor="#4d7c0f" /></linearGradient>
    <linearGradient id="orangeGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#f97316" /><stop offset="100%" stopColor="#c2410c" /></linearGradient>
    <linearGradient id="purpleGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#a855f7" /><stop offset="100%" stopColor="#7e22ce" /></linearGradient>
    <linearGradient id="tealGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#14b8a6" /><stop offset="100%" stopColor="#0f766e" /></linearGradient>
    <linearGradient id="goldGrad" x1="0" y1="0" x2="1" y2="1"><stop offset="0%" stopColor="#fbbf24" /><stop offset="100%" stopColor="#b45309" /></linearGradient>
    <filter id="glass" x="-20%" y="-20%" width="140%" height="140%">
        <feGaussianBlur in="SourceGraphic" stdDeviation="5" result="blur" />
        <feColorMatrix in="blur" mode="matrix" values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -7" result="ooze" />
        <feComposite in="SourceGraphic" in2="ooze" operator="atop"/>
    </filter>
    <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="15" result="coloredBlur"/>
      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
    <filter id="intenseGlow" x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="25" result="coloredBlur"/>
      <feMerge><feMergeNode in="coloredBlur"/><feMergeNode in="SourceGraphic"/></feMerge>
    </filter>
  </defs>
);

export const ModelCycle: React.FC = () => (
  <div className={containerClass}>
    <div className="glass-panel p-10 rounded-[3rem] bg-[#0f172a] border border-gray-800 w-full shadow-[0_0_50px_rgba(0,0,0,0.3)] relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-10"></div>
        <svg viewBox="0 0 800 400" className="w-full h-auto relative z-10">
        <GradientDefs />
        
        {/* Orbital Rings */}
        <ellipse cx="400" cy="200" rx="300" ry="150" fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth="2" />
        <ellipse cx="400" cy="200" rx="250" ry="120" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth="1" strokeDasharray="10,10" className="animate-[spin_20s_linear_infinite]" />

        {/* Nodes */}
        {[
            { x: 150, y: 200, c: "url(#greenGrad)", l: "1. النية", i: "🧭" },
            { x: 250, y: 120, c: "url(#blueGrad)", l: "2. الذات", i: "👤" },
            { x: 550, y: 120, c: "url(#goldGrad)", l: "3. الشغف", i: "🔥" },
            { x: 650, y: 200, c: "url(#purpleGrad)", l: "4. المهارات", i: "🧠" },
            { x: 550, y: 280, c: "url(#orangeGrad)", l: "5. السوق", i: "📊" },
            { x: 250, y: 280, c: "url(#tealGrad)", l: "6. المنتج", i: "💡" },
        ].map((node, idx) => (
            <g key={idx} transform={`translate(${node.x}, ${node.y})`} className="cursor-pointer hover:filter hover:drop-shadow-[0_0_15px_rgba(255,255,255,0.3)] transition-all duration-300 group-hover/node:opacity-100 opacity-90">
                <circle r="35" fill={node.c} filter="url(#glow)" opacity="0.8" />
                <circle r="30" fill="#1e293b" />
                <text y="8" fontSize="20" textAnchor="middle">{node.i}</text>
                <text y="55" fontSize="14" fill="white" textAnchor="middle" fontWeight="bold">{node.l}</text>
            </g>
        ))}

        {/* Center Hub */}
        <g transform="translate(400, 200)">
            <circle r="60" fill="url(#blueGrad)" opacity="0.2" className="animate-ping" />
            <circle r="50" fill="url(#blueGrad)" filter="url(#glow)" />
            <text y="10" fontSize="24" fill="white" textAnchor="middle" fontWeight="bold">$</text>
            <text y="80" fontSize="16" fill="#bfdbfe" textAnchor="middle" fontWeight="bold">المال (النتيجة)</text>
        </g>

        </svg>
    </div>
  </div>
);

export const VisualIntention: React.FC = () => (
  <div className={containerClass}>
    <svg viewBox="0 0 400 300" className={svgClass}>
      <GradientDefs />
      <rect width="400" height="300" rx="30" fill="#1a2e05" />
      <rect width="400" height="300" rx="30" fill="url(#greenGrad)" opacity="0.1" />
      
      <g transform="translate(200, 150)">
        <circle r="80" fill="none" stroke="url(#greenGrad)" strokeWidth="4" strokeDasharray="60, 20" className="animate-[spin_10s_linear_infinite]" />
        <circle r="60" fill="#1a2e05" stroke="#bef264" strokeWidth="2" />
        
        {/* Needle */}
        <path d="M0 -50 L10 0 L0 50 L-10 0 Z" fill="#bef264" transform="rotate(45)" filter="url(#glow)" />
        <circle r="5" fill="white" />
      </g>
      
      <text x="200" y="280" fontSize="20" fill="#ecfccb" {...textStyle}>البوصلة الداخلية</text>
    </svg>
  </div>
);

export const VisualPersonal: React.FC = () => (
  <div className={containerClass}>
    <svg viewBox="0 0 400 300" className={svgClass}>
      <GradientDefs />
      <rect width="400" height="300" rx="30" fill="#0f172a" />
      <rect width="400" height="300" rx="30" fill="url(#blueGrad)" opacity="0.1" />
      
      <g transform="translate(200, 140)">
         {/* Abstract ID Card */}
         <rect x="-60" y="-80" width="120" height="160" rx="10" fill="rgba(255,255,255,0.1)" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
         <circle cx="0" cy="-30" r="30" fill="url(#blueGrad)" filter="url(#glow)" />
         <rect x="-40" y="20" width="80" height="8" rx="4" fill="rgba(255,255,255,0.3)" />
         <rect x="-40" y="40" width="60" height="8" rx="4" fill="rgba(255,255,255,0.2)" />
         
         <path d="M40 60 L60 40 L80 60 Z" fill="#fbbf24" transform="translate(0,10)" filter="url(#glow)" />
      </g>

      <text x="200" y="280" fontSize="20" fill="#bfdbfe" {...textStyle}>بصمة التميز</text>
    </svg>
  </div>
);

export const VisualPassion: React.FC = () => (
  <div className={containerClass}>
    <svg viewBox="0 0 400 300" className={svgClass}>
      <GradientDefs />
      <rect width="400" height="300" rx="30" fill="#422006" />
      <rect width="400" height="300" rx="30" fill="url(#goldGrad)" opacity="0.1" />
      
      <g transform="translate(200, 150)">
        <path d="M0 60 Q 40 10 0 -60 Q -40 10 0 60" fill="url(#goldGrad)" filter="url(#glow)" className="animate-pulse-slow" />
        <path d="M0 40 Q 20 10 0 -30 Q -20 10 0 40" fill="#fff" opacity="0.5" />
      </g>
      
      <text x="200" y="280" fontSize="20" fill="#fef08a" {...textStyle}>شعلة الاستمرار</text>
    </svg>
  </div>
);

export const VisualSkills: React.FC = () => (
  <div className={containerClass}>
    <svg viewBox="0 0 400 300" className={svgClass}>
      <GradientDefs />
      <rect width="400" height="300" rx="30" fill="#1e1b4b" />
      <rect width="400" height="300" rx="30" fill="url(#purpleGrad)" opacity="0.1" />
      
      <g transform="translate(200, 150)">
        {/* Synapse Network */}
        <circle r="10" fill="#a855f7" filter="url(#glow)" />
        <circle cx="50" cy="-40" r="8" fill="#c084fc" />
        <circle cx="-50" cy="40" r="8" fill="#c084fc" />
        <line x1="0" y1="0" x2="50" y2="-40" stroke="#a855f7" strokeWidth="2" />
        <line x1="0" y1="0" x2="-50" y2="40" stroke="#a855f7" strokeWidth="2" />
        <circle r="70" fill="none" stroke="#a855f7" strokeWidth="1" strokeDasharray="4,4" className="animate-[spin_8s_linear_infinite]" />
      </g>

      <text x="200" y="280" fontSize="20" fill="#e9d5ff" {...textStyle}>شبكة القدرات</text>
    </svg>
  </div>
);

export const VisualMarket: React.FC = () => (
  <div className={containerClass}>
    <svg viewBox="0 0 400 300" className={svgClass}>
      <GradientDefs />
      <rect width="400" height="300" rx="30" fill="#431407" />
      <rect width="400" height="300" rx="30" fill="url(#orangeGrad)" opacity="0.1" />
      
      <g transform="translate(100, 220)">
         <rect x="0" y="-50" width="40" height="50" fill="url(#orangeGrad)" opacity="0.4" />
         <rect x="50" y="-80" width="40" height="80" fill="url(#orangeGrad)" opacity="0.6" />
         <rect x="100" y="-120" width="40" height="120" fill="url(#orangeGrad)" opacity="0.8" />
         <rect x="150" y="-160" width="40" height="160" fill="url(#orangeGrad)" filter="url(#glow)" />
         
         <polyline points="20,-50 70,-80 120,-120 170,-160" fill="none" stroke="white" strokeWidth="2" strokeDasharray="5,5" />
         <circle cx="170" cy="-160" r="5" fill="white" />
      </g>

      <text x="200" y="280" fontSize="20" fill="#fed7aa" {...textStyle}>مؤشرات النمو</text>
    </svg>
  </div>
);

export const VisualProduct: React.FC = () => (
  <div className={containerClass}>
    <svg viewBox="0 0 400 300" className={svgClass}>
      <GradientDefs />
      <rect width="400" height="300" rx="30" fill="#042f2e" />
      <rect width="400" height="300" rx="30" fill="url(#tealGrad)" opacity="0.1" />
      
      <g transform="translate(200, 150)">
         <path d="M-25 -40 L 25 -40 L 15 20 H -15 Z" fill="rgba(255,255,255,0.2)" />
         <circle cx="0" cy="-40" r="35" fill="url(#tealGrad)" filter="url(#glow)" />
         <path d="M-10 -50 L0 -70 L10 -50" stroke="white" strokeWidth="2" fill="none" />
         <path d="M-10 -50 L10 -50" stroke="white" strokeWidth="2" />
      </g>

      <text x="200" y="280" fontSize="20" fill="#99f6e4" {...textStyle}>القيمة المضافة</text>
    </svg>
  </div>
);

export const VisualMoney: React.FC = () => (
  <div className={containerClass}>
    <svg viewBox="0 0 400 300" className={svgClass}>
      <GradientDefs />
      <rect width="400" height="300" rx="30" fill="#172554" />
      <rect width="400" height="300" rx="30" fill="url(#blueGrad)" opacity="0.1" />
      
      <g transform="translate(200, 150)">
         <rect x="-60" y="-40" width="120" height="80" rx="10" fill="url(#blueGrad)" stroke="white" strokeWidth="2" filter="url(#glow)" />
         <circle cx="0" cy="0" r="25" fill="none" stroke="white" strokeWidth="2" />
         <text x="0" y="10" fontSize="24" fill="white" textAnchor="middle" fontWeight="bold">$</text>
         
         {/* Floating coins */}
         <circle cx="80" cy="-40" r="10" fill="#fbbf24" className="animate-bounce" />
         <circle cx="-80" cy="40" r="10" fill="#fbbf24" className="animate-bounce" style={{animationDelay: '0.5s'}} />
      </g>

      <text x="200" y="280" fontSize="20" fill="#bfdbfe" {...textStyle}>استدامة الأثر</text>
    </svg>
  </div>
);
