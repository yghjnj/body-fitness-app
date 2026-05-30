import type { ActivityLevel } from '../../types/models';

const ACTIVITY_MULTIPLIERS: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  very_active: 1.725,
  extreme: 1.9,
};

export const ACTIVITY_LABELS: Record<ActivityLevel, string> = {
  sedentary: '久坐不动（几乎不运动）',
  light: '轻度运动（每周1-3天）',
  moderate: '中度运动（每周3-5天）',
  very_active: '高强度运动（每周6-7天）',
  extreme: '极高强度（每天高强度/体力劳动）',
};

export interface TDEEResult {
  bmr: number;
  tdee: number;
  activityLevel: ActivityLevel;
  multiplier: number;
  maintenance: number;
  mildWeightLoss: number;
  weightLoss: number;
  mildWeightGain: number;
  weightGain: number;
}

export function calculateTDEE(bmr: number, activityLevel: ActivityLevel): TDEEResult {
  const multiplier = ACTIVITY_MULTIPLIERS[activityLevel];
  const tdee = Math.round(bmr * multiplier);

  return {
    bmr,
    tdee,
    activityLevel,
    multiplier,
    maintenance: tdee,
    mildWeightLoss: Math.round(tdee - 250),
    weightLoss: Math.round(tdee - 500),
    mildWeightGain: Math.round(tdee + 250),
    weightGain: Math.round(tdee + 500),
  };
}
