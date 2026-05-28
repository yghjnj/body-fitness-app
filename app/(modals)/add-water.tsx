import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/config/theme';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { addWater } from '../../src/services/database/repositories/waterRepo';
import { getTodayStr, getNowTimeStr } from '../../src/utils/formatting';

const QUICK_AMOUNTS = [100, 150, 200, 250, 300, 400, 500];

export default function AddWaterScreen() {
  const router = useRouter();
  const [amount, setAmount] = useState(250);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    await addWater({
      userId: 'local-user',
      amountMl: amount,
      date: getTodayStr(),
      time: getNowTimeStr(),
    });
    setSaving(false);
    router.back();
  };

  return (
    <View style={styles.container}>
      <Card>
        <Text style={styles.currentAmount}>{amount} ml</Text>
        <Text style={styles.label}>选择饮水量</Text>
        <View style={styles.quickRow}>
          {QUICK_AMOUNTS.map((a) => (
            <TouchableOpacity
              key={a}
              style={[styles.amountBtn, amount === a && styles.amountBtnActive]}
              onPress={() => setAmount(a)}
            >
              <Text style={[styles.amountText, amount === a && styles.amountTextActive]}>{a}</Text>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.customRow}>
          <TouchableOpacity style={styles.adjustBtn} onPress={() => setAmount(Math.max(50, amount - 50))}>
            <Ionicons name="remove" size={24} color={Colors.primary} />
          </TouchableOpacity>
          <Text style={styles.customAmount}>{amount} ml</Text>
          <TouchableOpacity style={styles.adjustBtn} onPress={() => setAmount(amount + 50)}>
            <Ionicons name="add" size={24} color={Colors.primary} />
          </TouchableOpacity>
        </View>
      </Card>
      <Button title="保存记录" onPress={handleSave} loading={saving} size="lg" style={{ marginTop: Spacing.lg }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.md },
  currentAmount: { fontSize: 56, fontWeight: '800', color: '#3B82F6', textAlign: 'center', marginBottom: Spacing.xs },
  label: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', marginBottom: Spacing.lg },
  quickRow: { flexDirection: 'row', flexWrap: 'wrap', gap: Spacing.sm, justifyContent: 'center', marginBottom: Spacing.lg },
  amountBtn: { paddingHorizontal: Spacing.md, paddingVertical: Spacing.sm, borderRadius: BorderRadius.md, backgroundColor: Colors.surfaceVariant },
  amountBtnActive: { backgroundColor: '#3B82F6' },
  amountText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textSecondary },
  amountTextActive: { color: '#fff' },
  customRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.lg },
  adjustBtn: { width: 48, height: 48, borderRadius: 24, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  customAmount: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text, minWidth: 80, textAlign: 'center' },
});
