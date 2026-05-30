// Translate abstract macro numbers into concrete food combos
// Each nutrient gets a "realistic daily combo" rather than absurd single-food counts

export interface FoodItem {
  name: string;
  icon: string;
  nutrientPer100g: number;
}

export interface NutrientCombo {
  nutrient: string;
  unit: string;
  color: string;
  foods: FoodItem[];
}

// Protein sources (g protein per 100g)
const PROTEIN_FOODS: FoodItem[] = [
  { name: '鸡蛋(2个)', icon: 'egg', nutrientPer100g: 13 },
  { name: '鸡胸肉(150g)', icon: 'restaurant', nutrientPer100g: 31 },
  { name: '三文鱼(150g)', icon: 'fish', nutrientPer100g: 22.7 },
  { name: '瘦牛肉(150g)', icon: 'nutrition', nutrientPer100g: 25.3 },
  { name: '豆腐(200g)', icon: 'leaf', nutrientPer100g: 8 },
  { name: '纯牛奶(250ml)', icon: 'cafe', nutrientPer100g: 3.2 },
  { name: '希腊酸奶(150g)', icon: 'ice-cream', nutrientPer100g: 10 },
  { name: '虾仁(150g)', icon: 'restaurant', nutrientPer100g: 18.7 },
  { name: '蛋白粉(1勺)', icon: 'flask', nutrientPer100g: 80 },
  { name: '猪里脊(120g)', icon: 'restaurant', nutrientPer100g: 25 },
];

// Carb sources (g carbs per 100g)
const CARB_FOODS: FoodItem[] = [
  { name: '米饭1碗(150g)', icon: 'restaurant', nutrientPer100g: 28.7 },
  { name: '全麦面包2片(100g)', icon: 'pizza', nutrientPer100g: 46 },
  { name: '燕麦50g', icon: 'leaf', nutrientPer100g: 66 },
  { name: '红薯200g', icon: 'leaf', nutrientPer100g: 20 },
  { name: '香蕉1根(120g)', icon: 'nutrition', nutrientPer100g: 22.5 },
  { name: '面条1碗(200g)', icon: 'restaurant', nutrientPer100g: 28 },
  { name: '玉米1根(200g)', icon: 'nutrition', nutrientPer100g: 17.5 },
  { name: '苹果1个(200g)', icon: 'nutrition', nutrientPer100g: 14 },
  { name: '杂粮饭1碗(150g)', icon: 'restaurant', nutrientPer100g: 24.7 },
];

// Fat sources (g fat per 100g)
const FAT_FOODS: FoodItem[] = [
  { name: '橄榄油1勺(5ml)', icon: 'water', nutrientPer100g: 100 },
  { name: '混合坚果20g', icon: 'nutrition', nutrientPer100g: 50 },
  { name: '牛油果半个(80g)', icon: 'leaf', nutrientPer100g: 15 },
  { name: '花生酱15g', icon: 'nutrition', nutrientPer100g: 50 },
  { name: '三文鱼(150g)', icon: 'fish', nutrientPer100g: 9.3 },
  { name: '鸡蛋黄(2个)', icon: 'egg', nutrientPer100g: 29.4 },
  { name: '芝麻酱10g', icon: 'nutrition', nutrientPer100g: 50 },
];

// Fiber sources (g fiber per 100g)
const FIBER_FOODS: FoodItem[] = [
  { name: '西兰花200g', icon: 'leaf', nutrientPer100g: 3 },
  { name: '燕麦50g(干)', icon: 'leaf', nutrientPer100g: 10 },
  { name: '苹果1个(带皮)', icon: 'nutrition', nutrientPer100g: 2 },
  { name: '红薯200g', icon: 'leaf', nutrientPer100g: 3 },
  { name: '全麦面包2片', icon: 'pizza', nutrientPer100g: 4 },
  { name: '菠菜200g', icon: 'leaf', nutrientPer100g: 2 },
  { name: '杏仁20g', icon: 'nutrition', nutrientPer100g: 12 },
  { name: '红豆50g(干)', icon: 'leaf', nutrientPer100g: 12 },
];

