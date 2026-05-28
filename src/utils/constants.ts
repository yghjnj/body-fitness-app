export const GENDER_OPTIONS = [
  { label: '男', value: 'male' as const },
  { label: '女', value: 'female' as const },
];

export const ACTIVITY_LEVEL_OPTIONS = [
  { label: '久坐不动（几乎不运动）', value: 'sedentary' as const },
  { label: '轻度运动（每周1-3天）', value: 'light' as const },
  { label: '中度运动（每周3-5天）', value: 'moderate' as const },
  { label: '高强度运动（每周6-7天）', value: 'very_active' as const },
  { label: '极高强度（每天高强度/体力劳动）', value: 'extreme' as const },
];

export const GOAL_TYPE_OPTIONS = [
  { label: '减脂', value: 'weight_loss' as const },
  { label: '增肌', value: 'muscle_gain' as const },
  { label: '维持', value: 'maintenance' as const },
  { label: '自定义', value: 'custom' as const },
];

export const MEAL_TYPE_OPTIONS = [
  { label: '早餐', value: 'breakfast' as const },
  { label: '午餐', value: 'lunch' as const },
  { label: '晚餐', value: 'dinner' as const },
  { label: '加餐', value: 'snack' as const },
];

export const PHOTO_CATEGORY_OPTIONS = [
  { label: '正面', value: 'front' as const },
  { label: '背面', value: 'back' as const },
  { label: '侧面', value: 'side' as const },
  { label: '展示', value: 'flexed' as const },
];

export const EXERCISE_MUSCLE_GROUPS = [
  '胸部', '背部', '腿部', '肩部', '手臂', '核心', '全身', '有氧',
];

export const EXERCISE_CATEGORIES = [
  { label: '力量', value: 'strength' as const },
  { label: '有氧', value: 'cardio' as const },
  { label: '柔韧性', value: 'flexibility' as const },
  { label: '爆发力', value: 'plyometric' as const },
];

export const DEFAULT_WATER_GOAL_ML = 2000;
