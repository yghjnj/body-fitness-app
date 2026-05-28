import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/config/theme';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { MacroCard } from '../../src/components/calculators/MacroCard';
import { SegmentedControl } from '../../src/components/ui/SegmentedControl';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { calculateBMR, calculateTDEE } from '../../src/utils/calculations';
import { getMealsByDate, getNutritionTotals } from '../../src/services/database/repositories/mealRepo';
import { getTodayStr } from '../../src/utils/formatting';
import type { MealRecord } from '../../src/types/models';
import { getPersonalizedTips } from '../../src/utils/healthTips';
import type { HealthTip } from '../../src/utils/healthTips';
import type { ActivityLevel, GoalType } from '../../src/types/models';

export default function NutritionScreen() {
  const router = useRouter();
  const settings = useSettingsStore();
  const [activityLevel, setActivityLevel] = useState<ActivityLevel>('moderate');
  const [goalType, setGoalType] = useState<GoalType>('maintenance');
  const [meals, setMeals] = useState<MealRecord[]>([]);
  const [totals, setTotals] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [healthTips, setHealthTips] = useState<HealthTip[]>([]);

  const loadMeals = useCallback(async () => {
    const today = getTodayStr();
    const [mealData, nutritionTotals] = await Promise.all([
      getMealsByDate('local-user', today),
      getNutritionTotals('local-user', today),
    ]);
    setMeals(mealData);
    setTotals(nutritionTotals);
  }, []);

  useEffect(() => {
    loadMeals();
    const interval = setInterval(loadMeals, 3000);
    return () => clearInterval(interval);
  }, [loadMeals]);

  const [currentWeight, setCurrentWeight] = useState(70);

  useEffect(() => {
    const { getLatestWeight } = require('../../src/services/database/repositories/weightRepo');
    getLatestWeight('local-user').then((w: any) => { if (w) setCurrentWeight(w.weight); });
  }, []);

  // Generate personalized health tips based on user data
  useEffect(() => {
    const bmi = currentWeight && settings.heightCm
      ? Math.round((currentWeight / Math.pow(settings.heightCm / 100, 2)) * 10) / 10
      : undefined;
    const tips = getPersonalizedTips({
      gender: settings.gender,
      age: settings.age,
      heightCm: settings.heightCm,
      bmi,
      calorieTarget: settings.calorieTarget,
    });
    setHealthTips(tips);
  }, [settings.gender, settings.age, settings.heightCm, currentWeight, settings.calorieTarget]);

  const bmrResult = calculateBMR(currentWeight, settings.heightCm, settings.age, settings.gender);
  const tdeeResult = calculateTDEE(bmrResult.average, activityLevel);
  let targetCalories = tdeeResult.tdee;
  if (goalType === 'weight_loss') targetCalories = tdeeResult.weightLoss;
  if (goalType === 'muscle_gain') targetCalories = tdeeResult.weightGain;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* TDEE Calculator */}
      <Text style={styles.sectionTitle}>每日热量需求</Text>
      <Card>
        <Text style={styles.label}>活动水平</Text>
        <View style={styles.levelRow}>
          {([
            { v: 'sedentary', l: '久坐' },
            { v: 'light', l: '轻度' },
            { v: 'moderate', l: '中度' },
            { v: 'very_active', l: '高度' },
            { v: 'extreme', l: '极高' },
          ] as { v: ActivityLevel; l: string }[]).map((level) => (
            <TouchableOpacity
              key={level.v}
              style={[styles.levelBtn, activityLevel === level.v && styles.levelBtnActive]}
              onPress={() => setActivityLevel(level.v)}
            >
              <Text style={[styles.levelText, activityLevel === level.v && styles.levelTextActive]}>
                {level.l}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.resultGrid}>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>TDEE</Text>
            <Text style={styles.resultValue}>{tdeeResult.tdee}</Text>
            <Text style={styles.resultUnit}>kcal/天</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>BMR</Text>
            <Text style={styles.resultValue}>{tdeeResult.bmr}</Text>
            <Text style={styles.resultUnit}>kcal/天</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>减脂</Text>
            <Text style={[styles.resultValue, { color: Colors.danger }]}>{tdeeResult.weightLoss}</Text>
            <Text style={styles.resultUnit}>kcal/天</Text>
          </View>
          <View style={styles.resultItem}>
            <Text style={styles.resultLabel}>增肌</Text>
            <Text style={[styles.resultValue, { color: Colors.success }]}>{tdeeResult.weightGain}</Text>
            <Text style={styles.resultUnit}>kcal/天</Text>
          </View>
        </View>
      </Card>

      {/* Goal Selection */}
      <Text style={styles.sectionTitle}>目标设置</Text>
      <SegmentedControl
        options={[
          { label: '减脂', value: 'weight_loss' },
          { label: '增肌', value: 'muscle_gain' },
          { label: '维持', value: 'maintenance' },
        ]}
        value={goalType}
        onChange={(v) => setGoalType(v as GoalType)}
      />

      {/* Macro Result */}
      <View style={{ marginTop: Spacing.md }}>
        <MacroCard calories={targetCalories} goalType={goalType} />
      </View>

      {/* Today's Meals */}
      <Text style={styles.sectionTitle}>今日饮食</Text>
      {totals.calories > 0 && (
        <Card style={{ marginBottom: Spacing.md }}>
          <View style={styles.mealTotals}>
            <MealTotal label="热量" value={totals.calories} unit="kcal" color="#F59E0B" />
            <MealTotal label="蛋白质" value={totals.protein} unit="g" color="#EF4444" />
            <MealTotal label="碳水" value={totals.carbs} unit="g" color="#3B82F6" />
            <MealTotal label="脂肪" value={totals.fat} unit="g" color="#8B5CF6" />
          </View>
        </Card>
      )}
      {meals.length > 0 ? (
        meals.map((meal) => (
          <Card key={meal.id} style={{ marginBottom: Spacing.sm }}>
            <View style={styles.mealRow}>
              <View style={styles.mealIcon}>
                <Ionicons name="restaurant" size={20} color={Colors.primary} />
              </View>
              <View style={styles.mealInfo}>
                <Text style={styles.mealName}>{meal.foodName}</Text>
                <Text style={styles.mealMeta}>{MEAL_LABELS[meal.mealType] || meal.mealType} · {meal.servingSizeG}g</Text>
              </View>
              <Text style={styles.mealCal}>{Math.round(meal.calories)} kcal</Text>
            </View>
          </Card>
        ))
      ) : (
        <EmptyState
          icon="restaurant"
          title="暂无饮食记录"
          description="记录您的一日三餐，追踪营养摄入"
          actionLabel="添加餐食"
          onAction={() => router.push('/(modals)/add-meal')}
        />
      )}
      {meals.length > 0 && (
        <Button title="+ 添加餐食" onPress={() => router.push('/(modals)/add-meal')} variant="outline" style={{ marginTop: Spacing.sm }} />
      )}

      {/* Personalized Health Tips */}
      <Text style={styles.sectionTitle}>为你推荐</Text>
      <Text style={styles.sectionSubtitle}>根据你的身体数据，智能推荐健康知识</Text>
      {healthTips.map((tip, i) => (
        <Card key={i} style={{ marginBottom: Spacing.sm }}>
          <View style={styles.tipHeader}>
            <View style={[styles.tipIconBox, { backgroundColor: getTipColor(tip.category) + '18' }]}>
              <Ionicons name={tip.icon as any} size={20} color={getTipColor(tip.category)} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.tipTitle}>{tip.title}</Text>
              <View style={styles.tipBadge}>
                <Text style={styles.tipBadgeText}>{getTipLabel(tip.category)}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.tipContent}>{tip.content}</Text>
        </Card>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const MEAL_LABELS: Record<string, string> = { breakfast: '早餐', lunch: '午餐', dinner: '晚餐', snack: '加餐' };

function getTipColor(category: string): string {
  switch (category) { case 'nutrition': return '#F59E0B'; case 'exercise': return '#10B981'; case 'lifestyle': return '#8B5CF6'; case 'science': return '#3B82F6'; default: return Colors.textSecondary; }
}

function getTipLabel(category: string): string {
  switch (category) { case 'nutrition': return '饮食营养'; case 'exercise': return '运动健身'; case 'lifestyle': return '生活习惯'; case 'science': return '科学知识'; default: return ''; }
}

function MealTotal({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: FontSize.sm, fontWeight: '700', color }}>{value}{unit}</Text>
      <Text style={{ fontSize: 10, color: Colors.textTertiary }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.md,
    marginTop: Spacing.md,
  },
  label: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  levelRow: {
    flexDirection: 'row',
    gap: 4,
    marginBottom: Spacing.md,
  },
  levelBtn: {
    flex: 1,
    paddingVertical: 6,
    borderRadius: BorderRadius.sm,
    backgroundColor: Colors.surfaceVariant,
    alignItems: 'center',
  },
  mealTotals: { flexDirection: 'row', justifyContent: 'space-around' },
  mealRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  mealIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  mealInfo: { flex: 1 },
  mealName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  mealMeta: { fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: 2 },
  mealCal: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary },
  levelBtnActive: { backgroundColor: Colors.primary },
  levelText: { fontSize: 11, fontWeight: '600', color: Colors.textTertiary },
  levelTextActive: { color: '#fff' },
  resultGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  resultItem: {
    width: '25%' as any,
    alignItems: 'center',
  },
  resultLabel: { fontSize: FontSize.xs, color: Colors.textTertiary, marginBottom: 2 },
  resultValue: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary },
  resultUnit: { fontSize: 10, color: Colors.textTertiary },
  sectionSubtitle: { fontSize: FontSize.sm, color: Colors.textTertiary, marginBottom: Spacing.md },
  tipHeader: { flexDirection: 'row', alignItems: 'flex-start', gap: Spacing.md, marginBottom: Spacing.sm },
  tipIconBox: { width: 40, height: 40, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  tipTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  tipBadge: { alignSelf: 'flex-start', paddingHorizontal: 8, paddingVertical: 1, borderRadius: BorderRadius.full, backgroundColor: Colors.surfaceVariant },
  tipBadgeText: { fontSize: 10, color: Colors.textTertiary, fontWeight: '600' },
  tipContent: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 22 },
});
