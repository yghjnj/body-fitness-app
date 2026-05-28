import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from '../ui/Card';
import { Colors, Spacing, FontSize, BorderRadius } from '../../config/theme';
import { calculateBMI, getBMICategoryDescription } from '../../utils/calculations';

interface BMICardProps {
  weightKg: number;
  heightCm: number;
}

export function BMICard({ weightKg, heightCm }: BMICardProps) {
  if (!weightKg || !heightCm || heightCm <= 0) {
    return (
      <Card>
        <Text style={styles.placeholder}>请输入身高和体重来计算 BMI</Text>
      </Card>
    );
  }

  const result = calculateBMI(weightKg, heightCm);

  return (
    <Card>
      <Text style={styles.title}>BMI 身体质量指数</Text>
      <View style={styles.valueRow}>
        <Text style={[styles.bmiValue, { color: result.categoryColor }]}>{result.bmi}</Text>
        <View style={[styles.badge, { backgroundColor: result.categoryColor }]}>
          <Text style={styles.badgeText}>{result.categoryLabel}</Text>
        </View>
      </View>
      <View style={styles.scaleBar}>
        <View style={[styles.scaleSegment, { backgroundColor: Colors.bmiUnderweight, flex: 18.5 }]} />
        <View style={[styles.scaleSegment, { backgroundColor: Colors.bmiNormal, flex: 6.4 }]} />
        <View style={[styles.scaleSegment, { backgroundColor: Colors.bmiOverweight, flex: 5.1 }]} />
        <View style={[styles.scaleSegment, { backgroundColor: Colors.bmiObese, flex: 10 }]} />
      </View>
      <View style={styles.scaleLabels}>
        <Text style={styles.scaleLabel}>偏瘦</Text>
        <Text style={styles.scaleLabel}>正常</Text>
        <Text style={styles.scaleLabel}>超重</Text>
        <Text style={styles.scaleLabel}>肥胖</Text>
      </View>
      <Text style={styles.description}>{getBMICategoryDescription(result.category)}</Text>
      <View style={styles.healthyWeight}>
        <Text style={styles.healthyLabel}>健康体重范围</Text>
        <Text style={styles.healthyValue}>{result.healthyWeightMin} - {result.healthyWeightMax} kg</Text>
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
  bmiValue: {
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
    fontSize: FontSize.md,
  },
  scaleBar: {
    flexDirection: 'row',
    height: 8,
    borderRadius: BorderRadius.full,
    overflow: 'hidden',
    marginBottom: Spacing.xs,
  },
  scaleSegment: {},
  scaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: Spacing.md,
  },
  scaleLabel: {
    fontSize: FontSize.xs,
    color: Colors.textTertiary,
  },
  description: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    lineHeight: 20,
    marginBottom: Spacing.md,
  },
  healthyWeight: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
  },
  healthyLabel: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.xs,
  },
  healthyValue: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.primary,
  },
});
