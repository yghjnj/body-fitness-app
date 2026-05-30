import { getDatabase } from '../init';
import type { WeightRecord } from '../../../types/models';
import { v4 as uuid } from 'uuid';
import { addWeightLocal, getLatestWeightLocal, getWeightsByDateRangeLocal, setSQLiteAvailable } from '../webFallback';

let useLocal = false;

export async function addWeight(record: Omit<WeightRecord, 'id' | 'createdAt' | 'updatedAt' | 'synced'>): Promise<WeightRecord> {
  if (useLocal) return addWeightLocal(record);
  try {
    const db = await getDatabase();
    const id = uuid();
    const now = new Date().toISOString();
    const newRecord: WeightRecord = { ...record, id, createdAt: now, updatedAt: now, synced: 0 };
    await db.runAsync(
      `INSERT INTO weight_records (id, user_id, weight, body_fat_percentage, source, date, created_at, updated_at, synced)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [newRecord.id, newRecord.userId, newRecord.weight, newRecord.bodyFatPercentage ?? null, newRecord.source, newRecord.date, newRecord.createdAt, newRecord.updatedAt, newRecord.synced]
    );
    return newRecord;
  } catch (e) {
    console.warn('SQLite addWeight failed, using localStorage fallback:', e);
    useLocal = true;
    setSQLiteAvailable(false);
    return addWeightLocal(record);
  }
}

export async function getWeightsByDateRange(userId: string, startDate: string, endDate: string): Promise<WeightRecord[]> {
  if (useLocal) return getWeightsByDateRangeLocal(userId, startDate, endDate);
  try {
    const db = await getDatabase();
    return db.getAllAsync<WeightRecord>(
      `SELECT * FROM weight_records WHERE user_id = ? AND date >= ? AND date <= ? ORDER BY date DESC`,
      [userId, startDate, endDate]
    );
  } catch {
    useLocal = true;
    setSQLiteAvailable(false);
    return getWeightsByDateRangeLocal(userId, startDate, endDate);
  }
}

export async function getLatestWeight(userId: string): Promise<WeightRecord | null> {
  if (useLocal) return getLatestWeightLocal(userId);
  try {
    const db = await getDatabase();
    const row = await db.getFirstAsync<WeightRecord>(
      `SELECT * FROM weight_records WHERE user_id = ? ORDER BY date DESC LIMIT 1`,
      [userId]
    );
    return row ?? null;
  } catch {
    useLocal = true;
    setSQLiteAvailable(false);
    return getLatestWeightLocal(userId);
  }
}
