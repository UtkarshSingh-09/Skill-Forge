import React, { useState, useMemo } from 'react';
import { View, Text, StyleSheet, Pressable, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { theme } from '../theme';
import { EXPERIMENT_CATALOG, ExperimentCatalogEntry } from '../../session/experimentCatalog';

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

export function SimulationCatalogPage() {
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<CategoryFilter>('ALL');

  const filteredExperiments = useMemo(() => {
    if (activeFilter === 'ALL') return EXPERIMENT_CATALOG;
    return EXPERIMENT_CATALOG.filter((exp) => getCategoryForSim(exp) === activeFilter);
  }, [activeFilter]);

  const handleSelectSim = (entry: ExperimentCatalogEntry) => {
    router.push({
      pathname: '/workbench',
      params: {
        id: entry.id,
        name: entry.name,
        simId: entry.simId,
      },
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      {/* Top Header */}
      <View style={styles.topNav}>
        <Pressable
          style={styles.backButton}
          onPress={() => router.replace('/')}
          accessibilityRole="button"
          accessibilityLabel="Back to Home"
        >
          <Ionicons name="chevron-back" size={22} color={theme.color.text} />
        </Pressable>

        <View style={styles.navTitleContainer}>
          <Text style={styles.navTitle}>Choose a Simulation Lab</Text>
          <Text style={styles.navSubtitle}>26 Interactive Offline Experiments · Select one to begin</Text>
        </View>
      </View>

      {/* Category Filter Chips */}
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

      {/* 26 Simulation Cards */}
      <ScrollView contentContainerStyle={styles.catalogList} showsVerticalScrollIndicator={false}>
        <View style={styles.catalogGrid}>
          {filteredExperiments.map((entry) => {
            const badge = getBadgeInfo(entry.simId);
            const numStr = entry.id.replace('exp_', '');

            return (
              <Pressable
                key={entry.id}
                style={({ pressed }) => [styles.catalogCard, pressed && styles.catalogCardPressed]}
                onPress={() => handleSelectSim(entry)}
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
                    <Text style={styles.openBtnText}>Start Simulation</Text>
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: theme.color.bg,
  },
  topNav: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 12,
    backgroundColor: theme.color.surface,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.05)',
    gap: 8,
  },
  backButton: {
    padding: 6,
  },
  navTitleContainer: {
    flex: 1,
  },
  navTitle: {
    color: theme.color.text,
    fontSize: 16,
    fontWeight: '800',
  },
  navSubtitle: {
    color: theme.color.textDim,
    fontSize: 11,
    marginTop: 2,
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
});
