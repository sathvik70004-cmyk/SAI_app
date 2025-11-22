import React from 'react';
import { MessageCircle, Heart, Wind, Info, CheckSquare } from 'lucide-react';
import { AppView } from '../types';

interface NavigationProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

export const Navigation: React.FC<NavigationProps> = ({ currentView, setView }) => {
  const navItems = [
    { id: AppView.CHAT, icon: MessageCircle, label: 'Chat' },
    { id: AppView.GOALS, icon: CheckSquare, label: 'Goals' },
    { id: AppView.MOOD, icon: Heart, label: 'Mood' },
    { id: AppView.BREATHE, icon: Wind, label: 'Breathe' },
    { id: AppView.RESOURCES, icon: Info, label: 'About' },
  ];

  return (
    <div className="bg-white/90 backdrop-blur-md border-t border-slate-100 px-6 py-3 pb-6 md:pb-3 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] z-50">
      <div className="flex justify-between items-center max-w-2xl mx-auto">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setView(item.id)}
              className={`flex flex-col items-center gap-1 transition-all duration-200 relative group ${
                isActive ? 'text-indigo-600 -translate-y-1' : 'text-slate-400 hover:text-slate-600'
              }`}
            >
              <div className={`p-2 rounded-xl transition-all duration-300 ${
                isActive ? 'bg-indigo-50 shadow-sm' : 'bg-transparent group-hover:bg-slate-50'
              }`}>
                <item.icon size={24} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className="text-[10px] font-medium tracking-wide">{item.label}</span>
              
              {/* Active Indicator */}
              <span className={`absolute -bottom-2 w-1 h-1 rounded-full bg-indigo-600 transition-all duration-300 ${isActive ? 'opacity-100' : 'opacity-0'}`} />
            </button>
          );
        })}
      </div>
    </div>
  );
};