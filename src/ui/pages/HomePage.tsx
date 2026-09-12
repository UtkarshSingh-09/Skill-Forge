import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../theme';

export function HomePage() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Clean Minimal Header */}
        <View style={styles.header}>
          <Text style={styles.kicker}>PHYSICAL COMPUTING LAB</Text>
          <Text style={styles.title}>SkillForge</Text>
          <Text style={styles.subtitle}>
            Real-time circuit verification and interactive augmented learning.
          </Text>
        </View>

        {/* Hero Cards Container */}
        <View style={styles.cardsContainer}>
          {/* Card 1: Analyse & Detect */}
          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => router.push('/analyse')}
            accessibilityRole="button"
            accessibilityLabel="Analyse and Detect Circuit"
          >
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="scan-outline" size={24} color={theme.color.accent} />
              </View>
              <Text style={styles.tag}>HARDWARE CAMERA</Text>
            </View>

            <Text style={styles.cardTitle}>Analyse & Detect</Text>
            <Text style={styles.cardDesc}>
              Point the camera at your breadboard to check wiring, inspect component polarity, and receive instant AR pin guidance.
            </Text>

            <View style={styles.cardFooter}>
              <Text style={styles.cardFooterText}>Start Verification</Text>
              <Ionicons name="arrow-forward" size={16} color={theme.color.text} />
            </View>
          </Pressable>

          {/* Card 2: Want to Learn New! */}
          <Pressable
            style={({ pressed }) => [styles.card, pressed && styles.cardPressed]}
            onPress={() => router.push('/learn')}
            accessibilityRole="button"
            accessibilityLabel="Want to Learn New Circuit"
          >
            <View style={styles.cardHeader}>
              <View style={styles.iconContainer}>
                <Ionicons name="school-outline" size={24} color={theme.color.pass} />
              </View>
              <Text style={styles.tag}>CIRCUIT SIMULATOR</Text>
            </View>

            <Text style={styles.cardTitle}>Interactive Simulator</Text>
            <Text style={styles.cardDesc}>
              Step into interactive virtual breadboard simulations, test Arduino firmware, and ask questions to your Socratic tutor.
            </Text>

            <View style={styles.cardFooter}>
              <Text style={styles.cardFooterText}>Open Simulator</Text>
              <Ionicons name="arrow-forward" size={16} color={theme.color.text} />
            </View>
          </Pressable>
        </View>

        {/* Minimal Footer */}
        <View style={styles.footer}>
          <Text style={styles.footerText}>Arduino Uno · iQOO 15 Rig · Offline Ready</Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bg,
  },
  scrollContent: {
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.md,
    justifyContent: 'space-between',
    minHeight: '100%',
  },
  header: {
    marginTop: theme.space.lg,
    marginBottom: theme.space.md,
  },
  kicker: {
    color: theme.color.accent,
    fontSize: 11,
    fontWeight: '800',
    letterSpacing: 1.2,
    marginBottom: 6,
  },
  title: {
    color: theme.color.text,
    fontSize: 36,
    fontWeight: '900',
    letterSpacing: -1,
  },
  subtitle: {
    color: theme.color.textDim,
    fontSize: 14,
    marginTop: 6,
    lineHeight: 20,
    maxWidth: 320,
  },
  cardsContainer: {
    gap: 16,
    marginVertical: theme.space.md,
  },
  card: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: theme.color.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  cardPressed: {
    opacity: 0.85,
    transform: [{ scale: 0.99 }],
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  iconContainer: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  tag: {
    color: theme.color.textDim,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
  },
  cardTitle: {
    color: theme.color.text,
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 6,
    letterSpacing: -0.3,
  },
  cardDesc: {
    color: theme.color.textDim,
    fontSize: 13,
    lineHeight: 19,
    marginBottom: 16,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.05)',
    paddingTop: 12,
  },
  cardFooterText: {
    color: theme.color.text,
    fontSize: 13,
    fontWeight: '700',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: theme.space.md,
  },
  footerText: {
    color: '#4B5563',
    fontSize: 12,
    fontWeight: '500',
  },
});
