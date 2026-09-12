import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useStore } from '../../session/store';

export function SensorStatusStrip() {
  const sensors = useStore((s) => s.sensors);

  // Only render if at least one sensor is actively polling
  const hasActiveSensor = sensors?.camera || sensors?.mic;
  if (!hasActiveSensor) return null;

  return (
    <View style={styles.container}>
      {sensors.camera && (
        <View style={styles.pill}>
          <View style={[styles.dot, { backgroundColor: theme.color.pass }]} />
          <Ionicons name="camera-outline" size={13} color={theme.color.text} style={styles.icon} />
          <Text style={styles.label}>Camera Active</Text>
        </View>
      )}

      {sensors.mic && (
        <View style={[styles.pill, styles.micPill]}>
          <View style={[styles.dot, { backgroundColor: theme.color.accent }]} />
          <Ionicons name="mic-outline" size={13} color={theme.color.text} style={styles.icon} />
          <Text style={styles.label}>Listening</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(18, 21, 28, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  micPill: {
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  dot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 6,
  },
  icon: {
    marginRight: 4,
  },
  label: {
    color: theme.color.textDim,
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.3,
  },
});
