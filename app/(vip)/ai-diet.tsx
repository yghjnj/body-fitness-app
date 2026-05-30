import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/config/theme';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { SegmentedControl } from '../../src/components/ui/SegmentedControl';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { useAuthStore } from '../../src/stores/authStore';
import { getLatestWeight } from '../../src/services/database/repositories/weightRepo';
import { generateDietPlan, type DietPlan } from '../../src/services/ai';

export default function AIDietScreen() {
  const settings = useSettingsStore();
  const { user } = useAuthStore();
  const [weightKg, setWeightKg] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<DietPlan | null>(null);

  useEffect(() => {
    // Try to load latest weight from database
    if (user?.id) {
      getLatestWeight(user.id).then((record) => {
        if (record) setWeightKg(String(record.weight));
      });
    }
  }, [user?.id]);

  const canGenerate = settings.gender && settings.age > 0 && settings.heightCm > 0;

  const handleGenerate = () => {
    const w = parseFloat(weightKg);
    if (!w || w <= 0) return;
    setLoading(true);
    // Small delay so the loading spinner renders smoothly
    setTimeout(() => {
      try {
        const plan = generateDietPlan({
          gender: settings.gender,
          age: settings.age,
          heightCm: settings.heightCm,
          weightKg: w,
          calorieTarget: settings.calorieTarget || undefined,
        });
        setResult(plan);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }, 300);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Params */}
      <Card>
        <Text style={styles.sectionTitle}>身体数据</Text>
        <View style={styles.paramsGrid}>
          <ParamItem label="性别" value={settings.gender === 'male' ? '男' : '女'} />
          <ParamItem label="年龄" value={`${settings.age}岁`} />
          <ParamItem label="身高" value={`${settings.heightCm}cm`} />
          <ParamItem label="热量目标" value={settings.calorieTarget ? `${settings.calorieTarget}kcal` : '自动计算'} />
        </View>
        <Input
          label="当前体重 (kg)"
          value={weightKg}
          onChangeText={setWeightKg}
          keyboardType="numeric"
          placeholder="输入体重，如 70"
          suffix="kg"
        />
      </Card>

      <Button
        title={loading ? '正在计算...' : '生成今日饮食建议'}
        onPress={handleGenerate}
        loading={loading}
        disabled={!canGenerate}
        size="lg"
        style={{ marginTop: Spacing.md }}
      />

      {result && (
        <View style={{ marginTop: Spacing.lg }}>
          {/* Goal badge */}
          <View style={styles.goalRow}>
            <View style={styles.goalBadge}>
              <Text style={styles.goalBadgeText}>{result.goalLabel}方案</Text>
            </View>
            <Text style={styles.bmiText}>BMI {result.bmi} · {result.bmiLabel}</Text>
          </View>

          {/* Macro summary */}
          <View style={styles.summaryRow}>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{result.totalCalories}</Text>
              <Text style={styles.summaryLabel}>总热量(kcal)</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{result.totalProtein}g</Text>
              <Text style={styles.summaryLabel}>蛋白质</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{result.totalCarbs}g</Text>
              <Text style={styles.summaryLabel}>碳水</Text>
            </View>
            <View style={styles.summaryItem}>
              <Text style={styles.summaryValue}>{result.totalFat}g</Text>
              <Text style={styles.summaryLabel}>脂肪</Text>
            </View>
          </View>

          {/* Meals */}
          {result.meals.map((meal, i) => (
            <Card key={i} style={{ marginBottom: Spacing.md }}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealTime}>{meal.time}</Text>
              </View>
              <View style={styles.mealItems}>
                {meal.items.map((item, j) => (
                  <Text key={j} style={styles.mealItem}>- {item}</Text>
                ))}
              </View>
              <View style={styles.mealNutrition}>
                <NutritionBadge label="热量" value={Math.round(meal.calories)} unit="kcal" color="#F59E0B" />
                <NutritionBadge label="蛋白质" value={Math.round(meal.protein)} unit="g" color="#EF4444" />
                <NutritionBadge label="碳水" value={Math.round(meal.carbs)} unit="g" color="#3B82F6" />
                <NutritionBadge label="脂肪" value={Math.round(meal.fat)} unit="g" color="#8B5CF6" />
              </View>
            </Card>
          ))}

          {/* Tips */}
          <Card>
            <Text style={styles.tipsTitle}>建议与说明</Text>
            {result.tips.map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <Ionicons name="bulb" size={18} color={Colors.warning} />
                <Text style={styles.tipText}>{tip}</Text>
              </View>
            ))}
          </Card>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function ParamItem({ label, value }: { label: string; value: string }) {
  return (
    <View style={piStyles.container}>
      <Text style={piStyles.label}>{label}</Text>
      <Text style={piStyles.value}>{value}</Text>
    </View>
  );
}

const piStyles = StyleSheet.create({
  container: { width: '48%' as any, marginBottom: Spacing.sm },
  label: { fontSize: FontSize.xs, color: Colors.textTertiary },
  value: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginTop: 2 },
});

function NutritionBadge({ label, value, unit, color }: { label: string; value: number; unit: string; color: string }) {
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
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md },
  paramsGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  goalBadge: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  goalBadgeText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },
  bmiText: { fontSize: FontSize.sm, color: Colors.textSecondary },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    backgroundColor: Colors.surface,
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
  },
  summaryItem: { alignItems: 'center' },
  summaryValue: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary },
  summaryLabel: { fontSize: 10, color: Colors.textTertiary, marginTop: 2 },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.sm,
  },
  mealName: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  mealTime: { fontSize: FontSize.sm, color: Colors.textSecondary },
  mealItems: { marginBottom: Spacing.md },
  mealItem: { fontSize: FontSize.md, color: Colors.text, lineHeight: 26 },
  mealNutrition: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  tipsTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md },
  tipRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm, alignItems: 'flex-start' },
  tipText: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
});
