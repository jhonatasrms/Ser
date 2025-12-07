
import { User } from '../types';

const STORAGE_KEY = 'sereninho_user_v2'; // Updated key version

export const getTodayStr = () => new Date().toISOString().split('T')[0];

export const getInitialUser = (): User | null => {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (!stored) return null;
  
  const user: User = JSON.parse(stored);
  // Basic integrity check
  if (!user.name) return null;
  
  return user;
};

export const saveUser = (user: User) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
};

export const registerTrial = (name: string, whatsapp: string): User => {
  const today = new Date();
  const tomorrow = new Date(today);
  tomorrow.setDate(tomorrow.getDate() + 1);

  const newUser: User = {
    name,
    whatsapp,
    plan: 'trial',
    trialEndDate: tomorrow.toISOString(),
    points: 0,
    streak: 0,
    lastActiveDate: getTodayStr(),
    completedTasks: {},
    unlockedBadges: []
  };
  
  saveUser(newUser);
  return newUser;
};

export const checkStreak = (user: User): User => {
    const today = getTodayStr();
    if (user.lastActiveDate === today) return user;

    const lastActive = new Date(user.lastActiveDate);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - lastActive.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    let newStreak = user.streak;

    if (diffDays === 1) {
        // Consecutive day
        newStreak += 1;
    } else if (diffDays > 1) {
        // Broke streak
        newStreak = 0;
    }

    const updatedUser = { ...user, lastActiveDate: today, streak: newStreak };
    saveUser(updatedUser);
    return updatedUser;
};
