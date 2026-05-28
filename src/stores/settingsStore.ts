import { create } from 'zustand';
import { DEFAULT_WATER_GOAL_ML } from '../utils/constants';

interface SettingsState {
  weightUnit: 'kg' | 'lbs';
  heightUnit: 'cm' | 'ft_in';
  waterGoalMl: number;
  calorieTarget: number;
  proteinTarget: number;
  carbsTarget: number;
  fatTarget: number;
  gender: 'male' | 'female';
  age: number;
  heightCm: number;
  loaded: boolean;
  updateSettings: (settings: Partial<SettingsState>) => void;
  setLoaded: (loaded: boolean) => void;
}

const DEFAULTS = {
  weightUnit: 'kg' as const,
  heightUnit: 'cm' as const,
  waterGoalMl: DEFAULT_WATER_GOAL_ML,
  calorieTarget: 2000,
  proteinTarget: 125,
  carbsTarget: 250,
  fatTarget: 67,
  gender: 'male' as const,
  age: 25,
  heightCm: 170,
};

const STORAGE_KEY = 'fitbody-settings';

// Load persisted settings from localStorage (web) or AsyncStorage
let persisted: Partial<SettingsState> = {};
try {
  if (typeof localStorage !== 'undefined') {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (raw) persisted = JSON.parse(raw);
  }
} catch {}

export const useSettingsStore = create<SettingsState>((set, get) => ({
  ...DEFAULTS,
  ...persisted,
  loaded: !!persisted.weightUnit,
  updateSettings: (settings) => {
    set(settings);
    try {
      const current = get();
      const toSave: Record<string, unknown> = {};
      for (const key of Object.keys(DEFAULTS)) {
        toSave[key] = (current as any)[key];
      }
      if (typeof localStorage !== 'undefined') {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(toSave));
      }
    } catch {}
  },
  setLoaded: (loaded) => set({ loaded }),
}));
