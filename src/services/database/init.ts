import * as SQLite from 'expo-sqlite';

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) return db;
  db = await SQLite.openDatabaseAsync('body_fitness.db');
  await runMigrations(db);
  return db;
}

async function runMigrations(db: SQLite.SQLiteDatabase): Promise<void> {
  await db.execAsync(`
    CREATE TABLE IF NOT EXISTS weight_records (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      weight REAL NOT NULL,
      body_fat_percentage REAL,
      source TEXT DEFAULT 'manual',
      date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      synced INTEGER DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_weight_date ON weight_records(date);

    CREATE TABLE IF NOT EXISTS body_measurements (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      neck_cm REAL,
      waist_cm REAL,
      hip_cm REAL,
      height_cm REAL,
      date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      synced INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS water_records (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      amount_ml INTEGER NOT NULL,
      date TEXT NOT NULL,
      time TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      synced INTEGER DEFAULT 0
    );

    CREATE INDEX IF NOT EXISTS idx_water_date ON water_records(date);

    CREATE TABLE IF NOT EXISTS meal_records (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      meal_type TEXT NOT NULL,
      food_name TEXT NOT NULL,
      calories REAL,
      protein_g REAL,
      carbs_g REAL,
      fat_g REAL,
      fiber_g REAL,
      serving_size_g REAL,
      serving_unit TEXT DEFAULT 'g',
      food_id TEXT,
      date TEXT NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      synced INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS workout_records (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      name TEXT NOT NULL,
      date TEXT NOT NULL,
      duration_minutes INTEGER,
      calories_burned REAL,
      perceived_effort INTEGER,
      notes TEXT,
      is_ai_generated INTEGER DEFAULT 0,
      source TEXT DEFAULT 'manual',
      created_at TEXT DEFAULT (datetime('now')),
      synced INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS exercise_sets (
      id TEXT PRIMARY KEY,
      workout_id TEXT NOT NULL,
      exercise_name TEXT NOT NULL,
      exercise_category TEXT,
      muscle_group TEXT,
      sets INTEGER,
      reps INTEGER,
      weight_kg REAL,
      distance_m REAL,
      duration_seconds INTEGER,
      rpe REAL,
      notes TEXT,
      order_index INTEGER NOT NULL,
      created_at TEXT DEFAULT (datetime('now')),
      synced INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS goals (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      type TEXT NOT NULL,
      target_weight_kg REAL,
      target_body_fat REAL,
      target_date TEXT,
      start_date TEXT NOT NULL,
      weekly_goal_kg REAL,
      activity_level TEXT,
      status TEXT DEFAULT 'active',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now')),
      synced INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS progress_photos (
      id TEXT PRIMARY KEY,
      user_id TEXT NOT NULL,
      local_uri TEXT NOT NULL,
      remote_uri TEXT,
      thumbnail_uri TEXT,
      date TEXT NOT NULL,
      category TEXT DEFAULT 'front',
      notes TEXT,
      synced INTEGER DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS sync_queue (
      id TEXT PRIMARY KEY,
      table_name TEXT NOT NULL,
      record_id TEXT NOT NULL,
      operation TEXT NOT NULL,
      payload TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      retry_count INTEGER DEFAULT 0,
      last_error TEXT
    );

    CREATE TABLE IF NOT EXISTS user_settings (
      id TEXT PRIMARY KEY DEFAULT 'default',
      weight_unit TEXT DEFAULT 'kg',
      height_unit TEXT DEFAULT 'cm',
      water_goal_ml INTEGER DEFAULT 2000,
      calorie_target INTEGER DEFAULT 2000,
      protein_target INTEGER DEFAULT 125,
      carbs_target INTEGER DEFAULT 250,
      fat_target INTEGER DEFAULT 67,
      gender TEXT DEFAULT 'male',
      age INTEGER DEFAULT 25,
      height_cm REAL DEFAULT 170
    );
  `);
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}
