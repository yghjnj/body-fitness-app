import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import Toast from 'react-native-toast-message';
import { Colors, Spacing } from '../../src/config/theme';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { Input } from '../../src/components/ui/Input';
import { addWeight } from '../../src/services/database/repositories/weightRepo';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { getTodayStr } from '../../src/utils/formatting';

export default function AddWeightScreen() {
  const router = useRouter();
  const settings = useSettingsStore();
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const weightNum = parseFloat(weight);
    if (!weightNum || weightNum <= 0) return;

    setSaving(true);
    try {
      await addWeight({
        userId: 'local-user',
        weight: weightNum,
        bodyFatPercentage: parseFloat(bodyFat) || undefined,
        source: 'manual',
        date: getTodayStr(),
      });
      // Sync to settingsStore so all screens see the update immediately
      settings.updateSettings({ weightKg: weightNum });
      Toast.show({ type: 'success', text1: '已记录', text2: `体重 ${weightNum}kg`, visibilityTime: 1500 });
      router.back();
    } catch (e: any) {
      Toast.show({ type: 'error', text1: '保存失败', text2: e?.message || '请重试' });
    } finally {
      setSaving(false);
    }
  };

  return (
    <View style={styles.container}>
      <Card>
        <Input label="体重 (kg)" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" placeholder="70.0" />
        <Input label="体脂率 % (可选)" value={bodyFat} onChangeText={setBodyFat} keyboardType="decimal-pad" placeholder="20" />
      </Card>
      <Button title="保存记录" onPress={handleSave} loading={saving} size="lg" style={{ marginTop: Spacing.lg }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.md },
});
