import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../config/theme';
import { useSubscriptionStore } from '../../stores/subscriptionStore';
import type { FeatureKey } from '../../config/features';
import { FEATURE_REQUIREMENTS } from '../../config/features';

interface FeatureGateProps {
  feature: FeatureKey;
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

export function FeatureGate({ feature, children, fallback }: FeatureGateProps) {
  const { isVIP } = useSubscriptionStore();
  const required = FEATURE_REQUIREMENTS[feature];

  if (required === 'free' || isVIP) {
    return <>{children}</>;
  }

  if (fallback) {
    return <>{fallback}</>;
  }

  return <VIPLock />;
}

export function VIPLock() {
  const router = useRouter();
  return (
    <View style={styles.lock}>
      <Ionicons name="lock-closed" size={32} color={Colors.vipGold} />
      <Text style={styles.lockTitle}>VIP 专属功能</Text>
      <Text style={styles.lockDesc}>升级 VIP 解锁此功能</Text>
      <TouchableOpacity style={styles.lockBtn} onPress={() => router.push('/(modals)/paywall')}>
        <Text style={styles.lockBtnText}>立即升级</Text>
      </TouchableOpacity>
    </View>
  );
}

export function VIPBanner({ message }: { message?: string }) {
  const { isVIP } = useSubscriptionStore();
  const router = useRouter();
  if (isVIP) return null;

  return (
    <TouchableOpacity style={styles.banner} onPress={() => router.push('/(modals)/paywall')} activeOpacity={0.9}>
      <View style={styles.bannerLeft}>
        <Ionicons name="diamond" size={22} color={Colors.vipGold} />
        <View style={{ flex: 1 }}>
          <Text style={styles.bannerTitle}>{message || '升级 VIP，解锁全部功能'}</Text>
          <Text style={styles.bannerSub}>¥30/月 · 无广告 · AI 饮食训练 · 无限记录</Text>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={18} color={Colors.vipGold} />
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  lock: {
    alignItems: 'center',
    padding: Spacing.xl,
    backgroundColor: Colors.vipGold + '08',
    borderRadius: BorderRadius.lg,
    borderWidth: 1,
    borderColor: Colors.vipGold + '30',
    borderStyle: 'dashed',
    gap: Spacing.sm,
  },
  lockTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  lockDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.md },
  lockBtn: { backgroundColor: Colors.vipGold, paddingHorizontal: Spacing.xl, paddingVertical: 10, borderRadius: BorderRadius.full },
  lockBtnText: { color: '#fff', fontWeight: '700', fontSize: FontSize.md },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.vipGold + '10',
    borderRadius: BorderRadius.lg,
    padding: Spacing.md,
    marginBottom: Spacing.md,
    borderWidth: 1,
    borderColor: Colors.vipGold + '30',
  },
  bannerLeft: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md, flex: 1 },
  bannerTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  bannerSub: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
});
