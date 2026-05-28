import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '../../config/theme';
import { calculateMacros } from '../../utils/calculations';
import type { GoalType } from '../../types/models';

interface MacroCardProps {
  calories: number;
  goalType: GoalType;
}

export function MacroCard({ calories, goalType }: MacroCardProps) {
  if (!calories) {
    return (
      <Card>
        <Text style={styles.placeholder}>请先计算 TDEE 来获取宏量营养建议</Text>
      </Card>
    );
  }

  const macros = calculateMacros(calories, goalType);

  return (
    <Card>
      <Text style={styles.title}>宏量营养素分配</Text>
      <Text style={styles.calories}>{macros.calories} kcal / 天</Text>

      <View style={styles.macroList}>
        <MacroBar label="蛋白质" grams={macros.proteinG} percent={macros.proteinPercent} color="#EF4444" />
        <MacroBar label="脂肪" grams={macros.fatG} percent={macros.fatPercent} color="#F59E0B" />
        <MacroBar label="碳水" grams={macros.carbsG} percent={macros.carbsPercent} color="#3B82F6" />
      </View>

      <View style={styles.fiberRow}>
        <Text style={styles.fiberLabel}>建议膳食纤维</Text>
        <Text style={styles.fiberValue}>{macros.fiberG}g / 天</Text>
      </View>
    </Card>
  );
}

function MacroBar({ label, grams, percent, color }: { label: string; grams: number; percent: number; color: string }) {
  return (
    <View style={macroStyles.container}>
      <View style={macroStyles.header}>
        <View style={macroStyles.labelRow}>
          <View style={[macroStyles.dot, { backgroundColor: color }]} />
          <Text style={macroStyles.label}>{label}</Text>
        </View>
        <Text style={macroStyles.grams}>{grams}g</Text>
      </View>
      <View style={macroStyles.barBg}>
        <View style={[macroStyles.bar, { backgroundColor: color, width: `${percent}%` }]} />
      </View>
      <Text style={macroStyles.percent}>{percent}% 热量</Text>
    </View>
  );
}

const macroStyles = StyleSheet.create({
  container: { marginBottom: Spacing.md },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.xs,
  },
  labelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.sm,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  label: {
    fontSize: FontSize.md,
    fontWeight: '600',
    color: Colors.text,
  },
  grams: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
  },
  barBg: {
    height: 8,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: 2,
  },
  bar: {
    height: '100%',
    borderRadius: BorderRadius.full,
  },
  percent: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
});

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
  calories: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: Spacing.lg,
  },
  macroList: {
    marginBottom: Spacing.md,
  },
  fiberRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  fiberLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
  },
  fiberValue: {
    fontSize: FontSize.md,
    fontWeight: '700',
    color: Colors.text,
  },
});
