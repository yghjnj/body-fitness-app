import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/config/theme';
import { Button } from '../../src/components/ui/Button';
import { useSubscriptionStore } from '../../src/stores/subscriptionStore';

type PlanType = 'monthly' | 'yearly' | 'lifetime';

interface Plan {
  type: PlanType;
  name: string;
  price: number;
  perMonth?: number;
  saving?: string;
  bestValue?: boolean;
}

const PLANS: Plan[] = [
  { type: 'yearly', name: '年度会员', price: 350, perMonth: 29, saving: '省 ¥10', bestValue: true },
  { type: 'monthly', name: '月度会员', price: 30 },
  { type: 'lifetime', name: '永久买断', price: 998 },
];

const FEATURES = [
  { icon: 'bulb' as const, title: 'AI 饮食建议', desc: 'AI 生成个性化饮食方案' },
  { icon: 'barbell' as const, title: 'AI 训练计划', desc: '四周渐进超负荷训练方案' },
  { icon: 'analytics' as const, title: '高级分析', desc: '完整历史数据趋势分析和预测' },
  { icon: 'download' as const, title: '数据导出', desc: '导出 CSV/PDF 格式健康报告' },
  { icon: 'close-circle' as const, title: '无广告体验', desc: '纯净使用体验，无广告打扰' },
];

export default function PaywallScreen() {
  const router = useRouter();
  const { activateVIP } = useSubscriptionStore();
  const [selectedPlan, setSelectedPlan] = useState<PlanType>('yearly');
  const [showPayment, setShowPayment] = useState(false);

  const selected = PLANS.find((p) => p.type === selectedPlan)!;

  const handleProceed = () => {
    setShowPayment(true);
  };

  const handlePaid = () => {
    activateVIP(selectedPlan);
    alert('VIP 已激活！感谢购买。');
    router.back();
  };

  if (showPayment) {
    return (
      <ScrollView style={s.container} contentContainerStyle={s.paymentContent}>
        <Text style={s.payTitle}>扫码支付</Text>
        <Text style={s.payAmount}>¥{selected.price} · {selected.name}</Text>

        <View style={s.qrPlaceholder}>
          <Ionicons name="qr-code" size={120} color={Colors.primary} />
          <Text style={s.qrLabel}>请在此处放置你的微信/支付宝收款码</Text>
          <Text style={s.qrHint}>打开 微信 → 我 → 服务 → 收付款 → 收款码 → 截图</Text>
          <Text style={s.qrHint}>将该截图替换到: assets/pay-qr.png</Text>
        </View>

        <Text style={s.payNote}>支付完成后，点击下方按钮开通 VIP</Text>
        <Button title="我已完成支付，开通 VIP" onPress={handlePaid} size="lg" />
        <Button title="返回选择套餐" onPress={() => setShowPayment(false)} variant="ghost" size="sm" style={{ marginTop: Spacing.md }} />
      </ScrollView>
    );
  }

  return (
    <ScrollView style={s.container} contentContainerStyle={s.content}>
      <View style={s.header}>
        <Ionicons name="diamond" size={48} color={Colors.vipGold} />
        <Text style={s.title}>升级 FitBody VIP</Text>
        <Text style={s.subtitle}>解锁全部功能，科学管理身材</Text>
      </View>

      {PLANS.map((plan) => {
        const isSelected = selectedPlan === plan.type;
        return (
          <TouchableOpacity key={plan.type} onPress={() => setSelectedPlan(plan.type)} activeOpacity={0.8}>
            <View style={[s.planCard, isSelected && s.planCardSelected, plan.bestValue && !isSelected && s.planCardBest]}>
              {plan.bestValue && <View style={s.bestBadge}><Text style={s.bestBadgeText}>最划算</Text></View>}
              <View style={s.planRow}>
                <View style={{ flex: 1 }}>
                  <Text style={s.planName}>{plan.name}</Text>
                  {plan.perMonth && <Text style={s.planPerMonth}>折合 ¥{plan.perMonth}/月</Text>}
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[s.planPrice, isSelected && { color: Colors.primary }]}>¥{plan.price}</Text>
                  {plan.saving && <Text style={s.planSaving}>{plan.saving}</Text>}
                </View>
              </View>
              {isSelected && <View style={s.selectedMark}><Ionicons name="checkmark-circle" size={20} color={Colors.primary} /></View>}
            </View>
          </TouchableOpacity>
        );
      })}

      <Text style={s.featureTitle}>VIP 专属功能</Text>
      {FEATURES.map((f, i) => (
        <View key={i} style={s.featureRow}>
          <View style={s.featureIcon}><Ionicons name={f.icon} size={22} color={Colors.vipGold} /></View>
          <View style={s.featureText}>
            <Text style={s.featureName}>{f.title}</Text>
            <Text style={s.featureDesc}>{f.desc}</Text>
          </View>
        </View>
      ))}

      <View style={s.buttons}>
        <Button title={`立即开通 - ¥${selected.price}`} onPress={handleProceed} size="lg" />
        <Button title="恢复购买" onPress={() => alert('如需恢复购买，请发送邮件到 support@fitbody.app')} variant="ghost" size="sm" />
      </View>

      <Text style={s.disclaimer}>
        支付后 VIP 即时开通。如需退款请在 24 小时内联系客服。
      </Text>
    </ScrollView>
  );
}

