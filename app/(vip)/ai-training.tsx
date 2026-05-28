import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/config/theme';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { useSettingsStore } from '../../src/stores/settingsStore';

export default function AITrainingScreen() {
  const settings = useSettingsStore();
  const [loading, setLoading] = useState(false);
  const [plan, setPlan] = useState<any>(null);

  const generatePlan = () => {
    setLoading(true);
    setTimeout(() => {
      setPlan({
        planName: '四周力量 + 燃脂综合计划',
        weeklySchedule: [
          { day: '周一', focus: '胸部 + 三头肌', exercises: ['卧推', '上斜哑铃推举', '绳索下压'] },
          { day: '周二', focus: '背部 + 二头肌', exercises: ['引体向上', '杠铃划船', '哑铃弯举'] },
          { day: '周三', focus: '休息/有氧', exercises: ['30分钟慢跑或HIIT'] },
          { day: '周四', focus: '腿部 + 肩部', exercises: ['深蹲', '腿举', '哑铃侧平举'] },
          { day: '周五', focus: '全身力量', exercises: ['硬拉', '实力推举', '平板支撑'] },
          { day: '周六', focus: '有氧 + 核心', exercises: ['HIIT 20分钟', '卷腹', '平板支撑'] },
          { day: '周日', focus: '休息', exercises: ['拉伸/瑜伽恢复'] },
        ],
        progressionStrategy: '每周目标重量增加2.5-5kg或额外1-2次重复。每四周测试一次最大重量以评估进步。',
      });
      setLoading(false);
    }, 2000);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Card>
        <Text style={styles.sectionTitle}>训练参数</Text>
        <View style={styles.paramRow}>
          <ParamChip label="性别" value={settings.gender === 'male' ? '男' : '女'} />
          <ParamChip label="年龄" value={`${settings.age}岁`} />
          <ParamChip label="身高" value={`${settings.heightCm}cm`} />
          <ParamChip label="经验" value="中级" />
        </View>
      </Card>

      <Button
        title={loading ? 'AI 正在生成...' : '生成训练计划'}
        onPress={generatePlan}
        loading={loading}
        size="lg"
        style={{ marginTop: Spacing.md }}
      />

      {plan && (
        <View style={{ marginTop: Spacing.lg }}>
          <Card>
            <Text style={styles.planName}>{plan.planName}</Text>
            <Text style={styles.progression}>{plan.progressionStrategy}</Text>
          </Card>

          {plan.weeklySchedule.map((day: any, i: number) => (
            <Card key={i} style={{ marginTop: Spacing.md }}>
              <View style={styles.dayHeader}>
                <Text style={styles.dayName}>{day.day}</Text>
                <View style={styles.focusBadge}>
                  <Text style={styles.focusText}>{day.focus}</Text>
                </View>
              </View>
              <View style={styles.exerciseList}>
                {day.exercises.map((ex: string, j: number) => (
                  <View key={j} style={styles.exerciseRow}>
                    <Ionicons name="barbell" size={16} color={Colors.primary} />
                    <Text style={styles.exerciseName}>{ex}</Text>
                  </View>
                ))}
              </View>
            </Card>
          ))}
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
  paramRow: { flexDirection: 'row', gap: Spacing.sm },
  planName: { fontSize: FontSize.lg, fontWeight: '800', color: Colors.primary, marginBottom: Spacing.md },
  progression: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
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
  exerciseRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.sm },
  exerciseName: { fontSize: FontSize.md, color: Colors.text },
});
