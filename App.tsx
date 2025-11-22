import React, { useState, useEffect } from 'react';
import { Download, X } from 'lucide-react';
import { AppView } from './types';
import { Navigation } from './components/Navigation';
import { ChatInterface } from './components/ChatInterface';
import { MoodTracker } from './components/MoodTracker';
import { BreathingExercise } from './components/BreathingExercise';
import { ResourcesView } from './components/ResourcesView';
import { GoalsView } from './components/GoalsView';
import { DisclaimerModal } from './components/DisclaimerModal';
import { SplashScreen } from './components/SplashScreen';

export default function App() {
  const [currentView, setCurrentView] = useState<AppView>(AppView.CHAT);
  const [hasAcceptedDisclaimer, setHasAcceptedDisclaimer] = useState(false);
  const [showSplash, setShowSplash] = useState(true);
  
  // Installation State
  const [deferredPrompt, setDeferredPrompt] = useState<any>(null);
  const [showInstallBanner, setShowInstallBanner] = useState(false);

  // Listen for PWA install event
  useEffect(() => {
    const handler = (e: any) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallBanner(true);
    };
    window.addEventListener('beforeinstallprompt', handler);
    return () => window.removeEventListener('beforeinstallprompt', handler);
  }, []);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    if (outcome === 'accepted') {
      setDeferredPrompt(null);
      setShowInstallBanner(false);
    }
  };

  // Don't show disclaimer until splash is done
  const showDisclaimer = !showSplash && !hasAcceptedDisclaimer;

  return (
    <div className="h-screen w-screen bg-slate-100 flex items-center justify-center overflow-hidden relative">
      {showSplash && <SplashScreen onComplete={() => setShowSplash(false)} />}
      
      {showDisclaimer && (
        <DisclaimerModal onAccept={() => setHasAcceptedDisclaimer(true)} />
      )}

      {/* Main Layout Container - Responsive for Mobile and Laptop */}
      <div className={`w-full h-full md:h-[90vh] md:w-[90vw] md:max-w-5xl md:rounded-[2.5rem] bg-white shadow-2xl flex flex-col relative overflow-hidden transition-all duration-700 ${showSplash ? 'scale-95 opacity-0' : 'scale-100 opacity-100'}`}>
        
        {/* Install Banner (Android/Desktop) */}
        {showInstallBanner && deferredPrompt && (
          <div className="absolute top-0 left-0 right-0 z-[60] bg-indigo-600 text-white px-4 py-3 flex items-center justify-between shadow-md animate-[slideDown_0.3s_ease-out]">
            <div className="flex items-center gap-3">
              <div className="p-1.5 bg-white/20 rounded-lg backdrop-blur-sm">
                <Download size={16} className="text-white" />
              </div>
              <div>
                <p className="text-xs font-bold opacity-90">Get the App</p>
                <p className="text-[10px] opacity-80">Install for a better experience</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <button 
                onClick={handleInstallClick}
                className="bg-white text-indigo-600 text-xs font-bold px-3 py-1.5 rounded-lg hover:bg-indigo-50 transition-colors shadow-sm"
              >
                Install
              </button>
              <button onClick={() => setShowInstallBanner(false)} className="p-1 hover:bg-white/10 rounded-full transition-colors">
                <X size={18} className="text-indigo-200 hover:text-white" />
              </button>
            </div>
          </div>
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-hidden relative bg-slate-50">
          
          {/* View Containers */}
          <div className={`absolute inset-0 transition-opacity duration-300 ${currentView === AppView.CHAT ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <ChatInterface isActive={currentView === AppView.CHAT} />
          </div>

          <div className={`absolute inset-0 transition-opacity duration-300 ${currentView === AppView.GOALS ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <GoalsView isActive={currentView === AppView.GOALS} />
          </div>

          <div className={`absolute inset-0 transition-opacity duration-300 ${currentView === AppView.MOOD ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <MoodTracker isActive={currentView === AppView.MOOD} />
          </div>

          <div className={`absolute inset-0 transition-opacity duration-300 ${currentView === AppView.BREATHE ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <BreathingExercise isActive={currentView === AppView.BREATHE} />
          </div>

          <div className={`absolute inset-0 transition-opacity duration-300 ${currentView === AppView.RESOURCES ? 'opacity-100 z-10' : 'opacity-0 z-0 pointer-events-none'}`}>
            <ResourcesView 
              isActive={currentView === AppView.RESOURCES} 
              installPrompt={deferredPrompt}
              onInstall={handleInstallClick}
            />
          </div>

        </main>

        {/* Bottom Navigation */}
        <Navigation currentView={currentView} setView={setCurrentView} />
      </div>
      
      {/* Laptop Background Decoration */}
      <div className="absolute inset-0 -z-10 hidden md:block bg-gradient-to-br from-indigo-200 via-purple-200 to-pink-200 opacity-50"></div>
      
      <style>{`
        @keyframes slideDown {
          from { transform: translateY(-100%); }
          to { transform: translateY(0); }
        }
      `}</style>
    </div>
  );
}