import type { GoalType } from '../../types/models';

export interface MacroTargets {
  calories: number;
  proteinG: number;
  proteinPercent: number;
  fatG: number;
  fatPercent: number;
  carbsG: number;
  carbsPercent: number;
  fiberG: number;
}

interface MacroRatios {
  proteinPct: number;
  fatPct: number;
  carbsPct: number;
}

const MACRO_RATIOS: Record<GoalType, MacroRatios> = {
  weight_loss: { proteinPct: 0.35, fatPct: 0.3, carbsPct: 0.35 },
  muscle_gain: { proteinPct: 0.3, fatPct: 0.25, carbsPct: 0.45 },
  maintenance: { proteinPct: 0.25, fatPct: 0.3, carbsPct: 0.45 },
  custom: { proteinPct: 0.25, fatPct: 0.3, carbsPct: 0.45 },
};

export function calculateMacros(calories: number, goalType: GoalType): MacroTargets {
  const ratios = MACRO_RATIOS[goalType];

  const proteinCal = calories * ratios.proteinPct;
  const fatCal = calories * ratios.fatPct;
  const carbsCal = calories * ratios.carbsPct;

  const proteinG = Math.round(proteinCal / 4);
  const fatG = Math.round(fatCal / 9);
  const carbsG = Math.round(carbsCal / 4);
  const fiberG = Math.round(calories / 1000 * 14);

  return {
    calories,
    proteinG,
    proteinPercent: Math.round(ratios.proteinPct * 100),
    fatG,
    fatPercent: Math.round(ratios.fatPct * 100),
    carbsG,
    carbsPercent: Math.round(ratios.carbsPct * 100),
    fiberG,
  };
}

export function calculateCaloriesForGoal(
  tdee: number,
  goalType: GoalType,
  weeklyGoalKg: number
): number {
  switch (goalType) {
    case 'weight_loss': {
      const dailyDeficit = (weeklyGoalKg * 7700) / 7;
      return Math.round(tdee - dailyDeficit);
    }
    case 'muscle_gain': {
      const dailySurplus = (weeklyGoalKg * 3500) / 7;
      return Math.round(tdee + dailySurplus);
    }
    case 'maintenance':
    default:
      return tdee;
  }
}
