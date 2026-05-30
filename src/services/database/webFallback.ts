// localStorage fallback for web when expo-sqlite OPFS is unavailable
import type { WaterRecord, MealRecord, WeightRecord, WorkoutRecord } from '../../types/models';

const WATER_KEY = 'fb_water_records';
const MEAL_KEY = 'fb_meal_records';
const WEIGHT_KEY = 'fb_weight_records';
const WORKOUT_KEY = 'fb_workout_records';

function read<T>(key: string): T[] {
  try {
    if (typeof localStorage !== 'undefined') {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : [];
    }
  } catch {}
  return [];
}

function write<T>(key: string, data: T[]) {
  try {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(key, JSON.stringify(data));
    }
  } catch {}
}

// --- Water ---
export function addWaterLocal(record: Omit<WaterRecord, 'id' | 'createdAt' | 'synced'>): WaterRecord {
  const records = read<WaterRecord>(WATER_KEY);
  const newRecord: WaterRecord = {
    ...record,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    createdAt: new Date().toISOString(),
    synced: 0,
  };
  records.push(newRecord);
  write(WATER_KEY, records);
  return newRecord;
}

export function getWaterTotalForDateLocal(userId: string, date: string): number {
  const records = read<WaterRecord>(WATER_KEY);
  return records
    .filter((r) => r.userId === userId && r.date === date)
    .reduce((sum, r) => sum + r.amountMl, 0);
}

// --- Meal ---
export function addMealLocal(record: Omit<MealRecord, 'id' | 'createdAt' | 'synced'>): MealRecord {
  const records = read<MealRecord>(MEAL_KEY);
  const newRecord: MealRecord = {
    ...record,
    id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8),
    createdAt: new Date().toISOString(),
    synced: 0,
  };
  records.push(newRecord);
  write(MEAL_KEY, records);
  return newRecord;
}

export function getNutritionTotalsLocal(userId: string, date: string) {
  const records = read<MealRecord>(MEAL_KEY);
  const today = records.filter((r) => r.userId === userId && r.date === date);
  return {
    calories: today.reduce((s, r) => s + r.calories, 0),
    protein: today.reduce((s, r) => s + r.proteinG, 0),
    carbs: today.reduce((s, r) => s + r.carbsG, 0),
    fat: today.reduce((s, r) => s + r.fatG, 0),
  };
}

// --- Weight ---
export function addWeightLocal(record: Omit<WeightRecord, 'id' | 'createdAt' | 'updatedAt' | 'synced'>): WeightRecord {
  const records = read<WeightRecord>(WEIGHT_KEY);
  const now = new Date().toISOString();
  const newRecord: WeightRecord = { ...record, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8), createdAt: now, updatedAt: now, synced: 0 };
  records.push(newRecord);
  write(WEIGHT_KEY, records);
  return newRecord;
}

export function getLatestWeightLocal(userId: string): WeightRecord | null {
  const records = read<WeightRecord>(WEIGHT_KEY);
  const userRecords = records.filter((r) => r.userId === userId).sort((a, b) => b.date.localeCompare(a.date));
  return userRecords[0] || null;
}

export function getWeightsByDateRangeLocal(userId: string, startDate: string, endDate: string): WeightRecord[] {
  const records = read<WeightRecord>(WEIGHT_KEY);
  return records
    .filter((r) => r.userId === userId && r.date >= startDate && r.date <= endDate)
    .sort((a, b) => b.date.localeCompare(a.date));
}

// --- Workout ---
export function addWorkoutLocal(record: Omit<WorkoutRecord, 'id' | 'createdAt' | 'synced'>): WorkoutRecord {
  const records = read<WorkoutRecord>(WORKOUT_KEY);
  const newRecord: WorkoutRecord = { ...record, id: Date.now().toString(36) + Math.random().toString(36).slice(2, 8), createdAt: new Date().toISOString(), synced: 0 };
  records.push(newRecord);
  write(WORKOUT_KEY, records);
  return newRecord;
}

export function getWorkoutsByDateLocal(userId: string, date: string): WorkoutRecord[] {
  const records = read<WorkoutRecord>(WORKOUT_KEY);
  return records.filter((r) => r.userId === userId && r.date === date);
}

export function getRecentWorkoutsLocal(userId: string, limit: number = 10): WorkoutRecord[] {
  const records = read<WorkoutRecord>(WORKOUT_KEY);
  return records
    .filter((r) => r.userId === userId)
    .sort((a, b) => b.date.localeCompare(a.date))
    .slice(0, limit);
}

// Detect if SQLite is available (doesn't throw on open)
let sqliteAvailable: boolean | null = null;

export function isSQLiteAvailable(): boolean | null {
  return sqliteAvailable;
}

export function setSQLiteAvailable(v: boolean) {
  sqliteAvailable = v;
}
