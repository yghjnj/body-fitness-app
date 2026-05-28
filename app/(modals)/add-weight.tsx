import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing } from '../../src/config/theme';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { Input } from '../../src/components/ui/Input';
import { addWeight } from '../../src/services/database/repositories/weightRepo';
import { getTodayStr } from '../../src/utils/formatting';

export default function AddWeightScreen() {
  const router = useRouter();
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    const weightNum = parseFloat(weight);
    if (!weightNum || weightNum <= 0) return;

    setSaving(true);
    await addWeight({
      userId: 'local-user',
      weight: weightNum,
      bodyFatPercentage: parseFloat(bodyFat) || undefined,
      source: 'manual',
      date: getTodayStr(),
    });
    setSaving(false);
    router.back();
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
