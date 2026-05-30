import React, { useState, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useFocusEffect } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius, Shadow } from '../../src/config/theme';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { EmptyState } from '../../src/components/ui/EmptyState';
import { BMICard } from '../../src/components/calculators/BMICard';
import { BodyFatCard } from '../../src/components/calculators/BodyFatCard';
import { getWeightsByDateRange } from '../../src/services/database/repositories/weightRepo';
import { getTodayStr, daysAgoStr } from '../../src/utils/formatting';
import type { WeightRecord } from '../../src/types/models';
import { useSubscriptionStore } from '../../src/stores/subscriptionStore';
import { VIPLock } from '../../src/components/subscription/FeatureGate';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { calculateBMI } from '../../src/utils/calculations';

type CalcTab = 'bmi' | 'bodyfat' | 'ideal' | 'whr';

export default function TrackingScreen() {
  const router = useRouter();
  const settings = useSettingsStore();
  const { isVIP } = useSubscriptionStore();
  const [activeTab, setActiveTab] = useState<CalcTab>('bmi');
  const [weightRecords, setWeightRecords] = useState<WeightRecord[]>([]);

  // Use settingsStore as single source of truth
  const gender = settings.gender;
  const heightCm = settings.heightCm;
  const weightKg = settings.weightKg;

  // Local inputs for measurements not in settings
  const [neck, setNeck] = useState('38');
  const [waist, setWaist] = useState('80');
  const [hip, setHip] = useState('95');

  const loadWeights = useCallback(async () => {
    const records = await getWeightsByDateRange('local-user', daysAgoStr(30), getTodayStr());
    setWeightRecords(records);
    if (records.length > 0 && records[0].weight !== settings.weightKg) {
      settings.updateSettings({ weightKg: records[0].weight });
    }
  }, []);

  useFocusEffect(
    useCallback(() => {
      loadWeights();
    }, [loadWeights])
  );

  const neckNum = parseFloat(neck) || 0;
  const waistNum = parseFloat(waist) || 0;
  const hipNum = parseFloat(hip) || 0;

  const bmiResult = weightKg && heightCm ? calculateBMI(weightKg, heightCm) : null;

  // Weight trend: find min/max for scaling
  const weights = weightRecords.map((r) => r.weight);
  const weightMin = weights.length > 0 ? Math.min(...weights) : 0;
  const weightMax = weights.length > 0 ? Math.max(...weights) : 100;
  const weightRange = weightMax - weightMin || 1;

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Body Data — unified with settingsStore */}
      <Card>
        <Text style={styles.cardTitle}>身体数据</Text>
        <Text style={styles.cardSubtitle}>与首页和个人中心同步</Text>
        <View style={styles.inputRow}>
          <MiniInput label="体重(kg)" value={String(weightKg)} onChange={(v) => settings.updateSettings({ weightKg: parseFloat(v) || 70 })} keyboardType="decimal-pad" />
          <MiniInput
            label="身高(cm)"
            value={String(heightCm)}
            onChange={(v) => settings.updateSettings({ heightCm: parseFloat(v) || 170 })}
            keyboardType="decimal-pad"
          />
          <MiniInput label="颈围(cm)" value={neck} onChange={setNeck} keyboardType="decimal-pad" />
        </View>
        <View style={styles.inputRow}>
          <MiniInput label="腰围(cm)" value={waist} onChange={setWaist} keyboardType="decimal-pad" />
          <MiniInput label="臀围(cm)" value={hip} onChange={setHip} keyboardType="decimal-pad" />
          <View style={styles.miniInput}>
            <Text style={styles.miniLabel}>性别</Text>
            <View style={styles.genderRow}>
              <TouchableOpacity
                style={[styles.genderBtn, gender === 'male' && styles.genderBtnActive]}
                onPress={() => settings.updateSettings({ gender: 'male' })}
              >
                <Text style={[styles.genderText, gender === 'male' && styles.genderTextActive]}>男</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.genderBtn, gender === 'female' && styles.genderBtnActive]}
                onPress={() => settings.updateSettings({ gender: 'female' })}
              >
                <Text style={[styles.genderText, gender === 'female' && styles.genderTextActive]}>女</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Card>

      {/* Calculator Tabs */}
      <View style={styles.tabRow}>
        {([
          { key: 'bmi', label: 'BMI' },
          { key: 'bodyfat', label: '体脂率' },
          { key: 'ideal', label: '理想体重' },
          { key: 'whr', label: '腰臀比' },
        ] as { key: CalcTab; label: string }[]).map((tab) => (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, activeTab === tab.key && styles.tabActive]}
            onPress={() => setActiveTab(tab.key)}
          >
            <Text style={[styles.tabText, activeTab === tab.key && styles.tabTextActive]}>{tab.label}</Text>
          </TouchableOpacity>
        ))}
      </View>

      {activeTab === 'bmi' && <BMICard weightKg={weightKg} heightCm={heightCm} />}

      {activeTab === 'bodyfat' && (
        isVIP ? (
          <BodyFatCard gender={gender} heightCm={heightCm} neckCm={neckNum} waistCm={waistNum} hipCm={hipNum} age={settings.age} bmi={bmiResult?.bmi || 0} />
        ) : <VIPLock />
      )}

      {activeTab === 'ideal' && (
        isVIP ? (
          <Card>
            <Text style={styles.cardTitle}>理想体重</Text>
            {weightKg && heightCm && gender ? (
              <IdealWeightDisplay heightCm={heightCm} gender={gender} currentWeight={weightKg} />
            ) : (
              <Text style={styles.placeholder}>请填写身高、体重和性别</Text>
            )}
          </Card>
        ) : <VIPLock />
      )}

      {activeTab === 'whr' && (
        isVIP ? (
          <Card>
            <Text style={styles.cardTitle}>腰臀比 (WHR)</Text>
            {waistNum > 0 && hipNum > 0 ? (
              <WHRDisplay waistCm={waistNum} hipCm={hipNum} gender={gender} />
            ) : (
              <Text style={styles.placeholder}>请填写腰围和臀围</Text>
            )}
          </Card>
        ) : <VIPLock />
      )}

      {/* Weight History with Trend */}
      <Text style={styles.sectionTitle}>体重记录</Text>
      {weightRecords.length > 0 ? (
        <Card>
          {/* Mini trend chart */}
          <Text style={styles.trendTitle}>近30天趋势</Text>
          <View style={styles.trendChart}>
            {weightRecords
              .slice()
              .reverse()
              .map((rec, i) => {
                const h = Math.max(8, ((rec.weight - weightMin) / weightRange) * 80);
                return (
                  <View key={rec.id} style={styles.trendBarCol}>
                    <Text style={styles.trendBarValue}>{rec.weight}</Text>
                    <View
                      style={[
                        styles.trendBar,
                        {
                          height: h,
                          backgroundColor: i === weightRecords.length - 1 ? Colors.primary : Colors.primary + '40',
                        },
                      ]}
                    />
                    <Text style={styles.trendBarDate}>{rec.date.slice(5)}</Text>
                  </View>
                );
              })}
          </View>

          {/* Weight list */}
          <View style={styles.weightList}>
            {weightRecords.map((rec, i) => {
              const prev = weightRecords[i + 1];
              const diff = prev ? rec.weight - prev.weight : 0;
              return (
                <View key={rec.id} style={styles.weightRecordRow}>
                  <View>
                    <Text style={styles.weightRecordValue}>{rec.weight} kg</Text>
                    <Text style={styles.weightRecordDate}>{rec.date}</Text>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', gap: Spacing.sm }}>
                    {rec.bodyFatPercentage ? (
                      <Text style={styles.weightRecordBf}>体脂 {rec.bodyFatPercentage}%</Text>
                    ) : null}
                    {diff !== 0 && prev && (
                      <Text style={[styles.weightDiff, { color: diff > 0 ? Colors.danger : Colors.success }]}>
                        {diff > 0 ? '+' : ''}{diff.toFixed(1)} kg
                      </Text>
                    )}
                  </View>
                </View>
              );
            })}
          </View>
        </Card>
      ) : (
        <EmptyState
          icon="trending-up"
          title="暂无体重记录"
          description="开始记录体重来追踪身体变化趋势"
          actionLabel="添加体重记录"
          onAction={() => router.push('/(modals)/add-weight')}
        />
      )}
      {weightRecords.length > 0 && (
        <Button title="+ 添加体重记录" onPress={() => router.push('/(modals)/add-weight')} variant="outline" style={{ marginTop: Spacing.md }} />
      )}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

