import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';

interface TestButtonProps {
  onPress: () => void;
  busy: boolean;
  disabled?: boolean;
}

export function TestButton({ onPress, busy, disabled = false }: TestButtonProps) {
  const handlePress = async () => {
    if (busy || disabled) return;
    try {
      await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    } catch {
      // Haptics no-op on unsupported platforms - never block
    }
    onPress();
  };

  const isDisabled = busy || disabled;

  return (
    <Pressable
      testID="test-button"
      onPress={handlePress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.button,
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Test circuit step"
    >
      {busy ? (
        <ActivityIndicator color={theme.color.bg} size="small" />
      ) : (
        <Text style={styles.text}>TEST</Text>
      )}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: {
    minWidth: theme.hit.testButton,
    minHeight: theme.hit.testButton,
    width: theme.hit.testButton,
    height: theme.hit.testButton,
    borderRadius: theme.hit.testButton / 2,
    backgroundColor: theme.color.accent,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: theme.color.accent,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.35,
    shadowRadius: 8,
  },
  disabled: {
    opacity: 0.6,
  },
  pressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.9,
  },
  text: {
    color: theme.color.bg,
    fontSize: 18,
    fontWeight: '800',
    letterSpacing: 1.2,
  },
});
