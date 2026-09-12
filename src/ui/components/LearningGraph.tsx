import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { theme } from '../theme';
import { initialSkillProfile } from '../../session/skillProfile';

export function LearningGraph() {
  const profile = initialSkillProfile;

  return (
    <View style={styles.card}>
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>Student Learning Progression</Text>
          <Text style={styles.subtitle}>Cross-session mastery & error recovery</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{profile.sessionsCompleted} LABS DONE</Text>
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
