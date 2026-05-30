import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter, useFocusEffect } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/config/theme';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { ExerciseDetailModal } from '../../src/components/exercise/ExerciseDetailModal';
import { useSubscriptionStore } from '../../src/stores/subscriptionStore';
import { getRecentWorkouts } from '../../src/services/database/repositories/workoutRepo';
import type { WorkoutRecord } from '../../src/types/models';
import type { Exercise } from '../../src/data/exercises';
import {
  CHEST_EXERCISES, BACK_EXERCISES, LEG_EXERCISES,
  SHOULDER_EXERCISES, ARM_EXERCISES, CORE_EXERCISES,
  CARDIO_EXERCISES,
} from '../../src/data/exercises';

const MUSCLE_GROUPS: { name: string; icon: keyof typeof Ionicons.glyphMap; exercises: Exercise[]; color: string }[] = [
  { name: '胸部', icon: 'shirt', exercises: CHEST_EXERCISES, color: '#EF4444' },
  { name: '背部', icon: 'arrow-back', exercises: BACK_EXERCISES, color: '#3B82F6' },
  { name: '腿部', icon: 'walk', exercises: LEG_EXERCISES, color: '#10B981' },
  { name: '肩部', icon: 'arrow-up', exercises: SHOULDER_EXERCISES, color: '#8B5CF6' },
  { name: '手臂', icon: 'hand-left', exercises: ARM_EXERCISES, color: '#F59E0B' },
  { name: '核心', icon: 'fitness', exercises: CORE_EXERCISES, color: '#EC4899' },
  { name: '有氧', icon: 'pulse', exercises: CARDIO_EXERCISES, color: '#06B6D4' },
];

