import React, { useState, useEffect } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/config/theme';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { useAuthStore } from '../../src/stores/authStore';
import { getLatestWeight } from '../../src/services/database/repositories/weightRepo';
import { generateWeeklyMealPlan, type WeeklyMealPlan } from '../../src/services/ai';

export default function AIMealPlanScreen() {
  const settings = useSettingsStore();
  const { user } = useAuthStore();
  const [weightKg, setWeightKg] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<WeeklyMealPlan | null>(null);
  const [expandedDay, setExpandedDay] = useState<number | null>(null);

  useEffect(() => {
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
    setTimeout(() => {
      try {
        const plan = generateWeeklyMealPlan({
          gender: settings.gender,
          age: settings.age,
          heightCm: settings.heightCm,
          weightKg: w,
          calorieTarget: settings.calorieTarget || undefined,
        });
        setResult(plan);
        setExpandedDay(null);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }, 300);
  };

  const toggleDay = (i: number) => {
    setExpandedDay(expandedDay === i ? null : i);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.sectionTitle}>身体数据</Text>
        <View style={styles.paramsRow}>
          <ParamChip label="性别" value={settings.gender === 'male' ? '男' : '女'} />
          <ParamChip label="年龄" value={`${settings.age}岁`} />
          <ParamChip label="身高" value={`${settings.heightCm}cm`} />
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
        title={loading ? '正在生成一周方案...' : '生成一周饮食方案'}
        onPress={handleGenerate}
        loading={loading}
        disabled={!canGenerate}
        size="lg"
        style={{ marginTop: Spacing.md }}
      />

      {result && (
        <View style={{ marginTop: Spacing.lg }}>
          {/* Overview */}
          <Card>
            <View style={styles.overviewBadge}>
              <Text style={styles.overviewBadgeText}>{result.goalLabel}</Text>
            </View>
            <Text style={styles.overviewText}>{result.overview}</Text>
            <View style={styles.weeklyMacros}>
              <MiniMacro label="周总热量" value={`${result.weeklyCalories}`} unit="kcal" />
              <MiniMacro label="日均蛋白质" value={`${Math.round(result.weeklyProtein / 7)}`} unit="g" />
              <MiniMacro label="日均碳水" value={`${Math.round(result.weeklyCarbs / 7)}`} unit="g" />
              <MiniMacro label="日均脂肪" value={`${Math.round(result.weeklyFat / 7)}`} unit="g" />
            </View>
          </Card>

          {/* Day-by-day */}
          {result.days.map((day, i) => (
            <Card key={i} style={{ marginTop: Spacing.sm }}>
              <TouchableOpacity
                style={styles.dayHeader}
                onPress={() => toggleDay(i)}
                activeOpacity={0.6}
              >
                <View style={styles.dayLeft}>
                  <Text style={styles.dayLabel}>{day.dayLabel}</Text>
                  <Text style={styles.dayCal}>{day.dailyCalories} kcal</Text>
                </View>
                <View style={styles.dayMacros}>
                  <Text style={styles.dayMacroText}>P{day.dailyProtein}g C{day.dailyCarbs}g F{day.dailyFat}g</Text>
                </View>
                <Ionicons
                  name={expandedDay === i ? 'chevron-up' : 'chevron-down'}
                  size={20}
                  color={Colors.textTertiary}
                />
              </TouchableOpacity>

              {expandedDay === i && (
                <View style={styles.dayMeals}>
                  {day.meals.map((meal, j) => (
                    <View key={j} style={styles.expandedMeal}>
                      <View style={styles.expandedMealHeader}>
                        <Text style={styles.expandedMealName}>{meal.name}</Text>
                        <Text style={styles.expandedMealTime}>{meal.time}</Text>
                      </View>
                      {meal.items.map((item, k) => (
                        <Text key={k} style={styles.expandedMealItem}>- {item}</Text>
                      ))}
                      <Text style={styles.expandedMealMacro}>
                        {Math.round(meal.calories)}kcal · P{Math.round(meal.protein)}g · C{Math.round(meal.carbs)}g · F{Math.round(meal.fat)}g
                      </Text>
                    </View>
                  ))}
                </View>
              )}
            </Card>
          ))}

          {/* Tips */}
          <Card style={{ marginTop: Spacing.md }}>
            <Text style={styles.tipsTitle}>执行建议</Text>
            {result.tips.map((tip, i) => (
              <View key={i} style={styles.tipRow}>
                <Ionicons name="checkmark-circle" size={18} color={Colors.success} />
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

function ParamChip({ label, value }: { label: string; value: string }) {
  return (
    <View style={chipStyles.container}>
      <Text style={chipStyles.label}>{label}</Text>
      <Text style={chipStyles.value}>{value}</Text>
    </View>
  );
}

const chipStyles = StyleSheet.create({
  container: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.md,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.sm,
    alignItems: 'center',
    flex: 1,
  },
  label: { fontSize: 10, color: Colors.textTertiary },
  value: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text, marginTop: 2 },
});

function MiniMacro({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <View style={{ alignItems: 'center' }}>
      <Text style={{ fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary }}>{value}<Text style={{ fontSize: 10, color: Colors.textTertiary }}> {unit}</Text></Text>
      <Text style={{ fontSize: 10, color: Colors.textTertiary }}>{label}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md },
  paramsRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  overviewBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.vipGold + '20',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
    marginBottom: Spacing.sm,
  },
  overviewBadgeText: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.vipGold },
  overviewText: { fontSize: FontSize.md, color: Colors.textSecondary, marginBottom: Spacing.md },
  weeklyMacros: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dayLeft: { flexDirection: 'column' },
  dayLabel: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  dayCal: { fontSize: FontSize.sm, color: Colors.primary, fontWeight: '600', marginTop: 2 },
  dayMacros: { flex: 1, marginLeft: Spacing.md },
  dayMacroText: { fontSize: FontSize.xs, color: Colors.textTertiary },
  dayMeals: {
    marginTop: Spacing.md,
    paddingTop: Spacing.md,
    borderTopWidth: 1,
    borderTopColor: Colors.divider,
    gap: Spacing.md,
  },
  expandedMeal: {
    backgroundColor: Colors.background,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  expandedMealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.xs,
  },
  expandedMealName: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.primary },
  expandedMealTime: { fontSize: FontSize.xs, color: Colors.textTertiary },
  expandedMealItem: { fontSize: FontSize.sm, color: Colors.text, lineHeight: 22 },
  expandedMealMacro: { fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: Spacing.xs },
  tipsTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md },
  tipRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm, alignItems: 'flex-start' },
  tipText: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
});
