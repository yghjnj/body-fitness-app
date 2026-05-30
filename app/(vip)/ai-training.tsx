import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/config/theme';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { SegmentedControl } from '../../src/components/ui/SegmentedControl';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { generateTrainingPlan, type TrainingPlan, type ExperienceLevel } from '../../src/services/ai';

const EXPERIENCE_OPTIONS = [
  { label: '新手', value: 'beginner' },
  { label: '中级', value: 'intermediate' },
  { label: '进阶', value: 'advanced' },
];

export default function AITrainingScreen() {
  const settings = useSettingsStore();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<TrainingPlan | null>(null);
  const [experience, setExperience] = useState<ExperienceLevel>('beginner');

  const handleGenerate = () => {
    setLoading(true);
    setTimeout(() => {
      try {
        const p = generateTrainingPlan({
          gender: settings.gender,
          age: settings.age,
          experience,
        });
        setPlan(p);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    }, 300);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.sectionTitle}>训练参数</Text>
        <View style={styles.paramRow}>
          <ParamChip label="性别" value={settings.gender === 'male' ? '男' : '女'} />
          <ParamChip label="年龄" value={`${settings.age}岁`} />
          <ParamChip label="身高" value={`${settings.heightCm}cm`} />
        </View>
        <Text style={styles.inputLabel}>训练经验</Text>
        <SegmentedControl
          options={EXPERIENCE_OPTIONS}
          value={experience}
          onChange={(v) => setExperience(v as ExperienceLevel)}
        />
      </Card>

      <Button
        title={loading ? '正在生成计划...' : '生成训练计划'}
        onPress={handleGenerate}
        loading={loading}
        size="lg"
        style={{ marginTop: Spacing.md }}
      />

      {plan && (
        <View style={{ marginTop: Spacing.lg }}>
          {/* Plan header */}
          <Card>
            <Text style={styles.planName}>{plan.planName}</Text>
            <Text style={styles.goalNote}>{plan.goalNote}</Text>
          </Card>

          {/* Weekly schedule */}
          {plan.weeklySchedule.map((day, i) => (
            <Card key={i} style={{ marginTop: Spacing.sm }}>
              <View style={styles.dayHeader}>
                <View>
                  <Text style={styles.dayName}>{day.dayName}</Text>
                </View>
                <View style={styles.focusBadge}>
                  <Text style={styles.focusText}>{day.focus}</Text>
                </View>
              </View>
              <View style={styles.exerciseList}>
                {day.exercises.map((ex, j) => {
                  const levelIdx = experience === 'beginner' ? 0 : experience === 'intermediate' ? 1 : 2;
                  return (
                    <View key={j} style={styles.exerciseRow}>
                      <Ionicons
                        name={ex.type === 'cardio' ? 'footsteps' : ex.type === 'flexibility' ? 'body' : 'barbell'}
                        size={16}
                        color={Colors.primary}
                      />
                      <View style={styles.exerciseInfo}>
                        <Text style={styles.exerciseName}>{ex.name}</Text>
                        <Text style={styles.exerciseDetail}>
                          {ex.defaultSets[levelIdx]}组 × {ex.defaultReps[levelIdx]} · 休息{ex.restSeconds}秒 · {ex.type === 'compound' ? '复合' : ex.type === 'isolation' ? '孤立' : ex.type === 'bodyweight' ? '自重' : ex.type === 'cardio' ? '有氧' : '柔韧'}
                        </Text>
                      </View>
                    </View>
                  );
                })}
              </View>
            </Card>
          ))}

          {/* Strategy */}
          <Card style={{ marginTop: Spacing.md }}>
            <Text style={styles.strategyTitle}>进阶策略</Text>
            <Text style={styles.strategyText}>{plan.progressionStrategy}</Text>

            <View style={{ marginTop: Spacing.md }}>
              <View style={styles.adviceRow}>
                <Ionicons name="flame" size={18} color="#F59E0B" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.adviceTitle}>热身</Text>
                  <Text style={styles.adviceText}>{plan.warmUpAdvice}</Text>
                </View>
              </View>
              <View style={[styles.adviceRow, { marginTop: Spacing.md }]}>
                <Ionicons name="snow" size={18} color="#3B82F6" />
                <View style={{ flex: 1 }}>
                  <Text style={styles.adviceTitle}>放松</Text>
                  <Text style={styles.adviceText}>{plan.coolDownAdvice}</Text>
                </View>
              </View>
            </View>
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md },
  paramRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.md },
  inputLabel: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.text, marginBottom: Spacing.sm },
  planName: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary, marginBottom: Spacing.sm },
  goalNote: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 22 },
  dayHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.md,
  },
  dayName: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  focusBadge: {
    backgroundColor: Colors.primary + '15',
    paddingHorizontal: Spacing.md,
    paddingVertical: 4,
    borderRadius: BorderRadius.full,
  },
  focusText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.primary },
  exerciseList: { gap: Spacing.sm },
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: Spacing.sm,
    paddingVertical: Spacing.xs,
  },
  exerciseInfo: { flex: 1 },
  exerciseName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  exerciseDetail: { fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: 2 },
  strategyTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm },
  strategyText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  adviceRow: { flexDirection: 'row', gap: Spacing.sm, alignItems: 'flex-start' },
  adviceTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text },
  adviceText: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20, marginTop: 2 },
});
