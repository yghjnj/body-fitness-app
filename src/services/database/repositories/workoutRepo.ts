import { getDatabase } from '../init';
import type { WorkoutRecord, ExerciseSet } from '../../../types/models';
import { v4 as uuid } from 'uuid';

export async function addWorkout(
  record: Omit<WorkoutRecord, 'id' | 'createdAt' | 'synced'>,
  exercises: Omit<ExerciseSet, 'id' | 'workoutId' | 'createdAt' | 'synced'>[]
): Promise<WorkoutRecord> {
  const db = await getDatabase();
  const id = uuid();
  const now = new Date().toISOString();
  const newRecord: WorkoutRecord = { ...record, id, createdAt: now, synced: 0 };

  await db.runAsync(
    `INSERT INTO workout_records (id, user_id, name, date, duration_minutes, calories_burned, perceived_effort, notes, is_ai_generated, source, created_at, synced)
     VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
    [newRecord.id, newRecord.userId, newRecord.name, newRecord.date, newRecord.durationMinutes, newRecord.caloriesBurned ?? null, newRecord.perceivedEffort ?? null, newRecord.notes ?? null, newRecord.isAiGenerated, newRecord.source, newRecord.createdAt, newRecord.synced]
  );

  for (let i = 0; i < exercises.length; i++) {
    const ex = exercises[i];
    const exId = uuid();
    await db.runAsync(
      `INSERT INTO exercise_sets (id, workout_id, exercise_name, exercise_category, muscle_group, sets, reps, weight_kg, distance_m, duration_seconds, rpe, notes, order_index, created_at, synced)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [exId, id, ex.exerciseName, ex.exerciseCategory ?? null, ex.muscleGroup ?? null, ex.sets, ex.reps, ex.weightKg ?? null, ex.distanceM ?? null, ex.durationSeconds ?? null, ex.rpe ?? null, ex.notes ?? null, ex.orderIndex ?? i, now, 0]
    );
  }

  return newRecord;
}

export async function getWorkoutsByDate(userId: string, date: string): Promise<WorkoutRecord[]> {
  const db = await getDatabase();
  return db.getAllAsync<WorkoutRecord>(
    `SELECT * FROM workout_records WHERE user_id = ? AND date = ? ORDER BY created_at DESC`,
    [userId, date]
  );
}

export async function getRecentWorkouts(userId: string, limit: number = 10): Promise<WorkoutRecord[]> {
  const db = await getDatabase();
  return db.getAllAsync<WorkoutRecord>(
    `SELECT * FROM workout_records WHERE user_id = ? ORDER BY date DESC LIMIT ?`,
    [userId, limit]
  );
}