function IdealWeightDisplay({ heightCm, gender, currentWeight }: { heightCm: number; gender: 'male' | 'female'; currentWeight: number }) {
  const { calculateIdealWeight } = require('../../src/utils/calculations');
  const result = calculateIdealWeight(gender, heightCm);

  return (
    <View>
      <View style={iwStyles.currentRow}>
        <Text style={iwStyles.currentLabel}>当前体重</Text>
        <Text style={iwStyles.currentValue}>{currentWeight} kg</Text>
      </View>
      <View style={iwStyles.targetRow}>
        <Text style={iwStyles.targetLabel}>理想体重范围</Text>
        <Text style={iwStyles.targetValue}>{result.average - 3} - {result.average + 3} kg</Text>
      </View>
      <View style={iwStyles.methods}>
        <IWMethod name="Devine" range={result.devine} />
        <IWMethod name="Robinson" range={result.robinson} />
        <IWMethod name="Miller" range={result.miller} />
        <IWMethod name="Hamwi" range={result.hamwi} />
      </View>
    </View>
  );
}

function IWMethod({ name, range }: { name: string; range: { min: number; max: number } }) {
  return (
    <View style={iwStyles.method}>
      <Text style={iwStyles.methodName}>{name}</Text>
      <Text style={iwStyles.methodRange}>{range.min} - {range.max} kg</Text>
    </View>
  );
}

