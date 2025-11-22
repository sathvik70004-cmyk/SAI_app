import React, { useState, useRef, useEffect } from 'react';
import { Send, Bot, User, Loader2, MessageSquare, AlertTriangle, Phone } from 'lucide-react';
import { Message } from '../types';
import { sendMessageToGemini } from '../services/geminiService';

interface ChatInterfaceProps {
  isActive: boolean;
}

// Hardcoded Counselor Number for WhatsApp Intervention
// Format: CountryCode + Number (e.g., 91 for India)
const COUNSELOR_WHATSAPP = "917000493676"; 

export const ChatInterface: React.FC<ChatInterfaceProps> = ({ isActive }) => {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "Hi there! I'm MindfulMate. I can share research-backed techniques to help you manage academic stress. How are you feeling right now?",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isAvatarMode, setIsAvatarMode] = useState(false);
  const [showCrisisModal, setShowCrisisModal] = useState(false);
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isActive, isAvatarMode]);

  const handleEmergencyContact = () => {
    const text = encodeURIComponent("Hi, I am using the MindfulMate app and I'm going through a difficult time. I need urgent support.");
    window.open(`https://wa.me/${COUNSELOR_WHATSAPP}?text=${text}`, '_blank');
    setShowCrisisModal(false);
  };

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      text: input.trim(),
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    try {
      let responseText = await sendMessageToGemini(userMsg.text);
      
      // Crisis Detection Logic
      if (responseText.includes('[CRISIS_DETECTED]')) {
        setShowCrisisModal(true);
        responseText = responseText.replace('[CRISIS_DETECTED]', '').trim();
      }

      const botMsg: Message = {
        id: (Date.now() + 1).toString(),
        role: 'model',
        text: responseText,
        timestamp: new Date()
      };
      
      setMessages(prev => [...prev, botMsg]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (!isActive) return null;

  return (
    <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl relative overflow-hidden">
      
      {/* Crisis Intervention Modal */}
      {showCrisisModal && (
        <div className="absolute inset-0 z-50 bg-slate-900/80 backdrop-blur-sm flex items-center justify-center p-6 animate-[fadeIn_0.3s_ease-out]">
          <div className="bg-white rounded-3xl p-6 max-w-sm w-full shadow-2xl border-t-8 border-rose-500">
            <div className="flex flex-col items-center text-center space-y-4">
              <div className="w-16 h-16 bg-rose-100 rounded-full flex items-center justify-center animate-bounce">
                <AlertTriangle size={32} className="text-rose-600" />
              </div>
              <h3 className="text-xl font-bold text-slate-800">We are concerned about you</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                It sounds like you're going through a really tough time. Please connect with the college counselor immediately.
              </p>
              
              <button
                onClick={handleEmergencyContact}
                className="w-full bg-green-500 hover:bg-green-600 text-white py-4 rounded-xl font-bold text-lg shadow-lg hover:shadow-green-500/30 transition-all flex items-center justify-center gap-2"
              >
                <Phone size={24} />
                Chat on WhatsApp
              </button>
              
              <button 
                onClick={() => setShowCrisisModal(false)}
                className="text-slate-400 text-xs hover:text-slate-600 mt-2"
              >
                Dismiss (I am safe)
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="bg-white/90 px-4 py-3 border-b border-slate-100 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-lg p-1 shadow-sm border border-slate-100">
            <img 
              src="https://upload.wikimedia.org/wikipedia/en/4/4e/IIIT_Naya_Raipur_logo.png" 
              alt="IIIT Logo" 
              className="w-full h-full object-contain"
            />
          </div>
          <div>
            <h2 className="font-bold text-slate-800 leading-tight">MindfulMate</h2>
            <p className="text-[10px] text-slate-500 font-medium">IIIT Naya Raipur Wellness</p>
          </div>
        </div>
        
        <button 
          onClick={() => setIsAvatarMode(!isAvatarMode)}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
            isAvatarMode 
              ? 'bg-indigo-100 text-indigo-700 border border-indigo-200' 
              : 'bg-slate-100 text-slate-600 border border-slate-200'
          }`}
        >
          {isAvatarMode ? <Bot size={14} /> : <MessageSquare size={14} />}
          {isAvatarMode ? 'Avatar' : 'Chat'}
        </button>
      </div>

      {/* Avatar Mode View */}
      {isAvatarMode ? (
        <div className="flex-1 flex flex-col items-center justify-center bg-gradient-to-b from-slate-50 to-indigo-50/30 relative">
          {/* Human-like Avatar */}
          <div className="relative w-80 h-80 flex items-center justify-center transform hover:scale-105 transition-transform duration-500">
            
            {/* Background Glow */}
            <div className={`absolute inset-0 bg-indigo-400 rounded-full mix-blend-multiply filter blur-[60px] opacity-20 animate-pulse`}></div>
            
            <svg viewBox="0 0 400 400" className="w-full h-full drop-shadow-2xl">
              <defs>
                <linearGradient id="skinGradient" x1="0.5" y1="0" x2="0.5" y2="1">
                  <stop offset="0%" stopColor="#F5D0A9" /> 
                  <stop offset="100%" stopColor="#E5B98C" /> 
                </linearGradient>
                <linearGradient id="hairGradient" x1="0" y1="0" x2="1" y2="1">
                  <stop offset="0%" stopColor="#2d2a26" />
                  <stop offset="50%" stopColor="#3e3a36" />
                  <stop offset="100%" stopColor="#2d2a26" />
                </linearGradient>
                <linearGradient id="shirtGradient" x1="0" y1="0" x2="0" y2="1">
                   <stop offset="0%" stopColor="#6366f1" />
                   <stop offset="100%" stopColor="#4f46e5" />
                </linearGradient>
                <filter id="softShadow">
                  <feGaussianBlur in="SourceAlpha" stdDeviation="2" />
                  <feOffset dx="0" dy="2" result="offsetblur" />
                  <feComponentTransfer>
                    <feFuncA type="linear" slope="0.2" />
                  </feComponentTransfer>
                  <feMerge> 
                    <feMergeNode />
                    <feMergeNode in="SourceGraphic" /> 
                  </feMerge>
                </filter>
              </defs>

              {/* Body/Shirt */}
              <path d="M110 350 Q200 380 290 350 L290 400 L110 400 Z" fill="url(#shirtGradient)" />
              <path d="M160 300 L110 350 L290 350 L240 300 Z" fill="#4338ca" /> {/* Collar area */}

              {/* Neck */}
              <path d="M165 260 L165 320 Q200 335 235 320 L235 260" fill="#E5B98C" />
              <path d="M165 300 Q200 315 235 300" fill="rgba(0,0,0,0.05)" /> {/* Neck Shadow */}

              {/* Face Shape */}
              <g transform="translate(0, 10)">
                  <path d="M130 140 Q125 280 200 300 Q275 280 270 140 Q270 80 200 80 Q130 80 130 140" fill="url(#skinGradient)" filter="url(#softShadow)" />
                  
                  {/* Ears */}
                  <path d="M125 180 Q115 190 128 210" fill="#E5B98C" />
                  <path d="M275 180 Q285 190 272 210" fill="#E5B98C" />
                  
                  {/* Hair - Back */}
                  <path d="M120 140 Q110 250 140 280 L260 280 Q290 250 280 140 Z" fill="#2d2a26" />

                  {/* Hair - Front */}
                  <path d="M120 150 Q120 60 200 50 Q280 60 280 150 Q280 90 200 90 Q120 90 120 150" fill="url(#hairGradient)" />
                  <path d="M200 50 Q240 50 260 100" fill="none" stroke="#3e3a36" strokeWidth="2" opacity="0.5" />

                  {/* Eyebrows */}
                  <path d="M150 160 Q170 150 185 160" stroke="#2d2a26" strokeWidth="4" fill="none" strokeLinecap="round" className={`transition-all duration-300 ${isLoading ? '-translate-y-2' : ''}`} />
                  <path d="M215 160 Q230 150 250 160" stroke="#2d2a26" strokeWidth="4" fill="none" strokeLinecap="round" className={`transition-all duration-300 ${isLoading ? '-translate-y-2' : ''}`} />

                  {/* Eyes */}
                  <g>
                    {/* Left Eye */}
                    <g transform="translate(165, 180)">
                        <ellipse cx="0" cy="0" rx="12" ry="8" fill="white" />
                        <circle cx="0" cy="0" r="4" fill="#3e2723" className={`${isLoading ? 'animate-ping' : ''}`} />
                        <circle cx="1" cy="-1" r="1.5" fill="white" opacity="0.7" />
                    </g>
                    {/* Right Eye */}
                    <g transform="translate(235, 180)">
                        <ellipse cx="0" cy="0" rx="12" ry="8" fill="white" />
                        <circle cx="0" cy="0" r="4" fill="#3e2723" className={`${isLoading ? 'animate-ping' : ''}`} />
                        <circle cx="1" cy="-1" r="1.5" fill="white" opacity="0.7" />
                    </g>

                    {/* Blinking Lids */}
                    <g className="animate-blink">
                        <path d="M153 180 Q165 182 177 180" stroke="#D4A880" strokeWidth="0" fill="none" className="blink-stroke" />
                    </g>
                  </g>

                  {/* Glasses (Optional - commented out for generic look, but prepared) */}
                  {/* <path d="M145 180 Q165 200 185 180 M215 180 Q235 200 255 180 M185 180 L215 180" stroke="#444" strokeWidth="2" fill="none" /> */}

                  {/* Nose */}
                  <path d="M200 190 Q195 210 200 215 Q205 210 200 215" stroke="#D4A880" strokeWidth="2" fill="none" />

                  {/* Mouth */}
                  <path 
                    d={isLoading ? "M180 245 Q200 255 220 245" : "M180 245 Q200 260 220 245"} 
                    stroke="#BC7870" 
                    strokeWidth="3" 
                    fill="none" 
                    strokeLinecap="round"
                    className={`transition-all duration-300 ${isLoading ? 'animate-pulse' : ''}`}
                  />
                  <path d="M180 245 Q200 260 220 245" fill="#DFA090" opacity="0.3" />
              </g>
            </svg>
          </div>

          <div className="mt-4 text-center max-w-md px-8 min-h-[100px] relative z-10">
            {isLoading ? (
              <div className="flex flex-col items-center gap-2">
                 <p className="text-indigo-600 font-medium animate-pulse">Thinking...</p>
                 <div className="flex gap-1">
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
                    <div className="w-1.5 h-1.5 bg-indigo-400 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
                 </div>
              </div>
            ) : (
              <div className="bg-white/90 backdrop-blur-md p-5 rounded-2xl shadow-lg border-b-4 border-indigo-100 transform transition-all duration-500 hover:-translate-y-1">
                <p className="text-slate-700 text-lg font-medium leading-relaxed">
                  "{messages[messages.length - 1].role === 'model' 
                    ? messages[messages.length - 1].text 
                    : "I'm listening..."}"
                </p>
              </div>
            )}
          </div>
        </div>
      ) : (
        /* Standard Chat View */
        <div className="flex-1 overflow-y-auto p-4 space-y-6 no-scrollbar bg-slate-50/30">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] md:max-w-[70%] gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : 'flex-row'}`}>
                <div className={`w-8 h-8 rounded-full flex-shrink-0 flex items-center justify-center shadow-sm ${
                  msg.role === 'user' 
                    ? 'bg-slate-200 text-slate-600' 
                    : 'bg-gradient-to-br from-indigo-500 to-purple-600 text-white'
                }`}>
                  {msg.role === 'user' ? <User size={14} /> : <Bot size={14} />}
                </div>
                
                <div className={`p-4 rounded-2xl shadow-sm text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === 'user'
                    ? 'bg-indigo-600 text-white rounded-tr-none'
                    : 'bg-white border border-slate-100 text-slate-700 rounded-tl-none'
                }`}>
                  {msg.text}
                </div>
              </div>
            </div>
          ))}
          
          {isLoading && (
            <div className="flex justify-start w-full">
              <div className="flex gap-3 max-w-[80%]">
                <div className="w-8 h-8 rounded-full bg-indigo-100 text-indigo-600 flex-shrink-0 flex items-center justify-center">
                  <Bot size={14} />
                </div>
                <div className="bg-white border border-slate-100 p-4 rounded-2xl rounded-tl-none shadow-sm flex items-center gap-2">
                  <Loader2 size={16} className="animate-spin text-indigo-500" />
                  <span className="text-slate-400 text-sm">Thinking...</span>
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      )}

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100 shadow-[0_-4px_20px_-5px_rgba(0,0,0,0.05)] z-20">
        <div className="relative flex items-end gap-2 max-w-3xl mx-auto">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyPress}
            placeholder={isAvatarMode ? "Type to speak to MindfulMate..." : "Type your thoughts here..."}
            className="w-full bg-slate-50 border border-slate-200 text-slate-800 placeholder:text-slate-400 rounded-2xl py-3 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 resize-none max-h-32 min-h-[50px] no-scrollbar transition-all"
            rows={1}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="absolute right-2 bottom-2 p-2 bg-indigo-600 text-white rounded-xl hover:bg-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm hover:shadow-md transform hover:-translate-y-0.5 active:translate-y-0"
          >
            <Send size={18} />
          </button>
        </div>
        <p className="text-center text-[10px] text-slate-400 mt-2">
          AI provides research-based tips. Verify with professionals.
        </p>
      </div>
      
      <style>{`
        @keyframes blink {
          0%, 96%, 100% { opacity: 0; transform: scaleY(1); }
          98% { opacity: 1; transform: scaleY(0.1); }
        }
        .animate-blink {
          animation: blink 4s infinite;
          transform-origin: center;
        }
      `}</style>
    </div>
  );
};