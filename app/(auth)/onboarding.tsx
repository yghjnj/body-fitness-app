import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/config/theme';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { SegmentedControl } from '../../src/components/ui/SegmentedControl';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { ACTIVITY_LEVEL_OPTIONS } from '../../src/utils/constants';

export default function OnboardingScreen() {
  const router = useRouter();
  const { updateSettings } = useSettingsStore();

  const [step, setStep] = useState(0);
  const [gender, setGender] = useState<'male' | 'female'>('male');
  const [age, setAge] = useState('25');
  const [height, setHeight] = useState('170');
  const [weight, setWeight] = useState('70');
  const [goalType, setGoalType] = useState('maintenance');
  const [activityLevel, setActivityLevel] = useState('moderate');

  const handleFinish = () => {
    updateSettings({
      gender,
      age: parseInt(age) || 25,
      heightCm: parseFloat(height) || 170,
      calorieTarget: goalType === 'weight_loss' ? 1600 : goalType === 'muscle_gain' ? 2800 : 2000,
      proteinTarget: goalType === 'weight_loss' ? 130 : goalType === 'muscle_gain' ? 140 : 115,
      carbsTarget: goalType === 'weight_loss' ? 160 : goalType === 'muscle_gain' ? 300 : 230,
      fatTarget: goalType === 'weight_loss' ? 55 : goalType === 'muscle_gain' ? 65 : 60,
    });
    router.replace('/(tabs)');
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.step}>{step + 1} / 4</Text>

      {step === 0 && (
        <View style={styles.stepContent}>
          <Text style={styles.title}>你的性别？</Text>
          <Text style={styles.desc}>用于精确计算身体指标</Text>
          <View style={styles.genderRow}>
            <Button
              title="男"
              onPress={() => setGender('male')}
              variant={gender === 'male' ? 'primary' : 'outline'}
              style={styles.genderBtn}
            />
            <Button
              title="女"
              onPress={() => setGender('female')}
              variant={gender === 'female' ? 'primary' : 'outline'}
              style={styles.genderBtn}
            />
          </View>
        </View>
      )}

      {step === 1 && (
        <View style={styles.stepContent}>
          <Text style={styles.title}>你的基本信息？</Text>
          <Text style={styles.desc}>用于精确计算</Text>
          <Input label="年龄" value={age} onChangeText={setAge} keyboardType="number-pad" suffix="岁" />
          <Input label="身高" value={height} onChangeText={setHeight} keyboardType="decimal-pad" suffix="cm" />
          <Input label="当前体重" value={weight} onChangeText={setWeight} keyboardType="decimal-pad" suffix="kg" />
        </View>
      )}

      {step === 2 && (
        <View style={styles.stepContent}>
          <Text style={styles.title}>你的目标？</Text>
          <SegmentedControl
            options={[
              { label: '减脂', value: 'weight_loss' },
              { label: '增肌', value: 'muscle_gain' },
              { label: '维持', value: 'maintenance' },
            ]}
            value={goalType}
            onChange={setGoalType}
          />
        </View>
      )}

      {step === 3 && (
        <View style={styles.stepContent}>
          <Text style={styles.title}>你的运动量？</Text>
          <View style={styles.activityList}>
            {ACTIVITY_LEVEL_OPTIONS.map((opt) => (
              <Button
                key={opt.value}
                title={opt.label}
                onPress={() => setActivityLevel(opt.value)}
                variant={activityLevel === opt.value ? 'primary' : 'outline'}
                style={{ marginBottom: Spacing.sm }}
              />
            ))}
          </View>
        </View>
      )}

      <View style={styles.buttons}>
        {step > 0 && (
          <Button
            title="上一步"
            onPress={() => setStep(step - 1)}
            variant="ghost"
            style={{ flex: 1 }}
          />
        )}
        <Button
          title={step < 3 ? '下一步' : '开始使用'}
          onPress={step < 3 ? () => setStep(step + 1) : handleFinish}
          style={{ flex: 1 }}
        />
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flexGrow: 1, padding: Spacing.xl, paddingTop: Spacing.xxl },
  step: {
    fontSize: FontSize.sm,
    color: Colors.textTertiary,
    marginBottom: Spacing.xl,
    textAlign: 'center',
  },
  stepContent: { flex: 1 },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
    marginBottom: Spacing.sm,
  },
  desc: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginBottom: Spacing.xl,
  },
  genderRow: {
    flexDirection: 'row',
    gap: Spacing.md,
  },
  genderBtn: { flex: 1, paddingVertical: 24 },
  activityList: { gap: Spacing.xs },
  buttons: {
    flexDirection: 'row',
    gap: Spacing.md,
    paddingTop: Spacing.xl,
  },
});
