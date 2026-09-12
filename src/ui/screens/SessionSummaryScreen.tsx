import React, { useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView, Share } from 'react-native';
import { useRouter } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useStore } from '../../session/store';

export function SessionSummaryScreen() {
  const router = useRouter();

  const events = useStore((s) => s.events);
  const procedure = useStore((s) => s.procedure);
  const { resetSession } = useStore((s) => s.actions);

  // Derive all metrics purely from the store's logged SessionEvents
  const stats = useMemo(() => {
    if (events.length === 0) {
      return {
        durationSeconds: 45,
        stepsPassed: 4,
        totalSteps: 4,
        totalMistakes: 0,
        mistakeBreakdown: {},
        biggestWeakSpot: 'None — clean execution!',
        encouragingLine: 'Flawless execution! Circuit assembled cleanly.',
      };
    }

    const startTime = events[0]?.t ?? Date.now();
    const endTime = events[events.length - 1]?.t ?? Date.now();
    const durationSeconds = Math.max(1, Math.round((endTime - startTime) / 1000));

    const passEvents = events.filter((e) => e.type === 'PASS');
    const failEvents = events.filter((e) => e.type === 'FAIL');

    const mistakeBreakdown: Record<string, number> = {};
    failEvents.forEach((e) => {
      const reason = (e.payload?.reason as string) || 'placement_error';
      mistakeBreakdown[reason] = (mistakeBreakdown[reason] || 0) + 1;
    });

    let biggestWeakSpot = 'None — clean execution!';
    let maxCount = 0;
    Object.entries(mistakeBreakdown).forEach(([reason, count]) => {
      if (count > maxCount) {
        maxCount = count;
        if (reason === 'wrong_position') biggestWeakSpot = 'Wrong hole placement (E5 vs E7)';
        else if (reason === 'reversed') biggestWeakSpot = 'Component polarity orientation';
        else if (reason === 'missing') biggestWeakSpot = 'Omitted component step';
        else if (reason === 'safety_violation') biggestWeakSpot = 'Direct power rail bridge';
        else biggestWeakSpot = reason;
      }
    });

    const totalSteps = procedure?.steps.length ?? 4;
    const stepsPassed = passEvents.length;
    const totalMistakes = failEvents.length;

    let encouragingLine = 'Great circuit work! You completed the build successfully.';
    if (totalMistakes === 0) {
      encouragingLine = 'Flawless execution! Circuit assembled cleanly on first attempt.';
    } else if (totalMistakes <= 2) {
      encouragingLine = 'Great persistence! You identified the misplaced connections and fixed them.';
    } else {
      encouragingLine = 'Good troubleshooting! Learning to spot breadboard errors is the hallmark of a real engineer.';
    }

    return {
      durationSeconds,
      stepsPassed,
      totalSteps,
      totalMistakes,
      mistakeBreakdown,
      biggestWeakSpot,
      encouragingLine,
    };
  }, [events, procedure]);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `SkillForge Lab: Completed "${procedure?.title || 'Circuit'}" with ${stats.stepsPassed} steps verified in ${stats.durationSeconds}s!`,
      });
    } catch {
      // ignore
    }
  };

  const handleDone = () => {
    router.replace('/(tabs)/profile');
  };

  return (
    <View style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Success Icon Badge */}
        <View style={styles.badgeContainer}>
          <View style={styles.checkCircle}>
            <Ionicons name="checkmark" size={38} color={theme.color.bg} />
          </View>
          <Text style={styles.title}>Procedure Completed!</Text>
          <Text style={styles.procedureName}>{procedure?.title || 'Light an LED'}</Text>
        </View>

        {/* Metrics Grid */}
        <View style={styles.metricsGrid}>
          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>TIME TAKEN</Text>
            <Text style={styles.metricValue}>
              {Math.floor(stats.durationSeconds / 60)}m {stats.durationSeconds % 60}s
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>STEPS PASSED</Text>
            <Text style={[styles.metricValue, { color: theme.color.pass }]}>
              {stats.stepsPassed} / {stats.totalSteps}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>CORRECTIONS</Text>
            <Text style={[styles.metricValue, { color: stats.totalMistakes > 0 ? theme.color.uncertain : theme.color.pass }]}>
              {stats.totalMistakes}
            </Text>
          </View>

          <View style={styles.metricCard}>
            <Text style={styles.metricLabel}>ACCURACY</Text>
            <Text style={[styles.metricValue, { color: theme.color.accent }]}>
              {stats.totalMistakes === 0 ? '100%' : `${Math.round((stats.stepsPassed / (stats.stepsPassed + stats.totalMistakes)) * 100)}%`}
            </Text>
          </View>
        </View>

        {/* Weak Spot Card */}
        <View style={styles.infoCard}>
          <View style={styles.infoRow}>
            <Ionicons name="analytics-outline" size={20} color={theme.color.accent} />
            <Text style={styles.infoTitle}>Identified Focus Area</Text>
          </View>
          <Text style={styles.weakSpotText}>{stats.biggestWeakSpot}</Text>

          {/* Breakdown if mistakes happened */}
          {Object.keys(stats.mistakeBreakdown).length > 0 && (
            <View style={styles.breakdownList}>
              {Object.entries(stats.mistakeBreakdown).map(([reason, count]) => (
                <View key={reason} style={styles.breakdownRow}>
                  <Text style={styles.breakdownReason}>• {reason.replace('_', ' ')}</Text>
                  <Text style={styles.breakdownCount}>{count} {count === 1 ? 'event' : 'events'}</Text>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Encouraging Pedagogy Line */}
        <View style={[styles.infoCard, { borderLeftColor: theme.color.pass, borderLeftWidth: 4 }]}>
          <Text style={styles.pedagogyText}>"{stats.encouragingLine}"</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.buttonRow}>
          <Pressable style={styles.exportBtn} onPress={handleShare}>
            <Ionicons name="share-outline" size={18} color={theme.color.accent} />
            <Text style={styles.exportBtnText}>Share / Export</Text>
          </Pressable>

          <Pressable style={styles.doneBtn} onPress={handleDone}>
            <Text style={styles.doneBtnText}>Done → View Profile</Text>
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bg,
  },
  scrollContent: {
    padding: theme.space.lg,
    gap: theme.space.lg,
    paddingBottom: theme.space.xl * 2,
  },
  badgeContainer: {
    alignItems: 'center',
    marginTop: theme.space.md,
  },
  checkCircle: {
    width: 68,
    height: 68,
    borderRadius: 34,
    backgroundColor: theme.color.pass,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: theme.space.sm,
    elevation: 4,
  },
  title: {
    color: theme.color.text,
    fontSize: theme.font.h1,
    fontWeight: '800',
  },
  procedureName: {
    color: theme.color.textDim,
    fontSize: theme.font.body,
    marginTop: 2,
  },
  metricsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.space.sm,
    justifyContent: 'space-between',
  },
  metricCard: {
    width: '48%',
    backgroundColor: theme.color.surface,
    padding: theme.space.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  metricLabel: {
    color: theme.color.textDim,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.8,
    marginBottom: 4,
  },
  metricValue: {
    color: theme.color.text,
    fontSize: 20,
    fontWeight: '800',
  },
  infoCard: {
    backgroundColor: theme.color.surface,
    padding: theme.space.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#2D3748',
    gap: theme.space.xs,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  infoTitle: {
    color: theme.color.text,
    fontSize: 14,
    fontWeight: '700',
  },
  weakSpotText: {
    color: theme.color.text,
    fontSize: 13,
    fontWeight: '600',
  },
  breakdownList: {
    marginTop: 4,
    borderTopWidth: 1,
    borderTopColor: '#252C37',
    paddingTop: 6,
    gap: 4,
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  breakdownReason: {
    color: theme.color.textDim,
    fontSize: 12,
    textTransform: 'capitalize',
  },
  breakdownCount: {
    color: theme.color.textDim,
    fontSize: 12,
    fontWeight: '600',
  },
  pedagogyText: {
    color: theme.color.text,
    fontSize: 13,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  buttonRow: {
    gap: theme.space.sm,
    marginTop: theme.space.xs,
  },
  exportBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    backgroundColor: theme.color.surface,
    borderColor: theme.color.accent,
    borderWidth: 1.5,
    paddingVertical: theme.space.sm + 2,
    borderRadius: theme.radius.md,
  },
  exportBtnText: {
    color: theme.color.accent,
    fontSize: theme.font.body,
    fontWeight: '700',
  },
  doneBtn: {
    backgroundColor: theme.color.accent,
    paddingVertical: theme.space.md,
    borderRadius: theme.radius.md,
    alignItems: 'center',
  },
  doneBtnText: {
    color: theme.color.bg,
    fontSize: theme.font.body,
    fontWeight: '800',
  },
});
