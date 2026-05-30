import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  RefreshControl,
  TouchableOpacity,
} from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/config/theme';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { BMICard } from '../../src/components/calculators/BMICard';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { useSubscriptionStore } from '../../src/stores/subscriptionStore';
import { calculateBMI } from '../../src/utils/calculations';
import { getTodayStr } from '../../src/utils/formatting';
import { getWaterTotalForDate } from '../../src/services/database/repositories/waterRepo';
import { getNutritionTotals } from '../../src/services/database/repositories/mealRepo';
import { getWorkoutsByDate } from '../../src/services/database/repositories/workoutRepo';
import { getLatestWeight } from '../../src/services/database/repositories/weightRepo';
import { VIPBanner, FeatureGate } from '../../src/components/subscription/FeatureGate';

export default function DashboardScreen() {
  const router = useRouter();
  const settings = useSettingsStore();
  const { isVIP } = useSubscriptionStore();

  const [refreshing, setRefreshing] = useState(false);
  const [waterToday, setWaterToday] = useState(0);
  const [nutritionToday, setNutritionToday] = useState({ calories: 0, protein: 0, carbs: 0, fat: 0 });
  const [workoutToday, setWorkoutToday] = useState(0);

  // Read directly from settingsStore — single source of truth across ALL screens
  const weightKg = settings.weightKg;
  const heightCm = settings.heightCm;
  const age = settings.age;
  const gender = settings.gender;

  const bmiResult = weightKg && heightCm ? calculateBMI(weightKg, heightCm) : null;

  const loadData = useCallback(async () => {
    const today = getTodayStr();
    const [water, nutrition, workouts, latestWeight] = await Promise.all([
      getWaterTotalForDate('local-user', today),
      getNutritionTotals('local-user', today),
      getWorkoutsByDate('local-user', today),
      getLatestWeight('local-user'),
    ]);
    setWaterToday(water);
    setNutritionToday(nutrition);
    setWorkoutToday(workouts.length);
    if (latestWeight && latestWeight.weight !== settings.weightKg) {
      settings.updateSettings({ weightKg: latestWeight.weight });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadData();
    }, [loadData])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await loadData();
    setRefreshing(false);
  }, [loadData]);

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      {/* Body Data Card — reads & writes to settingsStore as single source of truth */}
      <Card style={styles.quickCard}>
        <Text style={styles.greeting}>身体数据</Text>
        <Text style={styles.subtitle}>修改后所有页面同步更新</Text>
        <View style={styles.inputGrid}>
          <View style={styles.inputHalf}>
            <Text style={styles.inputLabel}>体重 (kg)</Text>
            <TextInput
              style={styles.dataInput}
              value={String(weightKg)}
              onChangeText={(v) => settings.updateSettings({ weightKg: parseFloat(v) || 70 })}
              keyboardType="decimal-pad"
              placeholder="70"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
          <View style={styles.inputHalf}>
            <Text style={styles.inputLabel}>身高 (cm)</Text>
            <TextInput
              style={styles.dataInput}
              value={String(heightCm)}
              onChangeText={(v) => settings.updateSettings({ heightCm: parseFloat(v) || 170 })}
              keyboardType="decimal-pad"
              placeholder="170"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
          <View style={styles.inputHalf}>
            <Text style={styles.inputLabel}>年龄</Text>
            <TextInput
              style={styles.dataInput}
              value={String(age)}
              onChangeText={(v) => settings.updateSettings({ age: parseInt(v) || 25 })}
              keyboardType="number-pad"
              placeholder="25"
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
          <View style={styles.inputHalf}>
            <Text style={styles.inputLabel}>性别</Text>
            <View style={styles.genderRow}>
              <TouchableOpacity
                style={[styles.genderBtn, gender === 'male' && styles.genderBtnActive]}
                onPress={() => settings.updateSettings({ gender: 'male' })}
              >
                <Text style={[styles.genderBtnText, gender === 'male' && styles.genderBtnTextActive]}>男</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderBtn, gender === 'female' && styles.genderBtnActive]}
                onPress={() => settings.updateSettings({ gender: 'female' })}
              >
                <Text style={[styles.genderBtnText, gender === 'female' && styles.genderBtnTextActive]}>女</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        {bmiResult && (
          <View style={styles.bmiPreview}>
            <Text style={styles.bmiPreviewLabel}>BMI</Text>
            <Text style={[styles.bmiPreviewValue, { color: bmiResult.categoryColor }]}>{bmiResult.bmi}</Text>
            <View style={[styles.bmiPreviewBadge, { backgroundColor: bmiResult.categoryColor }]}>
              <Text style={styles.bmiPreviewBadgeText}>{bmiResult.categoryLabel}</Text>
            </View>
          </View>
        )}
      </Card>

      {/* BMI Result */}
      {bmiResult && <BMICard weightKg={weightKg} heightCm={heightCm} />}

      {/* VIP Banner */}
      <VIPBanner />

      {/* Quick Actions */}
      <Text style={styles.sectionTitle}>快捷功能</Text>
      <View style={styles.actionGrid}>
        <ActionCard icon="water" title="饮水记录" subtitle="记录每日饮水" color="#3B82F6" onPress={() => router.push('/(modals)/add-water')} />
        <ActionCard icon="restaurant" title="饮食记录" subtitle="记录餐食营养" color="#F59E0B" onPress={() => router.push('/(modals)/add-meal')} />
        <ActionCard icon="barbell" title="锻炼记录" subtitle="记录训练内容" color="#10B981" onPress={() => router.push('/(modals)/add-workout')} />
        <ActionCard icon="camera" title="进度照片" subtitle="记录身材变化" color="#8B5CF6" onPress={() => router.push('/(modals)/progress-photo')} />
        <ActionCard icon="calculator" title="BMR/TDEE" subtitle="热量需求计算" color={Colors.secondary} onPress={() => router.push('/nutrition')} />
        <ActionCard icon="bulb" title="AI 饮食建议" subtitle={isVIP ? '智能饮食推荐' : 'VIP 专属'} color={Colors.vipGold} onPress={() => isVIP ? router.push('/(vip)/ai-diet') : router.push('/(modals)/paywall')} locked={!isVIP} />
        <ActionCard icon="analytics" title="高级分析" subtitle={isVIP ? '趋势+预测' : 'VIP 专属'} color={Colors.vipGold} onPress={() => isVIP ? router.push('/(vip)/advanced-analytics') : router.push('/(modals)/paywall')} locked={!isVIP} />
      </View>

      {/* Today Summary */}
      <Text style={styles.sectionTitle}>今日概览</Text>
      <Card>
        <View style={styles.todayGrid}>
          <TodayStat label="已饮水" value={String(waterToday)} unit="ml" total={settings.waterGoalMl} color="#3B82F6" />
          <TodayStat label="摄入热量" value={String(nutritionToday.calories)} unit="kcal" total={settings.calorieTarget} color="#F59E0B" />
          <TodayStat label="蛋白质" value={String(nutritionToday.protein)} unit="g" total={settings.proteinTarget} color="#EF4444" />
          <TodayStat label="锻炼" value={String(workoutToday)} unit="次" total={Math.max(workoutToday, 3)} color="#10B981" />
        </View>
      </Card>

      {!isVIP && (
        <View style={styles.adPlaceholder}>
          <Ionicons name="megaphone" size={20} color={Colors.textTertiary} />
          <Text style={styles.adText}>广告位 - 升级 VIP 去广告</Text>
        </View>
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function ActionCard({ icon, title, subtitle, color, onPress, locked }: {
  icon: keyof typeof Ionicons.glyphMap; title: string; subtitle: string; color: string;
  onPress: () => void; locked?: boolean;
}) {
  return (
    <Card style={actionStyles.card} padded={false}>
      <Button title="" onPress={onPress} variant="ghost" style={actionStyles.button} />
      <View style={actionStyles.content}>
        <View style={[actionStyles.iconBox, { backgroundColor: color + '18' }]}>
          <Ionicons name={icon} size={24} color={color} />
        </View>
        <Text style={actionStyles.title} numberOfLines={1}>{title}</Text>
        <Text style={actionStyles.subtitle} numberOfLines={1}>{subtitle}</Text>
        {locked && (
          <View style={actionStyles.lockBadge}>
            <Ionicons name="lock-closed" size={10} color={Colors.vipGold} />
            <Text style={actionStyles.lockText}>VIP</Text>
          </View>
        )}
      </View>
    </Card>
  );
}

const actionStyles = StyleSheet.create({
  card: { width: '30%' as any, marginBottom: Spacing.md, position: 'relative', overflow: 'hidden' },
  button: { position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, zIndex: 1, backgroundColor: 'transparent' },
  content: { padding: Spacing.sm, alignItems: 'center', gap: 4 },
  iconBox: { width: 44, height: 44, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center', marginBottom: 4 },
  title: { fontSize: 12, fontWeight: '700', color: Colors.text, textAlign: 'center' },
  subtitle: { fontSize: 10, color: Colors.textTertiary, textAlign: 'center' },
  lockBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.vipGold + '20', paddingHorizontal: 6, paddingVertical: 1, borderRadius: BorderRadius.full, gap: 2 },
  lockText: { fontSize: 9, fontWeight: '700', color: Colors.vipGold },
});

function TodayStat({ label, value, unit, total, color }: {
  label: string; value: string; unit: string; total: number; color: string;
}) {
  const pct = total > 0 ? Math.min(100, (parseInt(value || '0') / total) * 100) : 0;
  return (
    <View style={todayStyles.container}>
      <Text style={todayStyles.label}>{label}</Text>
      <View style={todayStyles.valueRow}>
        <Text style={[todayStyles.value, { color }]}>{value}</Text>
        <Text style={todayStyles.unit}>/{total}{unit}</Text>
      </View>
      <View style={todayStyles.progressBg}>
        <View style={[todayStyles.progress, { backgroundColor: color, width: `${pct}%` }]} />
      </View>
    </View>
  );
}

const todayStyles = StyleSheet.create({
  container: { width: '48%' as any, marginBottom: Spacing.md },
  label: { fontSize: FontSize.xs, color: Colors.textTertiary, marginBottom: 2 },
  valueRow: { flexDirection: 'row', alignItems: 'baseline', gap: 2, marginBottom: 4 },
  value: { fontSize: FontSize.xl, fontWeight: '800' },
  unit: { fontSize: FontSize.xs, color: Colors.textTertiary },
  progressBg: { height: 4, backgroundColor: Colors.surfaceVariant, borderRadius: BorderRadius.full, overflow: 'hidden' },
  progress: { height: '100%', borderRadius: BorderRadius.full },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  quickCard: { marginBottom: Spacing.md },
  greeting: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  subtitle: { fontSize: FontSize.xs, color: Colors.textTertiary, marginBottom: Spacing.md },
  inputGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  inputHalf: { width: '48%' as any, marginBottom: Spacing.sm },
  inputLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text, marginBottom: Spacing.xs },
  dataInput: { backgroundColor: Colors.surfaceVariant, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: 10, fontSize: FontSize.md, fontWeight: '700', color: Colors.primary },
  genderRow: { flexDirection: 'row', gap: Spacing.sm },
  genderBtn: { flex: 1, paddingVertical: 10, borderRadius: BorderRadius.md, backgroundColor: Colors.surfaceVariant, alignItems: 'center' },
  genderBtnActive: { backgroundColor: Colors.primary },
  genderBtnText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textTertiary },
  genderBtnTextActive: { color: '#fff' },
  bmiPreview: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, backgroundColor: Colors.surfaceVariant, borderRadius: BorderRadius.md, padding: Spacing.md, marginTop: Spacing.sm },
  bmiPreviewLabel: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  bmiPreviewValue: { fontSize: FontSize.xxl, fontWeight: '800' },
  bmiPreviewBadge: { paddingHorizontal: Spacing.md, paddingVertical: 4, borderRadius: BorderRadius.full, marginLeft: 'auto' as any },
  bmiPreviewBadgeText: { color: '#fff', fontWeight: '700', fontSize: FontSize.sm },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md, marginTop: Spacing.md },
  actionGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: '3.33%' as any },
  todayGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  adPlaceholder: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, backgroundColor: Colors.adBackground, borderRadius: BorderRadius.md, padding: Spacing.md, marginTop: Spacing.md },
  adText: { fontSize: FontSize.sm, color: Colors.textTertiary },
});
