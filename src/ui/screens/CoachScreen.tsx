import React, { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../theme';
import { StepHeader } from '../components/StepHeader';
import { VerdictPill } from '../components/VerdictPill';
import { TestButton } from '../components/TestButton';
import { CameraView } from '../components/CameraView';
import { BoardOverlay } from '../components/BoardOverlay';
import { HintSheet } from '../components/HintSheet';
import { SafetyBanner, DebugCoachBanner } from '../components/CoachBanners';
import { ArduinoPanel } from '../components/ArduinoPanel';
import { CircuitXRay } from '../components/CircuitXRay';
import { useStore } from '../../session/store';
import { mapVerdict } from '../verdictView';
import { MockFixtureKey } from '../dev/MockPerception';
import { speak } from '../speech/tts';
import { caps } from '../../capabilities';
import { analyseDebugging } from '../../engine/debugCoach';
import { explain } from '../../llm/explainer';
import { GroundTruth } from '../../contract/types';

export function CoachScreen() {
  const router = useRouter();

  // Read state from Zustand store
  const procedure = useStore((s) => s.procedure);
  const stepIndex = useStore((s) => s.stepIndex);
  const lastResult = useStore((s) => s.lastResult);
  const busy = useStore((s) => s.busy);
  const selectedFixture = useStore((s) => s.selectedFixture);
  const groundTruth = useStore((s) => s.groundTruth);
  const events = useStore((s) => s.events);

  const { requestTest, selectFixture, resetSession } = useStore((s) => s.actions);

  // Bottom Sheet Visibility and LLM Explanation state
  const [hintSheetVisible, setHintSheetVisible] = useState(false);
  const [xrayVisible, setXrayVisible] = useState(false);
  const [llmExplanation, setLlmExplanation] = useState<string | undefined>(undefined);
  const [debugMessage, setDebugMessage] = useState<string | null>(null);

  // Camera viewport dimensions for overlay homography alignment
  const [cameraSize, setCameraSize] = useState<{ width: number; height: number }>({
    width: 360,
    height: 320,
  });

  const totalSteps = procedure?.steps.length ?? 4;
  const currentStep = procedure?.steps[stepIndex];
  const instruction = currentStep?.instruction ?? 'Place the resistor from +5V to E5';

  const verdictConfig = mapVerdict(lastResult);

  // Track previous result to trigger TTS, LLM explanation, and DebugCoach
  const prevResultRef = useRef<typeof lastResult>(null);

  useEffect(() => {
    if (lastResult && lastResult !== prevResultRef.current) {
      prevResultRef.current = lastResult;

      // 1. Check DebugCoach for intervention
      const intervention = analyseDebugging(events);
      if (intervention) {
        setDebugMessage(intervention);
      }

      // 2. Trigger Async LLM Explainer (fire-and-forget, never blocks requestTest)
      if (caps.llm) {
        explain(lastResult, instruction).then((text) => {
          if (text) setLlmExplanation(text);
        });
      }

      // 3. Spoken guidance & HintSheet auto-open on FAIL/UNCERTAIN
      if (lastResult.result === 'FAIL' || lastResult.result === 'UNCERTAIN') {
        if (verdictConfig.speak) {
          speak(verdictConfig.speak);
        }
        setHintSheetVisible(true);
      } else if (lastResult.result === 'PASS') {
        if (verdictConfig.speak) {
          speak(verdictConfig.speak);
        }
      }
    }
  }, [lastResult, events, instruction, verdictConfig.speak]);

  // Auto-navigate to summary when the last step passes
  useEffect(() => {
    if (stepIndex === totalSteps - 1 && lastResult?.result === 'PASS') {
      const timer = setTimeout(() => {
        router.push('/summary');
      }, 1200);
      return () => clearTimeout(timer);
    }
  }, [stepIndex, totalSteps, lastResult, router]);

  const fixtureOptions: Array<{ key: MockFixtureKey; label: string }> = [
    { key: 'live', label: '⚡ Live Hardware' },
    { key: 'wrong', label: 'Wrong (FAIL)' },
    { key: 'correct', label: 'Correct (PASS)' },
    { key: 'occ', label: 'Occluded' },
  ];

  const currentHintText =
    lastResult?.hint ||
    (currentStep && lastResult?.reason && currentStep.hints[lastResult.reason as keyof typeof currentStep.hints]) ||
    instruction;

  // Real or fallback GroundTruth for Arduino panel
  const activeGroundTruth: GroundTruth = groundTruth || {
    available: caps.arduino,
    continuity: lastResult?.result === 'PASS',
    ledOn: lastResult?.result === 'PASS',
    raw: lastResult?.result === 'PASS' ? 710 : 0,
    truthTable: [
      { a: 0, b: 0, out: 0, expected: 0 },
      { a: 0, b: 1, out: 0, expected: 0 },
      { a: 1, b: 0, out: 0, expected: 0 },
      { a: 1, b: 1, out: lastResult?.result === 'PASS' ? 1 : 0, expected: 1 },
    ],
  };

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      {/* 1. StepHeader */}
      <StepHeader
        stepIndex={stepIndex}
        total={totalSteps}
        instruction={instruction}
      />

      {/* F.1 Safety Banner */}
      <SafetyBanner
        visible={lastResult?.reason === 'safety_violation'}
        message={lastResult?.hint || 'Direct short circuit detected! Disconnect power immediately.'}
      />

      {/* F.2 DebugCoach Banner */}
      <DebugCoachBanner
        message={debugMessage}
        onDismiss={() => setDebugMessage(null)}
      />

      {/* 2. Camera Preview Area with Sibling Overlay */}
      <View
        style={styles.cameraArea}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          if (width > 0 && height > 0) {
            setCameraSize({ width, height });
          }
        }}
      >
        {/* Sibling #1: Full-bleed CameraView */}
        <CameraView
          isActive={true}
          fixtureMode={false}
        />

        {/* Sibling #2: Skia BoardOverlay (never a child of camera) */}
        <BoardOverlay
          highlightCells={lastResult?.highlightCells ?? []}
          color={verdictConfig.overlayColor}
          width={cameraSize.width}
          height={cameraSize.height}
          visible={caps.overlay}
        />

        {/* Dev Fixture Switcher */}
        <View style={styles.devBar}>
          <View style={styles.devBarHeader}>
            <Text style={styles.devBarTitle}>
              {selectedFixture === 'live'
                ? `⚡ LIVE HARDWARE${groundTruth?.available ? ` (Sense: ${groundTruth.raw})` : ' (Auto)'}`
                : `Simulated: ${selectedFixture.toUpperCase()}`}
            </Text>
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

      {/* F.4 Arduino Ground Truth Panel (when caps.arduino is true or hardware detected) */}
      <ArduinoPanel
        groundTruth={activeGroundTruth}
        procedureId={procedure?.id || procedure?.procedureId}
      />

      {/* 3. Bottom Controls Area (B.3) */}
      <View style={styles.bottomControls}>
        {/* Verdict Pill */}
        <View style={styles.pillContainer}>
          <VerdictPill evaluation={lastResult} />
        </View>

        {/* Optional Circuit X-Ray Chip (B.5 / F.6) */}
        {caps.xray && (
          <Pressable
            style={styles.xrayChip}
            onPress={() => setXrayVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Circuit X-Ray"
          >
            <Ionicons name="scan-outline" size={13} color={theme.color.accent} />
            <Text style={styles.xrayChipText}>Circuit X-Ray</Text>
          </Pressable>
        )}

        {/* Action Row: Speak, TestButton, Hint */}
        <View style={styles.actionRow}>
          <Pressable
            testID="speak-button"
            style={styles.auxButton}
            onPress={() => speak(verdictConfig.speak || instruction)}
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
            onPress={() => setHintSheetVisible(true)}
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

      {/* 4. HintSheet (Bottom sheet, max 40% height, never covers camera permanently) */}
      <HintSheet
        visible={hintSheetVisible}
        template={currentHintText}
        llmText={llmExplanation}
        onClose={() => setHintSheetVisible(false)}
      />

      {/* 5. Circuit X-Ray (Modal schematic inspection, gated by caps.xray) */}
      <CircuitXRay
        visible={xrayVisible}
        onClose={() => setXrayVisible(false)}
        procedure={procedure}
        stepIndex={stepIndex}
        lastResult={lastResult}
      />
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
    overflow: 'hidden',
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
    zIndex: 10,
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
  xrayChip: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 4,
    paddingHorizontal: 12,
    backgroundColor: '#1E293B',
    borderRadius: theme.radius.pill,
    borderWidth: 1,
    borderColor: '#334155',
    alignSelf: 'center',
  },
  xrayChipText: {
    color: theme.color.accent,
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
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
