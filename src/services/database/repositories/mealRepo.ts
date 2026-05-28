import { getDatabase } from '../init';
import type { MealRecord } from '../../../types/models';
import { v4 as uuid } from 'uuid';

export async function addMeal(record: Omit<MealRecord, 'id' | 'createdAt' | 'synced'>): Promise<MealRecord> {
  const db = await getDatabase();
  const id = uuid();
  const now = new Date().toISOString();
  const newRecord: MealRecord = { ...record, id, createdAt: now, synced: 0 };
  await db.runAsync(
    `INSERT INTO meal_records (id, user_id, meal_type, food_name, calories, protein_g, carbs_g, fat_g, fiber_g, serving_size_g, serving_unit, food_id, date, created_at, synced)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [newRecord.id, newRecord.userId, newRecord.mealType, newRecord.foodName, newRecord.calories, newRecord.proteinG, newRecord.carbsG, newRecord.fatG, newRecord.fiberG, newRecord.servingSizeG, newRecord.servingUnit, newRecord.foodId ?? null, newRecord.date, newRecord.createdAt, newRecord.synced]
  );
  return newRecord;
}

export async function getMealsByDate(userId: string, date: string): Promise<MealRecord[]> {
  const db = await getDatabase();
  return db.getAllAsync<MealRecord>(
    `SELECT * FROM meal_records WHERE user_id = ? AND date = ? ORDER BY created_at DESC`,
    [userId, date]
  );
}

export async function getNutritionTotals(userId: string, date: string): Promise<{ calories: number; protein: number; carbs: number; fat: number }> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ calories: number; protein: number; carbs: number; fat: number }>(
    `SELECT COALESCE(SUM(calories), 0) as calories, COALESCE(SUM(protein_g), 0) as protein, COALESCE(SUM(carbs_g), 0) as carbs, COALESCE(SUM(fat_g), 0) as fat FROM meal_records WHERE user_id = ? AND date = ?`,
    [userId, date]
  );
  return row ?? { calories: 0, protein: 0, carbs: 0, fat: 0 };
}
