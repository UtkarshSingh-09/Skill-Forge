import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { useRouter } from 'expo-router';
import { theme } from '../theme';

export function ProcedureSelectScreen() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>SkillForge</Text>
      <Text style={styles.subtitle}>Procedure Select</Text>

      <View style={styles.card}>
        <Text style={styles.cardTitle}>Light an LED</Text>
        <Text style={styles.cardDesc}>Basic breadboard circuit with 220Ω resistor and LED</Text>
        <Pressable
          style={styles.btnPrimary}
          onPress={() => router.push('/coach')}
        >
          <Text style={styles.btnPrimaryText}>Start Coach</Text>
        </Pressable>
      </View>

      <View style={styles.navRow}>
        <Pressable
          style={styles.btnSecondary}
          onPress={() => router.push('/settings')}
        >
          <Text style={styles.btnSecondaryText}>Open Settings Modal</Text>
        </Pressable>

        <Pressable
          style={styles.btnSecondary}
          onPress={() => router.push('/summary')}
        >
          <Text style={styles.btnSecondaryText}>Open Summary Modal</Text>
        </Pressable>
      </View>
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
    fontSize: theme.font.h1,
    fontWeight: '700',
    marginBottom: theme.space.xs,
  },
  subtitle: {
    color: theme.color.textDim,
    fontSize: theme.font.body,
    marginBottom: theme.space.xl,
  },
  card: {
    backgroundColor: theme.color.surface,
    padding: theme.space.lg,
    borderRadius: theme.radius.md,
    width: '100%',
    maxWidth: 360,
    marginBottom: theme.space.xl,
  },
  cardTitle: {
    color: theme.color.text,
    fontSize: theme.font.h2,
    fontWeight: '600',
    marginBottom: theme.space.xs,
  },
  cardDesc: {
    color: theme.color.textDim,
    fontSize: theme.font.label,
    marginBottom: theme.space.md,
  },
  btnPrimary: {
    backgroundColor: theme.color.accent,
    paddingVertical: theme.space.sm,
    paddingHorizontal: theme.space.md,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  btnPrimaryText: {
    color: theme.color.bg,
    fontSize: theme.font.body,
    fontWeight: '700',
  },
  navRow: {
    flexDirection: 'column',
    gap: theme.space.sm,
    width: '100%',
    maxWidth: 360,
  },
  btnSecondary: {
    backgroundColor: theme.color.surface,
    borderColor: '#2D3748',
    borderWidth: 1,
    paddingVertical: theme.space.sm,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  btnSecondaryText: {
    color: theme.color.textDim,
    fontSize: theme.font.label,
  },
});
