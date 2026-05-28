import { getDatabase } from '../init';
import type { WaterRecord } from '../../../types/models';
import { v4 as uuid } from 'uuid';

export async function addWater(record: Omit<WaterRecord, 'id' | 'createdAt' | 'synced'>): Promise<WaterRecord> {
  const db = await getDatabase();
  const id = uuid();
  const now = new Date().toISOString();
  const newRecord: WaterRecord = { ...record, id, createdAt: now, synced: 0 };
  await db.runAsync(
    `INSERT INTO water_records (id, user_id, amount_ml, date, time, created_at, synced)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [newRecord.id, newRecord.userId, newRecord.amountMl, newRecord.date, newRecord.time, newRecord.createdAt, newRecord.synced]
  );
  return newRecord;
}

export async function getWaterByDate(userId: string, date: string): Promise<WaterRecord[]> {
  const db = await getDatabase();
  return db.getAllAsync<WaterRecord>(
    `SELECT * FROM water_records WHERE user_id = ? AND date = ? ORDER BY time DESC`,
    [userId, date]
  );
}

export async function getWaterTotalForDate(userId: string, date: string): Promise<number> {
  const db = await getDatabase();
  const row = await db.getFirstAsync<{ total: number }>(
    `SELECT COALESCE(SUM(amount_ml), 0) as total FROM water_records WHERE user_id = ? AND date = ?`,
    [userId, date]
  );
  return row?.total ?? 0;
}
