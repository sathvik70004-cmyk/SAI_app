import React, { useEffect, useState } from 'react';
import { Sparkles } from 'lucide-react';

interface SplashScreenProps {
  onComplete: () => void;
}

export const SplashScreen: React.FC<SplashScreenProps> = ({ onComplete }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Total duration 5-6 seconds
    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(onComplete, 500); // Allow fade out transition
    }, 5500);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className={`fixed inset-0 z-[100] flex flex-col items-center justify-center bg-slate-900 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0 pointer-events-none'}`}>
      <div className="relative flex flex-col items-center">
        {/* Logo Container */}
        <div className="w-32 h-32 mb-8 relative animate-[bounce_3s_infinite]">
          <div className="absolute inset-0 bg-indigo-500 rounded-full blur-2xl opacity-20 animate-pulse"></div>
          <img 
            src="https://upload.wikimedia.org/wikipedia/en/4/4e/IIIT_Naya_Raipur_logo.png" 
            alt="IIIT Naya Raipur" 
            className="w-full h-full object-contain relative z-10 drop-shadow-2xl"
          />
        </div>

        <h1 className="text-4xl md:text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 mb-4 animate-[fadeIn_1s_ease-out]">
          MindfulMate
        </h1>
        
        <div className="flex items-center gap-2 text-slate-400 text-sm md:text-lg animate-[fadeIn_2s_ease-out]">
          <Sparkles size={16} className="text-yellow-400" />
          <span>Your Campus Wellness Companion</span>
          <Sparkles size={16} className="text-yellow-400" />
        </div>

        {/* Loading Bar */}
        <div className="mt-12 w-64 h-1 bg-slate-800 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 animate-[progress_5.5s_ease-in-out_forwards] w-0"></div>
        </div>
      </div>
      
      <style>{`
        @keyframes progress {
          0% { width: 0%; }
          100% { width: 100%; }
        }
      `}</style>
    </div>
  );
};