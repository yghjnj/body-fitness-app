import React, { useState } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { Colors, Spacing, FontSize, BorderRadius } from '../../src/config/theme';
import { Button } from '../../src/components/ui/Button';
import { Card } from '../../src/components/ui/Card';
import { SegmentedControl } from '../../src/components/ui/SegmentedControl';
import { getDatabase } from '../../src/services/database/init';
import { getTodayStr } from '../../src/utils/formatting';
import { v4 as uuid } from 'uuid';

export default function ProgressPhotoScreen() {
  const router = useRouter();
  const [category, setCategory] = useState('front');
  const [photo, setPhoto] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  const savePhoto = async () => {
    if (!photo) return;
    setSaving(true);
    try {
      const db = await getDatabase();
      const id = uuid();
      await db.runAsync(
        `INSERT INTO progress_photos (id, user_id, local_uri, date, category, synced)
         VALUES (?, ?, ?, ?, ?, 0)`,
        [id, 'local-user', photo, getTodayStr(), category]
      );
    } catch (e) { console.error('Failed to save photo:', e); }
    setSaving(false);
    router.back();
  };

  const takePhoto = async () => {
    const result = await ImagePicker.launchCameraAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  const pickPhoto = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ['images'],
      quality: 0.8,
      allowsEditing: false,
    });
    if (!result.canceled && result.assets[0]) {
      setPhoto(result.assets[0].uri);
    }
  };

  return (
    <View style={styles.container}>
      <SegmentedControl
        options={[
          { label: '正面', value: 'front' },
          { label: '背面', value: 'back' },
          { label: '侧面', value: 'side' },
          { label: '展示', value: 'flexed' },
        ]}
        value={category}
        onChange={setCategory}
      />

      <View style={styles.photoArea}>
        {photo ? (
          <Image source={{ uri: photo }} style={styles.photo} resizeMode="cover" />
        ) : (
          <View style={styles.placeholder}>
            <Ionicons name="camera" size={64} color={Colors.textTertiary} />
            <Text style={styles.placeholderText}>拍摄或选择照片</Text>
          </View>
        )}
      </View>

      <View style={styles.buttons}>
        <Button title="拍照" onPress={takePhoto} icon={<Ionicons name="camera" size={20} color="#fff" />} style={{ flex: 1 }} />
        <Button title="相册" onPress={pickPhoto} variant="outline" icon={<Ionicons name="images" size={20} color={Colors.primary} />} style={{ flex: 1 }} />
      </View>

      {photo && (
        <Button title="保存照片" onPress={savePhoto} loading={saving} size="lg" style={{ marginTop: Spacing.md }} />
      )}

      {/* Before/After Placeholder */}
      <Text style={styles.historyTitle}>历史照片</Text>
      <Card>
        <View style={styles.emptyHistory}>
          <Ionicons name="time" size={32} color={Colors.textTertiary} />
          <Text style={styles.emptyText}>暂无历史照片</Text>
          <Text style={styles.emptySubtext}>定期拍摄同角度照片，追踪身材变化</Text>
        </View>
      </Card>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: Colors.background, padding: Spacing.md },
  photoArea: {
    width: '100%' as any,
    aspectRatio: 3 / 4,
    backgroundColor: Colors.surfaceVariant,
    borderRadius: BorderRadius.lg,
    overflow: 'hidden',
    marginTop: Spacing.md,
    marginBottom: Spacing.md,
  },
  photo: { width: '100%', height: '100%' },
  placeholder: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: Spacing.md,
  },
  placeholderText: { fontSize: FontSize.md, color: Colors.textTertiary },
  buttons: { flexDirection: 'row', gap: Spacing.md },
  historyTitle: {
    fontSize: FontSize.lg,
    fontWeight: '700',
    color: Colors.text,
    marginTop: Spacing.xl,
    marginBottom: Spacing.md,
  },
  emptyHistory: {
    alignItems: 'center',
    padding: Spacing.lg,
    gap: Spacing.sm,
  },
  emptyText: { fontSize: FontSize.md, fontWeight: '600', color: Colors.textSecondary },
  emptySubtext: { fontSize: FontSize.sm, color: Colors.textTertiary, textAlign: 'center' },
});
