
import React, { useState, useEffect } from 'react';
import { CheckSquare, Plus, Calendar, Trash2, Bell, BellOff, Clock, CheckCircle2, Circle, ToggleRight, ToggleLeft, X, AlertCircle, Edit2 } from 'lucide-react';
import { Goal } from '../types';

interface GoalsViewProps {
  isActive: boolean;
}

export const GoalsView: React.FC<GoalsViewProps> = ({ isActive }) => {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [input, setInput] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [autoSync, setAutoSync] = useState(false);
  const [notificationPermission, setNotificationPermission] = useState<NotificationPermission>('default');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Derived State
  const totalGoals = goals.length;
  const completedGoals = goals.filter(g => g.completed).length;
  const progressPercentage = totalGoals === 0 ? 0 : Math.round((completedGoals / totalGoals) * 100);

  // Load initial data and permission status
  useEffect(() => {
    const saved = localStorage.getItem('mindfulMate_goals');
    const savedSync = localStorage.getItem('mindfulMate_autoSync');
    
    if (savedSync) {
      setAutoSync(JSON.parse(savedSync));
    }

    if (saved) {
      try {
        const parsed = JSON.parse(saved);
        const hydrated = parsed.map((g: any) => ({ ...g, createdAt: new Date(g.createdAt) }));
        setGoals(hydrated);
      } catch (e) {
        console.error("Failed to load goals", e);
      }
    }

    if ('Notification' in window) {
      setNotificationPermission(Notification.permission);
    }
  }, []);

  // Save data on change
  useEffect(() => {
    localStorage.setItem('mindfulMate_goals', JSON.stringify(goals));
    localStorage.setItem('mindfulMate_autoSync', JSON.stringify(autoSync));
  }, [goals, autoSync]);

  // Notification Checker Loop (Runs every 30 seconds)
  useEffect(() => {
    if (notificationPermission !== 'granted') return;

    const interval = setInterval(() => {
      const now = new Date();
      const currentHours = now.getHours().toString().padStart(2, '0');
      const currentMinutes = now.getMinutes().toString().padStart(2, '0');
      const currentTime = `${currentHours}:${currentMinutes}`;

      setGoals(prevGoals => {
        let hasUpdates = false;
        const updatedGoals = prevGoals.map(goal => {
          // If goal has a start time, hasn't been notified, and it's time
          if (goal.startTime === currentTime && !goal.notified && !goal.completed) {
            sendNotification(goal.text);
            hasUpdates = true;
            return { ...goal, notified: true };
          }
          return goal;
        });
        
        // Only update state if we actually changed a notification flag to avoid re-renders
        return hasUpdates ? updatedGoals : prevGoals;
      });
    }, 30000); 

    return () => clearInterval(interval);
  }, [goals, notificationPermission]);

  const requestNotificationPermission = async () => {
    if (!('Notification' in window)) {
      alert("This browser does not support desktop notifications");
      return;
    }

    if (Notification.permission === 'granted') {
      new Notification("MindfulMate", {
        body: "Notifications are already active and working!",
        icon: "https://upload.wikimedia.org/wikipedia/en/4/4e/IIIT_Naya_Raipur_logo.png"
      });
      return;
    }

    if (Notification.permission === 'denied') {
      alert("Notifications are blocked. You need to enable them in your browser settings (click the lock icon in the address bar).");
      return;
    }

    try {
      const permission = await Notification.requestPermission();
      setNotificationPermission(permission);
      if (permission === 'granted') {
        new Notification("Notifications Enabled", {
          body: "MindfulMate will remind you when your tasks start!",
          icon: "https://upload.wikimedia.org/wikipedia/en/4/4e/IIIT_Naya_Raipur_logo.png"
        });
      }
    } catch (error) {
      console.error("Error requesting permission:", error);
      alert("Something went wrong requesting permissions. Please check your browser settings.");
    }
  };

  const sendNotification = (taskName: string) => {
    new Notification("Task Starting Now", {
      body: `It's time for: ${taskName}`,
      icon: "https://upload.wikimedia.org/wikipedia/en/4/4e/IIIT_Naya_Raipur_logo.png"
    });
  };

  const addToCalendar = (text: string, start?: string, end?: string) => {
    let datesParam = '';
    
    if (start && end) {
      const today = new Date();
      const yyyy = today.getFullYear();
      const mm = (today.getMonth() + 1).toString().padStart(2, '0');
      const dd = today.getDate().toString().padStart(2, '0');
      
      const startStr = `${yyyy}${mm}${dd}T${start.replace(':', '')}00`;
      const endStr = `${yyyy}${mm}${dd}T${end.replace(':', '')}00`;
      datesParam = `&dates=${startStr}/${endStr}`;
    }

    const encodedText = encodeURIComponent(text);
    const details = encodeURIComponent(`Goal created via MindfulMate App. Time: ${start || 'N/A'} to ${end || 'N/A'}`);
    
    const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodedText}&details=${details}${datesParam}`;
    window.open(url, '_blank');
  };

  const handleSaveGoal = () => {
    if (!input.trim()) return;
    
    if (editingId) {
      // Update existing goal
      setGoals(prev => prev.map(g => {
        if (g.id === editingId) {
          const isTimeChanged = g.startTime !== (startTime || undefined);
          return {
            ...g,
            text: input.trim(),
            startTime: startTime || undefined,
            endTime: endTime || undefined,
            // Reset notification if time changed so it triggers again
            notified: isTimeChanged ? false : g.notified
          };
        }
        return g;
      }));
    } else {
      // Create new goal
      const newGoal: Goal = {
        id: Date.now().toString(),
        text: input.trim(),
        completed: false,
        createdAt: new Date(),
        startTime: startTime || undefined,
        endTime: endTime || undefined,
        notified: false
      };
      
      setGoals(prev => [newGoal, ...prev]);
      
      if (autoSync) {
        addToCalendar(input.trim(), startTime, endTime);
      }
    }
    
    // Reset Form
    setInput('');
    setStartTime('');
    setEndTime('');
    setEditingId(null);
    setIsAddModalOpen(false);
  };

  const openAddModal = () => {
    setInput('');
    setStartTime('');
    setEndTime('');
    setEditingId(null);
    setIsAddModalOpen(true);
  };

  const openEditModal = (goal: Goal) => {
    setInput(goal.text);
    setStartTime(goal.startTime || '');
    setEndTime(goal.endTime || '');
    setEditingId(goal.id);
    setIsAddModalOpen(true);
  };

  const toggleGoal = (id: string) => {
    setGoals(prev => prev.map(g => g.id === id ? { ...g, completed: !g.completed } : g));
  };

  const deleteGoal = (id: string) => {
    setGoals(prev => prev.filter(g => g.id !== id));
  };

  const getPermissionButtonUI = () => {
    if (notificationPermission === 'granted') {
      return {
        style: 'bg-emerald-50 text-emerald-600 border border-emerald-200',
        icon: <Bell size={14} />,
        text: 'Active'
      };
    } else if (notificationPermission === 'denied') {
      return {
        style: 'bg-rose-50 text-rose-600 border border-rose-200',
        icon: <BellOff size={14} />,
        text: 'Blocked'
      };
    } else {
      return {
        style: 'bg-indigo-50 text-indigo-600 border border-indigo-200 animate-pulse',
        icon: <Bell size={14} />,
        text: 'Enable Alerts'
      };
    }
  };

  const buttonUI = getPermissionButtonUI();

  if (!isActive) return null;

  return (
    <div className="flex flex-col h-full bg-slate-50 relative">
      
      {/* Header Section */}
      <div className="bg-white px-6 py-6 pb-8 shadow-sm border-b border-slate-100 z-10 rounded-b-[2rem]">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <CheckSquare className="text-indigo-500" />
              Your Schedule
            </h2>
            <p className="text-slate-500 text-sm mt-1">Plan your day to reduce anxiety.</p>
          </div>
          
          {/* Permission Status Badge */}
          <button 
            onClick={requestNotificationPermission}
            className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-xs font-medium transition-colors shadow-sm hover:shadow-md ${buttonUI.style}`}
          >
            {buttonUI.icon}
            {buttonUI.text}
          </button>
        </div>

        {/* Progress Bar */}
        <div className="mb-6 bg-slate-50 p-4 rounded-2xl border border-slate-100">
          <div className="flex justify-between items-end mb-2">
             <span className="text-xs font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
               <CheckCircle2 size={12} />
               Daily Progress
             </span>
             <span className="text-sm font-bold text-indigo-600">{progressPercentage}%</span>
          </div>
          <div className="w-full h-3 bg-slate-200 rounded-full overflow-hidden">
             <div 
               className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full transition-all duration-1000 ease-out relative"
               style={{ width: `${progressPercentage}%` }}
             >
                {/* Shimmer effect */}
                <div className="absolute inset-0 bg-white/20 animate-[pulse_2s_infinite]"></div>
             </div>
          </div>
          <div className="mt-2 text-right">
            <span className="text-[10px] text-slate-400 font-medium">{completedGoals} of {totalGoals} tasks completed</span>
          </div>
        </div>

        {/* Calendar Sync Toggle */}
        <div className="flex items-center justify-between bg-slate-50 p-3 rounded-xl border border-slate-100">
          <div className="flex items-center gap-2 text-slate-600">
            <Calendar size={16} />
            <span className="text-sm font-medium">Sync to Google Calendar</span>
          </div>
          <button onClick={() => setAutoSync(!autoSync)} className="text-indigo-600 hover:text-indigo-700 transition-colors">
             {autoSync ? <ToggleRight size={28} /> : <ToggleLeft size={28} className="text-slate-300" />}
          </button>
        </div>
      </div>

      {/* Goals List - Scrollable Area */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 pb-32 no-scrollbar">
        {goals.length === 0 && (
          <div className="flex flex-col items-center justify-center py-12 opacity-50 border-2 border-dashed border-slate-200 rounded-3xl mt-4">
            <CheckSquare size={48} className="text-slate-300 mb-2" />
            <p className="text-slate-400 text-sm">No tasks scheduled today</p>
            <p className="text-slate-300 text-xs mt-1">Tap the + button to start</p>
          </div>
        )}

        {goals.map(goal => (
          <div 
            key={goal.id} 
            className={`bg-white p-4 rounded-2xl border transition-all duration-300 group hover:shadow-md relative overflow-hidden ${
              goal.completed 
                ? 'border-slate-100 opacity-75' 
                : 'border-indigo-100'
            }`}
          >
            {!goal.completed && (
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-indigo-500 rounded-l-2xl"></div>
            )}

            <div className="flex items-center gap-4">
              <button 
                onClick={() => toggleGoal(goal.id)}
                className={`flex-shrink-0 transition-colors ${goal.completed ? 'text-emerald-500' : 'text-slate-300 hover:text-indigo-500'}`}
              >
                {goal.completed ? <CheckCircle2 size={24} /> : <Circle size={24} />}
              </button>

              <div className="flex-1 min-w-0">
                <div className="flex items-baseline justify-between">
                  <p className={`font-semibold text-slate-800 text-lg truncate transition-all ${goal.completed ? 'line-through text-slate-400' : ''}`}>
                    {goal.text}
                  </p>
                  
                  {(goal.startTime || goal.endTime) && (
                    <div className="flex items-center gap-1.5 text-xs font-medium bg-indigo-50 text-indigo-600 px-2 py-1 rounded-md ml-2">
                      <Clock size={12} />
                      <span>
                        {goal.startTime || '...'} - {goal.endTime || '...'}
                      </span>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center gap-4 mt-1">
                   <span className="text-[10px] text-slate-400">
                     Added {goal.createdAt.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                   </span>
                   {goal.startTime && notificationPermission === 'granted' && !goal.completed && (
                      <span className="flex items-center gap-1 text-[10px] text-emerald-600 font-medium">
                        <Bell size={10} />
                        {goal.notified ? 'Notified' : 'Alert set'}
                      </span>
                   )}
                </div>
              </div>
            </div>

            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity bg-white pl-2 shadow-[-10px_0_20px_white]">
              <button 
                onClick={() => openEditModal(goal)}
                title="Edit Task"
                className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              >
                <Edit2 size={18} />
              </button>
              <button 
                onClick={() => addToCalendar(goal.text, goal.startTime, goal.endTime)}
                title="Add to Google Calendar"
                className="p-2 text-indigo-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition-colors"
              >
                <Calendar size={18} />
              </button>
              <button 
                onClick={() => deleteGoal(goal.id)}
                title="Delete Task"
                className="p-2 text-rose-400 hover:text-rose-600 hover:bg-rose-50 rounded-full transition-colors"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Action Button (FAB) */}
      <button 
        onClick={openAddModal}
        className="absolute bottom-24 right-6 w-14 h-14 bg-indigo-600 text-white rounded-full shadow-xl shadow-indigo-200 flex items-center justify-center hover:bg-indigo-700 hover:scale-105 active:scale-95 transition-all z-20"
      >
        <Plus size={28} />
      </button>

      {/* Add/Edit Task Modal Overlay */}
      {isAddModalOpen && (
        <div className="absolute inset-0 z-30 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-slate-900/20 backdrop-blur-sm animate-[fadeIn_0.2s_ease-out]">
          <div className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-3xl shadow-2xl animate-[slideUp_0.3s_ease-out] p-6 pb-8 sm:pb-6">
            
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-slate-800">{editingId ? 'Edit Task' : 'New Task'}</h3>
              <button onClick={() => setIsAddModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <X size={24} />
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Task Name</label>
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="e.g., Study for Math Exam"
                  className="w-full bg-slate-50 border border-slate-200 rounded-xl px-4 py-3 text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500"
                  autoFocus
                />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Start Time</label>
                  <input 
                    type="time" 
                    value={startTime}
                    onChange={(e) => setStartTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">End Time</label>
                  <input 
                    type="time" 
                    value={endTime}
                    onChange={(e) => setEndTime(e.target.value)}
                    className="w-full bg-slate-50 border border-slate-200 rounded-xl px-3 py-3 text-sm font-medium text-slate-700 focus:outline-none focus:border-indigo-500"
                  />
                </div>
              </div>

              <button 
                onClick={handleSaveGoal}
                disabled={!input.trim()}
                className="w-full py-3.5 mt-4 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 shadow-lg shadow-indigo-200 disabled:opacity-50 disabled:shadow-none transition-all flex items-center justify-center gap-2"
              >
                {editingId ? <CheckSquare size={20} /> : <Plus size={20} />}
                {editingId ? 'Save Changes' : 'Add to Schedule'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @keyframes slideUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
};
