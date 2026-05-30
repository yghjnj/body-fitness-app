import React from 'react';
import { View, Text, ScrollView, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/config/theme';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { useSettingsStore } from '../../src/stores/settingsStore';

export default function AdvancedAnalyticsScreen() {
  const settings = useSettingsStore();

  const stats = [
    { label: '当前体重', value: '70.0 kg', change: '-2.3 kg', trend: 'down' },
    { label: '体脂率', value: '22%', change: '-1.5%', trend: 'down' },
    { label: 'BMI', value: '24.2', change: '-0.8', trend: 'down' },
    { label: '本周锻炼', value: '4 次', change: '+1', trend: 'up' },
    { label: '日均热量', value: '1850 kcal', change: '-150', trend: 'down' },
    { label: '饮水达标', value: '6/7 天', change: '+2', trend: 'up' },
  ];

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>30 天数据分析</Text>
      <View style={styles.grid}>
        {stats.map((s, i) => (
          <Card key={i} style={{ width: '48%' as any, marginBottom: Spacing.md }}>
            <Text style={styles.statLabel}>{s.label}</Text>
            <Text style={styles.statValue}>{s.value}</Text>
            <View style={styles.changeRow}>
              <Ionicons
                name={s.trend === 'down' ? 'arrow-down' : 'arrow-up'}
                size={14}
                color={s.trend === 'down' ? Colors.success : Colors.danger}
              />
              <Text style={[styles.change, { color: s.trend === 'down' ? Colors.success : Colors.danger }]}>
                {s.change}
              </Text>
            </View>
          </Card>
        ))}
      </View>

      <Button title="导出 CSV 报告" onPress={() => {}} variant="outline" icon={<Ionicons name="download" size={18} color={Colors.primary} />} />
      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  title: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md },
  grid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' },
  statLabel: { fontSize: FontSize.xs, color: Colors.textTertiary, marginBottom: 4 },
  statValue: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text, marginBottom: 4 },
  changeRow: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  change: { fontSize: FontSize.sm, fontWeight: '600' },
});
