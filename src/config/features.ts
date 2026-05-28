// Free tier limits — generous enough to be useful, restrictive enough to upgrade
export const FREE_LIMITS = {
  weightHistoryDays: 7,        // Only see last 7 days of weight
  mealRecordsPerDay: 3,        // Max 3 meal entries per day
  workoutRecordsPerWeek: 3,    // Max 3 workouts per week
  progressPhotos: 3,           // Max 3 photos total
  aiQueriesPerMonth: 1,        // 1 free AI suggestion per month
  waterHistoryHours: 24,       // Only see last 24h of water
  dataExport: false,           // No export
  ads: true,                   // Ads shown
  advancedCalculators: false,  // BMI only (body fat, ideal weight, WHR locked)
  macroCalculator: false,      // TDEE only (macro split locked)
} as const;

export const FEATURE_REQUIREMENTS = {
  // Basic: always free
  bmi_calculator: 'free' as const,
  bmr_calculator: 'free' as const,
  tdee_calculator: 'free' as const,
  weight_tracking: 'free' as const,
  water_tracking: 'free' as const,
  meal_tracking: 'free' as const,
  workout_tracking: 'free' as const,
  goal_setting: 'free' as const,
  progress_photos: 'free' as const,

  // Premium: VIP only
  body_fat_calculator: 'vip' as const,
  ideal_weight_calculator: 'vip' as const,
  whr_calculator: 'vip' as const,
  macro_calculator: 'vip' as const,
  unlimited_photos: 'vip' as const,
  full_history: 'vip' as const,
  advanced_analytics: 'vip' as const,
  data_export: 'vip' as const,
  ai_diet: 'vip' as const,
  ai_training: 'vip' as const,
  ai_meal_plan: 'vip' as const,
  health_knowledge: 'vip' as const,
  community_post: 'vip' as const,
  community_interact: 'vip' as const,
  leaderboard_rank: 'vip' as const,
  health_connect: 'vip' as const,
  no_ads: 'vip' as const,
} as const;

export type FeatureKey = keyof typeof FEATURE_REQUIREMENTS;
