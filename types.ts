
export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: Date;
}

export interface MoodEntry {
  id: string;
  date: string;
  score: number; // 1-5
  note: string;
}

export interface Goal {
  id: string;
  text: string;
  completed: boolean;
  createdAt: Date;
  startTime?: string; // Format "HH:MM"
  endTime?: string;   // Format "HH:MM"
  notified?: boolean;
}

export enum AppView {
  CHAT = 'CHAT',
  MOOD = 'MOOD',
  BREATHE = 'BREATHE',
  GOALS = 'GOALS',
  RESOURCES = 'RESOURCES'
}

export interface ChatState {
  messages: Message[];
  isLoading: boolean;
}
