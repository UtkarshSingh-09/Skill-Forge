import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../theme';

export function SessionSummaryScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Session Summary (Modal)</Text>
      <Text style={styles.desc}>Performance indicators and review will live here</Text>

      <Pressable style={styles.button} onPress={() => router.back()}>
        <Text style={styles.btnText}>Dismiss Modal</Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bg,
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.space.lg,
  },
  title: {
    color: theme.color.text,
    fontSize: theme.font.h2,
    fontWeight: '700',
    marginBottom: theme.space.xs,
  },
  desc: {
    color: theme.color.textDim,
    fontSize: theme.font.body,
    marginBottom: theme.space.lg,
  },
  button: {
    backgroundColor: theme.color.surface,
    borderColor: theme.color.accent,
    borderWidth: 1,
    paddingVertical: theme.space.sm,
    paddingHorizontal: theme.space.lg,
    borderRadius: theme.radius.sm,
  },
  btnText: {
    color: theme.color.accent,
    fontSize: theme.font.body,
    fontWeight: '600',
  },
});
