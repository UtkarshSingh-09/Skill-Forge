import React from 'react';
import { Pressable, Text, StyleSheet, ActivityIndicator } from 'react-native';
import * as Haptics from 'expo-haptics';
import { theme } from '../theme';

interface TestButtonProps {
  onPress: () => void;
  busy: boolean;
  disabled?: boolean;
  size?: number;
}

export function TestButton({ onPress, busy, disabled = false, size = 54 }: TestButtonProps) {
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
        {
          minWidth: size,
          minHeight: size,
          width: size,
          height: size,
          borderRadius: size / 2,
        },
        isDisabled && styles.disabled,
        pressed && !isDisabled && styles.pressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Test circuit step"
    >
      {busy ? (
        <ActivityIndicator color="#0A0C10" size="small" />
      ) : (
        <Text style={[styles.text, { fontSize: size < 60 ? 12 : 16 }]}>TEST</Text>
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
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 3,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  disabled: {
    opacity: 0.5,
  },
  pressed: {
    transform: [{ scale: 0.94 }],
    opacity: 0.85,
  },
  text: {
    color: '#0A0C10',
    fontSize: 16,
    fontWeight: '900',
    letterSpacing: 0.8,
  },
});