export default function WorkoutsScreen() {
  const router = useRouter();
  const { isVIP } = useSubscriptionStore();
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutRecord[]>([]);
  const [selectedExercise, setSelectedExercise] = useState<Exercise | null>(null);
  const [showDetail, setShowDetail] = useState(false);

  const loadWorkouts = useCallback(async () => {
    const workouts = await getRecentWorkouts('local-user', 10);
    setRecentWorkouts(workouts);
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWorkouts();
    }, [loadWorkouts])
  );

  const openExercise = (ex: Exercise) => {
    setSelectedExercise(ex);
    setShowDetail(true);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Exercise Library — now interactive */}
      <Text style={styles.sectionTitle}>动作库</Text>
      <Text style={styles.sectionSubtitle}>点击查看动作要领、常见错误和动画演示</Text>
      {MUSCLE_GROUPS.map((group) => (
        <Card key={group.name} style={{ marginBottom: Spacing.sm }}>
          <View style={styles.groupHeader}>
            <View style={[styles.groupIcon, { backgroundColor: group.color + '20' }]}>
              <Ionicons name={group.icon} size={22} color={group.color} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.groupName}>{group.name}</Text>
              <Text style={styles.groupCount}>{group.exercises.length}个动作</Text>
            </View>
          </View>
          <View style={styles.exerciseTags}>
            {group.exercises.map((ex, i) => (
              <TouchableOpacity
                key={i}
                style={styles.exerciseTag}
                onPress={() => openExercise(ex)}
                activeOpacity={0.6}
              >
                <Text style={styles.exerciseTagText}>{ex.name}</Text>
                <Text style={styles.exerciseTagLevel}>{ex.difficulty === 'beginner' ? '入门' : ex.difficulty === 'intermediate' ? '中级' : '进阶'}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Card>
      ))}

      {/* AI Training (VIP) */}
      <Text style={styles.sectionTitle}>AI 智能训练</Text>
      <Card style={isVIP ? undefined : { opacity: 0.85 as any }}>
        <View style={styles.aiContent}>
          <Ionicons name="bulb" size={32} color={Colors.vipGold} />
          <View style={styles.aiText}>
            <Text style={styles.aiTitle}>AI 定制训练计划</Text>
            <Text style={styles.aiDesc}>
              {isVIP
                ? '根据您的目标和体能水平，AI 为您生成个性化训练计划'
                : '升级 VIP 解锁 AI 训练计划生成'}
            </Text>
          </View>
          {isVIP ? (
            <Button title="生成计划" onPress={() => router.push('/(vip)/ai-training')} variant="secondary" size="sm" />
          ) : (
            <View style={styles.vipBadge}>
              <Ionicons name="lock-closed" size={12} color={Colors.vipGold} />
              <Text style={styles.vipText}>VIP</Text>
            </View>
          )}
        </View>
      </Card>

      {/* Quick Start Templates */}
      <Text style={styles.sectionTitle}>快速开始</Text>
      <Text style={styles.sectionSubtitle}>选择预设模板记录训练</Text>
      {quickWorkouts.map((w, i) => (
        <Card key={i} style={{ marginBottom: Spacing.sm }}>
          <View style={styles.workoutRow}>
            <View style={styles.workoutIcon}>
              <Ionicons name="barbell" size={24} color={Colors.primary} />
            </View>
            <View style={styles.workoutInfo}>
              <Text style={styles.workoutName}>{w.name}</Text>
              <View style={styles.workoutMeta}>
                <MetaTag icon="time" text={w.duration} />
                <MetaTag icon="speedometer" text={w.level} />
                <MetaTag icon="body" text={w.muscles} />
              </View>
            </View>
            <Button title="开始" onPress={() => router.push('/(modals)/add-workout')} size="sm" />
          </View>
        </Card>
      ))}

      {/* History */}
      <Text style={styles.sectionTitle}>锻炼历史</Text>
      {recentWorkouts.length > 0 ? (
        recentWorkouts.map((w) => (
          <Card key={w.id} style={{ marginBottom: Spacing.sm }}>
            <View style={styles.historyRow}>
              <View style={styles.historyIcon}>
                <Ionicons name="barbell" size={20} color={Colors.primary} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={styles.historyName}>{w.name}</Text>
                <Text style={styles.historyMeta}>{w.date} · {w.durationMinutes}分钟</Text>
              </View>
              {w.caloriesBurned && (
                <Text style={styles.historyCal}>{Math.round(w.caloriesBurned)} kcal</Text>
              )}
            </View>
          </Card>
        ))
      ) : (
        <EmptyState
          icon="fitness"
          title="暂无锻炼记录"
          description="开始您的第一次训练吧"
          actionLabel="记录训练"
          onAction={() => router.push('/(modals)/add-workout')}
        />
      )}
      {recentWorkouts.length > 0 && (
        <Button title="+ 开始新训练" onPress={() => router.push('/(modals)/add-workout')} variant="outline" style={{ marginTop: Spacing.sm }} />
      )}

      {/* Exercise Detail Modal */}
      <ExerciseDetailModal exercise={selectedExercise} visible={showDetail} onClose={() => setShowDetail(false)} />

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const quickWorkouts = [
  { name: '全身力量训练', duration: '45分钟', level: '中级', muscles: '全身' },
  { name: '胸部 + 三头肌', duration: '50分钟', level: '中级', muscles: '胸部' },
  { name: '背部 + 二头肌', duration: '50分钟', level: '中级', muscles: '背部' },
  { name: '腿部训练', duration: '55分钟', level: '高级', muscles: '腿部' },
  { name: 'HIIT 燃脂', duration: '25分钟', level: '初级', muscles: '全身' },
];

function MetaTag({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      <Ionicons name={icon} size={12} color={Colors.textTertiary} />
      <Text style={{ fontSize: 11, color: Colors.textTertiary }}>{text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: 4, marginTop: Spacing.md },
  sectionSubtitle: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.md },
  groupHeader: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, marginBottom: Spacing.sm },
  groupIcon: { width: 44, height: 44, borderRadius: BorderRadius.md, alignItems: 'center', justifyContent: 'center' },
  groupName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  groupCount: { fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: 2 },
  exerciseTags: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm },
  exerciseTag: {
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.full,
    paddingHorizontal: Spacing.md,
    paddingVertical: Spacing.xs,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  exerciseTagText: { fontSize: FontSize.sm, color: Colors.text, fontWeight: '500' },
  exerciseTagLevel: { fontSize: 10, color: Colors.textTertiary, backgroundColor: Colors.background, paddingHorizontal: 6, paddingVertical: 1, borderRadius: BorderRadius.full },
  aiContent: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  aiText: { flex: 1 },
  aiTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  aiDesc: { fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 18 },
  vipBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.vipGold + '20', paddingHorizontal: Spacing.sm, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full, gap: 4 },
  vipText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.vipGold },
  workoutRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  workoutIcon: { width: 48, height: 48, borderRadius: BorderRadius.md, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  workoutInfo: { flex: 1, gap: 4 },
  workoutName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  workoutMeta: { flexDirection: 'row', gap: Spacing.md },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  historyIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  historyName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  historyMeta: { fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: 2 },
  historyCal: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.warning },
});
