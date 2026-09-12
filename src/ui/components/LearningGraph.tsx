import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { initialSkillProfile, getLearningHistory, getOverallMasteryPct } from '../../session/skillProfile';

export function LearningGraph() {
  const profile = initialSkillProfile;
  const history = getLearningHistory();
  const overallMastery = getOverallMasteryPct();

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Student Learning Progression</Text>
          <Text style={styles.subtitle}>Cross-session mastery & error recovery</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{overallMastery}% OVERALL MASTERY</Text>
        </View>
      </View>

      {/* Progress Bars for Indicators */}
      <View style={styles.indicatorsList}>
        {profile.indicators.map((ind) => (
          <View key={ind.key} style={styles.indicatorRow}>
            <View style={styles.labelRow}>
              <Text style={styles.indicatorLabel}>{ind.label}</Text>
              <Text style={[styles.indicatorValue, { color: ind.color }]}>{ind.value}%</Text>
            </View>
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  { width: `${ind.value}%`, backgroundColor: ind.color },
                ]}
              />
            </View>
          </View>
        ))}
      </View>

      {/* Cross-Session Attempt Progression Timeline (Emergency Pivot Showcase) */}
      <View style={styles.progressionSection}>
        <Text style={styles.progressionTitle}>Session-by-Session Arc</Text>
        <View style={styles.attemptsRow}>
          {history.map((node, index) => {
            const isHighAccuracy = node.accuracyPct >= 80;
            return (
              <View key={index} style={styles.attemptCard}>
                <View style={styles.attemptHeader}>
                  <Text style={styles.attemptLabel}>Attempt #{node.attemptNumber}</Text>
                  <Text
                    style={[
                      styles.accuracyText,
                      { color: isHighAccuracy ? theme.color.pass : theme.color.safety },
                    ]}
                  >
                    {node.accuracyPct}%
                  </Text>
                </View>
                <View style={styles.attemptBar}>
                  <View
                    style={[
                      styles.attemptFill,
                      {
                        width: `${node.accuracyPct}%`,
                        backgroundColor: isHighAccuracy ? theme.color.pass : theme.color.safety,
                      },
                    ]}
                  />
                </View>
                <Text style={styles.attemptMeta}>
                  {node.completionTimeSec}s · {node.hintsUsed} {node.hintsUsed === 1 ? 'hint' : 'hints'}
                </Text>
              </View>
            );
          })}
        </View>
      </View>

      {/* Key Metric Pills */}
      <View style={styles.metricGrid}>
        <View style={styles.metricBox}>
          <Text style={styles.metricNumber}>94%</Text>
          <Text style={styles.metricLabel}>First-Try Accuracy</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricNumber}>1.2</Text>
          <Text style={styles.metricLabel}>Avg Hints / Step</Text>
        </View>
        <View style={styles.metricBox}>
          <Text style={styles.metricNumber}>100%</Text>
          <Text style={styles.metricLabel}>Safety Protected</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    padding: theme.space.lg,
    borderWidth: 1.5,
    borderColor: '#2D3748',
    gap: theme.space.md,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  title: {
    color: theme.color.text,
    fontSize: 16,
    fontWeight: '700',
  },
  subtitle: {
    color: theme.color.textDim,
    fontSize: 12,
    marginTop: 2,
  },
  badge: {
    backgroundColor: 'rgba(56, 189, 248, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  badgeText: {
    color: theme.color.accent,
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  indicatorsList: {
    gap: theme.space.sm,
  },
  indicatorRow: {
    gap: 4,
  },
  labelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  indicatorLabel: {
    color: theme.color.text,
    fontSize: 12,
    fontWeight: '600',
  },
  indicatorValue: {
    fontSize: 12,
    fontWeight: '700',
  },
  track: {
    height: 6,
    backgroundColor: '#1E2430',
    borderRadius: 3,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 3,
  },
  progressionSection: {
    gap: theme.space.xs,
    paddingTop: theme.space.xs,
    borderTopWidth: 1,
    borderTopColor: '#252C37',
  },
  progressionTitle: {
    color: theme.color.textDim,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  attemptsRow: {
    flexDirection: 'row',
    gap: theme.space.sm,
  },
  attemptCard: {
    flex: 1,
    backgroundColor: '#161B22',
    padding: theme.space.sm,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: '#30363D',
    gap: 4,
  },
  attemptHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  attemptLabel: {
    color: theme.color.textDim,
    fontSize: 10,
    fontWeight: '600',
  },
  accuracyText: {
    fontSize: 11,
    fontWeight: '800',
  },
  attemptBar: {
    height: 4,
    backgroundColor: '#21262D',
    borderRadius: 2,
    overflow: 'hidden',
  },
  attemptFill: {
    height: '100%',
    borderRadius: 2,
  },
  attemptMeta: {
    color: theme.color.textDim,
    fontSize: 9,
    marginTop: 2,
  },
  metricGrid: {
    flexDirection: 'row',
    gap: theme.space.sm,
    paddingTop: theme.space.xs,
    borderTopWidth: 1,
    borderTopColor: '#252C37',
  },
  metricBox: {
    flex: 1,
    backgroundColor: '#161B22',
    paddingVertical: theme.space.sm,
    paddingHorizontal: 4,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#30363D',
  },
  metricNumber: {
    color: theme.color.text,
    fontSize: 16,
    fontWeight: '800',
  },
  metricLabel: {
    color: theme.color.textDim,
    fontSize: 9,
    fontWeight: '600',
    marginTop: 2,
    textAlign: 'center',
  },
});
