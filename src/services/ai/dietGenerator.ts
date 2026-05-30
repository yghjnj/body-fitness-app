import {
  BREAKFAST_MAINS, BREAKFAST_PROTEINS, BREAKFAST_FRUITS,
  STAPLES, PROTEINS, VEGETABLES, SNACKS, CONDIMENTS,
  pickRandom, sumFoods,
} from '../../data/foods';
import type { FoodItem } from '../../data/foods';
import { calculateBMR } from '../../utils/calculations/bmr';
import { calculateTDEE } from '../../utils/calculations/tdee';
import type { ActivityLevel, GoalType } from '../../types/models';

export interface MealSlot {
  name: string;
  time: string;
  items: string[];
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface DietPlan {
  meals: MealSlot[];
  tips: string[];
  totalCalories: number;
  totalProtein: number;
  totalCarbs: number;
  totalFat: number;
  goalLabel: string;
  bmi: number;
  bmiLabel: string;
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

function guessGoal(calorieTarget: number, tdee: number): GoalType {
  const diff = calorieTarget - tdee;
  if (diff < -300) return 'weight_loss';
  if (diff > 200) return 'muscle_gain';
  return 'maintenance';
}

function calcBMI(weightKg: number, heightCm: number): { bmi: number; label: string } {
  const h = heightCm / 100;
  const bmi = Math.round((weightKg / (h * h)) * 10) / 10;
  let label: string;
  if (bmi < 18.5) label = '偏瘦';
  else if (bmi < 25) label = '正常';
  else if (bmi < 30) label = '超重';
  else label = '肥胖';
  return { bmi, label };
}

function macroDistribution(calories: number, goal: GoalType, weightKg: number) {
  let proteinG: number, fatG: number, carbsG: number;
  switch (goal) {
    case 'weight_loss':
      proteinG = Math.round(weightKg * 2.2);
      fatG = Math.round(calories * 0.25 / 9);
      carbsG = Math.round((calories - proteinG * 4 - fatG * 9) / 4);
      break;
    case 'muscle_gain':
      proteinG = Math.round(weightKg * 2.0);
      fatG = Math.round(calories * 0.25 / 9);
      carbsG = Math.round((calories - proteinG * 4 - fatG * 9) / 4);
      break;
    default:
      proteinG = Math.round(weightKg * 1.6);
      fatG = Math.round(calories * 0.28 / 9);
      carbsG = Math.round((calories - proteinG * 4 - fatG * 9) / 4);
  }
  return { proteinG, fatG, carbsG };
}

// Meal calorie splits: breakfast 28%, lunch 35%, snack 8%, dinner 29%
const MEAL_SPLITS = [0.28, 0.35, 0.08, 0.29];
const MEAL_NAMES = ['早餐', '午餐', '加餐', '晚餐'];
const MEAL_TIMES = ['07:30', '12:00', '15:30', '18:30'];

export function generateDietPlan(params: UserParams): DietPlan {
  const { gender, age, heightCm, weightKg, activityLevel = 'moderate' } = params;

  const bmrResult = calculateBMR(weightKg, heightCm, age, gender);
  const tdeeResult = calculateTDEE(bmrResult.average, activityLevel);
  const tdee = tdeeResult.tdee;

  const calorieTarget = params.calorieTarget || tdee;
  const goal = params.goal || guessGoal(calorieTarget, tdee);
  const { bmi, label: bmiLabel } = calcBMI(weightKg, heightCm);
  const { proteinG, fatG, carbsG } = macroDistribution(calorieTarget, goal, weightKg);

  // --- Build meals ---
  const globalMacros = { proteinG, fatG, carbsG };

  const buildMeal = (index: number, usedFoods: Set<string>): MealSlot => {
    const split = MEAL_SPLITS[index];
    const targetCal = Math.round(calorieTarget * split);
    const targetProtein = Math.round(proteinG * split);
    const targetCarbs = Math.round(carbsG * split);
    const targetFat = Math.round(fatG * split);

    if (index === 0) {
      // Breakfast
      const main = pickRandom(BREAKFAST_MAINS.filter(f => !usedFoods.has(f.name)), 2);
      const protein = pickRandom(BREAKFAST_PROTEINS.filter(f => !usedFoods.has(f.name)), 1);
      const fruit = pickRandom(BREAKFAST_FRUITS.filter(f => !usedFoods.has(f.name)), 1);
      const items = [main[0], protein[0], fruit[0]];
      if (main[1] && sumFoods([main[0], protein[0], fruit[0]]).calories < targetCal * 0.7) {
        items.push(main[1]);
      }
      const nut = sumFoods(items);
      return { name: '早餐', time: '07:30', items: items.map(f => f.name), ...nut };
    }

    if (index === 1) {
      // Lunch — staple + protein + vegetable
      const staple = pickRandom(STAPLES.filter(f => !usedFoods.has(f.name)), 1);
      const protein = pickRandom(PROTEINS.filter(f => !usedFoods.has(f.name)), 1);
      const vegetable = pickRandom(VEGETABLES.filter(f => !usedFoods.has(f.name)), 1);
      const items = [...staple, ...protein, ...vegetable];
      // Add condiment for healthy fats
      if (targetFat > 10) {
        const cond = pickRandom(CONDIMENTS, 1);
        items.push(cond[0]);
      }
      const nut = sumFoods(items);
      return { name: '午餐', time: '12:00', items: items.map(f => `${f.name} ${f.serving}`), ...nut };
    }

    if (index === 2) {
      // Snack
      const snack = pickRandom(SNACKS.filter(f => !usedFoods.has(f.name)), 2);
      const nut = sumFoods(snack);
      return { name: '加餐', time: '15:30', items: snack.map(f => f.name), ...nut };
    }

    // Dinner — lighter, staple + protein + vegetable
    const staple = pickRandom(STAPLES.filter(f => !usedFoods.has(f.name)), 1);
    const protein = pickRandom(PROTEINS.filter(f => !usedFoods.has(f.name)), 1);
    const vegetable = pickRandom(VEGETABLES.filter(f => !usedFoods.has(f.name)), 1);
    const items = [...staple, ...protein, ...vegetable];
    const nut = sumFoods(items);
    return { name: '晚餐', time: '18:30', items: items.map(f => `${f.name} ${f.serving}`), ...nut };
  };

  const usedNames = new Set<string>();
  const meals: MealSlot[] = [];

  for (let i = 0; i < 4; i++) {
    const meal = buildMeal(i, usedNames);
    meals.push(meal);
    // Track used foods to avoid repetition within a day
    meal.items.forEach(name => {
      const baseName = name.split(' ')[0];
      usedNames.add(baseName);
    });
  }

  // Generate tips based on goal
  const tips: string[] = [];
  switch (goal) {
    case 'weight_loss':
      tips.push(`每日热量缺口约 ${tdee - calorieTarget} kcal，预计每周减 0.3-0.5kg`);
      tips.push('每餐先吃蔬菜再吃蛋白质，最后吃主食，增加饱腹感');
      tips.push('每天饮水不少于 2L，餐前喝一杯水有助于减少进食量');
      tips.push('晚餐尽量在睡前 3 小时完成，避免夜宵');
      tips.push('每周安排 3-5 次有氧运动，每次 30-45 分钟');
      break;
    case 'muscle_gain':
      tips.push(`每日热量盈余约 ${calorieTarget - tdee} kcal，配合力量训练促进肌肉生长`);
      tips.push('训练后 30 分钟内补充蛋白质+碳水，推荐乳清蛋白+香蕉');
      tips.push('每公斤体重摄入 2-2.2g 蛋白质，分 3-4 餐均衡摄入');
      tips.push('保证每天 7-8 小时睡眠，肌肉在休息时生长');
      tips.push('每周 4-5 次力量训练，逐渐增加负重');
      break;
    default:
      tips.push('保持当前热量平衡，体重稳定是健康的基础');
      tips.push('每餐保证蛋白质摄入，维持肌肉量');
      tips.push('每天饮水不少于 2L');
      tips.push('每周 3-4 次运动，力量+有氧结合');
      tips.push('多吃不同颜色的蔬菜，保证微量元素摄入');
  }

  const totalCalories = meals.reduce((s, m) => s + m.calories, 0);
  const totalProtein = meals.reduce((s, m) => s + m.protein, 0);
  const totalCarbs = meals.reduce((s, m) => s + m.carbs, 0);
  const totalFat = meals.reduce((s, m) => s + m.fat, 0);

  const goalLabels: Record<GoalType, string> = {
    weight_loss: '减脂',
    muscle_gain: '增肌',
    maintenance: '维持',
    custom: '自定义',
  };

  return {
    meals,
    tips,
    totalCalories: Math.round(totalCalories),
    totalProtein: Math.round(totalProtein),
    totalCarbs: Math.round(totalCarbs),
    totalFat: Math.round(totalFat),
    goalLabel: goalLabels[goal],
    bmi,
    bmiLabel,
  };
}
