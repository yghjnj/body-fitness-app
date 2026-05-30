import React from 'react';
import { Stack } from 'expo-router';

export default function ModalsLayout() {
  return (
    <Stack screenOptions={{ headerShown: true, presentation: 'modal' }}>
      <Stack.Screen name="add-weight" options={{ title: '添加体重' }} />
      <Stack.Screen name="add-water" options={{ title: '记录饮水' }} />
      <Stack.Screen name="add-meal" options={{ title: '记录饮食' }} />
      <Stack.Screen name="add-workout" options={{ title: '开始锻炼' }} />
      <Stack.Screen name="progress-photo" options={{ title: '进度照片' }} />
      <Stack.Screen name="goal-setter" options={{ title: '设定目标' }} />
      <Stack.Screen name="paywall" options={{ title: '升级 VIP' }} />
    </Stack>
  );
}
