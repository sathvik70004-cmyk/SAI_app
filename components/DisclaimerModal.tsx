import React from 'react';
import { ShieldAlert, Check } from 'lucide-react';

interface DisclaimerModalProps {
  onAccept: () => void;
}

export const DisclaimerModal: React.FC<DisclaimerModalProps> = ({ onAccept }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/60 backdrop-blur-sm p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden animate-[fadeIn_0.3s_ease-out]">
        <div className="bg-indigo-50 p-6 border-b border-indigo-100 flex items-center gap-3">
          <div className="p-2 bg-indigo-100 rounded-full text-indigo-600">
            <ShieldAlert size={24} />
          </div>
          <h2 className="text-xl font-bold text-slate-800">Important Notice</h2>
        </div>
        
        <div className="p-6 space-y-4">
          <p className="text-slate-600 leading-relaxed">
            MindfulMate is an AI-powered companion designed to offer support and wellness tips.
          </p>
          
          <div className="bg-amber-50 border-l-4 border-amber-400 p-4 rounded-r-lg">
            <p className="text-amber-900 text-sm font-medium">
              This app is <strong>not</strong> a replacement for professional therapy, medical advice, or crisis intervention.
            </p>
          </div>

          <p className="text-slate-600 text-sm">
            If you are in danger or experiencing a medical emergency, please call your local emergency services immediately.
          </p>
        </div>

        <div className="p-6 pt-2 bg-gray-50/50">
          <button
            onClick={onAccept}
            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-semibold py-3 px-4 rounded-xl transition-colors flex items-center justify-center gap-2 shadow-md hover:shadow-lg transform hover:-translate-y-0.5 duration-200"
          >
            <Check size={20} />
            I Understand & Accept
          </button>
        </div>
      </div>
    </div>
  );
};