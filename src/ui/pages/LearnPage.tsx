import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../theme';
import { SimulatorView } from '../components/SimulatorView';
import { SimChatbot } from '../components/SimChatbot';
import { CameraView } from '../components/CameraView';
import { BoardOverlay } from '../components/BoardOverlay';

export function LearnPage() {
  const router = useRouter();

  // Mode toggles
  const [arModeActive, setArModeActive] = useState<boolean>(false);
  const [vrSplitActive, setVrSplitActive] = useState<boolean>(false);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* 1. Top Navigation Bar */}
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
          <Text style={styles.navTitle}>Want to Learn New!</Text>
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
              size={16}
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
              size={16}
              color={vrSplitActive ? '#0E1116' : theme.color.pass}
            />
            <Text style={[styles.toggleText, vrSplitActive && styles.toggleTextActive]}>
              VR
            </Text>
          </Pressable>
        </View>
      </View>

      {/* 2. Stereoscopic VR View (If VR Split is toggled ON) */}
      {vrSplitActive ? (
        <View style={styles.vrContainer}>
          {/* Left Eye Pane */}
          <View style={styles.vrPane}>
            <View style={styles.vrEyeBadge}>
              <Text style={styles.vrEyeText}>LEFT EYE (CARDBOARD)</Text>
            </View>
            <SimulatorView simId="sim1_led_blink" height={260} showCodeButton={false} />
          </View>

          {/* Center Divider Line */}
          <View style={styles.vrDivider} />

          {/* Right Eye Pane */}
          <View style={styles.vrPane}>
            <View style={styles.vrEyeBadge}>
              <Text style={styles.vrEyeText}>RIGHT EYE (CARDBOARD)</Text>
            </View>
            <SimulatorView simId="sim1_led_blink" height={260} showCodeButton={false} />
          </View>
        </View>
      ) : arModeActive ? (
        /* 3. AR Live Camera Overlay Mode */
        <View style={styles.arContainer}>
          <CameraView isActive={true} fixtureMode={false} />
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
        /* 4. Standard Learn Layout: Hero Simulator + AI Chatbot */
        <View style={styles.standardContainer}>
          {/* Hero Circuit Simulator View */}
          <View style={styles.simWrapper}>
            <SimulatorView simId="sim1_led_blink" height={240} showCodeButton={true} />
          </View>

          {/* Socratic AI Tutor Chatbot Shell */}
          <View style={styles.chatWrapper}>
            <SimChatbot simId="sim1_led_blink" />
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
  togglesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  toggleBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: theme.radius.sm,
    gap: 4,
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
    fontWeight: '800',
  },
  standardContainer: {
    flex: 1,
    padding: theme.space.md,
    gap: theme.space.md,
  },
  simWrapper: {
    flexShrink: 0,
  },
  chatWrapper: {
    flex: 1,
  },
  arContainer: {
    flex: 1,
    margin: theme.space.md,
    borderRadius: theme.radius.md,
    overflow: 'hidden',
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.3)',
  },
  arInstructionCard: {
    position: 'absolute',
    bottom: 16,
    left: 16,
    right: 16,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 17, 22, 0.9)',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: theme.radius.md,
    borderWidth: 1,
    borderColor: 'rgba(56, 189, 248, 0.4)',
    gap: 8,
  },
  arInstructionText: {
    flex: 1,
    color: theme.color.text,
    fontSize: 12,
    fontWeight: '600',
  },
  vrContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#000',
  },
  vrPane: {
    flex: 1,
    justifyContent: 'center',
    padding: 8,
  },
  vrEyeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignSelf: 'center',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.pill,
    marginBottom: 6,
  },
  vrEyeText: {
    color: theme.color.textDim,
    fontSize: 9,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  vrDivider: {
    width: 2,
    height: '80%',
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
  },
});
