import { generateDietPlan, type DietPlan, type MealSlot } from './dietGenerator';
import type { ActivityLevel, GoalType } from '../../types/models';

export interface DailyPlan {
  dayLabel: string;
  meals: MealSlot[];
  dailyCalories: number;
  dailyProtein: number;
  dailyCarbs: number;
  dailyFat: number;
}

export interface WeeklyMealPlan {
  days: DailyPlan[];
  weeklyCalories: number;
  weeklyProtein: number;
  weeklyCarbs: number;
  weeklyFat: number;
  goalLabel: string;
  overview: string;
  tips: string[];
}

interface UserParams {
  gender: 'male' | 'female';
  age: number;
  heightCm: number;
  weightKg: number;
  calorieTarget?: number;
  activityLevel?: ActivityLevel;
  goal?: GoalType;
}

const DAY_LABELS = ['周一', '周二', '周三', '周四', '周五', '周六', '周日'];

const WEEKLY_VARIETY_TIPS = [
  '每天更换不同的蛋白质来源，确保氨基酸摄入多样化',
  '午餐和晚餐的主食交替使用糙米、藜麦、红薯、荞麦面等',
  '每天至少吃 3 种不同颜色的蔬菜',
  '周六可安排一顿自由餐（不超过总热量的 120%）',
  '提前一天准备第二天的食材，减少决策疲劳',
  '鱼类（三文鱼/鳕鱼）富含 Omega-3，每周至少吃 2 次',
  '加餐可选择不同的组合：酸奶+坚果、蛋白粉+水果、鸡蛋+全麦饼干',
];

export function generateWeeklyMealPlan(params: UserParams): WeeklyMealPlan {
  const days: DailyPlan[] = [];

  for (let i = 0; i < 7; i++) {
    // Vary daily calories slightly: 95%–105% of target, creating a natural zigzag
    const variation = 0.95 + Math.random() * 0.1;
    const dayParams: UserParams = {
      ...params,
      calorieTarget: params.calorieTarget
        ? Math.round(params.calorieTarget * variation)
        : undefined,
    };
    const plan = generateDietPlan(dayParams);
    days.push({
      dayLabel: DAY_LABELS[i],
      meals: plan.meals,
      dailyCalories: plan.totalCalories,
      dailyProtein: plan.totalProtein,
      dailyCarbs: plan.totalCarbs,
      dailyFat: plan.totalFat,
    });
  }

  const totalCal = days.reduce((s, d) => s + d.dailyCalories, 0);
  const totalPro = days.reduce((s, d) => s + d.dailyProtein, 0);
  const totalCarb = days.reduce((s, d) => s + d.dailyCarbs, 0);
  const totalFat = days.reduce((s, d) => s + d.dailyFat, 0);

  // Copy the goal label from any day's plan
  const tmp = generateDietPlan(params);
  const macroAvg = `${Math.round(totalPro / 7)}g 蛋白质 / ${Math.round(totalCarb / 7)}g 碳水 / ${Math.round(totalFat / 7)}g 脂肪`;
  const calAvg = Math.round(totalCal / 7);

  return {
    days,
    weeklyCalories: totalCal,
    weeklyProtein: totalPro,
    weeklyCarbs: totalCarb,
    weeklyFat: totalFat,
    goalLabel: tmp.goalLabel,
    overview: `7天${tmp.goalLabel}方案 · 日均 ${calAvg} kcal · ${macroAvg}`,
    tips: WEEKLY_VARIETY_TIPS.sort(() => Math.random() - 0.5).slice(0, 5),
  };
}
