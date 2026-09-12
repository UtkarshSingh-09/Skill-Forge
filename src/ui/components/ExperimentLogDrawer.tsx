import React, { useState } from 'react';
import { View, Text, StyleSheet, Pressable, Modal, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { theme } from '../theme';
import { useStore, ExperimentRun } from '../../session/store';

export function ExperimentLogDrawer() {
  const experiments = useStore((s) => s.experiments);
  const [isOpen, setIsOpen] = useState(false);

  const getVerdictStyle = (verdict: string) => {
    switch (verdict) {
      case 'PASS':
        return { bg: 'rgba(34, 197, 94, 0.15)', text: theme.color.pass, border: 'rgba(34, 197, 94, 0.4)' };
      case 'FAIL':
        return { bg: 'rgba(239, 68, 68, 0.15)', text: theme.color.fail, border: 'rgba(239, 68, 68, 0.4)' };
      default:
        return { bg: 'rgba(245, 158, 11, 0.15)', text: theme.color.uncertain, border: 'rgba(245, 158, 11, 0.4)' };
    }
  };

  const renderItem = ({ item }: { item: ExperimentRun }) => {
    const vStyle = getVerdictStyle(item.verdict);
    const timeFormatted = new Date(item.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

    return (
      <View style={styles.logRow}>
        <View style={styles.logInfo}>
          <Text style={styles.logName} numberOfLines={1}>{item.name}</Text>
          <Text style={styles.logSimId}>{item.simId} · {timeFormatted}</Text>
        </View>
        <View style={[styles.verdictBadge, { backgroundColor: vStyle.bg, borderColor: vStyle.border }]}>
          <Text style={[styles.verdictText, { color: vStyle.text }]}>{item.verdict}</Text>
        </View>
      </View>
    );
  };

  return (
    <>
      {/* Discreet Trigger Button */}
      <Pressable
        style={styles.triggerBtn}
        onPress={() => setIsOpen(true)}
        accessibilityRole="button"
        accessibilityLabel="Open Experiment Log"
      >
        <Ionicons name="list-outline" size={14} color={theme.color.textDim} />
        <Text style={styles.triggerText}>Log ({experiments.length})</Text>
      </Pressable>

      {/* Expanded Modal Sheet */}
      <Modal
        visible={isOpen}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsOpen(false)}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.sheetContainer}>
            <View style={styles.sheetHeader}>
              <View style={styles.sheetTitleRow}>
                <Ionicons name="journal-outline" size={18} color={theme.color.accent} />
                <Text style={styles.sheetTitle}>Experiment Run History</Text>
              </View>
              <Pressable
                style={styles.closeBtn}
                onPress={() => setIsOpen(false)}
                accessibilityRole="button"
                accessibilityLabel="Close"
              >
                <Ionicons name="close" size={20} color={theme.color.textDim} />
              </Pressable>
            </View>

            <Text style={styles.sheetSub}>
              {experiments.length} automated verification runs recorded this session
            </Text>

            <FlatList
              data={experiments}
              keyExtractor={(item, index) => String(item.id ?? index)}
              renderItem={renderItem}
              contentContainerStyle={styles.listContent}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </View>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  triggerBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderWidth: 1,
    borderColor: theme.color.border,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.pill,
    gap: 4,
  },
  triggerText: {
    color: theme.color.textDim,
    fontSize: 10,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'flex-end',
  },
  sheetContainer: {
    backgroundColor: theme.color.surface,
    borderTopLeftRadius: theme.radius.lg,
    borderTopRightRadius: theme.radius.lg,
    maxHeight: '70%',
    padding: 16,
    borderWidth: 1,
    borderColor: theme.color.border,
  },
  sheetHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sheetTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  sheetTitle: {
    color: theme.color.text,
    fontSize: theme.font.body,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  sheetSub: {
    color: theme.color.textDim,
    fontSize: 12,
    marginTop: 4,
    marginBottom: 12,
  },
  listContent: {
    paddingBottom: 20,
  },
  logRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(14, 17, 22, 0.6)',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: theme.radius.sm,
    marginBottom: 6,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.04)',
  },
  logInfo: {
    flex: 1,
    marginRight: 10,
  },
  logName: {
    color: theme.color.text,
    fontSize: 13,
    fontWeight: '600',
  },
  logSimId: {
    color: theme.color.textDim,
    fontSize: 11,
    marginTop: 2,
  },
  verdictBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: theme.radius.pill,
    borderWidth: 1,
  },
  verdictText: {
    fontSize: 10,
    fontWeight: '800',
    letterSpacing: 0.5,
  },
});
