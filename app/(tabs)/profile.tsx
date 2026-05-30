import React, { useState } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, Modal, TextInput, Switch } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/config/theme';
import { Card } from '../../src/components/ui/Card';
import { Button } from '../../src/components/ui/Button';
import { useSettingsStore } from '../../src/stores/settingsStore';
import { useSubscriptionStore } from '../../src/stores/subscriptionStore';
import { useAuthStore } from '../../src/stores/authStore';
import { logoutUser } from '../../src/services/firebase/auth';

const DEV_PASSWORD = process.env.EXPO_PUBLIC_DEV_MASTER_KEY || 'not-set';

export default function ProfileScreen() {
  const router = useRouter();
  const settings = useSettingsStore();
  const { isVIP, isDeveloper, setDeveloper } = useSubscriptionStore();
  const { user, isAuthenticated, logout } = useAuthStore();

  // Edit modal state
  const [editModal, setEditModal] = useState<{
    key: string;
    label: string;
    value: string;
    unit: string;
  } | null>(null);
  const [editValue, setEditValue] = useState('');

  // Developer password modal
  const [showDevPassword, setShowDevPassword] = useState(false);
  const [devPasswordInput, setDevPasswordInput] = useState('');
  const [devPasswordError, setDevPasswordError] = useState('');

  const handleDevToggle = (v: boolean) => {
    if (v) {
      // Turning ON — require password
      setShowDevPassword(true);
      setDevPasswordInput('');
      setDevPasswordError('');
    } else {
      // Turning OFF — no password needed
      setDeveloper(false);
    }
  };

  const confirmDevPassword = () => {
    if (devPasswordInput === DEV_PASSWORD) {
      setDeveloper(true);
      setShowDevPassword(false);
      setDevPasswordError('');
    } else {
      setDevPasswordError('密码错误');
    }
  };

  // Hidden dev entry: tap version text 7 times to open password dialog
  const [devTapCount, setDevTapCount] = useState(0);
  const handleVersionTap = () => {
    const next = devTapCount + 1;
    setDevTapCount(next);
    if (next >= 7) {
      setDevTapCount(0);
      if (!isDeveloper) {
        setShowDevPassword(true);
        setDevPasswordInput('');
        setDevPasswordError('');
      }
    }
    // Reset counter after 2 seconds of inactivity
    setTimeout(() => setDevTapCount(0), 2000);
  };

  const openEdit = (key: string, label: string, value: string, unit: string) => {
    setEditModal({ key, label, value, unit });
    setEditValue(value);
  };

  const saveEdit = () => {
    if (!editModal) return;
    const numVal = parseFloat(editValue);
    if (isNaN(numVal)) return;

    const updates: Record<string, any> = {};
    switch (editModal.key) {
      case 'age': updates.age = Math.round(numVal); break;
      case 'height': updates.heightCm = numVal; break;
      case 'gender': updates.gender = editValue as 'male' | 'female'; break;
      case 'weightUnit': updates.weightUnit = editValue as 'kg' | 'lbs'; break;
      case 'waterGoal': updates.waterGoalMl = Math.round(numVal); break;
      case 'calorieTarget': updates.calorieTarget = Math.round(numVal); break;
      case 'proteinTarget': updates.proteinTarget = Math.round(numVal); break;
      case 'carbsTarget': updates.carbsTarget = Math.round(numVal); break;
      case 'fatTarget': updates.fatTarget = Math.round(numVal); break;
    }
    settings.updateSettings(updates);
    setEditModal(null);
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* User Header */}
      <Card>
        {isAuthenticated && user ? (
          <View style={styles.userRow}>
            <View style={styles.avatar}>
              <Ionicons name="person" size={36} color={Colors.primary} />
            </View>
            <View style={styles.userInfo}>
              <Text style={styles.userName}>{user.displayName || 'FitBody 用户'}</Text>
              <Text style={styles.userEmail}>{user.email}</Text>
              {isVIP && (
                <View style={styles.vipBadge}>
                  <Ionicons name="diamond" size={14} color={Colors.vipGold} />
                  <Text style={styles.vipText}>VIP 会员</Text>
                </View>
              )}
            </View>
          </View>
        ) : (
          <View>
            <Text style={styles.notLoggedInTitle}>未登录</Text>
            <Text style={styles.notLoggedInDesc}>登录后享受云端同步和VIP功能</Text>
            <View style={styles.loginActions}>
              <Button title="手机登录" onPress={() => router.push('/(auth)/login?mode=phone')} variant="primary" size="sm" icon={<Ionicons name="phone-portrait" size={16} color="#fff" />} />
              <Button title="微信登录" onPress={() => router.push('/(auth)/login?mode=wechat')} variant="outline" size="sm" icon={<Ionicons name="logo-wechat" size={16} color={Colors.primary} />} />
              <Button title="邮箱登录" onPress={() => router.push('/(auth)/login')} variant="ghost" size="sm" />
            </View>
          </View>
        )}
      </Card>

      {/* Subscription */}
      {!isVIP && (
        <Card style={{ marginTop: Spacing.md }}>
          <View style={styles.upgradeRow}>
            <Ionicons name="diamond" size={28} color={Colors.vipGold} />
            <View style={{ flex: 1 }}>
              <Text style={styles.upgradeTitle}>升级 VIP</Text>
              <Text style={styles.upgradeDesc}>解锁 AI 饮食训练、无广告、高级分析</Text>
            </View>
            <Button title="升级" onPress={() => router.push('/(modals)/paywall')} size="sm" variant="secondary" />
          </View>
        </Card>
      )}

      {/* Body Settings - now editable */}
      <Text style={styles.sectionTitle}>身体数据</Text>
      <Card>
        <SettingsRow label="性别" value={settings.gender === 'male' ? '男' : '女'} icon="person"
          onPress={() => openEdit('gender', '性别', settings.gender, '')} />
        <SettingsRow label="年龄" value={`${settings.age} 岁`} icon="calendar"
          onPress={() => openEdit('age', '年龄', String(settings.age), '岁')} />
        <SettingsRow label="身高" value={`${settings.heightCm} cm`} icon="resize"
          onPress={() => openEdit('height', '身高', String(settings.heightCm), 'cm')} />
        <SettingsRow label="体重单位" value={settings.weightUnit === 'kg' ? 'kg' : 'lbs'} icon="scale"
          onPress={() => openEdit('weightUnit', '体重单位', settings.weightUnit, '')} />
      </Card>

      {/* Daily Goals - now editable */}
      <Text style={styles.sectionTitle}>每日目标</Text>
      <Card>
        <SettingsRow label="饮水目标" value={`${settings.waterGoalMl} ml`} icon="water"
          onPress={() => openEdit('waterGoal', '饮水目标', String(settings.waterGoalMl), 'ml')} />
        <SettingsRow label="热量目标" value={`${settings.calorieTarget} kcal`} icon="flame"
          onPress={() => openEdit('calorieTarget', '热量目标', String(settings.calorieTarget), 'kcal')} />
        <SettingsRow label="蛋白质" value={`${settings.proteinTarget}g`} icon="nutrition"
          onPress={() => openEdit('proteinTarget', '蛋白质目标', String(settings.proteinTarget), 'g')} />
        <SettingsRow label="碳水" value={`${settings.carbsTarget}g`} icon="nutrition"
          onPress={() => openEdit('carbsTarget', '碳水目标', String(settings.carbsTarget), 'g')} />
        <SettingsRow label="脂肪" value={`${settings.fatTarget}g`} icon="nutrition"
          onPress={() => openEdit('fatTarget', '脂肪目标', String(settings.fatTarget), 'g')} />
      </Card>

      {/* Developer Mode */}
      <Text style={styles.sectionTitle}>开发者模式</Text>
      <Card>
        <View style={styles.devRow}>
          <View style={{ flex: 1 }}>
            <Text style={styles.devTitle}>永久 VIP 权限</Text>
            <Text style={styles.devDesc}>开启后免费使用全部功能，无需付费</Text>
          </View>
          <Switch
            value={isDeveloper}
            onValueChange={handleDevToggle}
            trackColor={{ false: Colors.border, true: Colors.primary }}
            thumbColor="#fff"
          />
        </View>
      </Card>

      {/* Menu */}
      <Text style={styles.sectionTitle}>设置</Text>
      <Card>
        <MenuRow icon="cloud-upload" label="数据同步" />
        <MenuRow icon="download" label="导出数据" isVIP />
        <MenuRow icon="notifications" label="通知设置" />
        <MenuRow icon="shield-checkmark" label="隐私政策" />
        <MenuRow icon="document-text" label="用户协议" />
        <MenuRow icon="star" label="给我们评分" />
        <MenuRow icon="share-social" label="分享给朋友" />
      </Card>

      {/* Logout or Login buttons */}
      {isAuthenticated ? (
        <View style={styles.logoutRow}>
          <Button title="退出登录" onPress={async () => { await logoutUser(); logout(); router.replace('/(auth)/login'); }} variant="outline" style={{ borderColor: Colors.danger }} textStyle={{ color: Colors.danger }} />
        </View>
      ) : (
        <View style={styles.logoutRow}>
          <Button title="立即登录" onPress={() => router.push('/(auth)/login')} variant="primary" size="lg" />
        </View>
      )}

      {/* Developer Password Modal */}
      <Modal visible={showDevPassword} transparent animationType="fade">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.card}>
            <Ionicons name="key" size={40} color={Colors.primary} style={{ textAlign: 'center', marginBottom: Spacing.md }} />
            <Text style={modalStyles.title}>开发者验证</Text>
            <Text style={[modalStyles.desc, { textAlign: 'center', marginBottom: Spacing.md }]}>
              请输入开发者密码以开启永久 VIP 权限
            </Text>
            <View style={{ marginBottom: Spacing.lg }}>
              <TextInput
                style={{
                  fontSize: 24,
                  fontWeight: '700',
                  color: Colors.primary,
                  borderBottomWidth: 2,
                  borderBottomColor: Colors.primary,
                  paddingVertical: Spacing.sm,
                  textAlign: 'center',
                  letterSpacing: 8,
                }}
                value={devPasswordInput}
                onChangeText={setDevPasswordInput}
                secureTextEntry
                keyboardType="number-pad"
                autoFocus
                placeholder="******"
                placeholderTextColor={Colors.textTertiary}
              />
            </View>
            {devPasswordError ? (
              <Text style={{ color: Colors.danger, fontSize: FontSize.sm, textAlign: 'center', marginBottom: Spacing.md }}>{devPasswordError}</Text>
            ) : null}
            <View style={modalStyles.btnRow}>
              <Button title="取消" onPress={() => { setShowDevPassword(false); setDevPasswordError(''); }} variant="ghost" style={{ flex: 1 }} />
              <Button title="确认" onPress={confirmDevPassword} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>

      <TouchableOpacity onPress={handleVersionTap} activeOpacity={0.8}>
        <Text style={styles.version}>
          FitBody v1.0.0{devTapCount >= 3 ? (devTapCount >= 5 ? ' 🔑' : ' ...') : ''}
        </Text>
      </TouchableOpacity>
      <View style={{ height: 40 }} />

      {/* Edit Modal */}
      <Modal visible={!!editModal} transparent animationType="fade">
        <View style={modalStyles.overlay}>
          <View style={modalStyles.card}>
            <Text style={modalStyles.title}>修改{editModal?.label}</Text>
            {editModal?.key === 'gender' ? (
              <View style={modalStyles.genderRow}>
                <TouchableOpacity style={[modalStyles.genderBtn, editValue === 'male' && modalStyles.genderBtnActive]}
                  onPress={() => setEditValue('male')}>
                  <Text style={[modalStyles.genderText, editValue === 'male' && modalStyles.genderTextActive]}>男</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[modalStyles.genderBtn, editValue === 'female' && modalStyles.genderBtnActive]}
                  onPress={() => setEditValue('female')}>
                  <Text style={[modalStyles.genderText, editValue === 'female' && modalStyles.genderTextActive]}>女</Text>
                </TouchableOpacity>
              </View>
            ) : editModal?.key === 'weightUnit' ? (
              <View style={modalStyles.genderRow}>
                <TouchableOpacity style={[modalStyles.genderBtn, editValue === 'kg' && modalStyles.genderBtnActive]}
                  onPress={() => setEditValue('kg')}>
                  <Text style={[modalStyles.genderText, editValue === 'kg' && modalStyles.genderTextActive]}>kg</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[modalStyles.genderBtn, editValue === 'lbs' && modalStyles.genderBtnActive]}
                  onPress={() => setEditValue('lbs')}>
                  <Text style={[modalStyles.genderText, editValue === 'lbs' && modalStyles.genderTextActive]}>lbs</Text>
                </TouchableOpacity>
              </View>
            ) : (
              <View style={modalStyles.inputRow}>
                <TextInput style={modalStyles.input} value={editValue} onChangeText={setEditValue} keyboardType="number-pad" autoFocus />
                <Text style={modalStyles.unit}>{editModal?.unit}</Text>
              </View>
            )}
            <View style={modalStyles.btnRow}>
              <Button title="取消" onPress={() => setEditModal(null)} variant="ghost" style={{ flex: 1 }} />
              <Button title="确定" onPress={saveEdit} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}

