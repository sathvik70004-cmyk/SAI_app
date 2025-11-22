import React from 'react';
import { Phone, Shield, Users, Info, Heart, Download, Share, PlusSquare } from 'lucide-react';

interface ResourcesViewProps {
  isActive: boolean;
  installPrompt?: any;
  onInstall?: () => void;
}

export const ResourcesView: React.FC<ResourcesViewProps> = ({ isActive, installPrompt, onInstall }) => {
  if (!isActive) return null;

  const team = [
    { name: "M V Sai Sathvik", number: "7000493676" },
    { name: "Bhavika", number: "9039027103" },
    { name: "Rabina Dahariya", number: "8839357399" },
    { name: "Manish Bhagra", number: "9680060573" }
  ];

  // Simple iOS detection
  const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);

  return (
    <div className="flex flex-col h-full p-6 md:p-8 overflow-y-auto no-scrollbar bg-slate-50/50">
      
      {/* Install App Section (Dynamic) */}
      {(installPrompt || isIOS) && (
        <div className="mb-6 bg-gradient-to-br from-indigo-600 to-purple-700 rounded-3xl p-6 text-white shadow-lg transform transition-all hover:scale-[1.02]">
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-white/20 rounded-xl backdrop-blur-sm">
              <Download size={24} className="text-white" />
            </div>
            <h2 className="text-xl font-bold">Install App</h2>
          </div>
          
          {installPrompt ? (
            // Android / Desktop PWA Install Button
            <div>
              <p className="text-indigo-100 mb-4 text-sm">
                Install MindfulMate to your home screen for quick access and a native app experience.
              </p>
              <button 
                onClick={onInstall}
                className="w-full bg-white text-indigo-600 font-bold py-3 rounded-xl shadow-sm hover:bg-indigo-50 transition-colors flex items-center justify-center gap-2"
              >
                <Download size={18} />
                Install Now
              </button>
            </div>
          ) : isIOS ? (
            // iOS Manual Instructions
            <div>
              <p className="text-indigo-100 mb-4 text-sm">
                To install on iPhone/iPad:
              </p>
              <div className="space-y-3 text-sm font-medium text-white/90">
                <div className="flex items-center gap-3 bg-white/10 p-2 rounded-lg">
                  <Share size={20} />
                  <span>1. Tap the <strong>Share</strong> button below</span>
                </div>
                <div className="flex items-center gap-3 bg-white/10 p-2 rounded-lg">
                  <PlusSquare size={20} />
                  <span>2. Scroll down & tap <strong>"Add to Home Screen"</strong></span>
                </div>
              </div>
            </div>
          ) : null}
        </div>
      )}

      {/* App Info Header */}
      <div className="mb-8 bg-white rounded-3xl p-6 border border-slate-100 shadow-sm">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-indigo-50 rounded-xl text-indigo-600">
            <Heart size={24} fill="currentColor" className="text-indigo-600" />
          </div>
          <h2 className="text-2xl font-bold text-slate-800">About MindfulMate</h2>
        </div>
        <p className="text-slate-600 leading-relaxed mb-4">
          MindfulMate is a dedicated wellness companion designed specifically for the students of IIIT Naya Raipur. 
          Our mission is to provide a safe, non-judgmental space where you can vent, track your mood, and organize your goals.
          Powered by advanced AI, we offer supportive conversations and grounding techniques to help you navigate academic stress.
        </p>
        <div className="flex gap-2 flex-wrap">
          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">AI Support</span>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">Privacy First</span>
          <span className="px-3 py-1 bg-slate-100 text-slate-600 text-xs rounded-full font-medium">Student Focused</span>
        </div>
      </div>

      {/* Team Section */}
      <div className="mb-8">
        <h3 className="text-lg font-bold text-slate-800 mb-4 flex items-center gap-2">
          <Users size={20} className="text-indigo-500" />
          Meet The Team
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {team.map((member, idx) => (
            <div key={idx} className="bg-white p-4 rounded-2xl border border-slate-100 shadow-sm hover:shadow-md transition-all group">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-bold text-slate-700">{member.name}</h4>
                  <a href={`tel:${member.number}`} className="text-sm text-slate-500 mt-1 flex items-center gap-1 group-hover:text-indigo-600 transition-colors">
                    <Phone size={12} />
                    {member.number}
                  </a>
                </div>
                <div className="w-10 h-10 bg-gradient-to-br from-indigo-100 to-purple-100 rounded-full flex items-center justify-center text-indigo-600 text-sm font-bold">
                  {member.name.charAt(0)}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Emergency Section */}
      <div className="bg-rose-50 p-6 rounded-3xl border border-rose-100">
        <h3 className="text-lg font-bold text-rose-800 mb-2">Emergency Support</h3>
        <p className="text-rose-700/80 text-sm mb-4">
          If you are in crisis, we are not a replacement for professional help.
        </p>
        <div className="space-y-3">
           <button className="w-full bg-white text-rose-600 font-bold py-3 rounded-xl border border-rose-200 shadow-sm hover:bg-rose-50 transition-colors flex items-center justify-center gap-2">
             <Phone size={18} />
             Call 988 (National Helpline)
           </button>
        </div>
      </div>

      <div className="mt-8 text-center">
        <div className="inline-flex items-center gap-2 text-slate-400 text-xs">
          <Shield size={12} />
          <span>Developed at IIIT Naya Raipur</span>
        </div>
      </div>
    </div>
  );
};