import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../theme';
import { SimulatorView } from '../components/SimulatorView';
import { SimChatbot } from '../components/SimChatbot';
import { CameraView } from '../components/CameraView';
import { BoardOverlay } from '../components/BoardOverlay';
import { EXPERIMENT_CATALOG, ExperimentCatalogEntry } from '../../session/experimentCatalog';
import { SimId } from '../../sim/simProtocol';

type CategoryFilter = 'ALL' | 'BLINK' | 'DUAL' | 'BINARY' | 'MORSE' | 'DRILLS';

const CATEGORY_TAGS: Record<CategoryFilter, string> = {
  ALL: 'All (26)',
  BLINK: 'Single LED',
  DUAL: 'Dual LED',
  BINARY: 'Binary Count',
  MORSE: 'Morse Signals',
  DRILLS: 'Drills & Safety',
};

function getCategoryForSim(entry: ExperimentCatalogEntry): CategoryFilter {
  if (entry.simId === 'sim2_alternate_blink') return 'DUAL';
  if (entry.simId === 'sim3_binary_count') return 'BINARY';
  if (entry.simId === 'sim4_morse') return 'MORSE';
  const idNum = parseInt(entry.id.replace('exp_', ''), 10);
  if (idNum >= 13) return 'DRILLS';
  return 'BLINK';
}

function getBadgeInfo(simId: string) {
  switch (simId) {
    case 'sim2_alternate_blink':
      return { label: 'DUAL LED · D7 & D8', color: '#38BDF8', bg: 'rgba(56, 189, 248, 0.12)' };
    case 'sim3_binary_count':
      return { label: '2-BIT BINARY · 0-3', color: '#C084FC', bg: 'rgba(192, 132, 252, 0.12)' };
    case 'sim4_morse':
      return { label: 'SOS BEACON · ... --- ...', color: '#F59E0B', bg: 'rgba(245, 158, 11, 0.12)' };
    default:
      return { label: 'STANDARD · PIN 7', color: '#22C55E', bg: 'rgba(34, 197, 94, 0.12)' };
  }
}

