export type Subject = {
  id: string;
  userId: string;
  name: string;
  color: string;
  icon: string;
  createdAt: Date;
  updatedAt: Date;
};

export type Task = {
  id: string;
  subjectId: string;
  userId: string;
  title: string;
  completed: boolean;
  dueDate: Date | null;
  createdAt: Date;
  updatedAt: Date;
  subject?: Subject;
};

export type Session = {
  id: string;
  userId: string;
  subjectId: string;
  taskId: string | null;
  duration: number;
  date: Date;
  createdAt: Date;
  subject?: Subject;
  task?: Task | null;
};

export type Goal = {
  id: string;
  userId: string;
  dailyMinutes: number;
  updatedAt: Date;
};

export type TimerSettings = {
  workMinutes: number;
  shortBreakMinutes: number;
  longBreakMinutes: number;
  longBreakInterval: number;
};

export type TimerMode = "work" | "shortBreak" | "longBreak";
