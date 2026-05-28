import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/config/theme';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { Input } from '../../src/components/ui/Input';
import { addWorkout } from '../../src/services/database/repositories/workoutRepo';
import { getTodayStr } from '../../src/utils/formatting';
import type { ExerciseSet } from '../../src/types/models';

interface Exercise {
  id: string;
  name: string;
  sets: string;
  reps: string;
  weight: string;
}

export default function AddWorkoutScreen() {
  const router = useRouter();
  const [workoutName, setWorkoutName] = useState('');
  const [duration, setDuration] = useState('45');
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: '1', name: '', sets: '3', reps: '12', weight: '' },
  ]);
  const [saving, setSaving] = useState(false);

  const addExercise = () => {
    setExercises([...exercises, { id: String(Date.now()), name: '', sets: '3', reps: '12', weight: '' }]);
  };

  const removeExercise = (id: string) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter((e) => e.id !== id));
    }
  };

  const updateExercise = (id: string, field: keyof Exercise, value: string) => {
    setExercises(exercises.map((e) => (e.id === id ? { ...e, [field]: value } : e)));
  };

  const handleSave = async () => {
    if (!workoutName.trim()) return;
    setSaving(true);
    const exSets: Omit<ExerciseSet, 'id' | 'workoutId' | 'createdAt' | 'synced'>[] = exercises
      .filter((e) => e.name.trim())
      .map((e, i) => ({
        exerciseName: e.name.trim(),
        exerciseCategory: 'strength' as const,
        sets: parseInt(e.sets) || 0,
        reps: parseInt(e.reps) || 0,
        weightKg: parseFloat(e.weight) || undefined,
        orderIndex: i,
      }));
    await addWorkout(
      {
        userId: 'local-user',
        name: workoutName.trim(),
        date: getTodayStr(),
        durationMinutes: parseInt(duration) || 0,
        isAiGenerated: 0,
        source: 'manual',
      },
      exSets
    );
    setSaving(false);
    router.back();
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Input label="训练名称" placeholder="例：胸部训练" value={workoutName} onChangeText={setWorkoutName} />
      <Input label="时长(分钟)" value={duration} onChangeText={setDuration} keyboardType="number-pad" />

      <Text style={styles.sectionTitle}>训练动作</Text>
      {exercises.map((ex, i) => (
        <Card key={ex.id} style={{ marginBottom: Spacing.md }}>
          <View style={styles.exHeader}>
            <Text style={styles.exNumber}>动作 {i + 1}</Text>
            {exercises.length > 1 && (
              <TouchableOpacity onPress={() => removeExercise(ex.id)}>
                <Ionicons name="close-circle" size={22} color={Colors.danger} />
              </TouchableOpacity>
            )}
          </View>
          <Input placeholder="动作名称（例：卧推）" value={ex.name} onChangeText={(v) => updateExercise(ex.id, 'name', v)} />
          <View style={styles.exGrid}>
            <MiniField label="组数" value={ex.sets} onChange={(v) => updateExercise(ex.id, 'sets', v)} />
            <MiniField label="次数" value={ex.reps} onChange={(v) => updateExercise(ex.id, 'reps', v)} />
            <MiniField label="重量(kg)" value={ex.weight} onChange={(v) => updateExercise(ex.id, 'weight', v)} />
          </View>
        </Card>
      ))}

      <Button title="+ 添加动作" onPress={addExercise} variant="outline" />
      <Button title="保存训练" onPress={handleSave} loading={saving} size="lg" style={{ marginTop: Spacing.md }} />
    </ScrollView>
  );
}

function MiniField({ label, value, onChange }: { label: string; value: string; onChange: (v: string) => void }) {
  return (
    <View style={mfStyles.container}>
      <Text style={mfStyles.label}>{label}</Text>
      <TextInput
        style={mfStyles.input}
        value={value}
        onChangeText={onChange}
        keyboardType="decimal-pad"
        placeholderTextColor={Colors.textTertiary}
      />
    </View>
  );
}

const mfStyles = StyleSheet.create({
  container: { flex: 1 },
  label: { fontSize: 11, color: Colors.textTertiary, marginBottom: 2 },
  input: { backgroundColor: Colors.surfaceVariant, borderRadius: BorderRadius.sm, paddingHorizontal: Spacing.sm, paddingVertical: 8, fontSize: FontSize.sm, fontWeight: '600', color: Colors.text },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  sectionTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginTop: Spacing.md, marginBottom: Spacing.md },
  exHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: Spacing.md },
  exNumber: { fontSize: FontSize.md, fontWeight: '700', color: Colors.primary },
  exGrid: { flexDirection: 'row', gap: Spacing.sm },
});
