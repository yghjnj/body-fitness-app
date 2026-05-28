import React, { useState } from 'react';
import { View, Text, StyleSheet, KeyboardAvoidingView, Platform, ScrollView, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize } from '../../src/config/theme';
import { Button } from '../../src/components/ui/Button';
import { Input } from '../../src/components/ui/Input';
import { registerWithEmail } from '../../src/services/firebase/auth';

export default function RegisterScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!name.trim() || !email.trim() || !password) {
      Alert.alert('提示', '请填写所有必填信息');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('提示', '两次密码不一致');
      return;
    }
    if (password.length < 6) {
      Alert.alert('提示', '密码至少6位');
      return;
    }
    setLoading(true);
    try {
      await registerWithEmail(email.trim(), password, name.trim());
      router.replace('/(auth)/onboarding');
    } catch (err: any) {
      Alert.alert('注册失败', err.message || '请稍后重试');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <ScrollView contentContainerStyle={styles.content} keyboardShouldPersistTaps="handled">
        <View style={styles.header}>
          <Ionicons name="fitness" size={40} color={Colors.primary} />
          <Text style={styles.title}>创建账号</Text>
          <Text style={styles.subtitle}>开始你的身材管理之旅</Text>
        </View>

        <View style={styles.form}>
          <Input
            label="昵称"
            placeholder="请输入昵称"
            value={name}
            onChangeText={setName}
          />
          <Input
            label="邮箱"
            placeholder="请输入邮箱地址"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
          />
          <Input
            label="密码"
            placeholder="至少6位密码"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
          />
          <Input
            label="确认密码"
            placeholder="再次输入密码"
            value={confirmPassword}
            onChangeText={setConfirmPassword}
            secureTextEntry
          />
          <Button
            title="注册"
            onPress={handleRegister}
            loading={loading}
            size="lg"
            style={{ marginTop: Spacing.md }}
          />
        </View>

        <View style={styles.links}>
          <Text style={styles.linkText}>已有账号？</Text>
          <Button
            title="返回登录"
            onPress={() => router.back()}
            variant="ghost"
            size="sm"
          />
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flexGrow: 1,
    justifyContent: 'center',
    paddingHorizontal: Spacing.xl,
    paddingVertical: Spacing.xxl,
  },
  header: {
    alignItems: 'center',
    marginBottom: Spacing.xl,
  },
  title: {
    fontSize: FontSize.xxl,
    fontWeight: '800',
    color: Colors.text,
    marginTop: Spacing.md,
  },
  subtitle: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
    marginTop: Spacing.xs,
  },
  form: {
    marginBottom: Spacing.lg,
  },
  links: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  linkText: {
    fontSize: FontSize.md,
    color: Colors.textSecondary,
  },
});
