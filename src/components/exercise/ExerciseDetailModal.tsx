import React from 'react';
import { View, Text, StyleSheet, Modal, ScrollView, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../config/theme';
import { Button } from '../ui/Button';
import { SvgExerciseFigure } from './SvgExerciseFigure';
import type { Exercise } from '../../data/exercises';

type SvgPose = 'press' | 'squat' | 'curl' | 'raise' | 'row' | 'plank' | 'run' | 'deadlift' | 'fly' | 'static';

function mapAnimToPose(direction: string, joint: string): SvgPose {
  // Use both direction and joint to determine the best pose
  if (joint === 'knee' || direction === 'up_down' && joint === 'whole_body') return 'squat';
  if (joint === 'hip') return 'deadlift';
  if (joint === 'elbow') return 'curl';
  if (direction === 'forward_back' && joint === 'shoulder') return 'fly';
  if (direction === 'forward_back') return 'row';
  if (direction === 'rotation') return 'curl';
  if (direction === 'static_hold') return 'plank';
  if (direction === 'alternating') return 'run';
  if (direction === 'circular') return 'run';
  if (joint === 'shoulder') return 'raise';
  if (joint === 'spine') return 'row';
  return 'static';
}

interface Props {
  exercise: Exercise | null;
  visible: boolean;
  onClose: () => void;
}

export function ExerciseDetailModal({ exercise, visible, onClose }: Props) {
  if (!exercise) return null;

  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={styles.overlay}>
        <View style={styles.sheet}>
          {/* Header */}
          <View style={styles.handle} />
          <View style={styles.header}>
            <View style={{ flex: 1 }}>
              <Text style={styles.name}>{exercise.name}</Text>
              <View style={styles.badges}>
                <Badge label={exercise.muscleGroup} color={Colors.primary} />
                <Badge label={TYPE_LABELS[exercise.type]} color={TYPE_COLORS[exercise.type]} />
                <Badge label={DIFF_LABELS[exercise.difficulty]} color={DIFF_COLORS[exercise.difficulty]} />
              </View>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <Ionicons name="close" size={24} color={Colors.textSecondary} />
            </TouchableOpacity>
          </View>

          {/* Animation — SVG human figure with reanimated joints */}
          <View style={styles.animContainer}>
            <View style={styles.animBox}>
              <SvgExerciseFigure
                pose={mapAnimToPose(exercise.animation.direction, exercise.animation.joint)}
              />
            </View>
            <Text style={styles.rangeLabel}>{exercise.animation.rangeLabel}</Text>
          </View>

          <ScrollView style={styles.body} showsVerticalScrollIndicator={false}>
            {/* Description */}
            <Text style={styles.desc}>{exercise.description}</Text>

            {/* Secondary muscles */}
            {exercise.secondaryMuscles.length > 0 && (
              <View style={styles.secondaryRow}>
                <Text style={styles.secondaryLabel}>协同肌群：</Text>
                <Text style={styles.secondaryValue}>{exercise.secondaryMuscles.join('、')}</Text>
              </View>
            )}

            {/* Safety warning */}
            {exercise.safetyWarning && (
              <View style={styles.warningBox}>
                <Ionicons name="warning" size={18} color={Colors.warning} />
                <Text style={styles.warningText}>{exercise.safetyWarning}</Text>
              </View>
            )}

            {/* Form cues */}
            <Text style={styles.sectionHeader}>动作要领</Text>
            {exercise.formCues.map((cue, i) => (
              <View key={i} style={styles.cueRow}>
                <Text style={styles.cueNum}>{i + 1}</Text>
                <Text style={styles.cueText}>{cue}</Text>
              </View>
            ))}

            {/* Common mistakes */}
            <Text style={styles.sectionHeader}>常见错误</Text>
            {exercise.commonMistakes.map((mistake, i) => (
              <View key={i} style={styles.mistakeRow}>
                <Ionicons name="close-circle" size={16} color={Colors.danger} />
                <Text style={styles.mistakeText}>{mistake}</Text>
              </View>
            ))}

            {/* Training params */}
            <Text style={styles.sectionHeader}>训练参数</Text>
            <View style={styles.paramsGrid}>
              <ParamBox label="新手" sets={exercise.defaultSets[0]} reps={exercise.defaultReps[0]} />
              <ParamBox label="中级" sets={exercise.defaultSets[1]} reps={exercise.defaultReps[1]} />
              <ParamBox label="进阶" sets={exercise.defaultSets[2]} reps={exercise.defaultReps[2]} />
            </View>
            <Text style={styles.restText}>组间休息：{exercise.restSeconds}秒</Text>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
}

// --- Helpers ---
function Badge({ label, color }: { label: string; color: string }) {
  return (
    <View style={[badgeStyles.box, { backgroundColor: color + '18' }]}>
      <Text style={[badgeStyles.text, { color }]}>{label}</Text>
    </View>
  );
}

const badgeStyles = StyleSheet.create({
  box: { paddingHorizontal: 8, paddingVertical: 2, borderRadius: BorderRadius.full },
  text: { fontSize: 11, fontWeight: '700' },
});

function ParamBox({ label, sets, reps }: { label: string; sets: number; reps: string }) {
  return (
    <View style={pbStyles.box}>
      <Text style={pbStyles.level}>{label}</Text>
      <Text style={pbStyles.sets}>{sets}组</Text>
      <Text style={pbStyles.reps}>{reps}</Text>
    </View>
  );
}

const pbStyles = StyleSheet.create({
  box: { flex: 1, alignItems: 'center', backgroundColor: Colors.surfaceVariant, borderRadius: BorderRadius.md, padding: Spacing.sm },
  level: { fontSize: FontSize.xs, color: Colors.textTertiary, marginBottom: 4 },
  sets: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary },
  reps: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
});