const modalStyles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  card: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.lg, width: '100%', maxWidth: 320 },
  title: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: Spacing.sm, textAlign: 'center' },
  desc: { fontSize: FontSize.sm, color: Colors.textSecondary },
  inputRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: Spacing.sm, marginBottom: Spacing.lg },
  input: { fontSize: 40, fontWeight: '700', color: Colors.primary, borderBottomWidth: 2, borderBottomColor: Colors.primary, paddingVertical: Spacing.sm, minWidth: 120, textAlign: 'center' },
  unit: { fontSize: FontSize.lg, color: Colors.textSecondary },
  genderRow: { flexDirection: 'row', gap: Spacing.md, marginBottom: Spacing.lg },
  genderBtn: { flex: 1, paddingVertical: 16, borderRadius: BorderRadius.md, backgroundColor: Colors.surfaceVariant, alignItems: 'center' },
  genderBtnActive: { backgroundColor: Colors.primary },
  genderText: { fontSize: FontSize.lg, fontWeight: '600', color: Colors.textSecondary },
  genderTextActive: { color: '#fff' },
  btnRow: { flexDirection: 'row', gap: Spacing.md },
});

function SettingsRow({ label, value, icon, onPress }: { label: string; value: string; icon: keyof typeof Ionicons.glyphMap; onPress?: () => void }) {
  return (
    <TouchableOpacity style={srStyles.row} onPress={onPress}>
      <Ionicons name={icon} size={18} color={Colors.primary} style={{ width: 24 }} />
      <Text style={srStyles.label}>{label}</Text>
      <Text style={srStyles.value}>{value}</Text>
      <Ionicons name="create-outline" size={16} color={Colors.textTertiary} />
    </TouchableOpacity>
  );
}

const srStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: Spacing.sm,
  },
  label: { flex: 1, fontSize: FontSize.md, color: Colors.text },
  value: { fontSize: FontSize.md, color: Colors.textSecondary, marginRight: Spacing.xs },
});

function MenuRow({ icon, label, isVIP, onPress }: { icon: keyof typeof Ionicons.glyphMap; label: string; isVIP?: boolean; onPress?: () => void }) {
  return (
    <TouchableOpacity style={menuStyles.row} onPress={onPress || (() => alert(label + ' - 即将上线'))}>
      <Ionicons name={icon} size={18} color={isVIP ? Colors.vipGold : Colors.textSecondary} style={{ width: 24 }} />
      <Text style={menuStyles.label}>{label}</Text>
      {isVIP && (
        <View style={menuStyles.vipTag}>
          <Text style={menuStyles.vipTagText}>VIP</Text>
        </View>
      )}
      <Ionicons name="chevron-forward" size={16} color={Colors.textTertiary} />
    </TouchableOpacity>
  );
}

const menuStyles = StyleSheet.create({
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: Colors.divider,
    gap: Spacing.sm,
  },
  label: { flex: 1, fontSize: FontSize.md, color: Colors.text },
  vipTag: { backgroundColor: Colors.vipGold + '20', paddingHorizontal: 8, paddingVertical: 1, borderRadius: BorderRadius.full },
  vipTagText: { fontSize: 10, fontWeight: '700', color: Colors.vipGold },
});

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { padding: Spacing.md },
  userRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  avatar: { width: 64, height: 64, borderRadius: 32, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center' },
  userInfo: { flex: 1, gap: 2 },
  userName: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text },
  userEmail: { fontSize: FontSize.sm, color: Colors.textSecondary },
  notLoggedInTitle: { fontSize: FontSize.lg, fontWeight: '700', color: Colors.text, marginBottom: 4 },
  notLoggedInDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, marginBottom: Spacing.md },
  loginActions: { flexDirection: 'row', gap: Spacing.sm },
  vipBadge: { flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.vipGold + '20', paddingHorizontal: Spacing.sm, paddingVertical: 2, borderRadius: BorderRadius.full, gap: 4, alignSelf: 'flex-start', marginTop: 4 },
  vipText: { fontSize: FontSize.xs, fontWeight: '700', color: Colors.vipGold },
  upgradeRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  upgradeTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  upgradeDesc: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  sectionTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text, marginBottom: Spacing.md, marginTop: Spacing.lg },
  devRow: { flexDirection: 'row', alignItems: 'center', gap: Spacing.md },
  devTitle: { fontSize: FontSize.md, fontWeight: '700', color: Colors.text },
  devDesc: { fontSize: FontSize.xs, color: Colors.textSecondary, marginTop: 2 },
  logoutRow: { marginTop: Spacing.xl, alignItems: 'center' },
  version: { textAlign: 'center', fontSize: FontSize.xs, color: Colors.textTertiary, marginTop: Spacing.md },
});
