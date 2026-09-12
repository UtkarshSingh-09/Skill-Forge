import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { StepHeader } from '../components/StepHeader';
import { VerdictPill } from '../components/VerdictPill';
import { TestButton } from '../components/TestButton';
import { EvaluationResult, Verdict, FailReason } from '../../contract/types';

export function CoachScreen() {
  // Test states for D.1 verification
  const [busy, setBusy] = useState(false);
  const [currentResult, setCurrentResult] = useState<EvaluationResult | null>({
    stepId: 1,
    result: 'FAIL',
    reason: 'wrong_position',
    hint: 'Wrong hole — move to E5',
    confidence: 0.95,
    safetyViolations: [],
    highlightCells: ['E5', 'E7'],
  });

  const testStates: Array<{
    label: string;
    result: EvaluationResult;
  }> = [
    {
      label: 'PASS',
      result: {
        stepId: 1,
        result: 'PASS',
        reason: null,
        hint: 'Correct — next step',
        confidence: 0.98,
        safetyViolations: [],
        highlightCells: ['E5'],
      },
    },
    {
      label: 'FAIL (pos)',
      result: {
        stepId: 1,
        result: 'FAIL',
        reason: 'wrong_position',
        hint: 'Wrong hole — move to E5',
        confidence: 0.92,
        safetyViolations: [],
        highlightCells: ['E5'],
      },
    },
    {
      label: 'SAFETY',
      result: {
        stepId: 1,
        result: 'FAIL',
        reason: 'safety_violation',
        hint: 'Short circuit risk! Power rail bridged directly to ground.',
        confidence: 0.99,
        safetyViolations: ['Power rail bridged directly to ground.'],
        highlightCells: ['+rail_5', '-rail_5'],
      },
    },
    {
      label: 'UNCERTAIN',
      result: {
        stepId: 1,
        result: 'UNCERTAIN',
        reason: 'occluded',
        hint: 'Move your hands, then TEST',
        confidence: 0.4,
        safetyViolations: [],
        highlightCells: [],
      },
    },
    {
      label: 'CHECKING',
      result: {
        stepId: 1,
        result: 'CHECKING',
        reason: null,
        hint: null,
        confidence: 0,
        safetyViolations: [],
        highlightCells: [],
      },
    },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 1. StepHeader */}
      <StepHeader
        stepIndex={1}
        total={4}
        instruction="Place the resistor from +5V to E5"
      />

      {/* 2. Camera Preview Area (CameraView / BoardOverlay slot) */}
      <View style={styles.cameraArea}>
        <View style={styles.cameraPlaceholder}>
          <Ionicons name="camera-outline" size={48} color={theme.color.textDim} />
          <Text style={styles.cameraText}>CAMERA PREVIEW</Text>
          <Text style={styles.cameraSubtext}>Fixture Mode Active</Text>
        </View>

        {/* D.1 Test state switcher bar */}
        <View style={styles.devBar}>
          <Text style={styles.devBarTitle}>D.1 Test Presets:</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.chipRow}>
            {testStates.map((item) => (
              <Pressable
                key={item.label}
                onPress={() => setCurrentResult(item.result)}
                style={[
                  styles.chip,
                  currentResult?.reason === item.result.reason &&
                    currentResult?.result === item.result.result &&
                    styles.chipActive,
                ]}
              >
                <Text style={styles.chipText}>{item.label}</Text>
              </Pressable>
            ))}
            <Pressable
              onPress={() => setBusy(!busy)}
              style={[styles.chip, busy && styles.chipBusyActive]}
            >
              <Text style={styles.chipText}>{busy ? 'Busy: ON' : 'Busy: OFF'}</Text>
            </Pressable>
          </ScrollView>
        </View>
      </View>

      {/* 3. Bottom Controls Area */}
      <View style={styles.bottomControls}>
        {/* Verdict Pill */}
        <View style={styles.pillContainer}>
          <VerdictPill evaluation={currentResult} />
        </View>

        {/* Action Row: Speak, TestButton, Hint */}
        <View style={styles.actionRow}>
          <Pressable
            testID="speak-button"
            style={styles.auxButton}
            accessibilityRole="button"
            accessibilityLabel="Speak hint"
          >
            <Ionicons name="volume-high-outline" size={24} color={theme.color.text} />
          </Pressable>

          <TestButton
            onPress={() => {
              // Stub test action for D.1
              setBusy(true);
              setTimeout(() => setBusy(false), 800);
            }}
            busy={busy}
          />

          <Pressable
            testID="hint-button"
            style={styles.auxButton}
            accessibilityRole="button"
            accessibilityLabel="Show hint"
          >
            <Ionicons name="help-outline" size={24} color={theme.color.text} />
          </Pressable>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bg,
  },
  cameraArea: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#050709',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cameraPlaceholder: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: theme.space.xs,
  },
  cameraText: {
    color: theme.color.textDim,
    fontSize: theme.font.label,
    fontWeight: '700',
    letterSpacing: 1.5,
  },
  cameraSubtext: {
    color: '#4B5563',
    fontSize: 12,
  },
  devBar: {
    position: 'absolute',
    top: theme.space.sm,
    left: 0,
    right: 0,
    backgroundColor: 'rgba(26, 31, 39, 0.85)',
    paddingVertical: theme.space.xs,
    paddingHorizontal: theme.space.sm,
    borderBottomWidth: 1,
    borderBottomColor: '#2D3748',
  },
  devBarTitle: {
    color: theme.color.accent,
    fontSize: 11,
    fontWeight: '700',
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  chipRow: {
    gap: 6,
    flexDirection: 'row',
  },
  chip: {
    backgroundColor: '#252C37',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.sm,
  },
  chipActive: {
    backgroundColor: theme.color.accent,
  },
  chipBusyActive: {
    backgroundColor: theme.color.safety,
  },
  chipText: {
    color: theme.color.text,
    fontSize: 11,
    fontWeight: '600',
  },
  bottomControls: {
    backgroundColor: theme.color.surface,
    paddingHorizontal: theme.space.lg,
    paddingTop: theme.space.sm,
    paddingBottom: theme.space.lg,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    gap: theme.space.md,
  },
  pillContainer: {
    alignItems: 'center',
    width: '100%',
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingHorizontal: theme.space.md,
  },
  auxButton: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#252C37',
    justifyContent: 'center',
    alignItems: 'center',
  },
});
