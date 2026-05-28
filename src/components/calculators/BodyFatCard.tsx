import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '../../config/theme';
import { calculateBodyFat } from '../../utils/calculations';

interface BodyFatCardProps {
  gender: 'male' | 'female';
  heightCm: number;
  neckCm: number;
  waistCm: number;
  hipCm?: number;
  age: number;
  bmi: number;
}

export function BodyFatCard({ gender, heightCm, neckCm, waistCm, hipCm, age, bmi }: BodyFatCardProps) {
  if (!neckCm || !waistCm || !age || !bmi) {
    return (
      <Card>
        <Text style={styles.placeholder}>请完善身体数据来计算体脂率</Text>
      </Card>
    );
  }

  const result = calculateBodyFat(gender, heightCm, neckCm, waistCm, age, bmi, hipCm);

  return (
    <Card>
      <Text style={styles.title}>体脂率</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.value, { color: result.categoryColor }]}>{result.average}%</Text>
        <View style={[styles.badge, { backgroundColor: result.categoryColor }]}>
          <Text style={styles.badgeText}>{result.category}</Text>
        </View>
      </View>

      <View style={styles.methods}>
        {result.navyMethod !== undefined && (
          <View style={styles.methodItem}>
            <Text style={styles.methodLabel}>US Navy 公式</Text>
            <Text style={styles.methodValue}>{result.navyMethod}%</Text>
          </View>
        )}
        <View style={styles.methodItem}>
          <Text style={styles.methodLabel}>BMI 推算法</Text>
          <Text style={styles.methodValue}>{result.bmiMethod}%</Text>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  placeholder: {
    fontSize: FontSize.md,
    color: Colors.textTertiary,
    textAlign: 'center',
    padding: Spacing.md,
  },
  title: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  valueRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
    marginBottom: Spacing.md,
  },
  value: {
    fontSize: 48,
    fontWeight: '800',
  },
  badge: {
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
  },
  badgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: FontSize.sm,
  },
  methods: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  methodItem: {
    flex: 1,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  methodLabel: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
    marginBottom: Spacing.xs,
  },
  methodValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
  },
});
