import React, { useState, useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Pressable, Modal } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../theme';
import { SimulatorView } from '../components/SimulatorView';
import { CameraView } from '../components/CameraView';
import { BoardOverlay } from '../components/BoardOverlay';
import { SensorStatusStrip } from '../components/SensorStatusStrip';
import { TestButton } from '../components/TestButton';
import { VerdictPill } from '../components/VerdictPill';
import { InteractiveQACard } from '../components/InteractiveQACard';
import { ExperimentLogDrawer } from '../components/ExperimentLogDrawer';
import { HintSheet } from '../components/HintSheet';
import { useStore } from '../../session/store';
import { mapVerdict } from '../verdictView';
import { speak } from '../speech/tts';
import { MockFixtureKey } from '../dev/MockPerception';

export function AnalysePage() {
  const router = useRouter();

  // Read state from Zustand store
  const procedure = useStore((s) => s.procedure);
  const stepIndex = useStore((s) => s.stepIndex);
  const lastResult = useStore((s) => s.lastResult);
  const busy = useStore((s) => s.busy);
  const selectedFixture = useStore((s) => s.selectedFixture);
  const groundTruth = useStore((s) => s.groundTruth);
  const interaction = useStore((s) => s.interaction);

  const { requestTest, selectFixture, resetSession, setInteraction, nextStep } = useStore((s) => s.actions);

  // Bottom sheets & modals
  const [hintSheetVisible, setHintSheetVisible] = useState(false);
  const [devToolsVisible, setDevToolsVisible] = useState(false);

  // Camera viewport size
  const [cameraSize, setCameraSize] = useState<{ width: number; height: number }>({
    width: 360,
    height: 300,
  });

  const totalSteps = procedure?.steps.length ?? 4;
  const currentStep = procedure?.steps[stepIndex];
  const instruction = currentStep?.instruction ?? 'Verify breadboard circuit wiring';
  const verdictConfig = mapVerdict(lastResult);

  // Track previous result to trigger TTS and prompt interaction
  const prevResultRef = useRef<typeof lastResult>(null);

  useEffect(() => {
    if (lastResult && lastResult !== prevResultRef.current) {
      prevResultRef.current = lastResult;

      // Spoken guidance
      if (verdictConfig.speak) {
        speak(verdictConfig.speak);
      }

      // If failed or uncertain, open hint
      if (lastResult.result === 'FAIL' || lastResult.result === 'UNCERTAIN') {
        setHintSheetVisible(true);
      }

      // Activate conversational verification if not yet active
      if (!interaction) {
        setInteraction({
          question: lastResult.result === 'PASS'
            ? 'Circuit verified! Ready to test oscillation?'
            : 'Check wiring fault at highlighted pin. Need a hint?',
          active: true,
          status: lastResult.result,
        });
      }
    }
  }, [lastResult, interaction, setInteraction, verdictConfig.speak]);

  // Auto-advance step on PASS or navigate to summary on final step
  useEffect(() => {
    if (lastResult?.result === 'PASS') {
      if (stepIndex === totalSteps - 1) {
        const timer = setTimeout(() => {
          router.push('/summary');
        }, 1500);
        return () => clearTimeout(timer);
      } else {
        const timer = setTimeout(() => {
          nextStep();
        }, 1800);
        return () => clearTimeout(timer);
      }
    }
  }, [lastResult, stepIndex, totalSteps, router, nextStep]);

  const fixtureOptions: Array<{ key: MockFixtureKey; label: string }> = [
    { key: 'live', label: '⚡ Live Hardware Sense' },
    { key: 'correct', label: 'Simulated Correct (PASS)' },
    { key: 'wrong', label: 'Simulated Wrong Polarity (FAIL)' },
    { key: 'occ', label: 'Simulated Occlusion' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* 1. Header Navigation Bar */}
      <View style={styles.topNav}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="Back to Home"
        >
          <Ionicons name="chevron-back" size={22} color={theme.color.text} />
        </Pressable>

        <View style={styles.navTitleContainer}>
          <Text style={styles.navTitle}>Analyse & Detect</Text>
          <Text style={styles.navSubtitle}>
            Step {stepIndex + 1}/{totalSteps} · {procedure?.title || 'LED Circuit'}
          </Text>
        </View>

        <View style={styles.navRightRow}>
          <SensorStatusStrip />
          <Pressable
            style={styles.devToolsIconBtn}
            onPress={() => setDevToolsVisible(true)}
            accessibilityRole="button"
            accessibilityLabel="Developer Options"
          >
            <Ionicons name="options-outline" size={18} color={theme.color.textDim} />
          </Pressable>
        </View>
      </View>

      {/* 2. Top Half: Circuit Simulator Panel */}
      <View style={styles.topHalf}>
        <SimulatorView
          simId="sim1_led_blink"
          height={240}
          showCodeButton={true}
        />
      </View>

      {/* 3. Bottom Half: Uncluttered Camera & AR Viewfinder (Fills Down Properly) */}
      <View
        style={styles.bottomHalf}
        onLayout={(e) => {
          const { width, height } = e.nativeEvent.layout;
          if (width > 0 && height > 0) {
            setCameraSize({ width, height });
          }
        }}
      >
        {/* Live Camera Feed + on-device ML detection pipeline (Master Plan §4.1) */}
        <CameraView isActive={true} fixtureMode={false} enableDetection={true} />

        {/* Skia High-Contrast AR Pin Overlay */}
        <BoardOverlay
          highlightCells={lastResult?.highlightCells ?? []}
          color={verdictConfig.overlayColor}
          width={cameraSize.width}
          height={cameraSize.height}
          visible={true}
        />

        {/* Minimal Cyber-Viewfinder Corner Reticles */}
        <View style={styles.reticleContainer} pointerEvents="none">
          <View style={[styles.cornerBracket, styles.cornerTL]} />
          <View style={[styles.cornerBracket, styles.cornerTR]} />
          <View style={[styles.cornerBracket, styles.cornerBL]} />
          <View style={[styles.cornerBracket, styles.cornerBR]} />
        </View>

        {/* Floating Instruction Banner (Subtle & Translucent) */}
        <View style={styles.floatingInstructionCard}>
          <Ionicons name="information-circle-outline" size={15} color={theme.color.accent} />
          <Text style={styles.floatingInstructionText} numberOfLines={1}>
            {instruction}
          </Text>
        </View>

        {/* Interactive Q&A Card (When Active) */}
        <View style={styles.interactionWrapper}>
          <InteractiveQACard />
        </View>

        {/* Floating Action Deck (TEST Button + Verdict + Auxiliary) */}
        <View style={styles.floatingActionDeck}>
          <View style={styles.deckTopRow}>
            {/* Verdict Pill */}
            <VerdictPill evaluation={lastResult} />
            <ExperimentLogDrawer />
          </View>

          <View style={styles.deckBottomRow}>
            <Pressable
              style={styles.auxBtn}
              onPress={() => speak(verdictConfig.speak || instruction)}
              accessibilityRole="button"
              accessibilityLabel="Speak Instruction"
            >
              <Ionicons name="volume-high-outline" size={18} color={theme.color.text} />
            </Pressable>

            {/* Central Compact TEST Button */}
            <TestButton
              onPress={requestTest}
              busy={busy}
              size={48}
            />

            <Pressable
              style={styles.auxBtn}
              onPress={() => setHintSheetVisible(true)}
              accessibilityRole="button"
              accessibilityLabel="Show Hint"
            >
              <Ionicons name="help-outline" size={18} color={theme.color.text} />
            </Pressable>
          </View>
        </View>
      </View>

      {/* Socratic Hint Sheet Modal */}
      <HintSheet
        visible={hintSheetVisible}
        template={lastResult?.hint || instruction}
        onClose={() => setHintSheetVisible(false)}
      />

      {/* Dev / Hardware Diagnostics Drawer (Kept off the main camera surface!) */}
      <Modal
        visible={devToolsVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setDevToolsVisible(false)}
      >
        <View style={styles.devModalOverlay}>
          <View style={styles.devModalContent}>
            <View style={styles.devModalHeader}>
              <View style={styles.devModalTitleRow}>
                <Ionicons name="construct-outline" size={18} color={theme.color.accent} />
                <Text style={styles.devModalTitle}>Diagnostics & Test Fixtures</Text>
              </View>
              <Pressable onPress={() => setDevToolsVisible(false)}>
                <Ionicons name="close" size={20} color={theme.color.textDim} />
              </Pressable>
            </View>

            <Text style={styles.devModalDesc}>
              Select hardware sensor feed or simulated golden test fixtures:
            </Text>

            {fixtureOptions.map((opt) => (
              <Pressable
                key={opt.key}
                style={[
                  styles.fixtureOptionRow,
                  selectedFixture === opt.key && styles.fixtureOptionActive,
                ]}
                onPress={() => {
                  selectFixture(opt.key);
                  setDevToolsVisible(false);
                }}
              >
                <Text style={[styles.fixtureOptionText, selectedFixture === opt.key && styles.fixtureOptionTextActive]}>
                  {opt.label}
                </Text>
                {selectedFixture === opt.key && (
                  <Ionicons name="checkmark-circle" size={18} color={theme.color.pass} />
                )}
              </Pressable>
            ))}

            <Pressable
              style={styles.resetSessionBtn}
              onPress={() => {
                resetSession();
                setDevToolsVisible(false);
              }}
            >
              <Ionicons name="refresh-outline" size={16} color="#EF4444" />
              <Text style={styles.resetSessionText}>Reset Session</Text>
            </Pressable>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bg,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: theme.space.md,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.06)',
  },
  backButton: {
    padding: 6,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  navTitleContainer: {
    flex: 1,
    marginLeft: 10,
  },
  navTitle: {
    color: theme.color.text,
    fontSize: 16,
    fontWeight: '800',
  },
  navSubtitle: {
    color: theme.color.textDim,
    fontSize: 11,
  },
  navRightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  devToolsIconBtn: {
    padding: 6,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
  },
  topHalf: {
    paddingHorizontal: theme.space.md,
    paddingTop: theme.space.xs,
    paddingBottom: theme.space.xs,
  },
  bottomHalf: {
    flex: 1,
    position: 'relative',
    marginHorizontal: theme.space.md,
    marginBottom: 8,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    backgroundColor: '#000',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  reticleContainer: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    padding: 16,
    justifyContent: 'space-between',
  },
  cornerBracket: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderColor: 'rgba(255, 255, 255, 0.28)',
  },
  cornerTL: {
    top: 12,
    left: 12,
    borderTopWidth: 1.5,
    borderLeftWidth: 1.5,
    borderTopLeftRadius: 3,
  },
  cornerTR: {
    top: 12,
    right: 12,
    borderTopWidth: 1.5,
    borderRightWidth: 1.5,
    borderTopRightRadius: 3,
  },
  cornerBL: {
    bottom: 12,
    left: 12,
    borderBottomWidth: 1.5,
    borderLeftWidth: 1.5,
    borderBottomLeftRadius: 3,
  },
  cornerBR: {
    bottom: 12,
    right: 12,
    borderBottomWidth: 1.5,
    borderRightWidth: 1.5,
    borderBottomRightRadius: 3,
  },
  floatingInstructionCard: {
    position: 'absolute',
    top: 10,
    left: 10,
    right: 10,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(10, 12, 16, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: theme.radius.sm,
    gap: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  floatingInstructionText: {
    flex: 1,
    color: theme.color.text,
    fontSize: 12,
    fontWeight: '500',
  },
  interactionWrapper: {
    position: 'absolute',
    bottom: 74,
    left: 0,
    right: 0,
  },
  floatingActionDeck: {
    position: 'absolute',
    bottom: 8,
    left: 12,
    right: 12,
    backgroundColor: 'rgba(10, 12, 16, 0.92)',
    borderRadius: theme.radius.md,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  deckTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  deckBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  auxBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.06)',
  },
  devModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    padding: 24,
  },
  devModalContent: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.lg,
    padding: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  devModalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  devModalTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  devModalTitle: {
    color: theme.color.text,
    fontSize: 16,
    fontWeight: '700',
  },
  devModalDesc: {
    color: theme.color.textDim,
    fontSize: 12,
    marginBottom: 16,
  },
  fixtureOptionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(14, 17, 22, 0.6)',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: theme.radius.md,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  fixtureOptionActive: {
    borderColor: theme.color.accent,
    backgroundColor: 'rgba(56, 189, 248, 0.1)',
  },
  fixtureOptionText: {
    color: theme.color.textDim,
    fontSize: 13,
    fontWeight: '600',
  },
  fixtureOptionTextActive: {
    color: theme.color.text,
    fontWeight: '700',
  },
  resetSessionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    marginTop: 12,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.3)',
  },
  resetSessionText: {
    color: '#EF4444',
    fontSize: 13,
    fontWeight: '700',
  },
});
