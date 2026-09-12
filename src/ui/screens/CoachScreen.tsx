import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../theme';
import { StepHeader } from '../components/StepHeader';
import { VerdictPill } from '../components/VerdictPill';
import { TestButton } from '../components/TestButton';
import { useStore } from '../../session/store';
import { MockFixtureKey } from '../dev/MockPerception';

export function CoachScreen() {
  const router = useRouter();

  // Read all state directly from the Zustand store
  const procedure = useStore((s) => s.procedure);
  const stepIndex = useStore((s) => s.stepIndex);
  const lastResult = useStore((s) => s.lastResult);
  const busy = useStore((s) => s.busy);
  const selectedFixture = useStore((s) => s.selectedFixture);
  const events = useStore((s) => s.events);

  const { requestTest, selectFixture, resetSession } = useStore((s) => s.actions);

  const totalSteps = procedure?.steps.length ?? 4;
  const currentStep = procedure?.steps[stepIndex];
  const instruction = currentStep?.instruction ?? 'Place the resistor from +5V to E5';

  // Navigate to summary when the last step passes
  useEffect(() => {
    if (stepIndex === totalSteps - 1 && lastResult?.result === 'PASS') {
      const timer = setTimeout(() => {
        router.push('/summary');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [stepIndex, totalSteps, lastResult, router]);

  const fixtureOptions: Array<{ key: MockFixtureKey; label: string }> = [
    { key: 'wrong', label: 'Wrong (FAIL)' },
    { key: 'correct', label: 'Correct (PASS)' },
    { key: 'occ', label: 'Occluded (UNCERTAIN)' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 1. StepHeader with progress dots and gear button */}
      <StepHeader
        stepIndex={stepIndex}
        total={totalSteps}
        instruction={instruction}
      />

      {/* 2. Camera Preview Area */}
      <View style={styles.cameraArea}>
        <View style={styles.cameraPlaceholder}>
          <Ionicons name="camera-outline" size={48} color={theme.color.textDim} />
          <Text style={styles.cameraText}>CAMERA PREVIEW</Text>
          <Text style={styles.cameraSubtext}>Fixture Mode Active</Text>
        </View>

        {/* Dev Fixture Switcher (Part C & D.2) */}
        <View style={styles.devBar}>
          <View style={styles.devBarHeader}>
            <Text style={styles.devBarTitle}>Dev Fixture: {selectedFixture.toUpperCase()}</Text>
            <Pressable onPress={resetSession} style={styles.resetBtn}>
              <Text style={styles.resetBtnText}>Restart</Text>
            </Pressable>
          </View>
          <View style={styles.chipRow}>
            {fixtureOptions.map((opt) => (
              <Pressable
                key={opt.key}
                onPress={() => selectFixture(opt.key)}
                style={[
                  styles.chip,
                  selectedFixture === opt.key && styles.chipActive,
                ]}
              >
                <Text
                  style={[
                    styles.chipText,
                    selectedFixture === opt.key && styles.chipTextActive,
                  ]}
                >
                  {opt.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>
      </View>

      {/* 3. Bottom Controls Area (B.3) */}
      <View style={styles.bottomControls}>
        {/* Verdict Pill */}
        <View style={styles.pillContainer}>
          <VerdictPill evaluation={lastResult} />
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
            onPress={requestTest}
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

        {/* Event log counter */}
        <Text style={styles.eventCounter}>
          Events logged: {events.length} · Step: {stepIndex + 1}/{totalSteps}
        </Text>
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
    left: theme.space.md,
    right: theme.space.md,
    backgroundColor: 'rgba(26, 31, 39, 0.92)',
    padding: theme.space.sm,
    borderRadius: theme.radius.sm,
    borderWidth: 1,
    borderColor: '#2D3748',
  },
  devBarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  devBarTitle: {
    color: theme.color.accent,
    fontSize: 11,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  resetBtn: {
    paddingHorizontal: 6,
    paddingVertical: 2,
    backgroundColor: '#374151',
    borderRadius: 4,
  },
  resetBtnText: {
    color: theme.color.text,
    fontSize: 10,
    fontWeight: '600',
  },
  chipRow: {
    flexDirection: 'row',
    gap: 6,
  },
  chip: {
    flex: 1,
    backgroundColor: '#252C37',
    paddingVertical: 6,
    borderRadius: theme.radius.sm,
    alignItems: 'center',
  },
  chipActive: {
    backgroundColor: theme.color.accent,
  },
  chipText: {
    color: theme.color.textDim,
    fontSize: 11,
    fontWeight: '600',
  },
  chipTextActive: {
    color: theme.color.bg,
    fontWeight: '700',
  },
  bottomControls: {
    backgroundColor: theme.color.surface,
    paddingHorizontal: theme.space.lg,
    paddingTop: theme.space.sm,
    paddingBottom: theme.space.md,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    gap: theme.space.sm,
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
  eventCounter: {
    color: theme.color.textDim,
    fontSize: 11,
    textAlign: 'center',
    marginTop: 2,
  },
});
