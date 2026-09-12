import React from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useStore } from '../../session/store';
import arduinoLedProcedure from '../../contract/procedures/arduino_led_v1.json';
import arduinoLedV2Procedure from '../../contract/procedures/arduino_led_v2.json';
import andGateProcedure from '../../contract/procedures/and_gate_procedure.json';
import { Procedure } from '../../contract/types';

export function ProcedureSelectScreen() {
  const router = useRouter();
  const { setProcedure } = useStore((s) => s.actions);
  const currentProcedure = useStore((s) => s.procedure);

  const procedures: Procedure[] = [
    arduinoLedProcedure as unknown as Procedure,
    arduinoLedV2Procedure as unknown as Procedure,
    andGateProcedure as unknown as Procedure,
  ];

  const handleSelectProcedure = (proc: Procedure) => {
    setProcedure(proc);
    router.push('/(tabs)/coach');
  };

  const getProcId = (p: any) => p?.id || p?.procedureId || '';

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
            const procId = getProcId(proc);
            const currentId = getProcId(currentProcedure);
            const isCurrent = currentId === procId;
            const stepCount = proc.steps.length;
            const isV2 = procId.includes('v2');
            const isIntermediate = procId.includes('AND') || procId.includes('gate');

            let badgeLabel = 'PRIMARY LAB (P-A v2)';
            let badgeStyle = styles.badgeBeginner;
            let badgeTextStyle = styles.badgeTextBeginner;

            if (isV2) {
              badgeLabel = 'PROGRESSION (Level 2)';
              badgeStyle = styles.badgeProgression;
              badgeTextStyle = styles.badgeTextProgression;
            } else if (isIntermediate) {
              badgeLabel = 'CLASSIC TTL (7408)';
              badgeStyle = styles.badgeIntermediate;
              badgeTextStyle = styles.badgeTextIntermediate;
            }

            return (
              <View
                key={procId}
                style={[
                  styles.card,
                  isCurrent && styles.cardActive,
                ]}
              >
                {/* Header Row */}
                <View style={styles.cardHeader}>
                  <View style={styles.tagRow}>
                    <View style={[styles.badge, badgeStyle]}>
                      <Text style={[styles.badgeText, badgeTextStyle]}>
                        {badgeLabel}
                      </Text>
                    </View>
                    <Text style={styles.stepsMeta}>{stepCount} Steps</Text>
                  </View>

                  <Ionicons
                    name={isIntermediate ? 'hardware-chip-outline' : isV2 ? 'trending-up-outline' : 'bulb-outline'}
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
    paddingVertical: theme.space.md,
    borderBottomWidth: 1,
    borderBottomColor: '#1E293B',
  },
  branding: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
  },
  brandTitle: {
    color: theme.color.text,
    fontSize: 20,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  offlineBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 5,
    backgroundColor: 'rgba(34, 197, 94, 0.12)',
    paddingHorizontal: 7,
    paddingVertical: 3,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(34, 197, 94, 0.25)',
  },
  greenDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: theme.color.pass,
  },
  offlineText: {
    color: theme.color.pass,
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
    fontSize: 24,
    fontWeight: '800',
  },
  heroSubtitle: {
    color: theme.color.textDim,
    fontSize: 14,
    lineHeight: 20,
  },
  cardsContainer: {
    gap: theme.space.md,
  },
  card: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    padding: theme.space.lg,
    gap: theme.space.md,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  cardActive: {
    borderColor: theme.color.accent,
    backgroundColor: '#131D2E',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  tagRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: theme.space.sm,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.sm,
  },
  badgeBeginner: {
    backgroundColor: 'rgba(34, 197, 94, 0.15)',
  },
  badgeTextBeginner: {
    color: theme.color.pass,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  badgeProgression: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
  },
  badgeTextProgression: {
    color: theme.color.accent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  badgeIntermediate: {
    backgroundColor: 'rgba(168, 85, 247, 0.15)',
  },
  badgeTextIntermediate: {
    color: '#C084FC',
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  stepsMeta: {
    color: theme.color.textDim,
    fontSize: 12,
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
    backgroundColor: theme.color.accent,
    paddingVertical: 12,
    borderRadius: theme.radius.sm,
    gap: theme.space.xs,
    marginTop: theme.space.xs,
  },
  startBtnText: {
    color: theme.color.bg,
    fontSize: 14,
    fontWeight: '700',
  },
});
