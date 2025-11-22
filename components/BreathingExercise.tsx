import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Wind } from 'lucide-react';

interface BreathingExerciseProps {
  isActive: boolean;
}

type Phase = 'Inhale' | 'Hold' | 'Exhale' | 'Ready';

export const BreathingExercise: React.FC<BreathingExerciseProps> = ({ isActive }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [phase, setPhase] = useState<Phase>('Ready');
  const [secondsLeft, setSecondsLeft] = useState(4);
  const [cycles, setCycles] = useState(0);
  
  const timerRef = useRef<number | null>(null);

  // 4-7-8 Technique Configuration
  const PHASES: Record<string, { duration: number; next: Phase; label: string }> = {
    'Inhale': { duration: 4, next: 'Hold', label: 'Inhale deeply...' },
    'Hold': { duration: 7, next: 'Exhale', label: 'Hold it...' },
    'Exhale': { duration: 8, next: 'Inhale', label: 'Exhale slowly...' },
    'Ready': { duration: 4, next: 'Inhale', label: 'Ready?' }
  };

  useEffect(() => {
    if (isPlaying) {
      if (phase === 'Ready') {
        setPhase('Inhale');
        setSecondsLeft(4);
      }

      timerRef.current = window.setInterval(() => {
        setSecondsLeft((prev) => {
          if (prev <= 1) {
            const currentPhaseConfig = PHASES[phase];
            const nextPhase = currentPhaseConfig.next;
            setPhase(nextPhase);
            if (nextPhase === 'Inhale') setCycles(c => c + 1);
            return PHASES[nextPhase].duration;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      if (timerRef.current) clearInterval(timerRef.current);
    }

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPlaying, phase]);

  const reset = () => {
    setIsPlaying(false);
    setPhase('Ready');
    setSecondsLeft(4);
    setCycles(0);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  // Dynamic Styles based on Phase
  const getPhaseStyles = () => {
    switch (phase) {
      case 'Inhale':
        return {
          bg: 'from-slate-50 to-indigo-100',
          orbColor: 'bg-indigo-500',
          shadow: 'shadow-[0_0_60px_rgba(99,102,241,0.6)]',
          scale: 'scale-150',
          textColor: 'text-indigo-600',
          ringBorder: 'border-indigo-200'
        };
      case 'Hold':
        return {
          bg: 'from-slate-50 to-fuchsia-100',
          orbColor: 'bg-fuchsia-500',
          shadow: 'shadow-[0_0_60px_rgba(217,70,239,0.6)]',
          scale: 'scale-150', // Keep expanded
          textColor: 'text-fuchsia-600',
          ringBorder: 'border-fuchsia-200'
        };
      case 'Exhale':
        return {
          bg: 'from-slate-50 to-emerald-100',
          orbColor: 'bg-emerald-500',
          shadow: 'shadow-[0_0_40px_rgba(16,185,129,0.4)]',
          scale: 'scale-100',
          textColor: 'text-emerald-600',
          ringBorder: 'border-emerald-200'
        };
      default: // Ready
        return {
          bg: 'from-slate-50 to-slate-100',
          orbColor: 'bg-slate-400',
          shadow: 'shadow-xl',
          scale: 'scale-100',
          textColor: 'text-slate-600',
          ringBorder: 'border-slate-200'
        };
    }
  };

  const styles = getPhaseStyles();

  if (!isActive) return null;

  return (
    <div className={`flex flex-col h-full items-center justify-between py-12 px-6 relative overflow-hidden transition-colors duration-[2000ms] bg-gradient-to-b ${styles.bg}`}>
      
      {/* Floating Particles Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className={`absolute top-[20%] left-[20%] w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob transition-colors duration-[2000ms] ${phase === 'Inhale' ? 'bg-indigo-200' : phase === 'Hold' ? 'bg-fuchsia-200' : 'bg-emerald-200'}`}></div>
        <div className={`absolute top-[20%] right-[20%] w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-2000 transition-colors duration-[2000ms] ${phase === 'Inhale' ? 'bg-blue-200' : phase === 'Hold' ? 'bg-purple-200' : 'bg-teal-200'}`}></div>
        <div className={`absolute bottom-[20%] left-[30%] w-72 h-72 rounded-full mix-blend-multiply filter blur-3xl opacity-30 animate-blob animation-delay-4000 transition-colors duration-[2000ms] ${phase === 'Inhale' ? 'bg-sky-200' : phase === 'Hold' ? 'bg-pink-200' : 'bg-green-200'}`}></div>
      </div>

      {/* Header */}
      <div className="z-10 text-center space-y-2">
        <h2 className={`text-3xl font-bold transition-colors duration-1000 flex items-center justify-center gap-2 ${styles.textColor}`}>
          <Wind className="w-6 h-6" />
          Breathe
        </h2>
        <p className="text-slate-500 font-medium">4-7-8 Anxiety Reduction</p>
      </div>

      {/* Main Visualization */}
      <div className="relative z-10 flex items-center justify-center h-96 w-full">
        
        {/* Guide Ring (Static) */}
        <div className={`absolute w-64 h-64 rounded-full border-[1px] ${styles.ringBorder} opacity-30`}></div>
        <div className={`absolute w-48 h-48 rounded-full border-[1px] ${styles.ringBorder} opacity-20`}></div>

        {/* Breathing Orb */}
        <div className={`
          relative flex items-center justify-center
          w-40 h-40 rounded-full
          transition-all ease-in-out
          ${styles.orbColor}
          ${styles.shadow}
          ${styles.scale}
        `}
        style={{ 
          transitionDuration: phase === 'Hold' ? '0ms' : `${PHASES[phase].duration * 1000}ms` 
        }}
        >
          {/* Inner Glow Layer */}
          <div className="absolute inset-2 rounded-full bg-white opacity-20 blur-sm"></div>
          
          {/* Text Container (Counter-scales to stay readable) */}
          <div className={`
            absolute inset-0 flex flex-col items-center justify-center text-white
            transition-transform ease-in-out
            ${phase === 'Inhale' || phase === 'Hold' ? 'scale-66' : 'scale-100'}
          `}
          style={{ 
            transitionDuration: phase === 'Hold' ? '0ms' : `${PHASES[phase].duration * 1000}ms`,
            transform: phase === 'Inhale' || phase === 'Hold' ? 'scale(0.66)' : 'scale(1)'
          }}
          >
             <span className="text-4xl font-bold font-mono tabular-nums tracking-tighter drop-shadow-md">
               {isPlaying ? secondsLeft : '4-7-8'}
             </span>
             <span className="text-[10px] uppercase tracking-widest font-semibold mt-1 opacity-90 drop-shadow-sm">
               {isPlaying ? phase : 'Technique'}
             </span>
          </div>
        </div>
      </div>

      {/* Instructional Text */}
      <div className="z-10 h-16 flex items-center justify-center">
        <p className={`text-2xl font-light transition-all duration-500 transform ${isPlaying ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'} ${styles.textColor}`}>
          {PHASES[phase].label}
        </p>
      </div>

      {/* Controls */}
      <div className="z-10 flex items-center gap-8 mb-8">
        <button
          onClick={reset}
          className="p-4 rounded-full text-slate-400 hover:bg-white hover:text-slate-600 transition-all hover:shadow-md"
          disabled={!isPlaying && cycles === 0}
        >
          <RotateCcw size={20} />
        </button>

        <button
          onClick={() => setIsPlaying(!isPlaying)}
          className={`
            w-20 h-20 rounded-2xl flex items-center justify-center text-white shadow-xl hover:shadow-2xl hover:-translate-y-1 transition-all
            ${isPlaying ? 'bg-slate-900' : 'bg-gradient-to-r from-indigo-600 to-purple-600'}
          `}
        >
          {isPlaying ? (
            <Pause size={32} fill="currentColor" />
          ) : (
            <Play size={32} fill="currentColor" className="ml-1" />
          )}
        </button>
        
        <div className="w-12 text-center">
           <p className="text-xs font-bold text-slate-400">CYCLES</p>
           <p className="text-xl font-bold text-slate-700">{cycles}</p>
        </div>
      </div>

      {/* CSS for blobs */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};