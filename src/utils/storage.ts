import type { DecisionRecord } from '../types';

const STORAGE_KEY = 'are_you_sure_decisions_v1';

export const getStoredDecisions = (): DecisionRecord[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    return JSON.parse(raw);
  } catch (e) {
    console.error('Failed to load decisions from localStorage:', e);
    return [];
  }
};

export const saveDecision = (record: DecisionRecord): boolean => {
  try {
    const list = getStoredDecisions();
    // Keep latest at front, max 50 items
    const updated = [record, ...list.filter((item) => item.id !== record.id)].slice(0, 50);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error('Failed to save decision to localStorage:', e);
    return false;
  }
};

export const deleteDecision = (id: string): boolean => {
  try {
    const list = getStoredDecisions();
    const updated = list.filter((item) => item.id !== id);
    localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    return true;
  } catch (e) {
    console.error('Failed to delete decision:', e);
    return false;
  }
};

export const clearAllDecisions = (): boolean => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return true;
  } catch (e) {
    console.error('Failed to clear decisions:', e);
    return false;
  }
};
