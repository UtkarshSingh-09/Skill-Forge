import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useStore } from '../../session/store';
import ledProcedure from '../../contract/procedures/led_procedure.json';
import andGateProcedure from '../../contract/procedures/and_gate_procedure.json';
import { Procedure } from '../../contract/types';

export function ProcedureSelectScreen() {
  const router = useRouter();
  const { setProcedure } = useStore((s) => s.actions);
  const currentProcedure = useStore((s) => s.procedure);

  const procedures: Procedure[] = [
    ledProcedure as unknown as Procedure,
    andGateProcedure as unknown as Procedure,
  ];

  const handleSelectProcedure = (proc: Procedure) => {
    setProcedure(proc);
    router.push('/(tabs)/coach');
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* Top App Bar with Gear Settings Button */}
      <View style={styles.appBar}>
        <View style={styles.branding}>
          <Text style={styles.brandTitle}>SkillForge</Text>
          <View style={styles.offlineBadge}>
            <View style={styles.greenDot} />
            <Text style={styles.offlineText}>OFFLINE LAB</Text>
          </View>
        </View>

        <Pressable
          testID="settings-gear-btn"
          style={styles.gearButton}
          onPress={() => router.push('/settings')}
          hitSlop={8}
          accessibilityRole="button"
          accessibilityLabel="Settings"
        >
          <Ionicons name="settings-outline" size={22} color={theme.color.textDim} />
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.heroSection}>
          <Text style={styles.heroTitle}>Select Breadboard Lab</Text>
          <Text style={styles.heroSubtitle}>
            AI-assisted real-time circuit coaching with deterministic verification
          </Text>
        </View>

        {/* Procedure Cards List */}
        <View style={styles.cardsContainer}>
          {procedures.map((proc) => {
            const isCurrent = currentProcedure?.procedureId === proc.procedureId;
            const stepCount = proc.steps.length;
            const isIntermediate = proc.procedureId.includes('AND');

            return (
              <View
                key={proc.procedureId}
                style={[
                  styles.card,
                  isCurrent && styles.cardActive,
                ]}
              >
                {/* Header Row */}
                <View style={styles.cardHeader}>
                  <View style={styles.tagRow}>
                    <View style={[styles.badge, isIntermediate ? styles.badgeIntermediate : styles.badgeBeginner]}>
                      <Text style={[styles.badgeText, isIntermediate ? styles.badgeTextIntermediate : styles.badgeTextBeginner]}>
                        {isIntermediate ? 'INTERMEDIATE (TTL 7408)' : 'BEGINNER (P-A)'}
                      </Text>
                    </View>
                    <Text style={styles.stepsMeta}>{stepCount} Steps</Text>
                  </View>

                  <Ionicons
                    name={isIntermediate ? 'hardware-chip-outline' : 'bulb-outline'}
                    size={24}
                    color={isCurrent ? theme.color.accent : theme.color.textDim}
                  />
                </View>

                {/* Card Body */}
                <Text style={styles.cardTitle}>{proc.title}</Text>
                <Text style={styles.cardDesc}>
                  {(proc as any).description || 'Hands-on breadboard step-by-step assembly and verification'}
                </Text>

                {/* Card Action Button */}
                <Pressable
                  style={styles.startBtn}
                  onPress={() => handleSelectProcedure(proc)}
                  accessibilityRole="button"
                >
                  <Text style={styles.startBtnText}>
                    {isCurrent ? 'Resume Coach' : 'Start Procedure'}
                  </Text>
                  <Ionicons name="arrow-forward" size={16} color={theme.color.bg} />
                </Pressable>
              </View>
            );
          })}
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
  appBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.space.lg,
    paddingVertical: theme.space.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#252C37',
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandTitle: {
    color: theme.color.text,
    fontSize: theme.font.h1,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: '#161B22',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: '#30363D',
  },
  greenDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: theme.color.pass,
  },
  offlineText: {
    color: theme.color.textDim,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  gearButton: {
    padding: theme.space.xs,
  },
  content: {
    padding: theme.space.lg,
    gap: theme.space.lg,
    paddingBottom: theme.space.xl * 2,
  },
  heroSection: {
    gap: theme.space.xs,
  },
  heroTitle: {
    color: theme.color.text,
    fontSize: theme.font.h2,
    fontWeight: '700',
  },
  heroSubtitle: {
    color: theme.color.textDim,
    fontSize: theme.font.body - 2,
    lineHeight: 20,
  },
  cardsContainer: {
    gap: theme.space.md,
  },
  card: {
    backgroundColor: theme.color.surface,
    padding: theme.space.lg,
    borderRadius: theme.radius.md,
    borderWidth: 1.5,
    borderColor: '#2D3748',
    gap: theme.space.sm,
    elevation: 3,
  },
  cardActive: {
    borderColor: theme.color.accent,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  badgeBeginner: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  badgeIntermediate: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  badgeText: {
    fontSize: 10,
    fontWeight: '800',
  },
  badgeTextBeginner: {
    color: theme.color.pass,
  },
  badgeTextIntermediate: {
    color: theme.color.accent,
  },
  stepsMeta: {
    color: theme.color.textDim,
    fontSize: 11,
    fontWeight: '600',
  },
  cardTitle: {
    color: theme.color.text,
    fontSize: 18,
    fontWeight: '700',
  },
  cardDesc: {
    color: theme.color.textDim,
    fontSize: 13,
    lineHeight: 18,
  },
  startBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    backgroundColor: theme.color.accent,
    paddingVertical: theme.space.sm + 2,
    borderRadius: theme.radius.sm,
    marginTop: theme.space.xs,
  },
  startBtnText: {
    color: theme.color.bg,
    fontSize: theme.font.body - 2,
    fontWeight: '700',
  },
});
