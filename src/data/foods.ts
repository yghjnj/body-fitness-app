// Chinese food nutrition database — per-serving values (calories, protein/carbs/fat in grams)
// Organized by meal type for easy meal-plan lookup

export interface FoodItem {
  name: string;
  serving: string;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}

export interface FoodCategory {
  name: string;
  foods: FoodItem[];
}

// --- Breakfast 早餐 ---

export const BREAKFAST_MAINS: FoodItem[] = [
  { name: '全麦面包', serving: '2片(100g)', calories: 246, protein: 8, carbs: 46, fat: 4 },
  { name: '燕麦片', serving: '50g(干)', calories: 194, protein: 7, carbs: 33, fat: 3 },
  { name: '蒸红薯', serving: '200g', calories: 172, protein: 2, carbs: 40, fat: 0 },
  { name: '玉米', serving: '1根(200g)', calories: 172, protein: 5, carbs: 35, fat: 4 },
  { name: '全麦馒头', serving: '1个(80g)', calories: 196, protein: 6, carbs: 40, fat: 2 },
  { name: '杂粮粥', serving: '1碗(300g)', calories: 165, protein: 5, carbs: 34, fat: 1 },
  { name: '荞麦面', serving: '150g(熟)', calories: 178, protein: 7, carbs: 35, fat: 2 },
  { name: '紫薯', serving: '200g', calories: 156, protein: 3, carbs: 35, fat: 0 },
];

export const BREAKFAST_PROTEINS: FoodItem[] = [
  { name: '水煮鸡蛋', serving: '2个(100g)', calories: 144, protein: 13, carbs: 2, fat: 10 },
  { name: '纯牛奶', serving: '250ml', calories: 162, protein: 8, carbs: 12, fat: 9 },
  { name: '无糖豆浆', serving: '300ml', calories: 102, protein: 9, carbs: 6, fat: 4 },
  { name: '希腊酸奶', serving: '150g', calories: 145, protein: 15, carbs: 6, fat: 7 },
  { name: '低脂奶酪', serving: '50g', calories: 120, protein: 12, carbs: 2, fat: 7 },
  { name: '鹌鹑蛋', serving: '6个(60g)', calories: 96, protein: 8, carbs: 1, fat: 7 },
];

export const BREAKFAST_FRUITS: FoodItem[] = [
  { name: '苹果', serving: '1个(200g)', calories: 104, protein: 0, carbs: 28, fat: 0 },
  { name: '香蕉', serving: '1根(120g)', calories: 112, protein: 2, carbs: 27, fat: 0 },
  { name: '蓝莓', serving: '100g', calories: 57, protein: 1, carbs: 14, fat: 0 },
  { name: '橙子', serving: '1个(200g)', calories: 94, protein: 2, carbs: 22, fat: 0 },
  { name: '猕猴桃', serving: '2个(150g)', calories: 92, protein: 2, carbs: 22, fat: 1 },
  { name: '圣女果', serving: '150g', calories: 38, protein: 2, carbs: 6, fat: 0 },
];

// --- Lunch/Dinner 午餐晚餐 ---

export const STAPLES: FoodItem[] = [
  { name: '糙米饭', serving: '150g', calories: 184, protein: 4, carbs: 39, fat: 1 },
  { name: '白米饭', serving: '150g', calories: 195, protein: 4, carbs: 43, fat: 0 },
  { name: '全麦面条', serving: '200g(熟)', calories: 220, protein: 8, carbs: 44, fat: 2 },
  { name: '藜麦饭', serving: '150g', calories: 180, protein: 7, carbs: 32, fat: 3 },
  { name: '蒸土豆', serving: '200g', calories: 154, protein: 4, carbs: 34, fat: 0 },
  { name: '杂粮饭', serving: '150g', calories: 178, protein: 5, carbs: 37, fat: 2 },
  { name: '荞麦面', serving: '200g(熟)', calories: 210, protein: 8, carbs: 40, fat: 3 },
];

