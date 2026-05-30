import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, Alert, TouchableOpacity, Modal, TextInput } from 'react-native';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/config/theme';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { loginWithEmail } from '../../src/services/firebase/auth';
import { useSubscriptionStore } from '../../src/stores/subscriptionStore';

const DEV_MASTER_KEY = process.env.EXPO_PUBLIC_DEV_MASTER_KEY || 'not-set';

type LoginMode = 'email' | 'phone' | 'wechat';

export default function LoginScreen() {
  const router = useRouter();
  const { mode } = useLocalSearchParams<{ mode?: string }>();
  const [activeMode, setActiveMode] = useState<LoginMode>((mode as LoginMode) || 'email');
  const { setDeveloper } = useSubscriptionStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [phone, setPhone] = useState('');
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [codeSent, setCodeSent] = useState(false);

  // Developer master key modal
  const [showDevModal, setShowDevModal] = useState(false);
  const [devKeyInput, setDevKeyInput] = useState('');
  const [devKeyError, setDevKeyError] = useState('');

  const handleEmailLogin = async () => {
    if (!email.trim() || !password) { Alert.alert('提示', '请输入邮箱和密码'); return; }
    setLoading(true);
    try { await loginWithEmail(email.trim(), password); router.replace('/(tabs)'); }
    catch (err: any) { Alert.alert('登录失败', err.message || '请检查邮箱和密码'); }
    finally { setLoading(false); }
  };

  const handlePhoneLogin = async () => {
    if (!phone.trim()) { Alert.alert('提示', '请输入手机号'); return; }
    if (!codeSent) {
      Alert.alert('提示', `验证码已发送到 ${phone.trim()}`);
      setCodeSent(true);
      return;
    }
    if (!code.trim()) { Alert.alert('提示', '请输入验证码'); return; }
    if (code.trim().length !== 6) { Alert.alert('提示', '请输入6位验证码'); return; }
    Alert.alert('提示', '手机验证码登录需要 Firebase Phone Auth 配置。\n当前为演示模式。');
  };

  const handleWechatLogin = () => {
    Alert.alert(
      '微信登录',
      '微信开放平台登录需要：\n1. 注册微信开放平台账号\n2. 创建移动应用获取 AppID\n3. 配置 Universal Link\n\n当前为演示模式，点击确定模拟登录。',
      [{ text: '取消' }, { text: '模拟登录', onPress: () => router.replace('/(tabs)') }]
    );
  };

  const handleDevLogin = () => {
    if (devKeyInput === DEV_MASTER_KEY) {
      setDeveloper(true);
      setShowDevModal(false);
      setDevKeyError('');
      router.replace('/(tabs)');
    } else {
      setDevKeyError('密码错误，请重试');
    }
  };

  return (
    <KeyboardAvoidingView style={sc.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <View style={sc.content}>
        <View style={sc.logoContainer}>
          <View style={sc.logo}><Ionicons name="fitness" size={48} color={Colors.primary} /></View>
          <Text style={sc.appName}>FitBody</Text>
          <Text style={sc.tagline}>你的智能身材管理助手</Text>
        </View>

        <View style={sc.tabRow}>
          {([
            { key: 'phone' as const, label: '手机登录', icon: 'phone-portrait' as const },
            { key: 'wechat' as const, label: '微信登录', icon: 'logo-wechat' as const },
            { key: 'email' as const, label: '邮箱登录', icon: 'mail' as const },
          ]).map((tab) => (
            <TouchableOpacity key={tab.key} style={[sc.tab, activeMode === tab.key && sc.tabActive]}
              onPress={() => { setActiveMode(tab.key); setCodeSent(false); }}>
              <Ionicons name={tab.icon} size={18} color={activeMode === tab.key ? Colors.primary : Colors.textTertiary} />
              <Text style={[sc.tabText, activeMode === tab.key && sc.tabTextActive]}>{tab.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {activeMode === 'email' && (
          <View style={sc.form}>
            <Input label="邮箱" placeholder="请输入邮箱地址" value={email} onChangeText={setEmail} keyboardType="email-address" autoCapitalize="none" />
            <Input label="密码" placeholder="请输入密码" value={password} onChangeText={setPassword} secureTextEntry />
            <Button title="登录" onPress={handleEmailLogin} loading={loading} size="lg" style={{ marginTop: Spacing.md }} />
          </View>
        )}

        {activeMode === 'phone' && (
          <View style={sc.form}>
            <Input label="手机号" placeholder="请输入手机号" value={phone} onChangeText={setPhone} keyboardType="phone-pad" />
            <View style={sc.codeRow}>
              <View style={{ flex: 1 }}>
                <Input label="验证码" placeholder="6位验证码" value={code} onChangeText={setCode} keyboardType="number-pad" maxLength={6} />
              </View>
              <Button title={codeSent ? '重新发送' : '发送验证码'} onPress={() => { setCodeSent(true); Alert.alert('提示', `验证码已发送到 ${phone.trim() || '手机号'}`); }} variant="outline" size="sm" style={{ marginTop: 20 }} />
            </View>
            <Button title="登录" onPress={handlePhoneLogin} loading={loading} size="lg" style={{ marginTop: Spacing.md }} />
          </View>
        )}

        {activeMode === 'wechat' && (
          <View style={sc.form}>
            <View style={sc.wechatBox}>
              <Ionicons name="logo-wechat" size={64} color="#07C160" />
              <Text style={sc.wechatTitle}>微信一键登录</Text>
              <Text style={sc.wechatDesc}>使用你的微信账号快速登录 FitBody</Text>
              <Button title="微信登录" onPress={handleWechatLogin} size="lg" style={{ backgroundColor: '#07C160', marginTop: Spacing.lg }} />
            </View>
          </View>
        )}

        <View style={sc.links}>
          <Text style={sc.linkText}>还没有账号？</Text>
          <Button title="立即注册" onPress={() => router.push('/(auth)/register')} variant="ghost" size="sm" />
        </View>
        <View style={[sc.links, { marginTop: Spacing.md }]}>
          <Button title="跳过登录，直接使用" onPress={() => router.replace('/(tabs)')} variant="ghost" size="sm" />
        </View>

        {/* Developer entry — visible but discreet */}
        <TouchableOpacity style={sc.devEntry} onPress={() => { setShowDevModal(true); setDevKeyInput(''); setDevKeyError(''); }}>
          <Ionicons name="key" size={14} color={Colors.textTertiary} />
          <Text style={sc.devEntryText}>开发者</Text>
        </TouchableOpacity>
      </View>

      {/* Dev Password Modal */}
      <Modal visible={showDevModal} transparent animationType="fade">
        <View style={sc.modalOverlay}>
          <View style={sc.modalCard}>
            <Ionicons name="shield-checkmark" size={40} color={Colors.primary} style={{ textAlign: 'center', marginBottom: Spacing.md }} />
            <Text style={sc.modalTitle}>创作者验证</Text>
            <Text style={sc.modalDesc}>输入开发者密钥，验证你是 FitBody 的创作者，获取永久 VIP 权限。</Text>
            <TextInput
              style={sc.modalInput}
              value={devKeyInput}
              onChangeText={setDevKeyInput}
              secureTextEntry
              placeholder="输入开发者密钥"
              placeholderTextColor={Colors.textTertiary}
              autoFocus
            />
            {devKeyError ? <Text style={sc.modalError}>{devKeyError}</Text> : null}
            <View style={sc.modalBtns}>
              <Button title="取消" onPress={() => setShowDevModal(false)} variant="ghost" style={{ flex: 1 }} />
              <Button title="验证" onPress={handleDevLogin} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>
    </KeyboardAvoidingView>
  );
}

const sc = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background },
  content: { flex: 1, justifyContent: 'center', paddingHorizontal: Spacing.xl },
  logoContainer: { alignItems: 'center', marginBottom: Spacing.lg },
  logo: { width: 96, height: 96, borderRadius: 48, backgroundColor: Colors.primary + '15', alignItems: 'center', justifyContent: 'center', marginBottom: Spacing.md },
  appName: { fontSize: FontSize.xxxl, fontWeight: '800', color: Colors.primary },
  tagline: { fontSize: FontSize.md, color: Colors.textSecondary, marginTop: Spacing.xs },
  tabRow: { flexDirection: 'row', backgroundColor: Colors.surfaceVariant, borderRadius: BorderRadius.md, padding: 3, marginBottom: Spacing.lg },
  tab: { flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6, paddingVertical: 10, borderRadius: BorderRadius.sm },
  tabActive: { backgroundColor: Colors.surface, shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.1, shadowRadius: 2, elevation: 2 },
  tabText: { fontSize: FontSize.sm, fontWeight: '600', color: Colors.textTertiary },
  tabTextActive: { color: Colors.primary },
  form: { marginBottom: Spacing.lg },
  codeRow: { flexDirection: 'row', alignItems: 'flex-end', gap: Spacing.sm },
  wechatBox: { alignItems: 'center', padding: Spacing.xl, backgroundColor: Colors.surface, borderRadius: BorderRadius.lg },
  wechatTitle: { fontSize: FontSize.xl, fontWeight: '700', color: Colors.text, marginTop: Spacing.md },
  wechatDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, marginTop: Spacing.xs, textAlign: 'center' },
  links: { flexDirection: 'row', justifyContent: 'center', alignItems: 'center' },
  linkText: { fontSize: FontSize.md, color: Colors.textSecondary },
  // Dev entry
  devEntry: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 4, marginTop: Spacing.xl, paddingVertical: Spacing.md },
  devEntryText: { fontSize: FontSize.xs, color: Colors.textTertiary },
  // Modal
  modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'center', alignItems: 'center', padding: Spacing.xl },
  modalCard: { backgroundColor: Colors.surface, borderRadius: BorderRadius.lg, padding: Spacing.xl, width: '100%', maxWidth: 340 },
  modalTitle: { fontSize: FontSize.xl, fontWeight: '800', color: Colors.text, textAlign: 'center', marginBottom: Spacing.sm },
  modalDesc: { fontSize: FontSize.sm, color: Colors.textSecondary, textAlign: 'center', lineHeight: 20, marginBottom: Spacing.lg },
  modalInput: { backgroundColor: Colors.surfaceVariant, borderRadius: BorderRadius.md, paddingHorizontal: Spacing.md, paddingVertical: 14, fontSize: FontSize.lg, fontWeight: '700', color: Colors.primary, textAlign: 'center', letterSpacing: 4, marginBottom: Spacing.md },
  modalError: { color: Colors.danger, fontSize: FontSize.sm, textAlign: 'center', marginBottom: Spacing.md },
  modalBtns: { flexDirection: 'row', gap: Spacing.md },
});
