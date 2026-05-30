import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/config/theme';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { Input } from '../../src/components/ui/Input';
import { SegmentedControl } from '../../src/components/ui/SegmentedControl';
import { getDatabase } from '../../src/services/database/init';
import { getTodayStr } from '../../src/utils/formatting';
import type { GoalType } from '../../src/types/models';
import { v4 as uuid } from 'uuid';

export default function GoalSetterScreen() {
  const router = useRouter();
  const [goalType, setGoalType] = useState<GoalType>('weight_loss');
  const [targetWeight, setTargetWeight] = useState('65');
  const [weeklyGoal, setWeeklyGoal] = useState('0.5');
  const [saving, setSaving] = useState(false);

  const weeklyNum = parseFloat(weeklyGoal) || 0.5;
  const targetNum = parseFloat(targetWeight) || 65;

  const weeksToGoal = weeklyNum > 0 ? Math.ceil(Math.abs(targetNum - 70) / weeklyNum) : 0;

  const handleSave = async () => {
    setSaving(true);
    try {
      const db = await getDatabase();
      const id = uuid();
      const now = new Date().toISOString();
      // Cancel any previous active goals
      await db.runAsync(`UPDATE goals SET status = 'cancelled' WHERE user_id = ? AND status = 'active'`, ['local-user']);
      await db.runAsync(
        `INSERT INTO goals (id, user_id, type, target_weight_kg, target_date, start_date, weekly_goal_kg, activity_level, status, created_at, updated_at, synced)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, 'active', ?, ?, 0)`,
        [id, 'local-user', goalType, targetNum, null, getTodayStr(), weeklyNum, 'moderate', now, now]
      );
    } catch (e) {
      console.error('Failed to save goal:', e);
    }
    setSaving(false);
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.label}>目标类型</Text>
      <SegmentedControl
        options={[
          { label: '减脂', value: 'weight_loss' },
          { label: '增肌', value: 'muscle_gain' },
          { label: '维持', value: 'maintenance' },
        ]}
        value={goalType}
        onChange={(v) => setGoalType(v as GoalType)}
      />

      <Card style={{ marginTop: Spacing.md }}>
        {goalType !== 'maintenance' && (
          <>
            <Input label="目标体重 (kg)" value={targetWeight} onChangeText={setTargetWeight} keyboardType="decimal-pad" />
            <Input label="每周变化 (kg)" value={weeklyGoal} onChangeText={setWeeklyGoal} keyboardType="decimal-pad" suffix="kg/周" />
          </>
        )}
        {goalType === 'maintenance' && (
          <Text style={styles.maintainDesc}>维持模式帮助您保持当前体重，专注身体成分优化。</Text>
        )}
        {weeksToGoal > 0 && goalType !== 'maintenance' && (
          <View style={styles.estimation}>
            <Text style={styles.estLabel}>预计达成时间</Text>
            <Text style={styles.estValue}>{weeksToGoal} 周</Text>
          </View>
        )}
      </Card>

      <Button title="设定目标" onPress={handleSave} loading={saving} size="lg" style={{ marginTop: Spacing.lg }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  label: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  maintainDesc: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', padding: Spacing.lg, lineHeight: 22 },
  estimation: { backgroundColor: Colors.surfaceVariant, borderRadius: BorderRadius.md, padding: Spacing.md, marginTop: Spacing.md },
  estLabel: { fontSize: FontSize.xs, color: Colors.textTertiary },
  estValue: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary, marginTop: 4 },
});