const iwStyles = StyleSheet.create({
  currentRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.sm },
  currentLabel: { fontSize: FontSize.md, color: Colors.textSecondary },
  currentValue: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.primary },
  targetRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.surfaceVariant, borderRadius: BorderRadius.md, padding: Spacing.md, marginBottom: Spacing.md },
  targetLabel: { fontSize: FontSize.sm, color: Colors.textSecondary },
  targetValue: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.success },
  methods: { gap: Spacing.sm },
  method: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  methodName: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  methodRange: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.text },
});

function WHRDisplay({ waistCm, hipCm, gender }: { waistCm: number; hipCm: number; gender: 'male' | 'female' }) {
  const { calculateWHR, getWHRDescription } = require('../../src/utils/calculations');
  const result = calculateWHR(waistCm, hipCm, gender);
  return (
    <View>
      <Text style={[whrStyles.ratio, { color: result.categoryColor }]}>{result.ratio}</Text>
      <View style={[whrStyles.badge, { backgroundColor: result.categoryColor }]}>
        <Text style={whrStyles.badgeText}>{result.category}</Text>
      </View>
      <View style={whrStyles.detailRow}>
        <View style={whrStyles.detailItem}><Text style={whrStyles.detailLabel}>腰围</Text><Text style={whrStyles.detailValue}>{waistCm} cm</Text></View>
        <View style={whrStyles.detailItem}><Text style={whrStyles.detailLabel}>臀围</Text><Text style={whrStyles.detailValue}>{hipCm} cm</Text></View>
      </View>
      <Text style={whrStyles.desc}>{getWHRDescription(result.riskLevel, gender)}</Text>
    </View>
  );
}

