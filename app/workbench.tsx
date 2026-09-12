import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { theme } from '../src/ui/theme';
import { SimulatorView } from '../src/ui/components/SimulatorView';
import { SimChatbot } from '../src/ui/components/SimChatbot';
import { CameraView } from '../src/ui/components/CameraView';
import { BoardOverlay } from '../src/ui/components/BoardOverlay';
import { SimId } from '../src/sim/simProtocol';

export default function WorkbenchRoute() {
  const router = useRouter();
  const params = useLocalSearchParams<{ id?: string; name?: string; simId?: string }>();

  const simId = (params.simId || 'sim1_led_blink') as SimId;
  const simName = params.name || 'LED Blink (Pin 7)';

  // Mode toggles
  const [arModeActive, setArModeActive] = useState<boolean>(false);
  const [vrSplitActive, setVrSplitActive] = useState<boolean>(false);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* 1. Top Navigation Bar */}
      <View style={styles.topNav}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.replace('/learn')}
          accessibilityRole="button"
          accessibilityLabel="Back to All Labs"
        >
          <Ionicons name="chevron-back" size={20} color={theme.color.text} />
          <Text style={styles.backButtonText}>26 Labs</Text>
        </Pressable>

        <View style={styles.navTitleContainer}>
          <Text style={styles.navTitle} numberOfLines={1}>
            {simName}
          </Text>
          <Text style={styles.navSubtitle}>Interactive Simulator · AI Tutor · AR/VR Mode</Text>
        </View>

        {/* Action Toggles: AR Mode & VR Mode */}
        <View style={styles.togglesRow}>
          <Pressable
            style={[styles.toggleBtn, arModeActive && styles.toggleBtnActive]}
            onPress={() => {
              setArModeActive(!arModeActive);
              if (vrSplitActive) setVrSplitActive(false);
            }}
            accessibilityRole="button"
            accessibilityLabel="Toggle AR Camera Mode"
          >
            <Ionicons
              name={arModeActive ? 'camera' : 'camera-outline'}
              size={15}
              color={arModeActive ? '#0E1116' : theme.color.accent}
            />
            <Text style={[styles.toggleText, arModeActive && styles.toggleTextActive]}>
              AR
            </Text>
          </Pressable>

          <Pressable
            style={[styles.toggleBtn, vrSplitActive && styles.toggleBtnActive]}
            onPress={() => {
              setVrSplitActive(!vrSplitActive);
              if (arModeActive) setArModeActive(false);
            }}
            accessibilityRole="button"
            accessibilityLabel="Toggle VR Stereoscopic View"
          >
            <Ionicons
              name={vrSplitActive ? 'glasses' : 'glasses-outline'}
              size={15}
              color={vrSplitActive ? '#0E1116' : theme.color.pass}
            />
            <Text style={[styles.toggleText, vrSplitActive && styles.toggleTextActive]}>
              VR
            </Text>
          </Pressable>
        </View>
      </View>

      {/* 2. Stereoscopic VR View */}
      {vrSplitActive ? (
        <View style={styles.vrContainer}>
          <View style={styles.vrPane}>
            <View style={styles.vrEyeBadge}>
              <Text style={styles.vrEyeText}>LEFT EYE (CARDBOARD)</Text>
            </View>
            <SimulatorView simId={simId} height={280} showCodeButton={false} />
          </View>

          <View style={styles.vrDivider} />

          <View style={styles.vrPane}>
            <View style={styles.vrEyeBadge}>
              <Text style={styles.vrEyeText}>RIGHT EYE (CARDBOARD)</Text>
            </View>
            <SimulatorView simId={simId} height={280} showCodeButton={false} />
          </View>
        </View>
      ) : arModeActive ? (
        /* 3. AR Live Camera Overlay Mode */
        <View style={styles.arContainer}>
          <CameraView isActive={true} fixtureMode={false} showModeToggle={true} />
          <BoardOverlay
            highlightCells={['E10', 'E14', 'E18']}
            color={theme.color.accent}
            width={360}
            height={320}
            visible={true}
          />
          <View style={styles.arInstructionCard}>
            <Ionicons name="sparkles" size={16} color={theme.color.accent} />
            <Text style={styles.arInstructionText}>
              AR Live Guidance: Match physical breadboard holes E10, E14, and E18
            </Text>
          </View>
        </View>
      ) : (
        /* 4. Standard Workbench: Simulator + Socratic AI Tutor */
        <View style={styles.standardContainer}>
          <View style={styles.simWrapper}>
            <SimulatorView simId={simId} height={290} showCodeButton={true} />
          </View>

          <View style={styles.chatWrapper}>
            <SimChatbot simId={simId} />
          </View>
        </View>
      )}
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
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: theme.color.surface,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    gap: 8,
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 6,
    gap: 2,
  },
  backButtonText: {
    color: theme.color.text,
    fontSize: 12,
    fontWeight: '700',
  },
  navTitleContainer: {
    flex: 1,
  },
  navTitle: {
    color: theme.color.text,
    fontSize: 15,
    fontWeight: '800',
  },
  navSubtitle: {
    color: theme.color.textDim,
    fontSize: 11,
    marginTop: 1,
  },
  togglesRow: {
    flexDirection: 'row',
    gap: 6,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: theme.radius.sm,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  toggleBtnActive: {
    backgroundColor: theme.color.accent,
    borderColor: theme.color.accent,
  },
  toggleText: {
    color: theme.color.text,
    fontSize: 11,
    fontWeight: '700',
  },
  toggleTextActive: {
    color: '#0E1116',
  },
  standardContainer: {
    flex: 1,
    gap: 10,
    padding: 10,
  },
  simWrapper: {
    flexShrink: 0,
  },
  chatWrapper: {
    flex: 1,
  },
  vrContainer: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#000000',
  },
  vrPane: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 8,
  },
  vrDivider: {
    width: 2,
    backgroundColor: '#1E293B',
  },
  vrEyeBadge: {
    position: 'absolute',
    top: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: theme.radius.pill,
    zIndex: 10,
  },
  vrEyeText: {
    color: '#94A3B8',
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.8,
  },
  arContainer: {
    flex: 1,
    position: 'relative',
    backgroundColor: '#000000',
  },
  arInstructionCard: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: 'rgba(19, 29, 46, 0.92)',
    padding: 14,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: theme.color.accent,
  },
  arInstructionText: {
    color: theme.color.text,
    fontSize: 13,
    fontWeight: '600',
    flex: 1,
  },
});
