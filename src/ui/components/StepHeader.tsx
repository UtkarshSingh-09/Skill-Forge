import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../theme';

interface StepHeaderProps {
  stepIndex: number;
  total: number;
  instruction: string;
}

export function StepHeader({ stepIndex, total, instruction }: StepHeaderProps) {
  const router = useRouter();

  // Create progress dots array
  const dots = Array.from({ length: Math.max(1, total) }, (_, i) => i);

  return (
    <View style={styles.container}>
      <View style={styles.topRow}>
        <Text style={styles.stepCount}>
          Step {stepIndex + 1} of {total}
        </Text>

        <View style={styles.dotsContainer}>
          {dots.map((dotIndex) => {
            const isCompleted = dotIndex < stepIndex;
            const isCurrent = dotIndex === stepIndex;
            return (
              <View
                key={dotIndex}
                style={[
                  styles.dot,
                  isCurrent && styles.dotCurrent,
                  isCompleted && styles.dotCompleted,
                ]}
              />
            );
          })}
        </View>

        <Pressable
          testID="header-settings-btn"
          style={styles.gearButton}
          onPress={() => router.push('/settings')}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Settings"
        >
          <Ionicons name="settings-outline" size={20} color={theme.color.textDim} />
        </Pressable>
      </View>

      <Text
        style={styles.instruction}
        numberOfLines={2}
        ellipsizeMode="tail"
      >
        {instruction}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.color.surface,
    paddingHorizontal: theme.space.md,
    paddingVertical: theme.space.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#252C37',
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: theme.space.xs,
  },
  stepCount: {
    color: theme.color.textDim,
    fontSize: theme.font.label,
    fontWeight: '600',
  },
  dotsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#374151',
  },
  dotCompleted: {
    backgroundColor: theme.color.pass,
  },
  dotCurrent: {
    backgroundColor: theme.color.accent,
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  gearButton: {
    padding: theme.space.xs,
  },
  instruction: {
    color: theme.color.text,
    fontSize: theme.font.body,
    fontWeight: '600',
    lineHeight: 22,
  },
});
