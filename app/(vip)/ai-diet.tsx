import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/config/theme';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { useSettingsStore } from '../../src/stores/settingsStore';

export default function AIDietScreen() {
  const settings = useSettingsStore();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any>(null);

  const generateDiet = () => {
    setLoading(true);
    // Simulate AI response - will be replaced with Cloud Functions call
    setTimeout(() => {
      setResult({
        meals: [
          { name: '早餐', time: '07:30', items: ['全麦面包 2片', '鸡蛋 2个', '牛奶 250ml', '苹果 1个'], calories: 450, protein: 28, carbs: 52, fat: 16 },
          { name: '午餐', time: '12:00', items: ['糙米饭 150g', '鸡胸肉 150g', '西兰花 200g', '橄榄油 5ml'], calories: 550, protein: 42, carbs: 58, fat: 18 },
          { name: '加餐', time: '15:30', items: ['希腊酸奶 150g', '坚果 20g'], calories: 200, protein: 14, carbs: 10, fat: 12 },
          { name: '晚餐', time: '18:30', items: ['三文鱼 150g', '红薯 200g', '菠菜沙拉', '牛油果 半个'], calories: 520, protein: 35, carbs: 48, fat: 22 },
        ],
        tips: ['每餐保证蛋白质摄入', '训练前1小时补充碳水', '每天饮水不少于2L', '晚餐尽量在睡前3小时完成'],
        totalCalories: 1720,
        totalProtein: 119,
        totalCarbs: 168,
        totalFat: 68,
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Params Summary */}
      <Card>
        <Text style={styles.sectionTitle}>当前数据</Text>
        <View style={styles.paramsGrid}>
          <ParamItem label="性别" value={settings.gender === 'male' ? '男' : '女'} />
          <ParamItem label="年龄" value={`${settings.age}岁`} />
          <ParamItem label="身高" value={`${settings.heightCm}cm`} />
          <ParamItem label="热量目标" value={`${settings.calorieTarget}kcal`} />
        </View>
      </Card>

      <Button
        title={loading ? 'AI 正在生成...' : '生成饮食建议'}
        onPress={generateDiet}
        loading={loading}
        size="lg"
        style={{ marginTop: Spacing.md }}
      />

      {result && (
        <View style={{ marginTop: Spacing.lg }}>
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

          {result.meals.map((meal: any, i: number) => (
            <Card key={i} style={{ marginBottom: Spacing.md }}>
              <View style={styles.mealHeader}>
                <Text style={styles.mealName}>{meal.name}</Text>
                <Text style={styles.mealTime}>{meal.time}</Text>
              </View>
              <View style={styles.mealItems}>
                {meal.items.map((item: string, j: number) => (
                  <Text key={j} style={styles.mealItem}>• {item}</Text>
                ))}
              </View>
              <View style={styles.mealNutrition}>
                <NutritionBadge label="热量" value={meal.calories} unit="kcal" color="#F59E0B" />
                <NutritionBadge label="蛋白质" value={meal.protein} unit="g" color="#EF4444" />
                <NutritionBadge label="碳水" value={meal.carbs} unit="g" color="#3B82F6" />
                <NutritionBadge label="脂肪" value={meal.fat} unit="g" color="#8B5CF6" />
              </View>
            </Card>
          ))}

          <Card>
            <Text style={styles.tipsTitle}>健康小贴士</Text>
            {result.tips.map((tip: string, i: number) => (
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