export function LearnPage() {
  const router = useRouter();

  // Selected experiment from the 26-simulation catalog
  const [selectedExperiment, setSelectedExperiment] = useState<ExperimentCatalogEntry | null>(null);

  // Filter category
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('ALL');

  // Mode toggles for workbench view
  const [arModeActive, setArModeActive] = useState<boolean>(false);
  const [vrSplitActive, setVrSplitActive] = useState<boolean>(false);

  // Filtered experiments
  const filteredExperiments = useMemo(() => {
    if (activeFilter === 'ALL') return EXPERIMENT_CATALOG;
    return EXPERIMENT_CATALOG.filter((exp) => getCategoryForSim(exp) === activeFilter);
  }, [activeFilter]);

  // -------------------------------------------------------------
  // VIEW 1: 26 SIMULATION CATALOG SELECTOR
  // -------------------------------------------------------------
  if (!selectedExperiment) {
    return (
      <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
        {/* Top Header */}
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
            <Text style={styles.navTitle}>Interactive Circuit Labs</Text>
            <Text style={styles.navSubtitle}>26 Pre-Compiled Offline Simulations · AI Guidance</Text>
          </View>
        </View>

        {/* Filter Chips Horizontal Bar */}
        <View style={styles.filterContainer}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
            {(Object.keys(CATEGORY_TAGS) as CategoryFilter[]).map((filterKey) => {
              const isActive = activeFilter === filterKey;
              return (
                <Pressable
                  key={filterKey}
                  style={[styles.filterChip, isActive && styles.filterChipActive]}
                  onPress={() => setActiveFilter(filterKey)}
                  accessibilityRole="button"
                >
                  <Text style={[styles.filterChipText, isActive && styles.filterChipTextActive]}>
                    {CATEGORY_TAGS[filterKey]}
                  </Text>
                </Pressable>
              );
            })}
          </ScrollView>
        </View>

        {/* 26 Simulation Cards List */}
        <ScrollView
          contentContainerStyle={styles.catalogList}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.catalogGrid}>
            {filteredExperiments.map((entry, index) => {
              const badge = getBadgeInfo(entry.simId);
              const numStr = entry.id.replace('exp_', '');

              return (
                <Pressable
                  key={entry.id}
                  style={({ pressed }) => [styles.catalogCard, pressed && styles.catalogCardPressed]}
                  onPress={() => setSelectedExperiment(entry)}
                  accessibilityRole="button"
                  accessibilityLabel={`Open simulation ${entry.name}`}
                >
                  <View style={styles.cardTopRow}>
                    <View style={styles.numBadge}>
                      <Text style={styles.numBadgeText}>#{numStr}</Text>
                    </View>

                    <View style={[styles.simBadge, { backgroundColor: badge.bg, borderColor: badge.color + '40' }]}>
                      <Text style={[styles.simBadgeText, { color: badge.color }]}>{badge.label}</Text>
                    </View>
                  </View>

                  <Text style={styles.cardName}>{entry.name}</Text>

                  <View style={styles.cardBottomRow}>
                    <Text style={styles.engineText}>Engine: {entry.simId}</Text>
                    <View style={styles.openBtnRow}>
                      <Text style={styles.openBtnText}>Launch</Text>
                      <Ionicons name="arrow-forward-circle" size={18} color={theme.color.accent} />
                    </View>
                  </View>
                </Pressable>
              );
            })}
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  // -------------------------------------------------------------
  // VIEW 2: ACTIVE SIMULATOR & AI TUTOR WORKBENCH
  // -------------------------------------------------------------
  const activeSimId = (selectedExperiment.simId || 'sim1_led_blink') as SimId;
  const badge = getBadgeInfo(activeSimId);

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* 1. Workbench Top Navigation Bar */}
      <View style={styles.topNav}>
        <Pressable
          style={styles.backButton}
          onPress={() => setSelectedExperiment(null)}
          accessibilityRole="button"
          accessibilityLabel="Back to All Labs"
        >
          <Ionicons name="chevron-back" size={20} color={theme.color.text} />
          <Text style={styles.backButtonText}>All Labs</Text>
        </Pressable>

        <View style={styles.navTitleContainer}>
          <Text style={styles.navTitle} numberOfLines={1}>
            {selectedExperiment.name}
          </Text>
          <Text style={styles.navSubtitle}>{badge.label}</Text>
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

      {/* 2. Stereoscopic VR View (If VR Split is toggled ON) */}
      {vrSplitActive ? (
        <View style={styles.vrContainer}>
          <View style={styles.vrPane}>
            <View style={styles.vrEyeBadge}>
              <Text style={styles.vrEyeText}>LEFT EYE (CARDBOARD)</Text>
            </View>
            <SimulatorView simId={activeSimId} height={260} showCodeButton={false} />
          </View>

          <View style={styles.vrDivider} />

          <View style={styles.vrPane}>
            <View style={styles.vrEyeBadge}>
              <Text style={styles.vrEyeText}>RIGHT EYE (CARDBOARD)</Text>
            </View>
            <SimulatorView simId={activeSimId} height={260} showCodeButton={false} />
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
            <SimulatorView simId={activeSimId} height={250} showCodeButton={true} />
          </View>

          {/* Socratic AI Tutor Chatbot Shell */}
          <View style={styles.chatWrapper}>
            <SimChatbot simId={activeSimId} />
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
    fontSize: 13,
    fontWeight: '600',
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
  filterContainer: {
    backgroundColor: '#0D1017',
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    paddingVertical: 8,
  },
  filterScroll: {
    paddingHorizontal: 12,
    gap: 8,
  },
  filterChip: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: theme.radius.pill,
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.08)',
  },
  filterChipActive: {
    backgroundColor: theme.color.accent,
    borderColor: theme.color.accent,
  },
  filterChipText: {
    color: theme.color.textDim,
    fontSize: 12,
    fontWeight: '600',
  },
  filterChipTextActive: {
    color: '#0E1116',
    fontWeight: '800',
  },
  catalogList: {
    padding: 12,
    paddingBottom: 40,
  },
  catalogGrid: {
    gap: 10,
  },
  catalogCard: {
    backgroundColor: theme.color.surface,
    borderRadius: theme.radius.md,
    padding: 14,
    borderWidth: 1,
    borderColor: theme.color.border,
    gap: 8,
  },
  catalogCardPressed: {
    backgroundColor: '#161B22',
    borderColor: theme.color.accent,
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  numBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.06)',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: theme.radius.sm,
  },
  numBadgeText: {
    color: theme.color.textDim,
    fontSize: 11,
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  simBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
  },
  simBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
  cardName: {
    color: theme.color.text,
    fontSize: 15,
    fontWeight: '700',
    lineHeight: 20,
  },
  cardBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingTop: 4,
    borderTopWidth: 1,
    borderTopColor: 'rgba(255, 255, 255, 0.04)',
  },
  engineText: {
    color: theme.color.textDim,
    fontSize: 11,
    fontFamily: 'monospace',
  },
  openBtnRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  openBtnText: {
    color: theme.color.accent,
    fontSize: 12,
    fontWeight: '700',
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
