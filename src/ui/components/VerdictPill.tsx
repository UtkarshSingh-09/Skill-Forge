import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Verdict, FailReason, EvaluationResult } from '../../contract/types';
import { mapVerdict, VerdictInput } from '../verdictView';
import { theme } from '../theme';

interface VerdictPillProps {
  result?: Verdict;
  reason?: FailReason;
  hint?: string | null;
  evaluation?: EvaluationResult | null;
}

export function VerdictPill({ result, reason, hint, evaluation }: VerdictPillProps) {
  // Allow passing either individual fields or the full evaluation object
  const input: VerdictInput | null = evaluation
    ? evaluation
    : result
    ? { result, reason, hint }
    : null;

  const config = mapVerdict(input);

  // Map icon name safely to Ionicons
  const iconName = (config.icon || 'information-circle-outline') as keyof typeof Ionicons.glyphMap;

  return (
    <View
      testID="verdict-pill"
      style={[
        styles.pill,
        {
          borderColor: config.color,
          backgroundColor: '#161B22',
        },
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Verdict: ${config.text}`}
    >
      <View style={[styles.iconBadge, { backgroundColor: config.color }]}>
        <Ionicons name={iconName} size={16} color="#0E1116" />
      </View>

      <Text
        style={[styles.text, { color: config.color }]}
        numberOfLines={1}
        ellipsizeMode="tail"
      >
        {config.text}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: theme.space.xs,
    paddingHorizontal: theme.space.md,
    borderRadius: theme.radius.pill,
    borderWidth: 1.5,
    maxWidth: '92%',
    alignSelf: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  iconBadge: {
    width: 24,
    height: 24,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: theme.space.xs,
  },
  text: {
    fontSize: theme.font.label + 1,
    fontWeight: '700',
    flexShrink: 1,
  },
});