// Build a realistic daily combo: greedily pick foods until we reach ~80-100% of target
function buildCombo(target: number, pool: FoodItem[]): { items: FoodItem[]; total: number; percent: number } {
  const result: FoodItem[] = [];
  let accumulated = 0;
  // Shuffle slightly so different combos appear each time
  const shuffled = [...pool].sort(() => Math.random() - 0.5);
  for (const food of shuffled) {
    if (accumulated >= target * 0.85) break; // Stop at ~85% — realistic, not forced
    if (result.length >= 5) break; // Max 5 items to keep readable
    result.push(food);
    accumulated += food.nutrientPer100g;
  }
  return { items: result, total: Math.round(accumulated), percent: Math.round((accumulated / target) * 100) };
}

function formatComboText(combo: { items: FoodItem[]; total: number; percent: number }, target: number): string {
  if (combo.items.length === 0) return '';
  const items = combo.items.map(f => f.name.split('(')[0].trim()).join(' + ');
  return `${items} ≈ ${combo.total}g (目标的${combo.percent}%)`;
}

export function getMealCombo(targetGrams: number, nutrientIndex: number): {
  items: FoodItem[];
  total: number;
  percent: number;
  summary: string;
} {
  const pools = [PROTEIN_FOODS, CARB_FOODS, FAT_FOODS, FIBER_FOODS];
  const pool = pools[nutrientIndex] || pools[0];
  if (targetGrams <= 0) return { items: [], total: 0, percent: 0, summary: '' };

  const combo = buildCombo(targetGrams, pool);
  return {
    ...combo,
    summary: formatComboText(combo, targetGrams),
  };
}

export const NUTRIENT_COMBOS = [
  { nutrient: '蛋白质', unit: 'g', color: '#EF4444', pool: PROTEIN_FOODS },
  { nutrient: '碳水', unit: 'g', color: '#3B82F6', pool: CARB_FOODS },
  { nutrient: '脂肪', unit: 'g', color: '#8B5CF6', pool: FAT_FOODS },
  { nutrient: '膳食纤维', unit: 'g', color: '#10B981', pool: FIBER_FOODS },
];

// Quick single-food reference — for "how much X in one Y"
export interface QuickRef {
  food: string;
  icon: string;
  amount: string;
  protein: number;
  carbs: number;
  fat: number;
  calories: number;
}

export const QUICK_REFS: QuickRef[] = [
  { food: '鸡蛋(1个)', icon: 'egg', amount: '50g', protein: 6, carbs: 1, fat: 5, calories: 72 },
  { food: '鸡胸肉', icon: 'restaurant', amount: '100g', protein: 31, carbs: 1, fat: 2, calories: 133 },
  { food: '三文鱼', icon: 'fish', amount: '100g', protein: 20, carbs: 0, fat: 14, calories: 208 },
  { food: '牛奶', icon: 'cafe', amount: '250ml', protein: 8, carbs: 12, fat: 9, calories: 162 },
  { food: '米饭(熟)', icon: 'restaurant', amount: '150g', protein: 4, carbs: 43, fat: 0, calories: 195 },
  { food: '全麦面包', icon: 'pizza', amount: '2片(100g)', protein: 8, carbs: 46, fat: 4, calories: 246 },
  { food: '香蕉', icon: 'nutrition', amount: '1根(120g)', protein: 2, carbs: 27, fat: 0, calories: 112 },
  { food: '西兰花', icon: 'leaf', amount: '200g', protein: 6, carbs: 10, fat: 0, calories: 68 },
  { food: '坚果', icon: 'nutrition', amount: '20g', protein: 4, carbs: 4, fat: 10, calories: 120 },
  { food: '橄榄油', icon: 'water', amount: '5ml', protein: 0, carbs: 0, fat: 5, calories: 45 },
  { food: '希腊酸奶', icon: 'ice-cream', amount: '150g', protein: 15, carbs: 6, fat: 7, calories: 145 },
  { food: '红薯', icon: 'leaf', amount: '200g', protein: 2, carbs: 40, fat: 0, calories: 172 },
];