const s = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md, paddingBottom: Spacing.xxl },
  paymentContent: { padding: Spacing.xl, alignItems: 'center', paddingBottom: Spacing.xxl },
  header: { alignItems: 'center', marginBottom: Spacing.lg, marginTop: Spacing.lg },
  title: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.text, marginTop: Spacing.md },
  subtitle: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: Spacing.xs },
  planCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, marginBottom: Spacing.md, borderWidth: 2, borderColor: Colors.border, position: 'relative' },
  planCardSelected: { borderColor: Colors.primary, backgroundColor: Colors.primary + '06' },
  planCardBest: { borderColor: Colors.vipGold },
  bestBadge: { position: 'absolute', top: -10, right: Spacing.lg, backgroundColor: Colors.vipGold, paddingHorizontal: Spacing.md, paddingVertical: 2, borderRadius: BorderRadius.full },
  bestBadgeText: { color: '#fff', fontSize: 11, fontWeight: '700' },
  planRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingRight: 30 },
  planName: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  planPerMonth: { fontSize: FontSize.sm, color: Colors.textSecondary },
  planPrice: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.text },
  planSaving: { fontSize: FontSize.xs, color: Colors.success, fontWeight: '600', marginTop: 2 },
  selectedMark: { position: 'absolute', top: Spacing.lg, right: Spacing.lg },
  payTitle: { fontSize: FontSize.xxl, fontWeight: '800', color: Colors.text, marginBottom: Spacing.sm },
  payAmount: { fontSize: FontSize.lg, color: Colors.primary, fontWeight: '700', marginBottom: Spacing.xl },
  qrPlaceholder: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, borderWidth: 2, borderColor: Colors.border, borderStyle: 'dashed', padding: Spacing.xl, alignItems: 'center', width: '100%', marginBottom: Spacing.xl },
  qrLabel: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textSecondary, marginTop: Spacing.lg, textAlign: 'center' },
  qrHint: { fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: Spacing.sm, textAlign: 'center', lineHeight: 18 },
  payNote: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.lg },
  featureTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md, marginTop: Spacing.md },
  featureRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.md },
  featureIcon: { width: 44, height: 44, borderRadius: BorderRadius.md, backgroundColor: Colors.vipGold + '15', alignItems: 'center', justifyContent: 'center' },
  featureText: { flex: 1 },
  featureName: { fontSize: FontSize.md, fontWeight: '600', color: Colors.text },
  featureDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: 2, lineHeight: 18 },
  buttons: { marginTop: Spacing.md, gap: Spacing.md, alignItems: 'center' },
  disclaimer: { fontSize: 11, color: Colors.textTertiary, textAlign: 'center', marginTop: Spacing.lg, lineHeight: 18 },
});
