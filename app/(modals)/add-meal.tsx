import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/config/theme';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { SegmentedControl } from '../../src/components/ui/SegmentedControl';
import { Input } from '../../src/components/ui/Input';
import { addMeal } from '../../src/services/database/repositories/mealRepo';
import { getTodayStr } from '../../src/utils/formatting';
import type { MealRecord } from '../../src/types/models';

export default function AddMealScreen() {
  const router = useRouter();
  const [mealType, setMealType] = useState<MealRecord['mealType']>('breakfast');
  const [foodName, setFoodName] = useState('');
  const [calories, setCalories] = useState('');
  const [protein, setProtein] = useState('');
  const [carbs, setCarbs] = useState('');
  const [fat, setFat] = useState('');
  const [serving, setServing] = useState('100');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!foodName.trim()) return;
    setSaving(true);
    await addMeal({
      userId: 'local-user',
      mealType,
      foodName: foodName.trim(),
      calories: parseFloat(calories) || 0,
      proteinG: parseFloat(protein) || 0,
      carbsG: parseFloat(carbs) || 0,
      fatG: parseFloat(fat) || 0,
      fiberG: 0,
      servingSizeG: parseFloat(serving) || 100,
      servingUnit: 'g',
      date: getTodayStr(),
    });
    setSaving(false);
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <SegmentedControl
        options={[
          { label: '早餐', value: 'breakfast' },
          { label: '午餐', value: 'lunch' },
          { label: '晚餐', value: 'dinner' },
          { label: '加餐', value: 'snack' },
        ]}
        value={mealType}
        onChange={(v) => setMealType(v as MealRecord['mealType'])}
      />

      <Card style={{ marginTop: Spacing.md }}>
        <Input label="食物名称" placeholder="例：鸡胸肉" value={foodName} onChangeText={setFoodName} />
        <View style={styles.nutritionGrid}>
          <NutritionInput label="热量(kcal)" value={calories} onChange={setCalories} />
          <NutritionInput label="蛋白质(g)" value={protein} onChange={setProtein} />
          <NutritionInput label="碳水(g)" value={carbs} onChange={setCarbs} />
          <NutritionInput label="脂肪(g)" value={fat} onChange={setFat} />
        </View>
        <Input label="份量(g)" value={serving} onChangeText={setServing} keyboardType="decimal-pad" suffix="g" />
      </Card>

      <Button title="保存记录" onPress={handleSave} loading={saving} size="lg" style={{ marginTop: Spacing.lg }} />
    </ScrollView>
  );
}

function NutritionInput({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <View style={niStyles.container}>
      <Text style={niStyles.label}>{label}</Text>
      <TextInput
        style={niStyles.input}
        value={value}
        onChangeText={onChange}
        keyboardType="decimal-pad"
        placeholderTextColor={Colors.textTertiary}
      />
    </View>
  );
}

const niStyles = StyleSheet.create({
  container: { width: '48%' as any, marginBottom: Spacing.sm },
  label: { fontSize: FontSize.xs, color: Colors.textTertiary, marginBottom: 2 },
  input: { backgroundColor: Colors.surfaceVariant, borderRadius: BorderRadius.sm, paddingHorizontal: Spacing.sm, paddingVertical: 10, fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  nutritionGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
});