export const PROTEINS: FoodItem[] = [
  { name: '鸡胸肉', serving: '150g', calories: 200, protein: 38, carbs: 2, fat: 4 },
  { name: '三文鱼', serving: '150g', calories: 268, protein: 34, carbs: 0, fat: 14 },
  { name: '瘦牛肉', serving: '150g', calories: 235, protein: 38, carbs: 0, fat: 9 },
  { name: '虾仁', serving: '150g', calories: 135, protein: 28, carbs: 2, fat: 1 },
  { name: '豆腐', serving: '200g', calories: 152, protein: 16, carbs: 4, fat: 8 },
  { name: '猪里脊', serving: '120g', calories: 186, protein: 30, carbs: 1, fat: 7 },
  { name: '龙利鱼柳', serving: '150g', calories: 148, protein: 28, carbs: 0, fat: 4 },
  { name: '去皮鸡腿肉', serving: '150g', calories: 215, protein: 33, carbs: 0, fat: 9 },
  { name: '鸡蛋(炒)', serving: '2个(100g)', calories: 180, protein: 13, carbs: 2, fat: 13 },
  { name: '鳕鱼', serving: '150g', calories: 138, protein: 30, carbs: 0, fat: 2 },
];

export const VEGETABLES: FoodItem[] = [
  { name: '西兰花', serving: '200g', calories: 68, protein: 6, carbs: 10, fat: 0 },
  { name: '菠菜', serving: '200g', calories: 46, protein: 4, carbs: 4, fat: 0 },
  { name: '生菜沙拉', serving: '200g', calories: 30, protein: 2, carbs: 4, fat: 0 },
  { name: '番茄炒蛋', serving: '1份(200g)', calories: 165, protein: 9, carbs: 8, fat: 10 },
  { name: '清炒白菜', serving: '200g', calories: 72, protein: 3, carbs: 8, fat: 4 },
  { name: '凉拌黄瓜', serving: '200g', calories: 42, protein: 2, carbs: 6, fat: 1 },
  { name: '蒜蓉空心菜', serving: '200g', calories: 62, protein: 4, carbs: 7, fat: 3 },
  { name: '香菇青菜', serving: '200g', calories: 68, protein: 3, carbs: 10, fat: 2 },
  { name: '芹菜炒香干', serving: '180g', calories: 140, protein: 11, carbs: 8, fat: 7 },
  { name: '清蒸茄子', serving: '200g', calories: 48, protein: 2, carbs: 8, fat: 0 },
];

// --- Snacks 加餐 ---

export const SNACKS: FoodItem[] = [
  { name: '希腊酸奶', serving: '150g', calories: 145, protein: 15, carbs: 6, fat: 7 },
  { name: '混合坚果', serving: '20g', calories: 120, protein: 4, carbs: 4, fat: 10 },
  { name: '蛋白粉(乳清)', serving: '1勺(30g)', calories: 120, protein: 24, carbs: 3, fat: 1 },
  { name: '全麦饼干', serving: '3片(30g)', calories: 128, protein: 3, carbs: 20, fat: 4 },
  { name: '苹果', serving: '1个(200g)', calories: 104, protein: 0, carbs: 28, fat: 0 },
  { name: '香蕉', serving: '1根(120g)', calories: 112, protein: 2, carbs: 27, fat: 0 },
  { name: '水煮蛋', serving: '1个(50g)', calories: 72, protein: 7, carbs: 1, fat: 5 },
  { name: '毛豆', serving: '100g', calories: 131, protein: 13, carbs: 7, fat: 5 },
  { name: '蛋白棒', serving: '1根(60g)', calories: 210, protein: 20, carbs: 22, fat: 6 },
  { name: '脱脂牛奶', serving: '250ml', calories: 92, protein: 9, carbs: 13, fat: 0 },
];

// --- Condiments/Others ---

export const CONDIMENTS: FoodItem[] = [
  { name: '橄榄油', serving: '5ml', calories: 45, protein: 0, carbs: 0, fat: 5 },
  { name: '牛油果', serving: '半个(80g)', calories: 128, protein: 2, carbs: 5, fat: 12 },
  { name: '芝麻酱', serving: '10g', calories: 60, protein: 2, carbs: 2, fat: 5 },
  { name: '亚麻籽油', serving: '5ml', calories: 45, protein: 0, carbs: 0, fat: 5 },
];

// Helper: pick N random items from an array
export function pickRandom<T>(arr: T[], count: number): T[] {
  const shuffled = [...arr].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, arr.length));
}

// Sum nutrition for a list of foods
export function sumFoods(foods: FoodItem[]) {
  return {
    calories: foods.reduce((s, f) => s + f.calories, 0),
    protein: foods.reduce((s, f) => s + f.protein, 0),
    carbs: foods.reduce((s, f) => s + f.carbs, 0),
    fat: foods.reduce((s, f) => s + f.fat, 0),
  };
}
