import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SkillProfile } from '../../session/skillProfile';
import { theme } from '../theme';

interface SkillBarsProps {
  profile: SkillProfile;
}

export function SkillBars({ profile }: SkillBarsProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Session-Derived Skill Indicators</Text>
      <Text style={styles.subtext}>
        Observational proficiency derived from completed breadboard steps
      </Text>

      <View style={styles.barsList}>
        {profile.indicators.map((indicator) => (
          <View key={indicator.key} style={styles.barItem}>
            <View style={styles.barHeader}>
              <Text style={styles.label}>{indicator.label}</Text>
              <Text style={[styles.percentage, { color: indicator.color }]}>
                {indicator.value}%
              </Text>
            </View>

            {/* Track & Fill Bar */}
            <View style={styles.track}>
              <View
                style={[
                  styles.fill,
                  {
                    width: `${Math.min(100, Math.max(0, indicator.value))}%`,
                    backgroundColor: indicator.color,
                  },
                ]}
              />
            </View>
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: theme.color.surface,
    padding: theme.space.md,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: '#2D3748',
    width: '100%',
  },
  headerTitle: {
    color: theme.color.text,
    fontSize: theme.font.body,
    fontWeight: '700',
    marginBottom: 2,
  },
  subtext: {
    color: theme.color.textDim,
    fontSize: 11,
    marginBottom: theme.space.md,
  },
  barsList: {
    gap: theme.space.sm + 2,
  },
  barItem: {
    width: '100%',
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  label: {
    color: theme.color.text,
    fontSize: 13,
    fontWeight: '600',
  },
  percentage: {
    fontSize: 13,
    fontWeight: '700',
  },
  track: {
    height: 8,
    backgroundColor: '#252C37',
    borderRadius: 4,
    overflow: 'hidden',
  },
  fill: {
    height: '100%',
    borderRadius: 4,
  },
});
