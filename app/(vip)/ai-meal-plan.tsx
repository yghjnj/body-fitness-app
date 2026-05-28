import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/config/theme';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';

export default function AIMealPlanScreen() {
  return (
    <View style={styles.container}>
      <Card>
        <View style={styles.placeholder}>
          <Ionicons name="restaurant" size={64} color={Colors.vipGold} />
          <Text style={styles.title}>AI 饮食方案</Text>
          <Text style={styles.desc}>
            基于您的身体数据和目标，AI 将为您生成一周的完整饮食方案，{'\n'}
            包括每日三餐+加餐的详细食谱。
          </Text>
          <Button title="生成一周饮食方案" onPress={() => {}} size="lg" />
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.md },
  placeholder: { alignItems: 'center', padding: Spacing.xl, gap: Spacing.md },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.text },
  desc: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 24,
  },
});
