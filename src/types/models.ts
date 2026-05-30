export interface WeightRecord {
  id: string;
  userId: string;
  weight: number;
  bodyFatPercentage?: number;
  source: 'manual' | 'health_connect' | 'smart_scale';
  date: string;
  createdAt: string;
  updatedAt: string;
  synced: number;
}

export interface BodyMeasurements {
  id: string;
  userId: string;
  neckCm?: number;
  waistCm?: number;
  hipCm?: number;
  heightCm?: number;
  date: string;
  createdAt: string;
  updatedAt: string;
  synced: number;
}

export interface WaterRecord {
  id: string;
  userId: string;
  amountMl: number;
  date: string;
  time: string;
  createdAt: string;
  synced: number;
}

export interface MealRecord {
  id: string;
  userId: string;
  mealType: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  foodName: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  fiberG: number;
  servingSizeG: number;
  servingUnit: string;
  foodId?: string;
  date: string;
  createdAt: string;
  synced: number;
}

export interface WorkoutRecord {
  id: string;
  userId: string;
  name: string;
  date: string;
  durationMinutes: number;
  caloriesBurned?: number;
  perceivedEffort?: number;
  notes?: string;
  isAiGenerated: number;
  source: 'manual' | 'ai' | 'template';
  createdAt: string;
  synced: number;
}

export interface ExerciseSet {
  id: string;
  workoutId: string;
  exerciseName: string;
  exerciseCategory: 'strength' | 'cardio' | 'flexibility' | 'plyometric';
  muscleGroup?: string;
  sets: number;
  reps: number;
  weightKg?: number;
  distanceM?: number;
  durationSeconds?: number;
  rpe?: number;
  notes?: string;
  orderIndex: number;
  createdAt: string;
  synced: number;
}

export interface Goal {
  id: string;
  userId: string;
  type: 'weight_loss' | 'muscle_gain' | 'maintenance' | 'custom';
  targetWeightKg?: number;
  targetBodyFat?: number;
  targetDate?: string;
  startDate: string;
  weeklyGoalKg?: number;
  activityLevel: 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extreme';
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
  updatedAt: string;
  synced: number;
}

export interface ProgressPhoto {
  id: string;
  userId: string;
  localUri: string;
  remoteUri?: string;
  thumbnailUri?: string;
  date: string;
  category: 'front' | 'back' | 'side' | 'flexed';
  notes?: string;
  synced: number;
}

export interface UserProfile {
  id: string;
  email: string;
  displayName: string;
  photoURL?: string;
  heightCm?: number;
  birthDate?: string;
  gender?: 'male' | 'female' | 'other';
  activityLevel?: string;
  dietType?: string;
  allergies?: string[];
  onboardingComplete: boolean;
  subscriptionStatus: 'free' | 'vip';
}

export type ActivityLevel = 'sedentary' | 'light' | 'moderate' | 'very_active' | 'extreme';
export type GoalType = 'weight_loss' | 'muscle_gain' | 'maintenance' | 'custom';