const whrStyles = StyleSheet.create({
  ratio: { fontSize: 48, fontWeight: '800', marginBottom: Spacing.sm },
  badge: { alignSelf: 'flex-start', paddingHorizontal: Spacing.md, paddingVertical: Spacing.xs, borderRadius: BorderRadius.full, marginBottom: Spacing.md },
  badgeText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
  detailRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  detailItem: { flex: 1, backgroundColor: Colors.surfaceVariant, borderRadius: BorderRadius.md, padding: Spacing.md },
  detailLabel: { fontSize: FontSize.xs, color: Colors.textTertiary, marginBottom: 2 },
  detailValue: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  desc: { fontSize: FontSize.sm, color: Colors.textSecondary, lineHeight: 20 },
});

function MiniInput({ label, value, onChange, keyboardType }: { label: string; value: string; onChange: (v: string) => void; keyboardType?: 'decimal-pad' }) {
  return (
    <View style={miniStyles.container}>
      <Text style={miniStyles.label}>{label}</Text>
      <TextInput style={miniStyles.input} value={value} onChangeText={onChange} keyboardType={keyboardType || 'decimal-pad'} placeholderTextColor={Colors.textTertiary} />
    </View>
  );
}

const miniStyles = StyleSheet.create({
  container: { flex: 1 },
  label: { fontSize: 11, color: Colors.textTertiary, marginBottom: 2 },
  input: { backgroundColor: Colors.surfaceVariant, borderRadius: BorderRadius.sm, paddingHorizontal: Spacing.sm, paddingVertical: 8, fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  cardTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: 2 },
  cardSubtitle: { fontSize: FontSize.xs, color: Colors.textTertiary, marginBottom: Spacing.md },
  inputRow: { flexDirection: 'row', gap: Spacing.sm, marginBottom: Spacing.sm },
  miniInput: { flex: 1 },
  miniLabel: { fontSize: 11, color: Colors.textTertiary, marginBottom: 2 },
  genderRow: { flexDirection: 'row', gap: 4 },
  genderBtn: { flex: 1, paddingVertical: 8, borderRadius: BorderRadius.sm, backgroundColor: Colors.surfaceVariant, alignItems: 'center' },
  genderBtnActive: { backgroundColor: Colors.primary },
  genderText: { fontSize: 12, fontWeight: '600', color: Colors.textTertiary },
  genderTextActive: { color: '#fff' },
  tabRow: { flexDirection: 'row', backgroundColor: Colors.surfaceVariant, borderRadius: BorderRadius.md, padding: 3, marginTop: Spacing.md, marginBottom: Spacing.md },
  tab: { flex: 1, paddingVertical: Spacing.sm, alignItems: 'center', borderRadius: BorderRadius.sm },
  tabActive: { backgroundColor: Colors.surface, ...Shadow.sm },
  tabText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary },
  tabTextActive: { color: Colors.primary },
  placeholder: { fontSize: FontSize.md, color: Colors.textTertiary, textAlign: 'center', padding: Spacing.md },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginTop: Spacing.lg, marginBottom: Spacing.md },
  trendTitle: { fontSize: FontSize.sm, fontWeight: '700', color: Colors.textSecondary, marginBottom: Spacing.md },
  trendChart: { flexDirection: 'row', alignItems: 'flex-end', gap: 3, height: 120, marginBottom: Spacing.md, paddingBottom: 16, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  trendBarCol: { flex: 1, alignItems: 'center', justifyContent: 'flex-end' },
  trendBarValue: { fontSize: 9, color: Colors.textSecondary, marginBottom: 2 },
  trendBar: { width: '100%', maxWidth: 20, borderRadius: 3, minHeight: 4 },
  trendBarDate: { fontSize: 8, color: Colors.textTertiary, marginTop: 4, transform: [{ rotate: '-45deg' }] as any },
  weightList: { gap: Spacing.sm },
  weightRecordRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: Spacing.sm, borderBottomWidth: 1, borderBottomColor: Colors.divider },
  weightRecordValue: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  weightRecordDate: { fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: 2 },
  weightRecordBf: { fontSize: FontSize.sm, color: Colors.textSecondary, fontWeight: '600' },
  weightDiff: { fontSize: FontSize.xs, fontWeight: '700' },
});