const TYPE_LABELS: Record<string, string> = {
  compound: '复合动作', isolation: '孤立动作', bodyweight: '自重', cardio: '有氧', flexibility: '柔韧',
};
const TYPE_COLORS: Record<string, string> = {
  compound: '#EF4444', isolation: '#F59E0B', bodyweight: '#10B981', cardio: '#3B82F6', flexibility: '#8B5CF6',
};
const DIFF_LABELS: Record<string, string> = {
  beginner: '入门', intermediate: '中级', advanced: '进阶',
};
const DIFF_COLORS: Record<string, string> = {
  beginner: '#10B981', intermediate: '#F59E0B', advanced: '#EF4444',
};

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end' },
  sheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    maxHeight: '90%',
    paddingBottom: Spacing.xxl,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.border,
    alignSelf: 'center',
    marginTop: Spacing.md,
    marginBottom: Spacing.sm,
  },
  header: { flexDirection: 'row', paddingHorizontal: Spacing.lg, paddingVertical: Spacing.md, alignItems: 'flex-start' },
  name: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.text, marginBottom: Spacing.sm },
  badges: { flexDirection: 'row', gap: Spacing.sm, flexWrap: 'wrap' },
  closeBtn: { padding: Spacing.sm, marginTop: -4 },
  animContainer: { paddingHorizontal: Spacing.lg, marginBottom: Spacing.md },
  animBox: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.lg,
    height: 220,
    justifyContent: 'center',
  },
  rangeLabel: { textAlign: 'center', fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: Spacing.sm },
  body: { paddingHorizontal: Spacing.lg },
  desc: { fontSize: FontSize.md, color: Colors.textSecondary, lineHeight: 24, marginBottom: Spacing.md },
  secondaryRow: { flexDirection: 'row', marginBottom: Spacing.md, flexWrap: 'wrap' },
  secondaryLabel: { fontSize: FontSize.sm, color: Colors.textTertiary },
  secondaryValue: { fontSize: FontSize.sm, color: Colors.textSecondary, flex: 1 },
  warningBox: {
    flexDirection: 'row',
    backgroundColor: Colors.warning + '15',
    borderRadius: BorderRadius.md,
    padding: Spacing.md,
    gap: Spacing.sm,
    marginBottom: Spacing.lg,
    alignItems: 'flex-start',
  },
  warningText: { flex: 1, fontSize: FontSize.sm, color: Colors.warning, lineHeight: 20 },
  sectionHeader: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md, marginTop: Spacing.md },
  cueRow: { flexDirection: 'row', marginBottom: Spacing.sm, gap: Spacing.md, alignItems: 'flex-start' },
  cueNum: {
    width: 22,
    height: 22,
    borderRadius: 11,
    backgroundColor: Colors.primary,
    color: '#fff',
    fontSize: 12,
    fontWeight: '700',
    textAlign: 'center',
    lineHeight: 22,
    overflow: 'hidden',
  },
  cueText: { flex: 1, fontSize: FontSize.md, color: Colors.text, lineHeight: 22 },
  mistakeRow: { flexDirection: 'row', marginBottom: Spacing.sm, gap: Spacing.sm, alignItems: 'flex-start' },
  mistakeText: { flex: 1, fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
  paramsGrid: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  restText: { fontSize: FontSize.sm, color: Colors.textTertiary, textAlign: 'center', marginBottom: Spacing.md },
});
