import React, { useState, useEffect } from 'react';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, AreaChart, Area 
} from 'recharts';
import { Frown, Meh, Smile, Activity, Save } from 'lucide-react';
import { MoodEntry } from '../types';

interface MoodTrackerProps {
  isActive: boolean;
}

export const MoodTracker: React.FC<MoodTrackerProps> = ({ isActive }) => {
  const [moods, setMoods] = useState<MoodEntry[]>([]);
  const [selectedRating, setSelectedRating] = useState<number | null>(null);
  const [note, setNote] = useState('');

  // Mock initial data for visualization
  useEffect(() => {
    const mockData: MoodEntry[] = Array.from({ length: 7 }).map((_, i) => {
      const date = new Date();
      date.setDate(date.getDate() - (6 - i));
      return {
        id: `mock-${i}`,
        date: date.toLocaleDateString('en-US', { weekday: 'short' }),
        score: Math.floor(Math.random() * 3) + 2, // Random score 2-5
        note: 'Mock entry'
      };
    });
    setMoods(mockData);
  }, []);

  const handleSave = () => {
    if (!selectedRating) return;

    const newEntry: MoodEntry = {
      id: Date.now().toString(),
      date: 'Today',
      score: selectedRating,
      note
    };

    // Replace "Today" if it exists or append
    const existingTodayIndex = moods.findIndex(m => m.date === 'Today');
    if (existingTodayIndex >= 0) {
        const updated = [...moods];
        updated[existingTodayIndex] = newEntry;
        setMoods(updated);
    } else {
        setMoods([...moods.slice(1), newEntry]); // Keep last 7
    }
    
    setNote('');
    setSelectedRating(null);
  };

  const getMoodColor = (score: number) => {
    if (score <= 2) return 'text-rose-500 bg-rose-50 border-rose-200';
    if (score === 3) return 'text-amber-500 bg-amber-50 border-amber-200';
    return 'text-emerald-500 bg-emerald-50 border-emerald-200';
  };

  if (!isActive) return null;

  return (
    <div className="flex flex-col h-full space-y-6 overflow-y-auto no-scrollbar pb-20">
      
      {/* Header */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100">
        <h2 className="text-2xl font-bold text-slate-800 mb-2 flex items-center gap-2">
          <Activity className="text-indigo-500" />
          Mood Tracker
        </h2>
        <p className="text-slate-500 text-sm">Track your emotional well-being over time.</p>
      </div>

      {/* Input Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-4">How are you feeling today?</label>
          <div className="flex justify-between gap-2">
            {[1, 2, 3, 4, 5].map((rating) => (
              <button
                key={rating}
                onClick={() => setSelectedRating(rating)}
                className={`flex-1 aspect-square rounded-2xl flex flex-col items-center justify-center transition-all duration-200 border-2 ${
                  selectedRating === rating
                    ? 'border-indigo-500 bg-indigo-50 text-indigo-600 transform -translate-y-1 shadow-md'
                    : 'border-transparent bg-slate-50 text-slate-400 hover:bg-slate-100'
                }`}
              >
                {rating <= 2 ? <Frown size={24} /> : rating === 3 ? <Meh size={24} /> : <Smile size={24} />}
                <span className="text-xs font-bold mt-1">{rating}</span>
              </button>
            ))}
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Add a note (optional)</label>
          <textarea
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="w-full bg-slate-50 border border-slate-200 rounded-xl p-3 text-sm focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition-all"
            rows={2}
            placeholder="What influenced your mood?"
          />
        </div>

        <button
          onClick={handleSave}
          disabled={!selectedRating}
          className="w-full bg-slate-900 text-white py-3 rounded-xl font-semibold hover:bg-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center gap-2"
        >
          <Save size={18} />
          Log Mood
        </button>
      </div>

      {/* Chart Section */}
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-slate-100 h-80">
        <h3 className="text-lg font-semibold text-slate-800 mb-4">Weekly Trend</h3>
        <div className="w-full h-64">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={moods}>
              <defs>
                <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#6366f1" stopOpacity={0.3}/>
                  <stop offset="95%" stopColor="#6366f1" stopOpacity={0}/>
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{fontSize: 12, fill: '#94a3b8'}} 
                dy={10}
              />
              <YAxis 
                domain={[1, 5]} 
                hide 
              />
              <Tooltip 
                contentStyle={{ backgroundColor: '#fff', borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                itemStyle={{ color: '#6366f1' }}
              />
              <Area 
                type="monotone" 
                dataKey="score" 
                stroke="#6366f1" 
                strokeWidth={3}
                fillOpacity={1} 
                fill="url(#colorScore)" 
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};