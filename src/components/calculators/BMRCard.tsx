import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '../../config/theme';
import { calculateBMR } from '../../utils/calculations';

interface BMRCardProps {
  weightKg: number;
  heightCm: number;
  age: number;
  gender: 'male' | 'female';
}

export function BMRCard({ weightKg, heightCm, age, gender }: BMRCardProps) {
  if (!weightKg || !heightCm || !age) {
    return (
      <Card>
        <Text style={styles.placeholder}>请完善身体数据来计算 BMR</Text>
      </Card>
    );
  }

  const result = calculateBMR(weightKg, heightCm, age, gender);

  return (
    <Card>
      <Text style={styles.title}>BMR 基础代谢率</Text>
      <Text style={styles.value}>{result.average}</Text>
      <Text style={styles.unit}>kcal / 天</Text>
      <Text style={styles.description}>
        这是您身体在完全静止状态下维持基本生命活动所需的最低热量。
      </Text>
      <View style={styles.methods}>
        <View style={styles.methodItem}>
          <Text style={styles.methodLabel}>Mifflin-St Jeor</Text>
          <Text style={styles.methodValue}>{result.mifflinStJeor} kcal</Text>
        </View>
        <View style={styles.methodItem}>
          <Text style={styles.methodLabel}>Harris-Benedict</Text>
          <Text style={styles.methodValue}>{result.harrisBenedict} kcal</Text>
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
    marginBottom: Spacing.xs,
  },
  value: {
    fontSize: 48,
    fontWeight: '800',
    color: Colors.primary,
  },
  unit: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.sm,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
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
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
  },
});
