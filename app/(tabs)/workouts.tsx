import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/config/theme';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { useSubscriptionStore } from '../../src/stores/subscriptionStore';
import { getRecentWorkouts } from '../../src/services/database/repositories/workoutRepo';
import type { WorkoutRecord } from '../../src/types/models';

export default function WorkoutsScreen() {
  const router = useRouter();
  const { isVIP } = useSubscriptionStore();
  const [recentWorkouts, setRecentWorkouts] = useState<WorkoutRecord[]>([]);

  const loadWorkouts = useCallback(async () => {
    const workouts = await getRecentWorkouts('local-user', 10);
    setRecentWorkouts(workouts);
  }, []);

  useEffect(() => {
    loadWorkouts();
    const interval = setInterval(loadWorkouts, 3000);
    return () => clearInterval(interval);
  }, [loadWorkouts]);

  const quickWorkouts = [
    { name: '全身力量训练', duration: '45分钟', level: '中级', muscles: '全身' },
    { name: '胸部 + 三头肌', duration: '50分钟', level: '中级', muscles: '胸部' },
    { name: '背部 + 二头肌', duration: '50分钟', level: '中级', muscles: '背部' },
    { name: '腿部训练', duration: '55分钟', level: '高级', muscles: '腿部' },
    { name: 'HIIT 燃脂', duration: '25分钟', level: '初级', muscles: '全身' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Quick Start Templates */}
      <Text style={styles.sectionTitle}>快速开始</Text>
      <Text style={styles.sectionSubtitle}>选择预设模板快速开始训练</Text>
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

      {/* AI Training (VIP) */}
      <Text style={styles.sectionTitle}>AI 智能训练</Text>
      <Card style={StyleSheet.flatten([styles.aiCard, !isVIP && styles.aiLocked])}>
        <View style={styles.aiContent}>
          <Ionicons name="bulb" size={32} color={Colors.vipGold} />
          <View style={styles.aiText}>
            <Text style={styles.aiTitle}>AI 定制训练计划</Text>
            <Text style={styles.aiDesc}>
              {isVIP
                ? '根据您的目标和体能水平，AI 为您生成个性化四周训练计划'
                : '升级 VIP 解锁 AI 训练计划生成，包含四周渐进超负荷方案'}
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

      {/* Exercise Library */}
      <Text style={styles.sectionTitle}>动作库</Text>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.exerciseScroll}>
        {['胸部', '背部', '腿部', '肩部', '手臂', '核心', '有氧'].map((muscle) => (
          <TouchableCard key={muscle} muscle={muscle} />
        ))}
      </ScrollView>

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
          actionLabel="快速开始"
          onAction={() => router.push('/(modals)/add-workout')}
        />
      )}
      {recentWorkouts.length > 0 && (
        <Button title="+ 开始新训练" onPress={() => router.push('/(modals)/add-workout')} variant="outline" style={{ marginBottom: Spacing.md }} />
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function MetaTag({ icon, text }: { icon: keyof typeof Ionicons.glyphMap; text: string }) {
  return (
    <View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
      <Ionicons name={icon} size={12} color={Colors.textTertiary} />
      <Text style={{ fontSize: 11, color: Colors.textTertiary }}>{text}</Text>
    </View>
  );
}

function TouchableCard({ muscle }: { muscle: string }) {
  return (
    <TouchableOpacity onPress={() => alert(`查看「${muscle}」动作库 — 即将上线`)} activeOpacity={0.7}>
      <Card style={tcStyles.card} padded={false}>
        <View style={tcStyles.inner}>
          <Ionicons name="barbell" size={28} color={Colors.primary} />
          <Text style={tcStyles.text}>{muscle}</Text>
        </View>
      </Card>
    </TouchableOpacity>
  );
}

const tcStyles = StyleSheet.create({
  card: { width: 100, marginRight: Spacing.md },
  inner: {
    padding: Spacing.md,
    alignItems: 'center',
    gap: Spacing.sm,
  },
  text: {
    fontSize: FontSize.sm,
    fontWeight: '600',
    color: Colors.text,
  },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  sectionTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: Spacing.xs,
    marginTop: Spacing.md,
  },
  sectionSubtitle: {
    fontSize: FontSize.sm,
    color: Colors.textSecondary,
    marginBottom: Spacing.md,
  },
  workoutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  workoutIcon: {
    width: 48,
    height: 48,
    borderRadius: BorderRadius.md,
    backgroundColor: Colors.primary + '15',
    alignItems: 'center',
    justifyContent: 'center',
  },
  workoutInfo: { flex: 1, gap: 4 },
  workoutName: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  workoutMeta: { flexDirection: 'row', gap: Spacing.md },
  aiCard: { marginBottom: Spacing.md },
  aiLocked: { opacity: 0.85 },
  aiContent: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.md,
  },
  aiText: { flex: 1 },
  aiTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  aiDesc: { fontSize: FontSize.xs, color: Colors.textSecondary, lineHeight: 18 },
  vipBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.vipGold + '20',
    paddingHorizontal: Spacing.sm,
    paddingVertical: Spacing.xs,
    borderRadius: BorderRadius.full,
    gap: 4,
  },
  vipText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.vipGold },
  exerciseScroll: { marginBottom: Spacing.md },
  historyRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  historyIcon: { width: 40, height: 40, borderRadius: 20, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  historyName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  historyMeta: { fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: 2 },
  historyCal: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.warning },
});
