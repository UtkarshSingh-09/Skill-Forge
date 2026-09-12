import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';

interface SafetyBannerProps {
  visible: boolean;
  message?: string | null;
}

export function SafetyBanner({ visible, message }: SafetyBannerProps) {
  if (!visible || !message) return null;

  return (
    <View style={styles.safetyContainer}>
      <Ionicons name="warning" size={20} color="#0E1116" />
      <View style={styles.textWrap}>
        <Text style={styles.safetyTitle}>SAFETY ALERT</Text>
        <Text style={styles.safetyMessage}>{message}</Text>
      </View>
    </View>
  );
}

interface DebugCoachBannerProps {
  message: string | null;
  onDismiss: () => void;
}

export function DebugCoachBanner({ message, onDismiss }: DebugCoachBannerProps) {
  if (!message) return null;

  return (
    <View style={styles.debugContainer}>
      <Ionicons name="school-outline" size={18} color={theme.color.accent} />
      <Text style={styles.debugMessage}>{message}</Text>
      <Pressable onPress={onDismiss} hitSlop={8}>
        <Ionicons name="close" size={16} color={theme.color.textDim} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  safetyContainer: {
    backgroundColor: theme.color.safety,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.xs + 2,
    gap: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#EA580C',
  },
  textWrap: {
    flex: 1,
  },
  safetyTitle: {
    color: '#0E1116',
    fontSize: 10,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
  safetyMessage: {
    color: '#0E1116',
    fontSize: 12,
    fontWeight: '700',
    lineHeight: 16,
  },
  debugContainer: {
    backgroundColor: '#1E293B',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.xs,
    borderBottomWidth: 1,
    borderBottomColor: theme.color.accent,
    gap: 8,
  },
  debugMessage: {
    flex: 1,
    color: theme.color.text,
    fontSize: 12,
    fontWeight: '600',
    lineHeight: 16,
  },
});
