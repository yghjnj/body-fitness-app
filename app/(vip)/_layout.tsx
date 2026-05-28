import React from 'react';
import { Stack, useRouter } from 'expo-router';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/config/theme';
import { Button } from '../../src/components/ui/Button';
import { useSubscriptionStore } from '../../src/stores/subscriptionStore';

function VIPGuard({ children }: { children: React.ReactNode }) {
  const { isVIP } = useSubscriptionStore();
  const router = useRouter();

  if (!isVIP) {
    return (
      <View style={guardStyles.container}>
        <Ionicons name="diamond" size={64} color={Colors.vipGold} />
        <Text style={guardStyles.title}>VIP 专属功能</Text>
        <Text style={guardStyles.desc}>升级 VIP 解锁 AI 饮食建议、训练计划等功能</Text>
        <Button title="升级 VIP" onPress={() => router.push('/(modals)/paywall')} size="lg" />
        <Button title="返回" onPress={() => router.back()} variant="ghost" />
      </View>
    );
  }

  return <>{children}</>;
}

const guardStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.background,
    gap: Spacing.md,
  },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.text },
  desc: { fontSize: FontSize.md, color: Colors.textSecondary, textAlign: 'center', lineHeight: 22 },
});

export default function VIPLayout() {
  return (
    <VIPGuard>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen name="ai-diet" options={{ title: 'AI 饮食建议' }} />
        <Stack.Screen name="ai-training" options={{ title: 'AI 训练计划' }} />
        <Stack.Screen name="ai-meal-plan" options={{ title: 'AI 饮食方案' }} />
        <Stack.Screen name="advanced-analytics" options={{ title: '高级分析' }} />
      </Stack>
    </VIPGuard>
  );
}
